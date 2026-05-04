"use client";

import { useAtom } from "jotai";
import { cryptoTypeChipAtom } from "@/src/features/crypto-feed";
import { filterChipClass } from "@/src/shared/ui/filter-chip";
import { CRYPTO_TYPE_CHIPS_INTL } from "./constants";

export type CryptoTypeChipDef = {
  slug: string;
  label: string;
};

type CryptoTypeChipsProps = {
  chips: CryptoTypeChipDef[];
};

export const CryptoTypeChips = ({ chips }: CryptoTypeChipsProps) => {
  const [typeChip, setTypeChip] = useAtom(cryptoTypeChipAtom);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scroll-smooth scrollbar-hide">
      <button
        type="button"
        className={filterChipClass(typeChip === null)}
        aria-pressed={typeChip === null}
        onClick={() => setTypeChip(null)}
      >
        {CRYPTO_TYPE_CHIPS_INTL.ALL_LABEL}
      </button>
      {chips.map((chip) => {
        const active =
          typeChip !== null &&
          typeChip.toLowerCase() === chip.slug.toLowerCase();
        return (
          <button
            key={chip.slug}
            type="button"
            className={filterChipClass(active)}
            aria-pressed={active}
            onClick={() => setTypeChip(chip.slug)}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
