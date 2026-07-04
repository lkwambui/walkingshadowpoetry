const API_BASE = 'https://walkingshadowpoetry.com/blog/wp-json/wp/v2';

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  jetpack_featured_media_url: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: { width: number; height: number };
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; taxonomy: string }>>;
  };
}

export interface FetchPostsResult {
  posts: WPPost[];
  total: number;
  totalPages: number;
}

export async function fetchPosts(page = 1, perPage = 10, search = ''): Promise<FetchPostsResult> {
  const params = new URLSearchParams({
    _embed: '',
    per_page: String(perPage),
    page: String(page),
  });
  if (search) params.set('search', search);

  const res = await fetch(`${API_BASE}/posts?${params}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  const posts: WPPost[] = await res.json();
  const total = Number(res.headers.get('X-WP-Total')) || 0;
  const totalPages = Number(res.headers.get('X-WP-TotalPages')) || 1;
  return { posts, total, totalPages };
}

export async function fetchPost(slug: string): Promise<WPPost | null> {
  const res = await fetch(`${API_BASE}/posts?slug=${slug}&_embed`);
  if (!res.ok) throw new Error('Failed to fetch post');
  const posts: WPPost[] = await res.json();
  return posts[0] || null;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function getCategories(post: WPPost): string[] {
  const terms = post._embedded?.['wp:term'] ?? [];
  const categories = terms
    .flat()
    .filter(t => t.taxonomy === 'category' && t.name !== 'Uncategorized')
    .map(t => t.name);
  return [...new Set(categories)];
}
