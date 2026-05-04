"use client";

import { useMemo, type ReactNode } from "react";
import { useAtomValue } from "jotai";

import { eventsAtom } from "@/src/entities/event";
import { useCryptoTypeFilteredEvents } from "@/src/features/crypto-feed";
import { LoadingSkeleton } from "@/src/shared/ui/loading-skeleton";

import {
  CRYPTO_INTL,
  CRYPTO_VISIBLE_EVENT_CARDS,
} from "./constants";

type CryptoFeedGridProps = {
  cards: Array<{ id: string; node: ReactNode }>;
};

export const CryptoFeedGrid = ({ cards }: CryptoFeedGridProps) => {
  const events = useAtomValue(eventsAtom);
  const typeFilteredEvents = useCryptoTypeFilteredEvents(events);
  const isLoading = events.length === 0;

  const cardsById = useMemo(() => {
    const m = new Map<string, ReactNode>();
    for (const c of cards) m.set(c.id, c.node);
    return m;
  }, [cards]);

  const visibleEventIds = useMemo(
    () =>
      typeFilteredEvents
        .slice(0, CRYPTO_VISIBLE_EVENT_CARDS)
        .map((event) => event.id),
    [typeFilteredEvents],
  );

  return isLoading ? (
    <LoadingSkeleton count={6} />
  ) : visibleEventIds.length > 0 ? (
    <div className="grid auto-rows-[180px] grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {visibleEventIds.map((id) => cardsById.get(id) ?? null)}
    </div>
  ) : (
    <div className="py-12 text-center">
      <p className="text-lg text-foreground-muted">
        {CRYPTO_INTL.NO_MARKETS_FOUND}
      </p>
    </div>
  );
};
