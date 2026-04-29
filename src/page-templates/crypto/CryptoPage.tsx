"use client";

import { useMemo, type ReactNode } from "react";

import { useCryptoFeed, useCryptoTypeFilteredEvents } from "@/src/features/crypto-feed";
import { usePriceUpdates } from "@/src/features/price-updates";
import type { Event } from "@/src/entities/event";
import { CryptoTypeChips } from "@/src/widgets/crypto-type-chips";
import { IconDisplay } from "@/src/shared/ui/icon-button";
import { LoadingSkeleton } from "@/src/shared/ui/loading-skeleton";

import {
  CRYPTO_INTL,
  CRYPTO_TYPE_CHIP_DEFS,
  CRYPTO_VISIBLE_EVENT_CARDS,
} from "./constants";

type CryptoPageProps = {
  initialEvents: Event[];
  initialCounts: Record<string, number>;
  initialAllCount: number;
  subSlug: string | null;
  sidebar: ReactNode;
  cards: Array<{ id: string; node: ReactNode }>;
};

export function CryptoPage({
  initialEvents,
  initialCounts,
  initialAllCount,
  subSlug,
  sidebar,
  cards,
}: CryptoPageProps) {
  const { events, isLoading } = useCryptoFeed({
    initialEvents,
    initialCounts,
    initialAllCount,
    subSlug,
  });

  usePriceUpdates();

  const typeFilteredEvents = useCryptoTypeFilteredEvents(events);

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

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
      {sidebar}

      <div className="flex min-w-0 flex-col gap-4">
        <header className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-2">
          <h1 className="col-start-1 row-start-1 min-w-0 shrink-0 text-xl font-semibold tracking-tight text-foreground">
            {CRYPTO_INTL.TITLE}
          </h1>
          <div className="col-span-2 row-start-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-1">
            <CryptoTypeChips chips={CRYPTO_TYPE_CHIP_DEFS} />
          </div>
          <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-0.5 self-center lg:col-start-3">
            <IconDisplay
              name="search"
              shape="square"
              size="md"
              aria-label={CRYPTO_INTL.ARIA_SEARCH}
              iconColor="white"
            />
            <IconDisplay
              name="sliders"
              shape="square"
              size="md"
              aria-label={CRYPTO_INTL.ARIA_FILTERS}
              iconColor="white"
            />
          </div>
        </header>

        {isLoading ? (
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
        )}
      </div>
    </div>
  );
}
