import { z } from 'zod';

export const CryptoPriceBinanceUpdateSchema = z.object({
  topic: z.literal('crypto_prices'),
  type: z.literal('update'),
  timestamp: z.number(),
  payload: z.object({
    symbol: z.enum(['btcusdt', 'ethusdt', 'solusdt', 'xrpusdt']),
    timestamp: z.number(),
    value: z.number(),
  }),
});

export const CryptoPriceChainlinkUpdateSchema = z.object({
  topic: z.literal('crypto_prices_chainlink'),
  type: z.literal('update'),
  timestamp: z.number(),
  payload: z.object({
    symbol: z.enum(['btc/usd', 'eth/usd', 'sol/usd', 'xrp/usd']),
    timestamp: z.number(),
    value: z.number(),
  }),
});

export const EquityPriceUpdateSchema = z.object({
  topic: z.literal('equity_prices'),
  type: z.enum(['update', 'subscribe']),
  timestamp: z.number(),
  payload: z.union([
    z.object({
      symbol: z.string(),
      value: z.number(),
      full_accuracy_value: z.string(),
      timestamp: z.number(),
      received_at: z.number().optional(),
      is_carried_forward: z.boolean().optional(),
    }),
    z.object({
      symbol: z.string(),
      data: z.array(
        z.object({
          timestamp: z.number(),
          value: z.number(),
        })
      ),
    }),
  ]),
});

const ProfileSchema = z.object({
  baseAddress: z.string(),
  displayUsernamePublic: z.boolean(),
  name: z.string(),
  proxyWallet: z.string(),
  pseudonym: z.string(),
});

export const CommentCreatedSchema = z.object({
  topic: z.literal('comments'),
  type: z.literal('comment_created'),
  timestamp: z.number(),
  payload: z.object({
    body: z.string(),
    createdAt: z.string(),
    id: z.string(),
    parentCommentID: z.string().nullable(),
    parentEntityID: z.number(),
    parentEntityType: z.enum(['Event', 'Market']),
    profile: ProfileSchema,
    reactionCount: z.number(),
    replyAddress: z.string(),
    reportCount: z.number(),
    userAddress: z.string(),
  }),
});

export const CommentRemovedSchema = z.object({
  topic: z.literal('comments'),
  type: z.literal('comment_removed'),
  timestamp: z.number(),
  payload: z.object({
    id: z.string(),
    parentEntityID: z.number(),
    parentEntityType: z.enum(['Event', 'Market']),
  }),
});

export const ReactionCreatedSchema = z.object({
  topic: z.literal('comments'),
  type: z.literal('reaction_created'),
  timestamp: z.number(),
  payload: z.object({
    commentId: z.string(),
    reactionType: z.string(),
    userAddress: z.string(),
  }),
});

export const ReactionRemovedSchema = z.object({
  topic: z.literal('comments'),
  type: z.literal('reaction_removed'),
  timestamp: z.number(),
  payload: z.object({
    commentId: z.string(),
    reactionType: z.string(),
    userAddress: z.string(),
  }),
});

export const RTDSMessageSchema = z.union([
  CryptoPriceBinanceUpdateSchema,
  CryptoPriceChainlinkUpdateSchema,
  EquityPriceUpdateSchema,
  CommentCreatedSchema,
  CommentRemovedSchema,
  ReactionCreatedSchema,
  ReactionRemovedSchema,
]);
