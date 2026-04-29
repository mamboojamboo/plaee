"use client";

import { useState } from "react";

export type EventTimeframe = "past";

export function useEventTimeframeFilter() {
  const [timeframe, setTimeframe] = useState<EventTimeframe>("past");

  return {
    timeframe,
    setTimeframe,
  };
}
