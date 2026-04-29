"use client";

import React from "react";
import type { Outcome } from "@/src/entities/market";
import { useOutcomePrice, usePriceUpdateFlash } from "@/src/entities/market";
import { formatCents } from "@/src/shared/lib/format";
import { OutcomeTradeContent, outcomeTradeSurfaceClasses } from "@/src/shared/ui/outcome-trade";

type TradeCtaPairProps = {
  eventSlug: string;
  marketId: string;
  yesOutcome: Outcome;
  noOutcome: Outcome;
};

export function TradeCtaPair(props: TradeCtaPairProps) {
  const { marketId, yesOutcome, noOutcome } = props;

  const yesPrice = useOutcomePrice(marketId, yesOutcome.id, yesOutcome.price);
  const noPrice = useOutcomePrice(marketId, noOutcome.id, noOutcome.price);
  const yesFlash = usePriceUpdateFlash(yesPrice);
  const noFlash = usePriceUpdateFlash(noPrice);
  const yesFlashClass =
    yesFlash === "up" ? "cta-flash-up" : yesFlash === "down" ? "cta-flash-down" : "";
  const noFlashClass =
    noFlash === "up" ? "cta-flash-up" : noFlash === "down" ? "cta-flash-down" : "";

  return (
    <div className="grid w-full grid-cols-2 gap-2 lg:w-[330px]">
      <button
        type="button"
        className={`cursor-pointer ${yesFlashClass} ${outcomeTradeSurfaceClasses({
          variant: "positive",
          size: "default",
          showProbabilityOnHover: false,
          className:
            "h-12 max-lg:text-base max-lg:leading-normal lg:text-sm lg:leading-6",
        })}`}
        aria-label={`Buy ${yesOutcome.name} ${formatCents(yesPrice)}`}
      >
        <OutcomeTradeContent
          name={yesOutcome.name}
          probability={yesPrice * 100}
          label={`Buy ${yesOutcome.name} ${formatCents(yesPrice)}`}
        />
      </button>
      <button
        type="button"
        className={`cursor-pointer ${noFlashClass} ${outcomeTradeSurfaceClasses({
          variant: "negative",
          size: "default",
          showProbabilityOnHover: false,
          className:
            "h-12 max-lg:text-base max-lg:leading-normal lg:text-sm lg:leading-6",
        })}`}
        aria-label={`Buy ${noOutcome.name} ${formatCents(noPrice)}`}
      >
        <OutcomeTradeContent
          name={noOutcome.name}
          probability={noPrice * 100}
          label={`Buy ${noOutcome.name} ${formatCents(noPrice)}`}
        />
      </button>
    </div>
  );
}
