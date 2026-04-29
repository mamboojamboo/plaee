import type {
  RTDSMessage,
  CryptoPriceBinanceUpdate,
  CryptoPriceChainlinkUpdate,
  EquityPriceUpdate,
  CommentCreated,
  CommentRemoved,
  ReactionCreated,
  ReactionRemoved,
} from '../types';
import { RTDSMessageSchema } from '../schemas';

export function isRTDSMessage(message: unknown): message is RTDSMessage {
  return RTDSMessageSchema.safeParse(message).success;
}

export function isPong(data: unknown): boolean {
  return data === 'PONG' || data === 'pong';
}

export function isCryptoPriceBinance(message: RTDSMessage): message is CryptoPriceBinanceUpdate {
  return message.topic === 'crypto_prices' && message.type === 'update';
}

export function isCryptoPriceChainlink(
  message: RTDSMessage
): message is CryptoPriceChainlinkUpdate {
  return message.topic === 'crypto_prices_chainlink' && message.type === 'update';
}

export function isEquityPrice(message: RTDSMessage): message is EquityPriceUpdate {
  return message.topic === 'equity_prices';
}

export function isCommentCreated(message: RTDSMessage): message is CommentCreated {
  return message.topic === 'comments' && message.type === 'comment_created';
}

export function isCommentRemoved(message: RTDSMessage): message is CommentRemoved {
  return message.topic === 'comments' && message.type === 'comment_removed';
}

export function isReactionCreated(message: RTDSMessage): message is ReactionCreated {
  return message.topic === 'comments' && message.type === 'reaction_created';
}

export function isReactionRemoved(message: RTDSMessage): message is ReactionRemoved {
  return message.topic === 'comments' && message.type === 'reaction_removed';
}
