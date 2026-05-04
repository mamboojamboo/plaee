import type { EventTradeRow } from "@/src/entities/event";
import { TradingBoardRow } from "./TradingBoardRow";

type EventDetailTradingBoardProps = {
  rows: EventTradeRow[];
  eventSlug: string;
};

export const EventDetailTradingBoard = ({
  rows,
  eventSlug,
}: EventDetailTradingBoardProps) => {
  return (
    <section>
      {rows.map((row) => (
        <TradingBoardRow key={row.id} row={row} eventSlug={eventSlug} />
      ))}
    </section>
  );
};
