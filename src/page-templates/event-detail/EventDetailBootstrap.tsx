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
  initialEvent: Event;
  children: ReactNode;
};

export const EventDetailBootstrap = ({
  initialEvent,
  children,
}: EventDetailBootstrapProps) => {
  const hydratedEvents: Event[] = [initialEvent];

  useHydrateAtoms(
    [
      [eventsAtom, hydratedEvents],
      [isLoadingAtom, false],
    ] as const,
  );

  const setEvents = useSetAtom(eventsAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);

  useEffect(() => {
    setEvents([initialEvent]);
    setIsLoading(false);
  }, [initialEvent, setEvents, setIsLoading]);

  usePriceUpdates();

  return <>{children}</>;
};
