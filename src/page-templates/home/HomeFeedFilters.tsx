"use client";

import type { Tag } from "@/src/entities/tag";

import { useCategoryFilter } from "@/src/features/event-filter";
import { useMarketTags } from "@/src/features/tags-feed";
import { EventsFilter } from "@/src/widgets/events-filter";

type HomeFeedFiltersProps = {
  initialTags: Tag[];
};

export const HomeFeedFilters = ({ initialTags }: HomeFeedFiltersProps) => {
  const { selectedTagId, selectTag } = useCategoryFilter();
  const { tags, status } = useMarketTags({ initialTags });

  return (
    <EventsFilter
      tags={tags}
      selectedTagId={selectedTagId}
      onSelectTag={selectTag}
      isLoading={status === "loading"}
    />
  );
};
