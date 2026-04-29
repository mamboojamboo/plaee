import type { ReactNode } from "react";

import type { Event } from "@/src/entities/event";

import { EventCard } from "../container/EventCard";
import { eventToEventCardProps } from "./eventToEventCardProps";

export type EventCardNode = {
  id: string;
  node: ReactNode;
};

export function mapEventsToCardNodes(events: Event[]): EventCardNode[] {
  return events.map((event) => ({
    id: event.id,
    node: (
      <EventCard key={event.id} {...eventToEventCardProps(event)} />
    ),
  }));
}
