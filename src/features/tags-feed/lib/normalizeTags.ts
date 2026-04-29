import type { Tag } from "@/src/entities/tag";

type RawTagRow = {
  id?: unknown;
  label?: unknown;
  slug?: unknown;
  forceHide?: unknown;
  forceShow?: unknown;
  isCarousel?: unknown;
  publishedAt?: unknown;
  createdBy?: unknown;
  updatedBy?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

function asRow(row: unknown): RawTagRow | null {
  if (!row || typeof row !== "object") return null;
  return row as RawTagRow;
}

export function normalizeTagFromApi(row: unknown): Tag | null {
  const r = asRow(row);
  if (!r) return null;
  if (r.forceHide === true) return null;

  const id = r.id != null ? String(r.id).trim() : "";
  const slugRaw = r.slug != null ? String(r.slug).trim() : "";
  const labelRaw = r.label != null ? String(r.label).trim() : "";

  if (!id && !slugRaw && !labelRaw) return null;

  const label = labelRaw || slugRaw || id;
  const slug = slugRaw || id || label;

  return {
    id: id || slugRaw || labelRaw,
    label,
    slug,
    isCarousel: r.isCarousel === true ? true : undefined,
    forceShow: r.forceShow === true ? true : undefined,
    forceHide: undefined,
    publishedAt: r.publishedAt != null ? String(r.publishedAt) : undefined,
    createdBy:
      typeof r.createdBy === "number" || typeof r.createdBy === "string"
        ? r.createdBy
        : undefined,
    updatedBy:
      typeof r.updatedBy === "number" || typeof r.updatedBy === "string"
        ? r.updatedBy
        : undefined,
    createdAt: r.createdAt != null ? String(r.createdAt) : undefined,
    updatedAt: r.updatedAt != null ? String(r.updatedAt) : undefined,
  };
}

export function normalizeTagsFromApiResponse(data: unknown): Tag[] {
  if (!Array.isArray(data)) return [];
  const out: Tag[] = [];
  const seen = new Set<string>();
  for (const row of data) {
    const tag = normalizeTagFromApi(row);
    if (!tag) continue;
    const dedupeKey = tag.id;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(tag);
  }
  return out;
}
