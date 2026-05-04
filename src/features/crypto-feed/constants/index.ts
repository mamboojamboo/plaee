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

export const CRYPTO_SIDEBAR_PATH_SLUG_LIST = [
  ...CRYPTO_TIMEFRAME_SLUGS,
  ...CRYPTO_ASSET_SLUGS,
] as const;
