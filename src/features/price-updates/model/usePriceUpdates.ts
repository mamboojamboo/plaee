"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { eventsAtom } from "@/src/entities/event";
import type { PriceUpdate } from "@/src/entities/price-update";
import {
  marketTickSizesByAssetAtom,
  newMarketSummariesByMarketIdAtom,
  priceUpdatesAtom,
  resolvedMarketsByMarketIdAtom,
  wsConnectionStateAtom,
} from "@/src/entities/market";
import {
  getWebSocketManager,
  displayPriceFromBidAsk,
  type MarketBook,
  type MarketMessage,
  isBestBidAsk,
  isBook,
  isMarketResolved,
  isNewMarket,
  isPriceChange,
  isTickSizeChange,
  isTrade,
} from "@/src/shared/lib/websocket";

function displayPriceFromBook(book: MarketBook): number | null {
  if (!book.bids.length || !book.asks.length) return null;
  const bestBid = Math.max(...book.bids.map(([p]) => p));
  const bestAsk = Math.min(...book.asks.map(([p]) => p));
  if (!Number.isFinite(bestBid) || !Number.isFinite(bestAsk)) return null;
  return displayPriceFromBidAsk(bestBid, bestAsk, book.lastTradePrice);
}

export function usePriceUpdates(): void {
  const setPriceUpdates = useSetAtom(priceUpdatesAtom);
  const events = useAtomValue(eventsAtom);
  const setWSConnectionState = useSetAtom(wsConnectionStateAtom);
  const setTickSizes = useSetAtom(marketTickSizesByAssetAtom);
  const setResolvedMarkets = useSetAtom(resolvedMarketsByMarketIdAtom);
  const setNewMarketSummaries = useSetAtom(newMarketSummariesByMarketIdAtom);

  const tokenIdMap = useMemo(() => {
    const map = new Map<string, { marketId: string; outcomeId: string }>();

    events.forEach((event) => {
      event.markets.forEach((market) => {
        if (market.clobTokenIds && market.clobTokenIds.length > 0) {
          market.clobTokenIds.forEach((tokenId, outcomeIndex) => {
            if (market.outcomes[outcomeIndex]) {
              map.set(tokenId, {
                marketId: market.id,
                outcomeId: market.outcomes[outcomeIndex].id,
              });
            }
          });
        }
      });
    });

    return map;
  }, [events]);

  const tokenIdsKey = useMemo(
    () => Array.from(tokenIdMap.keys()).sort().join("|"),
    [tokenIdMap],
  );

  const tokenIdMapRef = useRef(tokenIdMap);

  const subscribedTokenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    tokenIdMapRef.current = tokenIdMap;
  }, [tokenIdMap]);

  useEffect(() => {
    const manager = getWebSocketManager();

    manager.connect();

    const unsubscribeState = manager.onConnectionStateChange((states) => {
      setWSConnectionState(states.market);
    });

    const applyUpdate = (
      tokenId: string,
      price: number,
      timestamp: number,
    ): void => {
      if (!Number.isFinite(price)) return;
      const mapping = tokenIdMapRef.current.get(tokenId);
      if (!mapping) return;

      const priceUpdate: PriceUpdate = {
        marketId: mapping.marketId,
        outcomeId: mapping.outcomeId,
        newPrice: price,
        timestamp,
      };

      setPriceUpdates((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(`${mapping.marketId}:${mapping.outcomeId}`, priceUpdate);
        return newMap;
      });
    };

    const handleMarketMessage = (message: MarketMessage): void => {
      if (isPriceChange(message) || isTrade(message)) {
        applyUpdate(message.asset_id, message.price, message.timestamp);
        return;
      }

      if (isBestBidAsk(message)) {
        const mid = displayPriceFromBidAsk(message.bid, message.ask);
        applyUpdate(message.asset_id, mid, message.timestamp);
        return;
      }

      if (isBook(message)) {
        const mid = displayPriceFromBook(message);
        if (mid !== null) {
          applyUpdate(message.asset_id, mid, message.timestamp);
        }
        return;
      }

      if (isTickSizeChange(message)) {
        setTickSizes((prev) => {
          const next = new Map(prev);
          next.set(message.asset_id, {
            assetId: message.asset_id,
            tickSize: message.tick_size,
            timestamp: message.timestamp,
          });
          return next;
        });
        return;
      }

      if (isNewMarket(message)) {
        setNewMarketSummaries((prev) => {
          const next = new Map(prev);
          next.set(message.market_id, {
            marketId: message.market_id,
            assetId: message.asset_id,
            timestamp: message.timestamp,
          });
          return next;
        });
        return;
      }

      if (isMarketResolved(message)) {
        setResolvedMarkets((prev) => {
          const next = new Map(prev);
          next.set(message.market_id, {
            marketId: message.market_id,
            winningAssetId: message.asset_id,
            resolvedOutcome: message.resolved_outcome,
            timestamp: message.timestamp,
          });
          return next;
        });
      }
    };

    const unsubscribeMarket = manager.subscribeMarket(handleMarketMessage);

    const nextIds =
      tokenIdsKey === "" ? new Set<string>() : new Set(tokenIdsKey.split("|"));
    const prevIds = subscribedTokenIdsRef.current;

    for (const id of nextIds) {
      if (!prevIds.has(id)) {
        manager.subscribeAsset(id);
      }
    }

    for (const id of prevIds) {
      if (!nextIds.has(id)) {
        manager.unsubscribeAsset(id);
      }
    }

    subscribedTokenIdsRef.current = nextIds;

    return () => {
      unsubscribeMarket();
      unsubscribeState();

      for (const id of subscribedTokenIdsRef.current) {
        manager.unsubscribeAsset(id);
      }
      subscribedTokenIdsRef.current = new Set();
    };
  }, [
    tokenIdsKey,
    setPriceUpdates,
    setWSConnectionState,
    setTickSizes,
    setResolvedMarkets,
    setNewMarketSummaries,
  ]);
}
