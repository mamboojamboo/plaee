import React, { memo } from "react";

import type { Market } from "@/src/entities/market";
import { LiveOutcomeButton, LiveOutcomePercent } from "@/src/features/price-updates";

import { extractMarketLabel } from "../utils/extractMarketLabel";

type MultiMarketLiveRowProps = {
  market: Market;
  eventSlug: string;
};

const MultiMarketLiveRow = memo(function MultiMarketLiveRow({
  market,
  eventSlug,
}: MultiMarketLiveRowProps) {
  const label = extractMarketLabel(market);
  const firstOutcome = market.outcomes[0];

  return (
    <div className="flex items-center gap-1 transition-colors">
      <div className="flex flex-1 items-center justify-between text-sm text-display-muted">
        <span className="truncate font-[440]">{label}</span>

        <span className="font-bold text-[15px]">
          {firstOutcome ? (
            <LiveOutcomePercent
              marketId={market.id}
              outcomeId={firstOutcome.id}
              initialPrice={firstOutcome.price}
            />
          ) : (
            "—"
          )}
        </span>
      </div>

      <div className="w-21 grid grid-cols-2 gap-1">
        {market.outcomes.map((outcome, idx) => (
          <LiveOutcomeButton
            key={outcome.id}
            href={`/event/${eventSlug}`}
            marketId={market.id}
            outcomeId={outcome.id}
            initialPrice={outcome.price}
            name={outcome.name}
            size="small"
            showProbabilityOnHover
            outcomeIndex={idx}
          />
        ))}
      </div>
    </div>
  );
});

type EventCardMultiMarketRowsProps = {
  markets: Market[];
  eventSlug: string;
};

export const EventCardMultiMarketRows: React.FC<EventCardMultiMarketRowsProps> = ({
  markets,
  eventSlug,
}) => {
  return (
    <div className="space-y-2">
      {markets.map((market) => (
        <MultiMarketLiveRow
          key={market.id}
          market={market}
          eventSlug={eventSlug}
        />
      ))}
    </div>
  );
};
