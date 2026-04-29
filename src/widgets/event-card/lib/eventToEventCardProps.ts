import type { Event } from "@/src/entities/event";

import type { EventCardProps } from "../container/EventCard";

export function eventToEventCardProps(event: Event): EventCardProps {
  return {
    markets: event.markets,
    slug: event.slug,
    imageUrl: event.imageUrl,
    title: event.title,
    seriesTitle: event.seriesTitle,
    volume: event.volume,
    volume24hr: event.volume24hr,
    startDate: event.startDate,
    resolutionDate: event.resolutionDate,
    createdAt: event.createdAt,
    live: event.live,
    featured: event.featured,
    active: event.active,
    closed: event.closed,
  };
}
