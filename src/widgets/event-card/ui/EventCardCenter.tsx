import { LiveOutcomeButton } from "@/src/features/price-updates";
import type { EventCardContent } from "../utils/getEventCardContent";
import { EventCardMultiMarketRows } from "./EventCardMultiMarketRows";

type EventCardCenterProps = {
  content: EventCardContent;
  eventSlug: string;
};

export const EventCardCenter = ({
  content,
  eventSlug,
}: EventCardCenterProps) => {
  switch (content.kind) {
    case "single":
      return (
        <div className="grid grid-cols-2 gap-2">
          {content.primaryMarket.outcomes.map((outcome, idx) => (
            <LiveOutcomeButton
              key={outcome.id}
              href={`/event/${eventSlug}`}
              marketId={content.primaryMarket.id}
              outcomeId={outcome.id}
              initialPrice={outcome.price}
              name={outcome.name}
              outcomeIndex={idx}
            />
          ))}
        </div>
      );
    case "multi":
      return (
        <EventCardMultiMarketRows
          markets={content.displayedMarkets}
          eventSlug={eventSlug}
        />
      );
    default: {
      const _exhaustive: never = content;
      return _exhaustive;
    }
  }
};
