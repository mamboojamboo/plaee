import React from "react";

import { formatPercentFromPrice } from "@/src/shared/lib/format";

type OutcomeTradeContentProps = {
  name: string;
  probability: number;
  showProbabilityOnHover?: boolean;
  label?: string;
  livePercentNode?: React.ReactNode;
};

export function OutcomeTradeContent({
  name,
  probability,
  showProbabilityOnHover = false,
  label,
  livePercentNode,
}: OutcomeTradeContentProps) {
  if (showProbabilityOnHover) {
    return (
      <span className="inline-grid place-items-center">
        <span className="col-start-1 row-start-1 transition-opacity duration-150 group-hover:opacity-0">
          {name}
        </span>
        <span className="col-start-1 row-start-1 transition-opacity duration-150 opacity-0 group-hover:opacity-100">
          {livePercentNode ??
            formatPercentFromPrice(probability / 100)}
        </span>
      </span>
    );
  }

  return <>{label ?? name}</>;
}
