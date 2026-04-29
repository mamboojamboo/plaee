import "server-only";

import type { Event } from "./types";
import type { Market } from "@/src/entities/market";
import {
  fetchFeaturedEventsFromGamma,
  fetchEventBySlugFromGamma,
  fetchMarketsByEventIdFromGamma,
} from "./lib/gammaApi";

export async function getFeaturedEvents(): Promise<Event[]> {
  return fetchFeaturedEventsFromGamma();
}

export async function getEventBySlugFromGamma(slug: string): Promise<Event | null> {
  return fetchEventBySlugFromGamma(slug);
}

export async function getMarketsByEventId(
  eventId: string,
  eventSlug: string,
): Promise<Market[]> {
  return fetchMarketsByEventIdFromGamma(eventId, eventSlug);
}
