export const CRYPTO_GRID_FETCH_LIMIT = 100;

export const CRYPTO_HUB_MERGE_PAGE_SIZE = 500;

export const CRYPTO_RECURRING_FETCH_LIMIT = 40;

export const CRYPTO_ASSET_DEDUPE_LIMIT = 200;

export type CryptoPaginationOrder =
  | "volume_24hr"
  | "startDate"
  | "createdAt"
  | "endDate";

export function buildCryptoTagPaginationQuery(params: {
  tagSlug: string;
  order?: CryptoPaginationOrder;
  ascending?: boolean;
  limit?: number;
  offset?: number;
  relatedTags?: boolean;
}): string {
  const q = new URLSearchParams();
  q.set("closed", "false");
  q.set("active", "true");
  q.set("tag_slug", params.tagSlug);
  q.set("limit", String(params.limit ?? 500));
  if (params.offset != null) {
    q.set("offset", String(params.offset));
  }
  if (params.order != null) {
    q.set("order", params.order);
  }
  if (params.ascending != null) {
    q.set("ascending", String(params.ascending));
  }
  if (params.relatedTags) {
    q.set("related_tags", "true");
  }
  return q.toString();
}
