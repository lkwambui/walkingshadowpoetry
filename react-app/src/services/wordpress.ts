export const wordpressConfig = {
  baseUrl:
    import.meta.env.VITE_WORDPRESS_API_URL?.replace(/\/+$/, '') ||
    'https://walkingshadowpoetry.com/blog/wp-json/wp/v2',
  perPage: 12,
  cacheDuration: 5 * 60 * 1000,
} as const;

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

interface WPImageSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WPFeaturedImage {
  source_url: string;
  alt_text: string;
  media_details?: {
    width: number;
    height: number;
    sizes?: Record<string, WPImageSize>;
  };
}

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: WPFeaturedImage[];
    'wp:term'?: WPTerm[][];
  };
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
}

interface WPAPIResponse<T> {
  data: T;
  total: number;
  totalPages: number;
}

interface PostsOptions {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: number;
  exclude?: number[];
}

const responseCache = new Map<string, { expiresAt: number; value: unknown }>();
const inFlightRequests = new Map<string, Promise<WPAPIResponse<unknown>>>();

export function clearWordPressCache() {
  responseCache.clear();
}

async function request<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<WPAPIResponse<T>> {
  const url = new URL(`${wordpressConfig.baseUrl}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const key = url.toString();
  const cached = responseCache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as WPAPIResponse<T>;
  }

  const pending = inFlightRequests.get(key);
  if (pending) return pending as Promise<WPAPIResponse<T>>;

  const fetchRequest: Promise<WPAPIResponse<T>> = (async () => {
    const response = await fetch(key, { headers: { Accept: 'application/json' } });

    if (!response.ok) {
      throw new Error(`WordPress request failed (${response.status} ${response.statusText})`);
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('WordPress returned a non-JSON response. Check VITE_WORDPRESS_API_URL.');
    }

    const value: WPAPIResponse<T> = {
      data: (await response.json()) as T,
      total: Number(response.headers.get('X-WP-Total')) || 0,
      totalPages: Number(response.headers.get('X-WP-TotalPages')) || 0,
    };
    responseCache.set(key, {
      expiresAt: Date.now() + wordpressConfig.cacheDuration,
      value,
    });
    return value;
  })();

  inFlightRequests.set(key, fetchRequest as Promise<WPAPIResponse<unknown>>);
  try {
    return await fetchRequest;
  } finally {
    inFlightRequests.delete(key);
  }
}

export async function getPosts({
  page = 1,
  perPage = wordpressConfig.perPage,
  search = '',
  categoryId,
  exclude = [],
}: PostsOptions = {}): Promise<PaginatedResult<WPPost>> {
  const { data, total, totalPages } = await request<WPPost[]>('/posts', {
    _embed: 'wp:featuredmedia,wp:term',
    _fields: 'id,date,slug,link,author,featured_media,categories,tags,title,excerpt,content,_links,_embedded',
    status: 'publish',
    page: String(page),
    per_page: String(perPage),
    orderby: 'date',
    order: 'desc',
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(categoryId ? { categories: String(categoryId) } : {}),
    ...(exclude.length ? { exclude: exclude.join(',') } : {}),
  });

  return { items: data, total, totalPages };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const { data } = await request<WPPost[]>('/posts', {
    _embed: 'wp:featuredmedia,wp:term',
    _fields: 'id,date,slug,link,author,featured_media,categories,tags,title,excerpt,content,_links,_embedded',
    status: 'publish',
    slug,
  });

  return data[0] ?? null;
}

export async function getCategories(): Promise<WPCategory[]> {
  const { data } = await request<WPCategory[]>('/categories', {
    _fields: 'id,name,slug,count',
    hide_empty: 'true',
    per_page: '100',
    orderby: 'name',
    order: 'asc',
  });

  return data;
}

export async function getRelatedPosts(post: WPPost): Promise<WPPost[]> {
  if (post.categories.length === 0) return [];

  const { items } = await getPosts({
    perPage: 3,
    categoryId: post.categories[0],
    exclude: [post.id],
  });
  return items;
}

export function getFeaturedImage(
  post: WPPost,
  size: 'card' | 'large' = 'card',
): { url: string; alt: string; width?: number; height?: number } | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;

  const sizes = media.media_details?.sizes;
  const candidates = size === 'large'
    ? ['large', '1536x1536', 'medium_large', 'full']
    : ['medium_large', 'large', 'medium', 'full'];
  const image = candidates.map((name) => sizes?.[name]).find(Boolean);

  return {
    url: image?.source_url ?? media.source_url,
    alt: media.alt_text || getPostTitle(post),
    width: image?.width ?? media.media_details?.width,
    height: image?.height ?? media.media_details?.height,
  };
}

export function getPostTitle(post: WPPost): string {
  return htmlToText(post.title.rendered);
}

export function getPostExcerpt(post: WPPost): string {
  return htmlToText(post.excerpt.rendered).trim();
}

export function getPostCategories(post: WPPost): WPTerm[] {
  return (post._embedded?.['wp:term'] ?? []).flat().filter((term) => term.taxonomy === 'category');
}

export function getPostTags(post: WPPost): WPTerm[] {
  return (post._embedded?.['wp:term'] ?? []).flat().filter((term) => term.taxonomy === 'post_tag');
}

function htmlToText(html: string): string {
  const formatted = html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, ' ');
  const document = new DOMParser().parseFromString(formatted, 'text/html');
  return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
