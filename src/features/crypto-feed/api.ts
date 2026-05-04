import "server-only";

import { cache } from "react";

import type { Event } from "@/src/entities/event";
import { eventTagMatchesSelectedTag } from "@/src/entities/tag";
import { fetchEventsPaginatedFromGamma } from "@/src/entities/event/server";
import {
  CRYPTO_ASSET_SLUGS,
  CRYPTO_TIMEFRAME_SLUGS,
  CRYPTO_TYPE_CHIP_SLUGS,
  RECURRING_TIMEFRAME_SLUGS,
} from "./constants";
import {
  buildCryptoTagPaginationQuery,
  CRYPTO_ASSET_DEDUPE_LIMIT,
  CRYPTO_GRID_FETCH_LIMIT,
  CRYPTO_HUB_MERGE_PAGE_SIZE,
  CRYPTO_RECURRING_FETCH_LIMIT,
} from "./lib/cryptoTagPagination";
import { selectLiveEventPerSeries } from "./lib/selectLiveEventPerSeries";

const LONG_HORIZON_TIMEFRAMES = new Set([
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "pre-market",
  "etf",
]);

function sortByVolumeDesc(events: Event[]): Event[] {
  return [...events].sort((a, b) => b.volume - a.volume);
}

const fetchCryptoMergedHubEventsCached = cache(async (): Promise<Event[]> => {
  const [vol, created] = await Promise.all([
    fetchEventsPaginatedFromGamma(
      buildCryptoTagPaginationQuery({
        tagSlug: "crypto",
        relatedTags: true,
        order: "volume_24hr",
        ascending: false,
        limit: CRYPTO_HUB_MERGE_PAGE_SIZE,
      }),
    ),
    fetchEventsPaginatedFromGamma(
      buildCryptoTagPaginationQuery({
        tagSlug: "crypto",
        relatedTags: true,
        order: "createdAt",
        ascending: false,
        limit: CRYPTO_HUB_MERGE_PAGE_SIZE,
      }),
    ),
  ]);

  const byId = new Map<string, Event>();
  for (const e of vol.events) byId.set(e.id, e);
  for (const e of created.events) byId.set(e.id, e);

  return [...byId.values()];
});

export async function fetchCryptoMergedHubEvents(): Promise<Event[]> {
  return fetchCryptoMergedHubEventsCached();
}

const fetchCryptoTrendingEventsCached = cache(async (): Promise<Event[]> => {
  const merged = await fetchCryptoMergedHubEventsCached();
  return sortByVolumeDesc(merged);
});

export async function fetchCryptoTrendingEvents(): Promise<Event[]> {
  return fetchCryptoTrendingEventsCached();
}

const fetchCryptoEventsForSubSlugCached = cache(
  async (subSlug: string): Promise<Event[]> => {
    const normalized = subSlug.trim().toLowerCase();
    let out: Event[];

    if (RECURRING_TIMEFRAME_SLUGS.has(normalized)) {
      const q = buildCryptoTagPaginationQuery({
        tagSlug: normalized,
        relatedTags: true,
        order: "startDate",
        ascending: false,
        limit: CRYPTO_RECURRING_FETCH_LIMIT,
      });
      const { events } = await fetchEventsPaginatedFromGamma(q);
      out = sortByVolumeDesc(selectLiveEventPerSeries(events));
    } else if ((CRYPTO_ASSET_SLUGS as readonly string[]).includes(normalized)) {
      const q = buildCryptoTagPaginationQuery({
        tagSlug: normalized,
        relatedTags: true,
        order: "volume_24hr",
        ascending: false,
        limit: CRYPTO_ASSET_DEDUPE_LIMIT,
      });
      const { events } = await fetchEventsPaginatedFromGamma(q);
      out = sortByVolumeDesc(selectLiveEventPerSeries(events)).slice(0, CRYPTO_GRID_FETCH_LIMIT);
    } else {
      const q = buildCryptoTagPaginationQuery({
        tagSlug: normalized,
        relatedTags: true,
        order: "volume_24hr",
        ascending: false,
        limit: CRYPTO_GRID_FETCH_LIMIT,
      });
      const { events } = await fetchEventsPaginatedFromGamma(q);
      out = sortByVolumeDesc(events);
    }

    return out;
  },
);

export async function fetchCryptoEventsForSubSlug(
  subSlug: string,
): Promise<Event[]> {
  return fetchCryptoEventsForSubSlugCached(subSlug);
}

const fetchCryptoSidebarCountsCached = cache(async (): Promise<{
  all: number;
  counts: Record<string, number>;
}> => {
  const timeframeTasks = CRYPTO_TIMEFRAME_SLUGS.map(async (slug) => {
    if (RECURRING_TIMEFRAME_SLUGS.has(slug)) {
      const q = buildCryptoTagPaginationQuery({
        tagSlug: slug,
        relatedTags: true,
        order: "startDate",
        ascending: false,
        limit: CRYPTO_RECURRING_FETCH_LIMIT,
      });
      const { events } = await fetchEventsPaginatedFromGamma(q);
      return { slug, count: selectLiveEventPerSeries(events).length };
    }
    if (LONG_HORIZON_TIMEFRAMES.has(slug)) {
      const q = buildCryptoTagPaginationQuery({
        tagSlug: slug,
        relatedTags: true,
        limit: 1,
      });
      const { total } = await fetchEventsPaginatedFromGamma(q);
      return { slug, count: total };
    }
    return { slug, count: 0 };
  });

  const assetTasks = CRYPTO_ASSET_SLUGS.map(async (slug) => {
    const q = buildCryptoTagPaginationQuery({
      tagSlug: slug,
      relatedTags: true,
      order: "volume_24hr",
      ascending: false,
      limit: CRYPTO_ASSET_DEDUPE_LIMIT,
    });
    const { events } = await fetchEventsPaginatedFromGamma(q);
    return { slug, count: selectLiveEventPerSeries(events).length };
  });

  const mergeForAllAndChips = async (): Promise<{
    all: number;
    chipCounts: Record<string, number>;
  }> => {
    const unique = await fetchCryptoMergedHubEventsCached();

    const chipCounts: Record<string, number> = {};
    for (const chip of CRYPTO_TYPE_CHIP_SLUGS) {
      chipCounts[chip] = unique.filter((e) =>
        e.tags.some((t) => eventTagMatchesSelectedTag(t, chip)),
      ).length;
    }

    return { all: unique.length, chipCounts };
  };

  const [tfResults, assetResults, merged] = await Promise.all([
    Promise.all(timeframeTasks),
    Promise.all(assetTasks),
    mergeForAllAndChips(),
  ]);

  const counts: Record<string, number> = { ...merged.chipCounts };
  for (const { slug, count } of tfResults) counts[slug] = count;
  for (const { slug, count } of assetResults) counts[slug] = count;

  return { all: merged.all, counts };
});

export async function fetchCryptoSidebarCounts(): Promise<{
  all: number;
  counts: Record<string, number>;
}> {
  return fetchCryptoSidebarCountsCached();
}
