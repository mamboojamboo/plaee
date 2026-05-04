import type { ReactNode } from "react";

import { LoadingSkeleton } from "@/src/shared/ui/loading-skeleton";
import { EVENT_DETAIL_INTL } from "./constants";

type EventDetailPageShellProps = {
  children: ReactNode;
};

export const EventDetailPageShell = ({
  children,
}: EventDetailPageShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
};

export const EventDetailLoadingState = () => {
  return (
    <EventDetailPageShell>
      <LoadingSkeleton count={1} className="h-96" />
    </EventDetailPageShell>
  );
};

export const EventDetailEmptyState = () => {
  return (
    <div className="py-12 text-center">
      <p className="text-lg text-foreground-muted">
        {EVENT_DETAIL_INTL.NO_MARKETS_AVAILABLE}
      </p>
    </div>
  );
};
