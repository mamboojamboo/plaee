import { type ReactNode } from "react";

import type { Event } from "@/src/entities/event";
import { IconDisplay } from "@/src/shared/ui/icon-button";
import { CryptoTypeChips } from "@/src/widgets/crypto-type-chips";

import { CryptoFeedBootstrap } from "./CryptoFeedBootstrap";
import { CryptoFeedGrid } from "./CryptoFeedGrid";
import { CRYPTO_INTL, CRYPTO_TYPE_CHIP_DEFS } from "./constants";

type CryptoPageProps = {
  initialEvents: Event[];
  initialCounts: Record<string, number>;
  initialAllCount: number;
  subSlug: string | null;
  sidebar: ReactNode;
  cards: Array<{ id: string; node: ReactNode }>;
};

export const CryptoPage = ({
  initialEvents,
  initialCounts,
  initialAllCount,
  subSlug,
  sidebar,
  cards,
}: CryptoPageProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
      {sidebar}

      <CryptoFeedBootstrap
        key={subSlug ?? "all"}
        initialEvents={initialEvents}
        initialCounts={initialCounts}
        initialAllCount={initialAllCount}
        subSlug={subSlug}
      >
        <div className="flex min-w-0 flex-col gap-4">
          <header className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-2">
            <div className="col-start-1 row-start-1 min-w-0 shrink-0">
              <h2 className="min-w-0 text-xl font-semibold tracking-tight text-foreground">
                {CRYPTO_INTL.TITLE}
              </h2>
            </div>
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

          <CryptoFeedGrid cards={cards} />
        </div>
      </CryptoFeedBootstrap>
    </div>
  );
};
