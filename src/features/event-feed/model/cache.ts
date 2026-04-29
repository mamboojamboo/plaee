import type { Event } from "@/src/entities/event";

const TTL_MS = 30_000;

type Bucket = {
  data: Event[] | null;
  timestamp: number;
};

let bucket: Bucket = { data: null, timestamp: 0 };

export const featuredEventsCache = {
  get(now: number = Date.now()): Event[] | null {
    if (
      bucket.data !== null &&
      now - bucket.timestamp < TTL_MS
    ) {
      return bucket.data;
    }
    return null;
  },

  set(events: Event[], now: number = Date.now()): void {
    bucket = { data: events, timestamp: now };
  },

  invalidate(): void {
    bucket = { data: null, timestamp: 0 };
  },
};
