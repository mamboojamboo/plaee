export type MarketMessage =
  | MarketPriceChange
  | MarketTrade
  | MarketBook
  | MarketTickSizeChange
  | MarketBestBidAsk
  | MarketNewMarket
  | MarketResolved;

export type MarketPriceChange = {
  type: 'price_change';
  asset_id: string;
  price: number;
  timestamp: number;
};

export type MarketTrade = {
  type: 'last_trade_price';
  asset_id: string;
  price: number;
  timestamp: number;
  size?: number;
};

export type MarketBook = {
  type: 'book';
  asset_id: string;
  bids: Array<[number, number]>;
  asks: Array<[number, number]>;
  timestamp: number;
  lastTradePrice?: number;
};

export type MarketTickSizeChange = {
  type: 'tick_size_change';
  asset_id: string;
  tick_size: number;
  timestamp: number;
};

export type MarketBestBidAsk = {
  type: 'best_bid_ask';
  asset_id: string;
  bid: number;
  ask: number;
  timestamp: number;
};

export type MarketNewMarket = {
  type: 'new_market';
  asset_id: string;
  market_id: string;
  timestamp: number;
};

export type MarketResolved = {
  type: 'market_resolved';
  asset_id: string;
  market_id: string;
  resolved_outcome: string;
  timestamp: number;
};

export type MarketSubscriptionRequest = {
  type: 'market';
  assets_ids: string[];
  initial_dump?: boolean;
  level?: 1 | 2 | 3;
  custom_feature_enabled?: boolean;
};

export type MarketSubscriptionUpdate = {
  operation: 'subscribe' | 'unsubscribe';
  assets_ids: string[];
  custom_feature_enabled?: boolean;
};
