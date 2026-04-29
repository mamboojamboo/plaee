import type { Event } from "@/src/entities/event";
import type { Market } from "@/src/entities/market";

import { getPrimaryMarket } from "./getPrimaryMarket";

export type EventCardContentSingle = {
  kind: "single";
  primaryMarket: Market;
  chanceLabel: string;
};

export type EventCardContentMulti = {
  kind: "multi";
  displayedMarkets: Market[];
};

export type EventCardContent = EventCardContentSingle | EventCardContentMulti;

export function getEventCardContent(
  event: Pick<Event, "markets">,
  maxDisplayed: number,
): EventCardContent | null {
  if (event.markets.length === 1) {
    const primaryMarket = getPrimaryMarket(event);
    if (!primaryMarket) return null;

    const firstOutcomeName = primaryMarket.outcomes[0]?.name ?? "";
    const chanceLabel =
      firstOutcomeName.toLowerCase() === "yes" ? "chance" : firstOutcomeName;

    return {
      kind: "single",
      primaryMarket,
      chanceLabel,
    };
  }

  return {
    kind: "multi",
    displayedMarkets: event.markets.slice(0, maxDisplayed),
  };
}
