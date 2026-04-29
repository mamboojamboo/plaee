"use client";

import { useAtomValue } from "jotai";
import { useMemo } from "react";
import type { Event } from "@/src/entities/event";
import { filterEventsByCryptoTypeChip } from "../lib/filterEventsByCryptoTypeChip";
import { cryptoTypeChipAtom } from "./atoms";

export function useCryptoTypeFilteredEvents(events: Event[]): Event[] {
  const typeChip = useAtomValue(cryptoTypeChipAtom);
  return useMemo(
    () => filterEventsByCryptoTypeChip(events, typeChip),
    [events, typeChip],
  );
}
