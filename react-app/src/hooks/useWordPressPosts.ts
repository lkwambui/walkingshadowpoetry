import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearWordPressCache,
  getCategories,
  getPosts,
  type PaginatedResult,
  type WPPost,
  type WPCategory,
} from '../services/wordpress';

const emptyResult: PaginatedResult<WPPost> = { items: [], total: 0, totalPages: 0 };

export function useWordPressCategories() {
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getCategories().then((items) => {
      if (active) {
        setCategories(items);
        setError(null);
      }
    }).catch((reason: unknown) => {
      console.error('Unable to load WordPress categories.', reason);
      if (active) setError(reason instanceof Error ? reason : new Error('Unable to load categories.'));
    });

    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    clearWordPressCache();
    setError(null);
    setAttempt((value) => value + 1);
  }, []);

  return { categories, error, retry };
}

export function useWordPressPosts(search: string, categoryId?: number) {
  const [result, setResult] = useState(emptyResult);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [page, setPage] = useState(1);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    setResult(emptyResult);
    setPage(1);

    getPosts({ page: 1, search, categoryId }).then((response) => {
      if (currentRequest !== requestId.current) return;
      setResult(response);
      setLoading(false);
    }).catch((reason: unknown) => {
      console.error('Unable to load WordPress posts.', reason);
      if (currentRequest !== requestId.current) return;
      setError(reason instanceof Error ? reason : new Error('Unable to load posts.'));
      setLoading(false);
    });

    return () => {
      requestId.current += 1;
    };
  }, [search, categoryId, attempt]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || page >= result.totalPages) return;

    const currentRequest = requestId.current;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const response = await getPosts({ page: nextPage, search, categoryId });
      if (currentRequest !== requestId.current) return;
      setResult((current) => {
        const knownIds = new Set(current.items.map((post) => post.id));
        return {
          ...response,
          items: [...current.items, ...response.items.filter((post) => !knownIds.has(post.id))],
        };
      });
      setPage(nextPage);
    } catch (reason) {
      console.error('Unable to load more WordPress posts.', reason);
      setError(reason instanceof Error ? reason : new Error('Unable to load more posts.'));
    } finally {
      if (currentRequest === requestId.current) setLoadingMore(false);
    }
  }, [categoryId, loading, loadingMore, page, result.totalPages, search]);

  const retry = useCallback(() => {
    clearWordPressCache();
    setAttempt((value) => value + 1);
  }, []);

  return {
    posts: result.items,
    total: result.total,
    totalPages: result.totalPages,
    loading,
    loadingMore,
    error,
    hasMore: page < result.totalPages,
    loadMore,
    retry,
  };
}
