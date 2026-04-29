import type { CryptoTypeChipDef } from "@/src/widgets/crypto-type-chips";

export const CRYPTO_VISIBLE_EVENT_CARDS = 33;

export const CRYPTO_INTL = {
  TITLE: "Crypto",
  NO_MARKETS_FOUND: "No markets found",
  ARIA_SEARCH: "Search crypto markets",
  ARIA_FILTERS: "Filters",
};

export const CRYPTO_TYPE_CHIP_DEFS: CryptoTypeChipDef[] = [
  { slug: "up-or-down", label: "Up / Down" },
  { slug: "above-below", label: "Above / Below" },
  { slug: "price-range", label: "Price Range" },
  { slug: "hit-price", label: "Hit Price" },
];
