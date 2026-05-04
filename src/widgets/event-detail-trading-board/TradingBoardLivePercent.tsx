"use client";

import React from "react";

import type { EventTradeRow } from "@/src/entities/event";
import { useOutcomePrice, usePriceUpdateFlash } from "@/src/entities/market";
import { formatPercentFromPrice } from "@/src/shared/lib/format";

type TradingBoardLivePercentProps = {
  row: EventTradeRow;
};

export const TradingBoardLivePercent = React.memo(function TradingBoardLivePercent({
  row,
}: TradingBoardLivePercentProps) {
  const yesPrice = useOutcomePrice(row.id, row.yesOutcome.id, row.yesOutcome.price);
  const probabilityPercentLabel = formatPercentFromPrice(yesPrice);
  const priceFlash = usePriceUpdateFlash(yesPrice);
  const priceFlashClass =
    priceFlash === "up"
      ? "price-flash-up"
      : priceFlash === "down"
        ? "price-flash-down"
        : "";

  return (
    <span className={priceFlashClass}>{probabilityPercentLabel}</span>
  );
});
