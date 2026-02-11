import { useState, useEffect } from 'react';

const DEFAULT_COUNTRY = 'us';

/**
 * Fetches /api/origin to get user's country and returns a 2-letter code for phone input (e.g. 'us', 'in').
 * Use in Login modal, Signup, and Login pages so phone field shows correct country code.
 */
export function useOriginCountry(enabled = true) {
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const fetchOrigin = async () => {
      try {
        const res = await fetch('/api/origin', { method: 'GET' });
        const json = (await res.json()) as { country?: string };
        const code = (json.country || '').trim().toLowerCase();
        if (!cancelled && /^[a-z]{2}$/.test(code)) {
          setCountryCode(code);
        }
      } catch {
        // Keep default
      }
    };
    fetchOrigin();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return countryCode;
}
