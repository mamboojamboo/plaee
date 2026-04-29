"use client";

import { useEffect, type ReactNode } from "react";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import {
  type Event,
  eventsAtom,
  isLoadingAtom,
} from "@/src/entities/event";
import { usePriceUpdates } from "@/src/features/price-updates";

type EventDetailBootstrapProps = {
  initialEvent: Event | null;
  children: ReactNode;
};

export function EventDetailBootstrap({
  initialEvent,
  children,
}: EventDetailBootstrapProps) {
  const hydratedEvents = initialEvent ? [initialEvent] : [];

  useHydrateAtoms(
    [
      [eventsAtom, hydratedEvents],
      [isLoadingAtom, false],
    ] as const,
  );

  const setEvents = useSetAtom(eventsAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);

  useEffect(() => {
    if (initialEvent) {
      setEvents([initialEvent]);
    } else {
      setEvents([]);
    }
    setIsLoading(false);
  }, [initialEvent, setEvents, setIsLoading]);

  usePriceUpdates();

  return <>{children}</>;
}
