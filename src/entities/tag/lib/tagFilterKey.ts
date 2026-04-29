import type { Tag } from "../types";

export function tagFilterKey(tag: Tag): string {
  const s = tag.slug?.trim();
  if (s) return s.toLowerCase();
  return String(tag.id);
}

export function eventTagMatchesSelectedTag(eventTag: Tag, selectedTagId: string): boolean {
  if (eventTag.id === selectedTagId) return true;
  const slug = eventTag.slug?.trim();
  if (slug && slug.toLowerCase() === selectedTagId.toLowerCase()) return true;
  const legacyLabel = selectedTagId.charAt(0).toUpperCase() + selectedTagId.slice(1);
  if (
    eventTag.label &&
    eventTag.label.toLowerCase() === legacyLabel.toLowerCase()
  ) {
    return true;
  }
  return false;
}

export function isNavTagSelected(tag: Tag, selectedTagId: string | null): boolean {
  if (selectedTagId === null) return false;
  return (
    tag.id === selectedTagId ||
    tagFilterKey(tag) === selectedTagId.toLowerCase()
  );
}
