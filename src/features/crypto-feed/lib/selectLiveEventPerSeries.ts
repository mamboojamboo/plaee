import type { Event } from "@/src/entities/event";

export function selectLiveEventPerSeries(events: Event[]): Event[] {
  const now = Date.now();
  const bySeries = new Map<string, Event>();

  for (const e of events) {
    const key = e.seriesSlug ?? e.slug ?? e.id;
    const endTs = Date.parse(e.resolutionDate ?? "");
    if (!Number.isFinite(endTs) || endTs < now) continue;

    const current = bySeries.get(key);
    if (!current) {
      bySeries.set(key, e);
      continue;
    }
    const currentEnd = Date.parse(current.resolutionDate ?? "");
    if (endTs < currentEnd) bySeries.set(key, e);
  }

  return [...bySeries.values()];
}
