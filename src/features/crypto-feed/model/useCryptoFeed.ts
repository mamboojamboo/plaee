"use client";

import { useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { useHydrateAtoms } from "jotai/utils";
import type { Event } from "@/src/entities/event";
import { eventsAtom } from "@/src/entities/event";
import {
  cryptoAllCountAtom,
  cryptoCountsAtom,
  cryptoEventsAtom,
  cryptoSubSlugAtom,
} from "./atoms";

type UseCryptoFeedInput = {
  initialEvents: Event[];
  initialCounts: Record<string, number>;
  initialAllCount: number;
  subSlug: string | null;
};

type UseCryptoFeedResult = {
  events: Event[];
  counts: Map<string, number>;
  allCount: number;
  isLoading: boolean;
};

function toCountsMap(counts: Record<string, number>): Map<string, number> {
  const m = new Map<string, number>();
  for (const [k, v] of Object.entries(counts)) {
    m.set(k.toLowerCase(), v);
  }
  return m;
}

export function useCryptoFeed({
  initialEvents,
  initialCounts,
  initialAllCount,
  subSlug,
}: UseCryptoFeedInput): UseCryptoFeedResult {
  const setCryptoEvents = useSetAtom(cryptoEventsAtom);
  const setCryptoSubSlug = useSetAtom(cryptoSubSlugAtom);
  const setCryptoCounts = useSetAtom(cryptoCountsAtom);
  const setCryptoAllCount = useSetAtom(cryptoAllCountAtom);
  const setEvents = useSetAtom(eventsAtom);

  const isLoading = initialEvents.length === 0;

  useHydrateAtoms(
    [
      [cryptoEventsAtom, initialEvents],
      [cryptoSubSlugAtom, subSlug],
      [cryptoCountsAtom, initialCounts],
      [cryptoAllCountAtom, initialAllCount],
      [eventsAtom, initialEvents],
    ] as const,
  );

  useEffect(() => {
    setCryptoEvents(initialEvents);
    setCryptoSubSlug(subSlug);
    setCryptoCounts(initialCounts);
    setCryptoAllCount(initialAllCount);
    setEvents(initialEvents);
  }, [
    initialEvents,
    initialCounts,
    initialAllCount,
    subSlug,
    setCryptoEvents,
    setCryptoSubSlug,
    setCryptoCounts,
    setCryptoAllCount,
    setEvents,
  ]);

  const countsMap = useMemo(() => toCountsMap(initialCounts), [initialCounts]);

  return {
    events: initialEvents,
    counts: countsMap,
    allCount: initialAllCount,
    isLoading,
  };
}
