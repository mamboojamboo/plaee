import { atom } from "jotai";

import { filteredEventsAtom } from "./atoms";

export const searchQueryAtom = atom<string>("");

export const searchedEventsAtom = atom((get) => {
  const events = get(filteredEventsAtom);
  const query = get(searchQueryAtom).toLowerCase();

  if (!query) return events;

  return events.filter((event) => {
    const titleMatch = event.title.toLowerCase().includes(query);
    const tagsMatch = event.tags.some((tag) =>
      tag.label.toLowerCase().includes(query),
    );
    return titleMatch || tagsMatch;
  });
});
