import { articles } from '../data/articles';
import { episodes } from '../data/episodes';
import { galleryItems } from '../data/gallery';
import { pastPerformances, upcomingPerformances } from '../data/performances';
import { poems } from '../data/poems';

/**
 * Content facade used by the application.
 *
 * Everything currently reads from the local structured content in `src/data`.
 * When headless WordPress is enabled, replace the implementations below with
 * the typed helpers in `services/wordpress.ts`. Keeping the same return shapes
 * means page components do not need to change.
 */
export const contentApi = {
  getPoems: () => poems,
  getPoemBySlug: (slug: string) => poems.find((poem) => poem.slug === slug) ?? null,
  getArticles: () => articles,
  getArticleBySlug: (slug: string) => articles.find((article) => article.slug === slug) ?? null,
  getEpisodes: () => episodes,
  getEpisodeBySlug: (slug: string) => episodes.find((episode) => episode.slug === slug) ?? null,
  getGallery: () => galleryItems,
  getPerformances: () => ({ upcoming: upcomingPerformances, past: pastPerformances }),
};
