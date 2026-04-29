import { type Tag, tagFilterKey } from "@/src/entities/tag";

function priority(tag: Tag): number {
  let p = 0;
  if (tag.isCarousel) p += 2;
  if (tag.forceShow) p += 1;
  return p;
}

export function rankTags(tags: Tag[], frequencyByKey: Map<string, number>): Tag[] {
  const indexed = tags.map((t, index) => ({ t, index }));
  indexed.sort((a, b) => {
    const dp = priority(b.t) - priority(a.t);
    if (dp !== 0) return dp;
    const ka = tagFilterKey(a.t);
    const kb = tagFilterKey(b.t);
    const fa = frequencyByKey.get(ka) ?? 0;
    const fb = frequencyByKey.get(kb) ?? 0;
    if (fa !== fb) return fb - fa;
    return a.index - b.index;
  });
  return indexed.map(({ t }) => t);
}

export function buildTagFrequencyMap(
  events: { tags: Tag[] }[]
): Map<string, number> {
  const m = new Map<string, number>();
  for (const event of events) {
    for (const tag of event.tags) {
      const k = tagFilterKey(tag);
      m.set(k, (m.get(k) ?? 0) + 1);
    }
  }
  return m;
}
