import type { Tag } from "@/src/entities/tag";
import { normalizeTagsFromApiResponse } from "./lib/normalizeTags";

let resolvedTags: Tag[] | null = null;
let inFlight: Promise<Tag[]> | null = null;

export async function fetchMarketTags(): Promise<Tag[]> {
  if (resolvedTags) {
    return resolvedTags;
  }
  if (inFlight) {
    return inFlight;
  }

  inFlight = (async () => {
    const response = await fetch("/api/tags?type=all", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Tags request failed: ${response.status}`);
    }

    const data: unknown = await response.json();
    return normalizeTagsFromApiResponse(data);
  })();

  try {
    resolvedTags = await inFlight;
    return resolvedTags;
  } finally {
    inFlight = null;
  }
}
