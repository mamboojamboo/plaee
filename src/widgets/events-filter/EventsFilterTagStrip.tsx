"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type Tag,
  tagFilterKey,
  isNavTagSelected,
} from "@/src/entities/tag";
import { CATEGORY_TAGS } from "@/src/entities/category";
import { INTL, UI } from "./constants";
import type { EventsFilterTagStripProps } from "./types";

function chipClass(active: boolean): string {
  if (active) {
    return `${UI.CHIP_BASE_CLASS} ${UI.CHIP_ACTIVE_CLASS}`;
  }
  return `${UI.CHIP_BASE_CLASS} ${UI.CHIP_DEFAULT_CLASS}`;
}

const NAV_PIN_SLUGS = ["crypto", "sports", "politics"] as const;

function orderNavTags(tags: Tag[]): Tag[] {
  const pinned: Tag[] = [];
  for (const slug of NAV_PIN_SLUGS) {
    const fromApi = tags.find((t) => tagFilterKey(t).toLowerCase() === slug);
    const fallback = CATEGORY_TAGS.find((t) => tagFilterKey(t).toLowerCase() === slug);
    const tag = fromApi ?? fallback;
    if (tag) pinned.push(tag);
  }
  const pinnedKeys = new Set(pinned.map((t) => tagFilterKey(t).toLowerCase()));
  const rest = tags.filter((t) => !pinnedKeys.has(tagFilterKey(t).toLowerCase()));
  return [...pinned, ...rest];
}

export function EventsFilterTagStrip({
  tags,
  selectedTagId,
  onSelectTag,
  scrollContainerRef,
  isLoading,
}: EventsFilterTagStripProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const orderedTags = useMemo(() => orderNavTags(tags), [tags]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollLeft(container.scrollLeft > 2);
      setCanScrollRight(container.scrollLeft < maxScrollLeft - 2);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [scrollContainerRef, tags, isLoading]);

  const scrollByDirection = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollStep = Math.max(
      UI.TAG_SCROLL_STEP_MIN_PX,
      Math.floor(container.clientWidth * UI.TAG_SCROLL_STEP_RATIO)
    );
    container.scrollBy({
      left: direction === "right" ? scrollStep : -scrollStep,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex min-w-0 items-center gap-1">
      {canScrollLeft ? (
        <button
          type="button"
          className="events-filter-scroll-fade-left absolute left-0 top-0 bottom-0 z-20 inline-flex items-center justify-start text-foreground-muted hover:text-foreground"
          style={{
            width: `${UI.TAG_SCROLL_CONTROL_WIDTH_PX}px`,
            paddingLeft: `${UI.TAG_SCROLL_CONTROL_ICON_OFFSET_PX}px`,
          }}
          aria-label={INTL.ARIA_SCROLL_LEFT}
          onClick={() => scrollByDirection("left")}
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
      ) : null}
      <div
        ref={scrollContainerRef}
        className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        <button
          type="button"
          onClick={() => onSelectTag(null)}
          className={chipClass(selectedTagId === null)}
        >
          {INTL.TAG_ALL}
        </button>
        {isLoading
          ? Array.from({ length: UI.TAG_SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-16 shrink-0 animate-pulse rounded-md bg-surface-tertiary"
                aria-hidden
              />
            ))
          : orderedTags.map((tag) => {
              const active = isNavTagSelected(tag, selectedTagId);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onSelectTag(tagFilterKey(tag))}
                  className={chipClass(active)}
                >
                  {tag.label}
                </button>
              );
            })}
      </div>
      {canScrollRight ? (
        <button
          type="button"
          className="events-filter-scroll-fade-right absolute right-0 top-0 bottom-0 z-20 inline-flex items-center justify-end text-foreground-muted hover:text-foreground"
          style={{
            width: `${UI.TAG_SCROLL_CONTROL_WIDTH_PX}px`,
            paddingRight: `${UI.TAG_SCROLL_CONTROL_ICON_OFFSET_PX}px`,
          }}
          aria-label={INTL.ARIA_SCROLL_RIGHT}
          onClick={() => scrollByDirection("right")}
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
