import { z } from 'zod';

export const MarketPriceChangeSchema = z.object({
  type: z.literal('price_change'),
  asset_id: z.string(),
  price: z.number(),
  timestamp: z.number(),
});

export const MarketTradeSchema = z.object({
  type: z.literal('last_trade_price'),
  asset_id: z.string(),
  price: z.number(),
  timestamp: z.number(),
  size: z.number().optional(),
});

export const MarketBookSchema = z.object({
  type: z.literal('book'),
  asset_id: z.string(),
  bids: z.array(z.tuple([z.number(), z.number()])),
  asks: z.array(z.tuple([z.number(), z.number()])),
  timestamp: z.number(),
  lastTradePrice: z.number().optional(),
});

export const MarketTickSizeChangeSchema = z.object({
  type: z.literal('tick_size_change'),
  asset_id: z.string(),
  tick_size: z.number(),
  timestamp: z.number(),
});

export const MarketBestBidAskSchema = z.object({
  type: z.literal('best_bid_ask'),
  asset_id: z.string(),
  bid: z.number(),
  ask: z.number(),
  timestamp: z.number(),
});

export const MarketNewMarketSchema = z.object({
  type: z.literal('new_market'),
  asset_id: z.string(),
  market_id: z.string(),
  timestamp: z.number(),
});

export const MarketResolvedSchema = z.object({
  type: z.literal('market_resolved'),
  asset_id: z.string(),
  market_id: z.string(),
  resolved_outcome: z.string(),
  timestamp: z.number(),
});

export const MarketMessageSchema = z.union([
  MarketPriceChangeSchema,
  MarketTradeSchema,
  MarketBookSchema,
  MarketTickSizeChangeSchema,
  MarketBestBidAskSchema,
  MarketNewMarketSchema,
  MarketResolvedSchema,
]);
