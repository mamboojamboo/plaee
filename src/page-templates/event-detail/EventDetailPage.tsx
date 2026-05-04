import { notFound } from "next/navigation";
import {
  type Event,
  selectEventHeaderMeta,
  selectEventTradeRows,
} from "@/src/entities/event";
import { EventDetailHeader } from "@/src/widgets/event-detail-header";
import { EventDetailTradingBoard } from "@/src/widgets/event-detail-trading-board";

import { EventDetailBootstrap } from "./EventDetailBootstrap";
import { EVENT_DETAIL_INTL } from "./constants";
import {
  EventDetailEmptyState,
  EventDetailPageShell,
} from "./EventDetailStates";

type EventDetailPageProps = {
  slug: string;
  initialEvent: Event;
};

export const EventDetailPage = ({
  slug,
  initialEvent,
}: EventDetailPageProps) => {
  const eventMatchesSlug =
    initialEvent.slug === slug || initialEvent.id === slug;
  if (!eventMatchesSlug) {
    notFound();
  }

  const headerMeta = selectEventHeaderMeta(initialEvent);
  const tradeRows = selectEventTradeRows(initialEvent.markets);

  return (
    <EventDetailBootstrap key={initialEvent.id} initialEvent={initialEvent}>
      <EventDetailPageShell>
        <EventDetailHeader
          meta={headerMeta}
          timeframeLabel={EVENT_DETAIL_INTL.TIMEFRAME_LABEL_PAST}
        />
        {tradeRows.length > 0 ? (
          <EventDetailTradingBoard
            rows={tradeRows}
            eventSlug={initialEvent.slug}
          />
        ) : (
          <EventDetailEmptyState />
        )}
      </EventDetailPageShell>
    </EventDetailBootstrap>
  );
};
