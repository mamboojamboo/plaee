"use client";

import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { outcomePriceUpdateAtomFamily } from "./outcomePriceAtomFamily";

export function useOutcomePrice(
  marketId: string,
  outcomeId: string,
  originalPrice: number,
): number {
  const key = `${marketId}:${outcomeId}`;
  const selectiveAtom = useMemo(
    () => outcomePriceUpdateAtomFamily(key),
    [key],
  );
  const update = useAtomValue(selectiveAtom);
  return update?.newPrice ?? originalPrice;
}
