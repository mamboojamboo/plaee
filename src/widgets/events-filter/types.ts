import type { RefObject } from "react";
import type { Tag } from "@/src/entities/tag";

export type EventsFilterTagStripProps = {
  tags: Tag[];
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
};
