'use client';

import { useEffect } from 'react';

/**
 * Silences all console output in the browser.
 * The user explicitly requested removing console logs from the app runtime.
 */
export default function ConsoleSilencer() {
  useEffect(() => {
    // Ensure this only affects the browser
    if (typeof window === 'undefined') return;

    // No-op all console methods
    const noop = () => undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = window.console;
    if (!c) return;

    c.log = noop;
    c.error = noop;
    c.warn = noop;
    c.info = noop;
    c.debug = noop;
  }, []);

  return null;
}

