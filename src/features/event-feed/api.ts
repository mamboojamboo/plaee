import "server-only";

import type { Event } from "@/src/entities/event";
import { getFeaturedEvents } from "@/src/entities/event/server";
import { featuredEventsCache } from "./model/cache";

export async function fetchEvents(
  forceRefresh: boolean = false,
): Promise<Event[]> {
  const now = Date.now();

  if (!forceRefresh) {
    const cached = featuredEventsCache.get(now);
    if (cached) return cached;
  }

  const events = await getFeaturedEvents();
  featuredEventsCache.set(events, now);
  return events;
}
