"use client";

import React, { useRef } from "react";
import type { Tag } from "@/src/entities/tag";
import { IconDisplay } from "@/src/shared/ui/icon-button";
import { INTL } from "./constants";
import { EventsFilterTagStrip } from "./EventsFilterTagStrip";

export type EventsFilterProps = {
  tags: Tag[];
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
  isLoading: boolean;
};

export function EventsFilter({
  tags,
  selectedTagId,
  onSelectTag,
  isLoading,
}: EventsFilterProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <nav className="bg-background">
      <div className="flex flex-col gap-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            {INTL.TITLE}
          </h2>
          <div className="flex shrink-0 items-center gap-0.5">
            <IconDisplay
              name="search"
              shape="square"
              size="md"
              aria-label={INTL.ARIA_SEARCH}
              iconColor="white"
            />
            <IconDisplay
              name="sliders"
              shape="square"
              size="md"
              aria-label={INTL.ARIA_FILTERS}
              iconColor="white"
            />
            <IconDisplay
              name="bookmark"
              shape="square"
              size="md"
              aria-label={INTL.ARIA_BOOKMARKS}
              iconColor="white"
            />
          </div>
        </div>
        <EventsFilterTagStrip
          tags={tags}
          selectedTagId={selectedTagId}
          onSelectTag={onSelectTag}
          scrollContainerRef={stripRef}
          isLoading={isLoading}
        />
      </div>
    </nav>
  );
}
