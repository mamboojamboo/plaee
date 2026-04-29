import { selectAtom } from "jotai/utils";

import type { PriceUpdate } from "@/src/entities/price-update";

import { priceUpdatesAtom } from "./atoms";

export function outcomePriceUpdateEquality(
  a: PriceUpdate | null,
  b: PriceUpdate | null,
): boolean {
  if (Object.is(a, b)) return true;
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return (
    a.marketId === b.marketId &&
    a.outcomeId === b.outcomeId &&
    a.newPrice === b.newPrice &&
    a.timestamp === b.timestamp
  );
}

type OutcomeSelect = ReturnType<
  typeof selectAtom<Map<string, PriceUpdate>, PriceUpdate | null>
>;

const outcomeSelectAtoms = new Map<string, OutcomeSelect>();

export function getOutcomePriceUpdateSelectAtom(outcomeKey: string): OutcomeSelect {
  let cached = outcomeSelectAtoms.get(outcomeKey);
  if (!cached) {
    cached = selectAtom(
      priceUpdatesAtom,
      (map) => map.get(outcomeKey) ?? null,
      outcomePriceUpdateEquality,
    );
    outcomeSelectAtoms.set(outcomeKey, cached);
  }
  return cached;
}

export function outcomePriceUpdateAtomFamily(outcomeKey: string): OutcomeSelect {
  return getOutcomePriceUpdateSelectAtom(outcomeKey);
}
