import "server-only";

import { cache } from "react";

import type { Event } from "@/src/entities/event";
import { getFeaturedEvents } from "@/src/entities/event/server";

const fetchEventsCached = cache(async (): Promise<Event[]> => getFeaturedEvents());

export async function fetchEvents(): Promise<Event[]> {
  return fetchEventsCached();
}
