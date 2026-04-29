import type { Event } from "@/src/entities/event";
import { eventTagMatchesSelectedTag } from "@/src/entities/tag";

export function filterEventsByCryptoTypeChip(
  events: Event[],
  chipSlug: string | null,
): Event[] {
  if (chipSlug === null || chipSlug.trim() === "") {
    return events;
  }
  const key = chipSlug.trim().toLowerCase();
  return events.filter((e) =>
    e.tags.some((t) => eventTagMatchesSelectedTag(t, key)),
  );
}
