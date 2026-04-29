import type { CryptoSidebarGroups, CryptoSidebarRow } from "./cryptoSidebarTypes";
import {
  CRYPTO_ASSET_LABELS,
  CRYPTO_ASSET_SLUGS,
  CRYPTO_TIMEFRAME_LABELS,
  CRYPTO_TIMEFRAME_SLUGS,
} from "./allowlists";

function rowsForTimeframes(counts: Record<string, number>): CryptoSidebarRow[] {
  return CRYPTO_TIMEFRAME_SLUGS.map((slug) => ({
    slug,
    label: CRYPTO_TIMEFRAME_LABELS[slug] ?? slug,
    count: counts[slug] ?? 0,
  }));
}

function rowsForAssets(counts: Record<string, number>): CryptoSidebarRow[] {
  return CRYPTO_ASSET_SLUGS.map((slug) => ({
    slug,
    label: CRYPTO_ASSET_LABELS[slug] ?? slug.replace(/-/g, " "),
    count: counts[slug] ?? 0,
  }));
}

export function groupCryptoTags(
  counts: Record<string, number>,
  allCount: number,
): CryptoSidebarGroups {
  return {
    allCount,
    timeframes: rowsForTimeframes(counts),
    assets: rowsForAssets(counts),
  };
}
