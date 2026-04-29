"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import type { Event } from "@/src/entities/event";
import { eventsAtom, isLoadingAtom } from "@/src/entities/event";
import type { Tag } from "@/src/entities/tag";
import { LoadingSkeleton } from "@/src/shared/ui/loading-skeleton";

import {
  filteredEventsAtom,
  useCategoryFilter,
} from "@/src/features/event-filter";
import { usePriceUpdates } from "@/src/features/price-updates";
import { useMarketTags } from "@/src/features/tags-feed";

import { HOME_VISIBLE_EVENT_CARDS, INTL } from "./constants";
import { EventsFilter } from "@/src/widgets/events-filter";

type HomePageProps = {
  initialEvents: Event[];
  initialTags: Tag[];
  cards: Array<{ id: string; node: ReactNode }>;
};

export function HomePage({ initialEvents, initialTags, cards }: HomePageProps) {
  useHydrateAtoms(
    [
      [eventsAtom, initialEvents],
      [isLoadingAtom, initialEvents.length === 0],
    ] as const,
  );

  const [, setEvents] = useAtom(eventsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [filteredEvents] = useAtom(filteredEventsAtom);

  const { selectedTagId, selectTag } = useCategoryFilter();
  const { tags, status } = useMarketTags({ initialTags });

  usePriceUpdates();

  useEffect(() => {
    setEvents(initialEvents);
    setIsLoading(initialEvents.length === 0);
  }, [initialEvents, setEvents, setIsLoading]);

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

  return (
    <>
      <EventsFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onSelectTag={selectTag}
        isLoading={status === "loading"}
      />
      {isLoading ? (
        <LoadingSkeleton count={12} />
      ) : visibleEventIds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[180px]">
          {visibleEventIds.map((id) => cardsById.get(id) ?? null)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground-muted text-lg">
            {INTL.NO_MARKETS_FOUND}
          </p>
        </div>
      )}
    </>
  );
}
