import { useState, useRef } from 'react';

export const useRssFeed = () => {
  const [rssFeed, setRssFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const ongoingRequestRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRssFeed = async (url: string) => {
    if (!url || !url.trim()) {
      setLoading(false);
      return [];
    }

    const trimmedUrl = url.trim();
    
    // If same URL is already being fetched, don't make another request
    if (ongoingRequestRef.current === trimmedUrl && loading) {
      return [];
    }

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    ongoingRequestRef.current = trimmedUrl;
    
    setLoading(true);
    try {
      const apiUrl = `https://superlink.io/api/rss?url=${encodeURIComponent(trimmedUrl)}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
      });
      
      // Check if request was aborted
      if (abortController.signal.aborted) {
        return [];
      }

      // Handle 404 or other errors - still return empty array but don't throw
      if (!response.ok) {
        // For 404 or other errors, return empty array
        // Keep loading state briefly to show smooth UX
        setTimeout(() => {
          setLoading(false);
          ongoingRequestRef.current = null;
        }, 500);
        return [];
      }
      
      const data = await response.json();
      const feed = Array.isArray(data) ? data.slice(0, 5) : [];
      setRssFeed(feed);
      setLoading(false);
      ongoingRequestRef.current = null;
      return feed;
    } catch (error: any) {
      // Ignore abort errors
      if (error.name === 'AbortError') {
        return [];
      }
      
      console.error('Error fetching RSS feed:', error);
      // Even on error, keep loading state briefly for smooth UX
      setTimeout(() => {
        setLoading(false);
        ongoingRequestRef.current = null;
      }, 500);
      return [];
    }
  };

  return { rssFeed, loading, fetchRssFeed };
};
