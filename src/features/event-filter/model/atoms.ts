import { atom } from "jotai";
import { eventsAtom } from "@/src/entities/event";
import { eventTagMatchesSelectedTag } from "@/src/entities/tag";

export const selectedTagIdAtom = atom<string | null>(null);

export const filteredEventsAtom = atom((get) => {
  const events = get(eventsAtom);
  const selectedTagId = get(selectedTagIdAtom);

  if (!selectedTagId) {
    return events;
  }

  return events.filter((event) =>
    event.tags.some((tag) => eventTagMatchesSelectedTag(tag, selectedTagId))
  );
});

export const layoutAtom = atom<"grid" | "list">("grid");
