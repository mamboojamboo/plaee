"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import type { Event } from "@/src/entities/event";
import { eventsAtom, isLoadingAtom } from "@/src/entities/event";
import { usePriceUpdates } from "@/src/features/price-updates";

type HomeFeedBootstrapProps = {
  initialEvents: Event[];
};

export const HomeFeedBootstrap = ({
  initialEvents,
}: HomeFeedBootstrapProps) => {
  useHydrateAtoms(
    [
      [eventsAtom, initialEvents],
      [isLoadingAtom, initialEvents.length === 0],
    ] as const,
  );

  const setEvents = useSetAtom(eventsAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);

  useEffect(() => {
    setEvents(initialEvents);
    setIsLoading(initialEvents.length === 0);
  }, [initialEvents, setEvents, setIsLoading]);

  usePriceUpdates();

  return null;
};
