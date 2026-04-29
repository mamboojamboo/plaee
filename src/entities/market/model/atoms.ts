import { atom } from "jotai";

import type { PriceUpdate } from "@/src/entities/price-update";
import type { WSConnectionState } from "@/src/shared/lib/websocket";

export const priceUpdatesAtom = atom<Map<string, PriceUpdate>>(new Map());

export const wsConnectionStateAtom = atom<WSConnectionState>("closed");

export type MarketTickSizeUpdate = {
  assetId: string;
  tickSize: number;
  timestamp: number;
};

export const marketTickSizesByAssetAtom = atom<Map<string, MarketTickSizeUpdate>>(
  new Map(),
);

export type ResolvedMarketUpdate = {
  marketId: string;
  winningAssetId: string;
  resolvedOutcome: string;
  timestamp: number;
};

export const resolvedMarketsByMarketIdAtom = atom<Map<string, ResolvedMarketUpdate>>(
  new Map(),
);

export type NewMarketSummary = {
  marketId: string;
  assetId: string;
  timestamp: number;
};

export const newMarketSummariesByMarketIdAtom = atom<Map<string, NewMarketSummary>>(
  new Map(),
);
