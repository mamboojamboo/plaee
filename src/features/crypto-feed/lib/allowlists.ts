import {
  CRYPTO_ASSET_SLUGS,
  CRYPTO_SIDEBAR_PATH_SLUG_LIST,
  CRYPTO_TIMEFRAME_SLUGS,
  CRYPTO_TYPE_CHIP_SLUGS,
} from "../constants";

const ALL_KNOWN = new Set<string>([
  ...CRYPTO_TIMEFRAME_SLUGS,
  ...CRYPTO_ASSET_SLUGS,
  ...CRYPTO_TYPE_CHIP_SLUGS,
]);

const SIDEBAR_PATH_SLUGS = new Set<string>(CRYPTO_SIDEBAR_PATH_SLUG_LIST);

export function isCryptoSidebarPathSegment(slug: string): boolean {
  return SIDEBAR_PATH_SLUGS.has(slug.trim().toLowerCase());
}

export function isKnownCryptoSubSlug(slug: string): boolean {
  return ALL_KNOWN.has(slug.trim().toLowerCase());
}
