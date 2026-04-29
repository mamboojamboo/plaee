import { type ReactNode } from "react";
import {
  type Event,
  selectEventHeaderMeta,
  selectEventTradeRows,
} from "@/src/entities/event";
import { TradeCtaPair } from "@/src/features/trade-cta";
import { EventDetailHeader } from "@/src/widgets/event-detail-header";
import { EventDetailTradingBoard } from "@/src/widgets/event-detail-trading-board";

import { EventDetailBootstrap } from "./EventDetailBootstrap";
import {
  EventDetailEmptyState,
  EventDetailNotFoundState,
  EventDetailPageShell,
} from "./EventDetailStates";

type EventDetailPageProps = {
  slug: string;
  initialEvent: Event | null;
};

const TIMEFRAME_LABEL = "Past";

export function EventDetailPage({ slug, initialEvent }: EventDetailPageProps) {
  if (!initialEvent) {
    return <EventDetailNotFoundState />;
  }

  const eventMatchesSlug =
    initialEvent.slug === slug || initialEvent.id === slug;
  if (!eventMatchesSlug) {
    return <EventDetailNotFoundState />;
  }

  const headerMeta = selectEventHeaderMeta(initialEvent);
  const tradeRows = selectEventTradeRows(initialEvent.markets);
  const eventSlug = initialEvent.slug;

  const rowsWithActions: Array<{
    row: (typeof tradeRows)[number];
    actions: ReactNode;
  }> = tradeRows.map((row) => ({
    row,
    actions: (
      <TradeCtaPair
        eventSlug={eventSlug}
        marketId={row.id}
        yesOutcome={row.yesOutcome}
        noOutcome={row.noOutcome}
      />
    ),
  }));

  return (
    <EventDetailBootstrap initialEvent={initialEvent}>
      <EventDetailPageShell>
        <EventDetailHeader meta={headerMeta} timeframeLabel={TIMEFRAME_LABEL} />
        {rowsWithActions.length > 0 ? (
          <EventDetailTradingBoard rows={rowsWithActions} />
        ) : (
          <EventDetailEmptyState />
        )}
      </EventDetailPageShell>
    </EventDetailBootstrap>
  );
}
