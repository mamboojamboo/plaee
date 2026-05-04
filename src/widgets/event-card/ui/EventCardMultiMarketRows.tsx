import type { Market } from "@/src/entities/market";
import { LiveOutcomeButton, LiveOutcomePercent } from "@/src/features/price-updates";

import { INTL } from "../constants";
import { extractMarketLabel } from "../utils/extractMarketLabel";

type MultiMarketLiveRowProps = {
  market: Market;
  eventSlug: string;
};

const MultiMarketLiveRow = ({
  market,
  eventSlug,
}: MultiMarketLiveRowProps) => {
  const label = extractMarketLabel(market);
  const firstOutcome = market.outcomes[0];

  return (
    <div className="flex min-w-0 items-center gap-2 transition-colors">
      <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-sm text-display-muted">
        <span className="truncate font-[440]" title={label}>
          {label}
        </span>

        <span className="shrink-0 text-[15px] font-bold tabular-nums">
          {firstOutcome ? (
            <LiveOutcomePercent
              marketId={market.id}
              outcomeId={firstOutcome.id}
              initialPrice={firstOutcome.price}
            />
          ) : (
            INTL.EMPTY_PERCENT_PLACEHOLDER
          )}
        </span>
      </div>

      <div className="grid w-21 shrink-0 grid-cols-2 gap-1">
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
};

type EventCardMultiMarketRowsProps = {
  markets: Market[];
  eventSlug: string;
};

export const EventCardMultiMarketRows = ({
  markets,
  eventSlug,
}: EventCardMultiMarketRowsProps) => {
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
