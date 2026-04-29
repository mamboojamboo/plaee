import React, { type ReactNode } from "react";
import type { EventTradeRow } from "@/src/entities/event";
import { TradingBoardRow } from "./TradingBoardRow";

type EventDetailTradingBoardProps = {
  rows: Array<{ row: EventTradeRow; actions: ReactNode }>;
};

export function EventDetailTradingBoard({
  rows,
}: EventDetailTradingBoardProps) {
  return (
    <section>
      {rows.map(({ row, actions }) => (
        <TradingBoardRow key={row.id} row={row} actions={actions} />
      ))}
    </section>
  );
}
