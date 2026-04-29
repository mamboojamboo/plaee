import React from "react";

import type { Event } from "@/src/entities/event";

import { EventCardFooter } from "./EventCardFooter";
import { EventCardHeader } from "./EventCardHeader";

type EventCardShellProps = Pick<
  Event,
  | "slug"
  | "imageUrl"
  | "volume"
  | "volume24hr"
  | "startDate"
  | "resolutionDate"
  | "createdAt"
  | "live"
  | "featured"
  | "active"
  | "closed"
> & {
  headline: string;
  fullTitle: string;
  chanceIndicator?: React.ReactNode;
  children: React.ReactNode;
};

export function EventCardShell({
  slug,
  imageUrl,
  headline,
  fullTitle,
  volume,
  volume24hr,
  startDate,
  resolutionDate,
  createdAt,
  live,
  featured,
  active,
  closed,
  chanceIndicator,
  children,
}: EventCardShellProps) {
  return (
    <div className="h-full bg-surface-card rounded-event-card pt-3 pr-3 pb-2 pl-3 overflow-hidden transition-[transform,background-color] duration-200 ease-out hover:-translate-y-px hover:bg-surface-card-hover">
      <div className="flex h-full flex-col justify-between gap-2">
        <EventCardHeader
          slug={slug}
          imageUrl={imageUrl}
          headline={headline}
          fullTitle={fullTitle}
          chanceIndicator={chanceIndicator}
        />

        <div className="space-y-2">
          {children}
          <EventCardFooter
            active={active}
            closed={closed}
            createdAt={createdAt}
            featured={featured}
            live={live}
            resolutionDate={resolutionDate}
            startDate={startDate}
            volume={volume}
            volume24hr={volume24hr}
          />
        </div>
      </div>
    </div>
  );
}
