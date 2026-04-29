"use client";

import { memo, useMemo } from "react";
import { formatPercentFromPrice } from "@/src/shared/lib/format";
import { ChanceIndicator } from "@/src/shared/ui/chance-indicator";
import { useOutcomePrice, usePriceUpdateFlash } from "@/src/entities/market";

export type LiveChanceIndicatorProps = {
  marketId: string;
  outcomeId: string;
  initialPrice: number;
  chanceLabel: string;
};

function LiveChanceIndicatorInner({
  marketId,
  outcomeId,
  initialPrice,
  chanceLabel,
}: LiveChanceIndicatorProps) {
  const price = useOutcomePrice(marketId, outcomeId, initialPrice);
  const probabilityPercent = price * 100;
  const percentLabel = useMemo(() => formatPercentFromPrice(price), [price]);
  const flash = usePriceUpdateFlash(price);
  const percentTextClassName =
    flash === "up"
      ? "price-flash-up"
      : flash === "down"
        ? "price-flash-down"
        : "";

  return (
    <ChanceIndicator
      probability={probabilityPercent}
      label={chanceLabel}
      percentLabel={percentLabel}
      percentTextClassName={percentTextClassName}
    />
  );
}

export const LiveChanceIndicator = memo(LiveChanceIndicatorInner);
