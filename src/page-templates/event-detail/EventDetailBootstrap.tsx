"use client";

import { useState, type ReactNode } from "react";
import { createStore, Provider } from "jotai";

import {
  type Event,
  eventsAtom,
  isLoadingAtom,
} from "@/src/entities/event";
import { usePriceUpdates } from "@/src/features/price-updates";

type EventDetailBootstrapProps = {
  initialEvent: Event;
  children: ReactNode;
};

const EventDetailLivePriceUpdates = () => {
  usePriceUpdates();

  return null;
};

export const EventDetailBootstrap = ({
  initialEvent,
  children,
}: EventDetailBootstrapProps) => {
  const [store] = useState(() => {
    const nextStore = createStore();

    nextStore.set(eventsAtom, [initialEvent]);
    nextStore.set(isLoadingAtom, false);

    return nextStore;
  });

  return (
    <Provider store={store}>
      <EventDetailLivePriceUpdates />
      {children}
    </Provider>
  );
};
