"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import type { Event } from "@/src/entities/event";
import { eventsAtom } from "@/src/entities/event";
import { usePriceUpdates } from "@/src/features/price-updates";
import {
  cryptoAllCountAtom,
  cryptoCountsAtom,
  cryptoEventsAtom,
  cryptoSubSlugAtom,
} from "@/src/features/crypto-feed";

type CryptoFeedBootstrapProps = {
  initialEvents: Event[];
  initialCounts: Record<string, number>;
  initialAllCount: number;
  subSlug: string | null;
};

export const CryptoFeedBootstrap = ({
  initialEvents,
  initialCounts,
  initialAllCount,
  subSlug,
}: CryptoFeedBootstrapProps) => {
  useHydrateAtoms(
    [
      [cryptoEventsAtom, initialEvents],
      [cryptoSubSlugAtom, subSlug],
      [cryptoCountsAtom, initialCounts],
      [cryptoAllCountAtom, initialAllCount],
      [eventsAtom, initialEvents],
    ] as const,
  );

  const setCryptoEvents = useSetAtom(cryptoEventsAtom);
  const setCryptoSubSlug = useSetAtom(cryptoSubSlugAtom);
  const setCryptoCounts = useSetAtom(cryptoCountsAtom);
  const setCryptoAllCount = useSetAtom(cryptoAllCountAtom);
  const setEvents = useSetAtom(eventsAtom);

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

  usePriceUpdates();

  return null;
};
