"use client";

import { useMemo, type ReactNode } from "react";
import { useAtomValue } from "jotai";

import {
  filteredEventsAtom,
} from "@/src/features/event-filter";
import { isLoadingAtom } from "@/src/entities/event";
import { LoadingSkeleton } from "@/src/shared/ui/loading-skeleton";

import { HOME_VISIBLE_EVENT_CARDS, INTL } from "./constants";

type HomeFeedGridProps = {
  cards: Array<{ id: string; node: ReactNode }>;
};

export const HomeFeedGrid = ({ cards }: HomeFeedGridProps) => {
  const filteredEvents = useAtomValue(filteredEventsAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  const cardsById = useMemo(() => {
    const m = new Map<string, ReactNode>();
    for (const c of cards) m.set(c.id, c.node);
    return m;
  }, [cards]);

  const visibleEventIds = useMemo(
    () =>
      filteredEvents
        .slice(0, HOME_VISIBLE_EVENT_CARDS)
        .map((event) => event.id),
    [filteredEvents],
  );

  return isLoading ? (
    <LoadingSkeleton count={12} />
  ) : visibleEventIds.length > 0 ? (
    <div className="grid grid-cols-1 gap-3 auto-rows-[180px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visibleEventIds.map((id) => cardsById.get(id) ?? null)}
    </div>
  ) : (
    <div className="py-12 text-center">
      <p className="text-lg text-foreground-muted">
        {INTL.NO_MARKETS_FOUND}
      </p>
    </div>
  );
};
