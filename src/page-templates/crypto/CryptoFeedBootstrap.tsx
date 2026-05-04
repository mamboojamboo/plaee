"use client";

import { useState, type ReactNode } from "react";
import { createStore, Provider } from "jotai";

import type { Event } from "@/src/entities/event";
import { eventsAtom } from "@/src/entities/event";
import { usePriceUpdates } from "@/src/features/price-updates";
import {
  cryptoAllCountAtom,
  cryptoCountsAtom,
  cryptoEventsAtom,
  cryptoSubSlugAtom,
  cryptoTypeChipAtom,
} from "@/src/features/crypto-feed";

type CryptoFeedBootstrapProps = {
  initialEvents: Event[];
  initialCounts: Record<string, number>;
  initialAllCount: number;
  subSlug: string | null;
  children: ReactNode;
};

const CryptoFeedLivePriceUpdates = () => {
  usePriceUpdates();

  return null;
};

export const CryptoFeedBootstrap = ({
  initialEvents,
  initialCounts,
  initialAllCount,
  subSlug,
  children,
}: CryptoFeedBootstrapProps) => {
  const [store] = useState(() => {
    const nextStore = createStore();

    nextStore.set(cryptoEventsAtom, initialEvents);
    nextStore.set(cryptoSubSlugAtom, subSlug);
    nextStore.set(cryptoCountsAtom, initialCounts);
    nextStore.set(cryptoAllCountAtom, initialAllCount);
    nextStore.set(cryptoTypeChipAtom, null);
    nextStore.set(eventsAtom, initialEvents);

    return nextStore;
  });

  return (
    <Provider store={store}>
      <CryptoFeedLivePriceUpdates />
      {children}
    </Provider>
  );
};
