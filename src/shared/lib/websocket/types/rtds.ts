export type CryptoPriceBinanceUpdate = {
  topic: 'crypto_prices';
  type: 'update';
  timestamp: number;
  payload: {
    symbol: 'btcusdt' | 'ethusdt' | 'solusdt' | 'xrpusdt';
    timestamp: number;
    value: number;
  };
};

export type CryptoPriceChainlinkUpdate = {
  topic: 'crypto_prices_chainlink';
  type: 'update';
  timestamp: number;
  payload: {
    symbol: 'btc/usd' | 'eth/usd' | 'sol/usd' | 'xrp/usd';
    timestamp: number;
    value: number;
  };
};

export type EquityPriceUpdate = {
  topic: 'equity_prices';
  type: 'update' | 'subscribe';
  timestamp: number;
  payload:
    | {
        symbol: string;
        value: number;
        full_accuracy_value: string;
        timestamp: number;
        received_at?: number;
        is_carried_forward?: boolean;
      }
    | {
        symbol: string;
        data: Array<{ timestamp: number; value: number }>;
      };
};

export type CommentCreated = {
  topic: 'comments';
  type: 'comment_created';
  timestamp: number;
  payload: {
    body: string;
    createdAt: string;
    id: string;
    parentCommentID: string | null;
    parentEntityID: number;
    parentEntityType: 'Event' | 'Market';
    profile: {
      baseAddress: string;
      displayUsernamePublic: boolean;
      name: string;
      proxyWallet: string;
      pseudonym: string;
    };
    reactionCount: number;
    replyAddress: string;
    reportCount: number;
    userAddress: string;
  };
};

export type CommentRemoved = {
  topic: 'comments';
  type: 'comment_removed';
  timestamp: number;
  payload: {
    id: string;
    parentEntityID: number;
    parentEntityType: 'Event' | 'Market';
  };
};

export type ReactionCreated = {
  topic: 'comments';
  type: 'reaction_created';
  timestamp: number;
  payload: {
    commentId: string;
    reactionType: string;
    userAddress: string;
  };
};

export type ReactionRemoved = {
  topic: 'comments';
  type: 'reaction_removed';
  timestamp: number;
  payload: {
    commentId: string;
    reactionType: string;
    userAddress: string;
  };
};

export type RTDSMessage =
  | CryptoPriceBinanceUpdate
  | CryptoPriceChainlinkUpdate
  | EquityPriceUpdate
  | CommentCreated
  | CommentRemoved
  | ReactionCreated
  | ReactionRemoved;

export type RTDSSubscription = {
  topic: string;
  type?: string;
  filters?: string;
  gamma_auth?: {
    address: string;
  };
};

export type RTDSSubscriptionRequest = {
  action: 'subscribe' | 'unsubscribe';
  subscriptions: RTDSSubscription[];
};
