import type { Event } from "../types";
import type { Market, Outcome } from "@/src/entities/market";
import {
  formatEventDate,
  formatMoneyCompact,
  formatVolumeLabel,
} from "@/src/shared/lib/format";

export type EventHeaderMeta = {
  categoryLabel: string;
  title: string;
  volumeLabel: string;
  resolutionDateLabel: string;
  imageUrl?: string;
};

export type EventTradeRow = {
  id: string;
  label: string;
  volumeLabel: string;
  yesOutcome: Outcome;
  noOutcome: Outcome;
};

function getPrimaryOutcomes(market: Market): { yesOutcome: Outcome; noOutcome: Outcome } | null {
  if (market.outcomes.length < 2) return null;
  return {
    yesOutcome: market.outcomes[0],
    noOutcome: market.outcomes[1],
  };
}

export function selectEventHeaderMeta(event: Event): EventHeaderMeta {
  return {
    categoryLabel: event.tags[0]?.label ?? "Market",
    title: event.title,
    volumeLabel: formatVolumeLabel(event.volume),
    resolutionDateLabel: formatEventDate(event.resolutionDate),
    imageUrl: event.iconUrl || event.imageUrl,
  };
}

export function selectEventTradeRows(markets: Market[]): EventTradeRow[] {
  return markets
    .map((market) => {
      const outcomes = getPrimaryOutcomes(market);
      if (!outcomes) return null;

      const leftValue = market.volume > 0 ? market.volume : market.liquidity;

      return {
        id: market.id,
        label: market.groupItemTitle || market.question,
        volumeLabel: `${formatMoneyCompact(leftValue)} Vol.`,
        yesOutcome: outcomes.yesOutcome,
        noOutcome: outcomes.noOutcome,
      };
    })
    .filter((row): row is EventTradeRow => row !== null);
}
