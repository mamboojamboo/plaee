import "server-only";

import { unstable_cache } from "next/cache";

import type { Tag } from "@/src/entities/tag";
import { GAMMA_API_URL, JSON_REQUEST_HEADERS } from "@/src/shared/api";
import { normalizeTagsFromApiResponse } from "./lib/normalizeTags";

export { fetchGammaTagsUpstream } from "./lib/gammaTagsUpstream";

const GAMMA_TAGS_QUERY = "limit=500&offset=0";

async function fetchMarketTagsFromGamma(): Promise<Tag[]> {
  try {
    const response = await fetch(`${GAMMA_API_URL}/tags?${GAMMA_TAGS_QUERY}`, {
      headers: JSON_REQUEST_HEADERS,
    });

    if (!response.ok) {
      console.warn(`[Tags] Request failed with status ${response.status}`);
      return [];
    }

    const data: unknown = await response.json();
    return normalizeTagsFromApiResponse(data);
  } catch (error) {
    console.error("[Tags] Failed to fetch:", error);
    return [];
  }
}

const getMarketTagsCached = unstable_cache(
  async () => fetchMarketTagsFromGamma(),
  ["market-tags-all"],
  { revalidate: 3600, tags: ["tags"] },
);

export async function getMarketTags(): Promise<Tag[]> {
  return getMarketTagsCached();
}
