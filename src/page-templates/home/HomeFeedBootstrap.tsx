"use client";

import { useState, type ReactNode } from "react";
import { createStore, Provider } from "jotai";

import type { Event } from "@/src/entities/event";
import { eventsAtom, isLoadingAtom } from "@/src/entities/event";
import { usePriceUpdates } from "@/src/features/price-updates";

type HomeFeedBootstrapProps = {
  initialEvents: Event[];
  children: ReactNode;
};

const HomeFeedLivePriceUpdates = () => {
  usePriceUpdates();

  return null;
};

export const HomeFeedBootstrap = ({
  initialEvents,
  children,
}: HomeFeedBootstrapProps) => {
  const [store] = useState(() => {
    const nextStore = createStore();

    nextStore.set(eventsAtom, initialEvents);
    nextStore.set(isLoadingAtom, initialEvents.length === 0);

    return nextStore;
  });

  return (
    <Provider store={store}>
      <HomeFeedLivePriceUpdates />
      {children}
    </Provider>
  );
};
