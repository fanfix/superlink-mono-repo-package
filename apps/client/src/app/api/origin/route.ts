import { NextResponse } from 'next/server';

function normalizeCountryCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const trimmed = code.trim();
  if (!trimmed) return null;
  // Country codes may come like "US" or "us"
  if (trimmed.length === 2) return trimmed.toLowerCase();
  return null;
}

function countryFromAcceptLanguage(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;
  // Example: "en-US,en;q=0.9" -> "US"
  const first = acceptLanguage.split(',')[0]?.trim();
  if (!first) return null;
  const match = first.match(/^[a-z]{2,3}-([A-Za-z]{2})\b/);
  return normalizeCountryCode(match?.[1]);
}

export async function GET(request: Request) {
  const headers = request.headers;

  // Common CDNs / platforms country headers (best signal)
  const headerCandidates = [
    'x-vercel-ip-country',
    'cf-ipcountry',
    'x-country-code',
    'x-geo-country',
    'x-appengine-country',
    'x-client-country',
  ];

  for (const key of headerCandidates) {
    const code = normalizeCountryCode(headers.get(key));
    if (code) {
      return NextResponse.json({ country: code, source: key });
    }
  }

  // Fallback: infer from Accept-Language (works in local dev)
  const acceptLanguage = headers.get('accept-language');
  const inferred = countryFromAcceptLanguage(acceptLanguage);
  if (inferred) {
    return NextResponse.json({ country: inferred, source: 'accept-language' });
  }

  // Final fallback
  return NextResponse.json({ country: 'us', source: 'default' });
}

