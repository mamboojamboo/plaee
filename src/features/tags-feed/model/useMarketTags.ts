"use client";

import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { CATEGORY_TAGS } from "@/src/entities/category";
import { eventsAtom } from "@/src/entities/event";
import type { Tag } from "@/src/entities/tag";
import { fetchMarketTags } from "../api";
import { buildTagFrequencyMap, rankTags } from "../lib/rankTags";

export type MarketTagsStatus = "loading" | "ok" | "error";

type UseMarketTagsOptions = {
  initialTags?: Tag[];
};

export function useMarketTags({ initialTags }: UseMarketTagsOptions = {}) {
  const events = useAtomValue(eventsAtom);
  const hasInitialTags = initialTags !== undefined && initialTags.length > 0;

  const [apiTags, setApiTags] = useState<Tag[] | null>(
    hasInitialTags ? initialTags! : null,
  );
  const [status, setStatus] = useState<MarketTagsStatus>(
    hasInitialTags ? "ok" : "loading",
  );

  useEffect(() => {
    if (hasInitialTags) return;

    let cancelled = false;
    (async () => {
      try {
        const tags = await fetchMarketTags();
        if (!cancelled) {
          setApiTags(tags);
          setStatus("ok");
        }
      } catch {
        if (!cancelled) {
          setApiTags(CATEGORY_TAGS);
          setStatus("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasInitialTags]);

  const frequencyByKey = useMemo(() => buildTagFrequencyMap(events), [events]);

  const tags = useMemo(() => {
    const base = apiTags ?? [];
    if (base.length === 0) return [];
    return rankTags(base, frequencyByKey);
  }, [apiTags, frequencyByKey]);

  return { tags, status, rawTags: apiTags };
}
