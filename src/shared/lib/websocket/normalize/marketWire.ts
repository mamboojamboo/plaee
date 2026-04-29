import type {
  MarketBestBidAsk,
  MarketBook,
  MarketMessage,
  MarketNewMarket,
  MarketPriceChange,
  MarketResolved,
  MarketTickSizeChange,
  MarketTrade,
} from '../types';
import { MarketMessageSchema } from '../schemas';

const DISPLAY_SPREAD_MAX = 0.1;

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function parseWireTimestamp(ts: unknown): number {
  if (typeof ts === 'number' && Number.isFinite(ts)) return ts;
  if (typeof ts === 'string') {
    const n = parseInt(ts, 10);
    if (Number.isFinite(n)) return n;
  }
  return Date.now();
}

function parseWirePrice(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const n = parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : 0;
}

export function displayPriceFromBidAsk(
  bestBid: number,
  bestAsk: number,
  lastTrade?: number
): number {
  if (!Number.isFinite(bestBid) || !Number.isFinite(bestAsk)) {
    return Number.isFinite(lastTrade) ? lastTrade! : 0;
  }
  if (bestAsk < bestBid) {
    return Number.isFinite(lastTrade) ? lastTrade! : (bestBid + bestAsk) / 2;
  }
  const mid = (bestBid + bestAsk) / 2;
  const spread = bestAsk - bestBid;
  if (spread > DISPLAY_SPREAD_MAX && lastTrade !== undefined && Number.isFinite(lastTrade)) {
    return lastTrade;
  }
  return mid;
}

function parseBookLevels(levels: unknown): Array<[number, number]> {
  if (!Array.isArray(levels)) return [];
  const out: Array<[number, number]> = [];
  for (const row of levels) {
    if (Array.isArray(row) && row.length >= 2) {
      const p = parseWirePrice(row[0]);
      const s = parseWirePrice(row[1]);
      if (Number.isFinite(p) && Number.isFinite(s)) out.push([p, s]);
      continue;
    }
    if (isRecord(row) && 'price' in row) {
      const p = parseWirePrice(row.price);
      const s = parseWirePrice(row.size);
      if (Number.isFinite(p) && Number.isFinite(s)) out.push([p, s]);
    }
  }
  return out;
}

function normalizeBook(w: Record<string, unknown>): MarketBook {
  const bids = parseBookLevels(w.bids);
  const asks = parseBookLevels(w.asks);
  const lastTradeRaw = w.last_trade_price;
  const lastTradePrice =
    lastTradeRaw !== undefined && lastTradeRaw !== null && String(lastTradeRaw).length > 0
      ? parseWirePrice(lastTradeRaw)
      : undefined;

  return {
    type: 'book',
    asset_id: String(w.asset_id ?? ''),
    bids,
    asks,
    timestamp: parseWireTimestamp(w.timestamp),
    lastTradePrice: Number.isFinite(lastTradePrice) ? lastTradePrice : undefined,
  };
}

function normalizePriceChanges(w: Record<string, unknown>): MarketPriceChange[] {
  const ts = parseWireTimestamp(w.timestamp);
  const changes = w.price_changes;
  if (!Array.isArray(changes)) return [];

  const out: MarketPriceChange[] = [];
  for (const ch of changes) {
    if (!isRecord(ch)) continue;
    const asset_id = String(ch.asset_id ?? '');
    if (!asset_id) continue;

    const bb = parseWirePrice(ch.best_bid);
    const ba = parseWirePrice(ch.best_ask);
    let price: number;
    if (
      Number.isFinite(bb) &&
      Number.isFinite(ba) &&
      ba >= bb &&
      bb >= 0 &&
      ba <= 1
    ) {
      price = displayPriceFromBidAsk(bb, ba);
    } else {
      price = parseWirePrice(ch.price);
    }

    out.push({
      type: 'price_change',
      asset_id,
      price,
      timestamp: ts,
    });
  }
  return out;
}

function normalizeLastTrade(w: Record<string, unknown>): MarketTrade {
  return {
    type: 'last_trade_price',
    asset_id: String(w.asset_id ?? ''),
    price: parseWirePrice(w.price),
    timestamp: parseWireTimestamp(w.timestamp),
    size: w.size !== undefined ? parseWirePrice(w.size) : undefined,
  };
}

function normalizeTickSizeChange(w: Record<string, unknown>): MarketTickSizeChange {
  return {
    type: 'tick_size_change',
    asset_id: String(w.asset_id ?? ''),
    tick_size: parseWirePrice(w.new_tick_size ?? w.tick_size),
    timestamp: parseWireTimestamp(w.timestamp),
  };
}

function normalizeBestBidAsk(w: Record<string, unknown>): MarketBestBidAsk {
  const bid = parseWirePrice(w.best_bid);
  const ask = parseWirePrice(w.best_ask);
  return {
    type: 'best_bid_ask',
    asset_id: String(w.asset_id ?? ''),
    bid,
    ask,
    timestamp: parseWireTimestamp(w.timestamp),
  };
}

function normalizeNewMarket(w: Record<string, unknown>): MarketNewMarket {
  const assets = w.assets_ids ?? w.clob_token_ids;
  let asset_id = '';
  if (Array.isArray(assets) && assets.length > 0) {
    asset_id = String(assets[0]);
  }
  return {
    type: 'new_market',
    asset_id: asset_id || String(w.asset_id ?? ''),
    market_id: String(w.market ?? w.condition_id ?? ''),
    timestamp: parseWireTimestamp(w.timestamp),
  };
}

function normalizeMarketResolved(w: Record<string, unknown>): MarketResolved {
  return {
    type: 'market_resolved',
    asset_id: String(w.winning_asset_id ?? w.asset_id ?? ''),
    market_id: String(w.market ?? ''),
    resolved_outcome: String(w.winning_outcome ?? ''),
    timestamp: parseWireTimestamp(w.timestamp),
  };
}

function normalizeOneWireObject(obj: unknown): MarketMessage[] {
  if (!isRecord(obj)) return [];

  if (typeof obj.type === 'string' && obj.event_type === undefined) {
    const parsed = MarketMessageSchema.safeParse(obj);
    return parsed.success ? [parsed.data] : [];
  }

  const eventType = obj.event_type;
  if (typeof eventType !== 'string') return [];

  switch (eventType) {
    case 'book':
      return [normalizeBook(obj)];
    case 'price_change':
      return normalizePriceChanges(obj);
    case 'last_trade_price':
      return [normalizeLastTrade(obj)];
    case 'tick_size_change':
      return [normalizeTickSizeChange(obj)];
    case 'best_bid_ask':
      return [normalizeBestBidAsk(obj)];
    case 'new_market':
      return [normalizeNewMarket(obj)];
    case 'market_resolved':
      return [normalizeMarketResolved(obj)];
    default:
      return [];
  }
}

export function normalizeMarketWirePayload(raw: unknown): MarketMessage[] {
  if (raw === null || raw === undefined) return [];

  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    return raw.flatMap((item) => normalizeOneWireObject(item));
  }

  return normalizeOneWireObject(raw);
}
