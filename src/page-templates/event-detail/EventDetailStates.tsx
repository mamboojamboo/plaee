import React from "react";

import { LoadingSkeleton } from "@/src/shared/ui/loading-skeleton";

function EventDetailPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}

export function EventDetailLoadingState() {
  return (
    <EventDetailPageShell>
      <LoadingSkeleton count={1} className="h-96" />
    </EventDetailPageShell>
  );
}

export function EventDetailNotFoundState() {
  return (
    <EventDetailPageShell>
      <div className="py-12 text-center">
        <p className="text-lg text-foreground-muted">Event not found</p>
      </div>
    </EventDetailPageShell>
  );
}

export function EventDetailEmptyState() {
  return (
    <div className="py-12 text-center">
      <p className="text-lg text-foreground-muted">No markets available</p>
    </div>
  );
}

export { EventDetailPageShell };
