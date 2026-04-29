import React, { memo } from "react";

import type { Event } from "@/src/entities/event";
import { LiveChanceIndicator } from "@/src/features/price-updates";

import { EventCardCenter } from "../ui/EventCardCenter";
import { EventCardShell } from "../ui/EventCardShell";
import {
  type EventCardContent,
  getEventCardContent,
} from "../utils/getEventCardContent";

export type EventCardProps = Pick<
  Event,
  | "markets"
  | "slug"
  | "imageUrl"
  | "title"
  | "seriesTitle"
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
  maxDisplayed?: number;
};

function chanceIndicatorForContent(
  content: EventCardContent,
): React.ReactNode | undefined {
  if (content.kind !== "single") return undefined;
  const first = content.primaryMarket.outcomes[0];
  if (!first) return undefined;
  return (
    <LiveChanceIndicator
      marketId={content.primaryMarket.id}
      outcomeId={first.id}
      initialPrice={first.price}
      chanceLabel={content.chanceLabel}
    />
  );
}

function EventCardInner({
  markets,
  slug,
  imageUrl,
  title,
  seriesTitle,
  volume,
  volume24hr,
  startDate,
  resolutionDate,
  createdAt,
  live,
  featured,
  active,
  closed,
  maxDisplayed = 2,
}: EventCardProps) {
  const content = getEventCardContent({ markets }, maxDisplayed);
  if (content === null) return null;

  const headline =
    seriesTitle != null && String(seriesTitle).trim() !== ""
      ? String(seriesTitle).trim()
      : title;

  return (
    <EventCardShell
      active={active}
      closed={closed}
      featured={featured}
      fullTitle={title}
      headline={headline}
      imageUrl={imageUrl}
      createdAt={createdAt}
      live={live}
      resolutionDate={resolutionDate}
      slug={slug}
      startDate={startDate}
      volume={volume}
      volume24hr={volume24hr}
      chanceIndicator={chanceIndicatorForContent(content)}
    >
      <EventCardCenter content={content} eventSlug={slug} />
    </EventCardShell>
  );
}

export const EventCard = memo(EventCardInner);
