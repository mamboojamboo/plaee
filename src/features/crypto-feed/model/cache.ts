import type { Event } from "@/src/entities/event";

const GRID_TTL_MS = 30_000;
const SIDEBAR_TTL_MS = 60_000;

type CacheBucket<T> = {
  data: T;
  timestamp: number;
};

function createStringKeyCache<T>(ttlMs: number) {
  const map = new Map<string, CacheBucket<T>>();

  return {
    get(key: string, now: number = Date.now()): T | null {
      const b = map.get(key);
      if (b != null && now - b.timestamp < ttlMs) {
        return b.data;
      }
      return null;
    },

    set(key: string, data: T, now: number = Date.now()): void {
      map.set(key, { data, timestamp: now });
    },

    invalidate(): void {
      map.clear();
    },
  };
}

export type CryptoSidebarCountsPayload = {
  all: number;
  counts: Record<string, number>;
};

export const cryptoFeedGridCache = createStringKeyCache<Event[]>(GRID_TTL_MS);

export const cryptoFeedSidebarCache = createStringKeyCache<CryptoSidebarCountsPayload>(
  SIDEBAR_TTL_MS,
);
