import type { Event } from "@/src/entities/event";
import type { Market } from "@/src/entities/market";

export const getPrimaryMarket = (
  event: Pick<Event, "markets">,
): Market | null => {
  return event.markets[0] || null;
};