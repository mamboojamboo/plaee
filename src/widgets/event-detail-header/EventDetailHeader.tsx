import Image from "next/image";
import type { EventHeaderMeta } from "@/src/entities/event";
import { IconDisplay } from "@/src/shared/ui/icon-button";
import { EVENT_DETAIL_HEADER_INTL } from "./constants";
import { TradingBoardControls } from "./TradingBoardControls";

type EventDetailHeaderProps = {
  meta: EventHeaderMeta;
  timeframeLabel: string;
};

export const EventDetailHeader = ({
  meta,
  timeframeLabel,
}: EventDetailHeaderProps) => {
  return (
    <header className="space-y-3 border-b border-border pb-3 lg:space-y-5 lg:pb-5">
      <div className="flex items-start justify-between gap-3 lg:gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {meta.imageUrl && (
            <Image
              src={meta.imageUrl}
              alt={meta.title}
              width={64}
              height={64}
              sizes="(min-width: 1024px) 64px, 56px"
              className="mt-0.5 size-14 shrink-0 rounded-xl object-cover lg:size-16"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-normal leading-5 text-foreground-muted lg:text-sm lg:leading-5">
              {meta.categoryLabel}
            </p>
            <h1 className="text-xl font-semibold leading-6 text-foreground lg:text-2xl lg:font-semibold lg:leading-6 lg:text-white">
              {meta.title}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <IconDisplay
            name="code"
            shape="circle"
            size="md"
            iconColor="white"
            aria-label={EVENT_DETAIL_HEADER_INTL.ARIA_OPEN_CODE_EMBED}
          />
          <IconDisplay
            name="link"
            shape="circle"
            size="md"
            iconColor="white"
            aria-label={EVENT_DETAIL_HEADER_INTL.ARIA_COPY_EVENT_LINK}
          />
          <IconDisplay
            name="bookmark"
            shape="circle"
            size="md"
            iconColor="white"
            aria-label={EVENT_DETAIL_HEADER_INTL.ARIA_BOOKMARK_EVENT}
          />
        </div>
      </div>

      <TradingBoardControls
        resolutionDateLabel={meta.resolutionDateLabel}
        timeframeLabel={timeframeLabel}
      />

      <div className="text-base font-normal leading-6 text-foreground lg:text-[13px] lg:leading-6">
        <span className="lg:font-medium lg:tracking-[-0.09px] lg:text-display-muted">
          {meta.volumeLabel}
        </span>
        <span className="hidden lg:inline lg:font-normal lg:text-foreground-muted">
          {EVENT_DETAIL_HEADER_INTL.META_SEPARATOR}
          {meta.resolutionDateLabel}
        </span>
      </div>
    </header>
  );
};
