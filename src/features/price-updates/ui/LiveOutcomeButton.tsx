"use client";

import Link from "next/link";
import React, { type MouseEventHandler } from "react";

import type { Outcome } from "@/src/entities/market";
import {
  getEventCardOutcomeButtonVariant,
  OutcomeTradeContent,
  outcomeTradeSurfaceClasses,
  type OutcomeLinkVariant,
} from "@/src/shared/ui/outcome-trade";

import { useOutcomePrice, usePriceUpdateFlash } from "@/src/entities/market";
import { LiveOutcomePercent } from "./LiveOutcomePercent";

export type LiveOutcomeButtonProps = {
  href: string;
  marketId: string;
  outcomeId: string;
  initialPrice: number;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  size?: "default" | "small";
  showProbabilityOnHover?: boolean;
  label?: string;
  variant?: OutcomeLinkVariant;
  outcomeIndex: number;
  className?: string;
} & Pick<Outcome, "name">;

export const LiveOutcomeButton = React.memo(function LiveOutcomeButton({
  href,
  name,
  marketId,
  outcomeId,
  initialPrice,
  onClick,
  size = "default",
  showProbabilityOnHover = false,
  label,
  variant,
  outcomeIndex,
  className = "",
}: LiveOutcomeButtonProps) {
  const price = useOutcomePrice(marketId, outcomeId, initialPrice);
  const flash = usePriceUpdateFlash(price);
  const flashClass =
    flash === "up"
      ? "cta-flash-up"
      : flash === "down"
        ? "cta-flash-down"
        : "";

  const computedVariant =
    variant ?? getEventCardOutcomeButtonVariant(outcomeIndex);
  const surfaceClass = outcomeTradeSurfaceClasses({
    variant: computedVariant,
    size,
    showProbabilityOnHover,
    className,
  });

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${flashClass} ${surfaceClass}`.trim()}
    >
      <OutcomeTradeContent
        name={name}
        probability={price * 100}
        showProbabilityOnHover={showProbabilityOnHover}
        label={label}
        livePercentNode={
          showProbabilityOnHover ? (
            <LiveOutcomePercent
              marketId={marketId}
              outcomeId={outcomeId}
              initialPrice={initialPrice}
            />
          ) : undefined
        }
      />
    </Link>
  );
});
