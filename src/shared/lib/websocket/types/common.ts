export type WSConnectionState = 'connecting' | 'open' | 'closed' | 'error' | 'reconnecting';

export type ConnectionError = {
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: number;
};

export type MessageHandler<T> = (message: T) => void;
export type StateListener = (state: WSConnectionState) => void;
export type Unsubscribe = () => void;

export type WSClientConfig = {
  endpoint: string;
  heartbeatInterval?: number;
  heartbeat?: 'send-ping' | 'respond-to-ping' | 'none';
  maxReconnectAttempts?: number;
  baseReconnectDelay?: number;
  maxReconnectDelay?: number;
};
