import React from "react";
import type { Event } from "@/src/entities/event";
import { formatVolume } from "../utils/formatVolume";
import { getCardTagVisibility } from "../utils/getCardTagVisibility";
import { INTL } from "../constants";
import { Badge } from "@/src/shared/ui/badge";
import { IconDisplay } from "@/src/shared/ui/icon-button";

type EventCardFooterProps = Pick<
  Event,
  | "volume"
  | "volume24hr"
  | "startDate"
  | "resolutionDate"
  | "createdAt"
  | "live"
  | "featured"
  | "active"
  | "closed"
>;

export const EventCardFooter: React.FC<EventCardFooterProps> = ({
  volume,
  volume24hr,
  startDate,
  resolutionDate,
  createdAt,
  live,
  featured,
  active,
  closed,
}) => {
  const volForFooter = Math.max(volume, volume24hr ?? 0);
  const volumeDisplay = formatVolume(volForFooter);
  const { showNew, showVol } = getCardTagVisibility({
    volume: volForFooter,
    startDate,
    endDate: resolutionDate,
    closed,
    createdAt,
  });
  const isLive = Boolean(live);
  const showNewBadge = showNew && !isLive;
  const showVolumeLbl = showVol;
  const shouldShowGiftIcon = Boolean(featured);
  const shouldShowBookmarkIcon = Boolean(active) && !closed;

  return (
    <div className="flex w-full items-center justify-between text-[13px] text-foreground-muted">
      <div className="flex min-w-0 items-center gap-2">
        {showNewBadge && <Badge name="new" />}
        {isLive && <Badge name="live" />}
        {showVolumeLbl && <span className="truncate">{volumeDisplay}</span>}
      </div>
      <div className="flex shrink-0 items-center">
        {shouldShowGiftIcon && (
          <IconDisplay name="gift" shape="square" size="sm" aria-label={INTL.ARIA_LABEL_GIFT} />
        )}
        {shouldShowBookmarkIcon && (
          <IconDisplay name="bookmark" shape="circle" size="sm" aria-label={INTL.ARIA_LABEL_BOOKMARK} />
        )}
      </div>
    </div>
  );
};
