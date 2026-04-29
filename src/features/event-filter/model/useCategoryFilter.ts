import { useCallback } from "react";
import { useAtom } from "jotai";

import { CATEGORY_TAGS } from "@/src/entities/category";
import type { Tag } from "@/src/entities/tag";

import { selectedTagIdAtom } from "./atoms";

function getCategoryById(id: string | null): Tag | null {
  if (!id) return null;
  return CATEGORY_TAGS.find((tag) => tag.id === id) || null;
}

function getCategoryLabel(id: string | null): string | null {
  return getCategoryById(id)?.label ?? null;
}

export function useCategoryFilter() {
  const [selectedTagId, setSelectedTagId] = useAtom(selectedTagIdAtom);

  const selectTag = useCallback(
    (tagId: string | null) => {
      setSelectedTagId(tagId);
    },
    [setSelectedTagId],
  );

  return {
    selectedTagId,
    selectTag,
    getCategory: getCategoryById,
    getCategoryNameById: getCategoryLabel,
  };
}
