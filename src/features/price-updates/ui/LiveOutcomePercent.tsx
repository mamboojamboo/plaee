"use client";

import React, { useMemo } from "react";
import { formatPercentFromPrice } from "@/src/shared/lib/format";
import { useOutcomePrice, usePriceUpdateFlash } from "@/src/entities/market";

export type LiveOutcomePercentProps = {
  marketId: string;
  outcomeId: string;
  initialPrice: number;
  className?: string;
};

export const LiveOutcomePercent = React.memo(function LiveOutcomePercent({
  marketId,
  outcomeId,
  initialPrice,
  className = "",
}: LiveOutcomePercentProps) {
  const price = useOutcomePrice(marketId, outcomeId, initialPrice);
  const flash = usePriceUpdateFlash(price);
  const flashClass =
    flash === "up"
      ? "price-flash-up"
      : flash === "down"
        ? "price-flash-down"
        : "";

  const label = useMemo(() => formatPercentFromPrice(price), [price]);

  return (
    <span className={`${flashClass} ${className}`.trim()}>{label}</span>
  );
});
