import { useState, useEffect } from 'react';

const DEFAULT_COUNTRY = 'us';

export interface OriginResult {
  country: string;
  source?: string;
}

/**
 * Fetches /api/origin when enabled (e.g. when Login modal opens) to get user's country.
 * Returns 2-letter code for phone input (e.g. 'us', 'in') and full result with source.
 */
export function useOriginCountry(enabled = true) {
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY);
  const [originResult, setOriginResult] = useState<OriginResult | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const fetchOrigin = async () => {
      try {
        const res = await fetch('/api/origin', { method: 'GET' });
        const json = (await res.json()) as { country?: string; source?: string };
        const code = (json.country || '').trim().toLowerCase();
        if (!cancelled && /^[a-z]{2}$/.test(code)) {
          setCountryCode(code);
          setOriginResult({ country: code, source: json.source });
        }
      } catch {
        if (!cancelled) setOriginResult({ country: DEFAULT_COUNTRY, source: 'default' });
      }
    };
    fetchOrigin();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { countryCode, originResult };
}
