import type {
  MarketMessage,
  MarketPriceChange,
  MarketTrade,
  MarketBook,
  MarketTickSizeChange,
  MarketBestBidAsk,
  MarketNewMarket,
  MarketResolved,
} from '../types';
import { MarketMessageSchema } from '../schemas';

export function isMarketMessage(message: unknown): message is MarketMessage {
  return MarketMessageSchema.safeParse(message).success;
}

export function isPriceChange(message: MarketMessage): message is MarketPriceChange {
  return message.type === 'price_change';
}

export function isTrade(message: MarketMessage): message is MarketTrade {
  return message.type === 'last_trade_price';
}

export function isBook(message: MarketMessage): message is MarketBook {
  return message.type === 'book';
}

export function isTickSizeChange(message: MarketMessage): message is MarketTickSizeChange {
  return message.type === 'tick_size_change';
}

export function isBestBidAsk(message: MarketMessage): message is MarketBestBidAsk {
  return message.type === 'best_bid_ask';
}

export function isNewMarket(message: MarketMessage): message is MarketNewMarket {
  return message.type === 'new_market';
}

export function isMarketResolved(message: MarketMessage): message is MarketResolved {
  return message.type === 'market_resolved';
}
