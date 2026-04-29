export const CRYPTO_TIMEFRAME_SLUGS = [
  "5m",
  "15m",
  "1h",
  "4h",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "pre-market",
  "etf",
] as const;

export const RECURRING_TIMEFRAME_SLUGS = new Set(["5m", "15m", "1h", "4h"]);

export const CRYPTO_TIMEFRAME_LABELS: Record<string, string> = {
  "5m": "5 Min",
  "15m": "15 Min",
  "1h": "1 Hour",
  "4h": "4 Hours",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  "pre-market": "Pre-Market",
  etf: "ETF",
};

export const CRYPTO_ASSET_SLUGS = [
  "bitcoin",
  "ethereum",
  "solana",
  "xrp",
  "dogecoin",
  "bnb",
  "microstrategy",
] as const;

export const CRYPTO_ASSET_LABELS: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
  xrp: "XRP",
  dogecoin: "Dogecoin",
  bnb: "BNB",
  microstrategy: "MicroStrategy",
};

export const CRYPTO_TYPE_CHIP_SLUGS = [
  "up-or-down",
  "above-below",
  "price-range",
  "hit-price",
] as const;

const ALL_KNOWN = new Set<string>([
  ...CRYPTO_TIMEFRAME_SLUGS,
  ...CRYPTO_ASSET_SLUGS,
  ...CRYPTO_TYPE_CHIP_SLUGS,
]);

const SIDEBAR_PATH_SLUGS = new Set<string>([
  ...CRYPTO_TIMEFRAME_SLUGS,
  ...CRYPTO_ASSET_SLUGS,
]);

export function isCryptoSidebarPathSegment(slug: string): boolean {
  return SIDEBAR_PATH_SLUGS.has(slug.trim().toLowerCase());
}

export function isKnownCryptoSubSlug(slug: string): boolean {
  return ALL_KNOWN.has(slug.trim().toLowerCase());
}
