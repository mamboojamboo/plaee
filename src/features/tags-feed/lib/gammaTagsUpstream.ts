import "server-only";

import { GAMMA_API_URL, JSON_REQUEST_HEADERS } from "@/src/shared/api";

const GAMMA_PROXY_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function upstreamHeaders(): HeadersInit {
  return {
    ...JSON_REQUEST_HEADERS,
    "User-Agent": GAMMA_PROXY_USER_AGENT,
  };
}

export function buildGammaTagsProxyUrl(request: Request): string {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "all";

  if (type === "forceShow") {
    return `${GAMMA_API_URL}/tags?forceShow=true&limit=100`;
  }
  if (type === "carousel") {
    return `${GAMMA_API_URL}/tags?is_carousel=true&limit=100`;
  }
  return `${GAMMA_API_URL}/tags?limit=500&offset=0`;
}

export async function fetchGammaTagsUpstream(request: Request): Promise<Response> {
  const url = buildGammaTagsProxyUrl(request);
  return fetch(url, { headers: upstreamHeaders() });
}
