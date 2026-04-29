"use client";

import React, { memo, type ReactNode } from "react";
import type { EventTradeRow } from "@/src/entities/event";
import { useOutcomePrice, usePriceUpdateFlash } from "@/src/entities/market";
import { formatPercentFromPrice } from "@/src/shared/lib/format";

type TradingBoardRowProps = {
  row: EventTradeRow;
  actions: ReactNode;
};

function TradingBoardRowInner({ row, actions }: TradingBoardRowProps) {
  const yesPrice = useOutcomePrice(row.id, row.yesOutcome.id, row.yesOutcome.price);
  const probabilityPercentLabel = formatPercentFromPrice(yesPrice);
  const priceFlash = usePriceUpdateFlash(yesPrice);
  const priceFlashClass =
    priceFlash === "up" ? "price-flash-up" : priceFlash === "down" ? "price-flash-down" : "";

  return (
    <div className="border-b border-border py-4 lg:grid lg:grid-cols-[1fr_140px_330px] lg:items-center lg:gap-6">
      <div className="mb-3 flex items-start justify-between gap-3 lg:mb-0 lg:block">
        <div className="min-w-0 pr-3">
          <p className="truncate text-base font-semibold leading-normal text-foreground lg:text-base lg:font-semibold lg:leading-normal lg:text-display-heading">
            {row.label}
          </p>
          <p className="mt-1.5 text-xs font-normal leading-4 text-foreground-muted lg:mt-1 lg:text-[13px] lg:font-normal lg:leading-6">
            {row.volumeLabel}
          </p>
        </div>
        <div className="shrink-0 text-right text-[28px] font-semibold leading-none text-display-muted lg:hidden">
          <span className={priceFlashClass}>{probabilityPercentLabel}</span>
        </div>
      </div>

      <div className="hidden text-center text-[28px] font-semibold leading-none text-display-muted lg:block">
        <span className={priceFlashClass}>{probabilityPercentLabel}</span>
      </div>

      {actions}
    </div>
  );
}

export const TradingBoardRow = memo(TradingBoardRowInner);
