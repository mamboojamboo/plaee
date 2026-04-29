import { WSClient } from '../client';
import type {
  RTDSMessage,
  RTDSSubscription,
  RTDSSubscriptionRequest,
  MessageHandler,
  StateListener,
  Unsubscribe,
  WSConnectionState,
} from '../types';
import { isRTDSMessage } from '../validators';

export class RtdsWsChannel {
  private wsClient: WSClient;
  private messageHandlers = new Set<MessageHandler<RTDSMessage>>();
  private stateListeners = new Set<StateListener>();
  private subscriptions = new Set<string>();
  private subscriptionBuffer = new Set<string>();

  constructor() {
    this.wsClient = new WSClient({
      endpoint: 'wss://ws-live-data.polymarket.com',
      heartbeatInterval: 5000,
      heartbeat: 'send-ping',
    });

    this.wsClient.onStateChange((state: WSConnectionState) => {
      this.notifyStateChange(state);
    });

    this.wsClient.subscribe((data: string | Buffer) => {
      this.handleRawMessage(data);
    });
  }

  public connect(): void {
    this.wsClient.connect();
  }

  public disconnect(): void {
    this.wsClient.disconnect();
  }

  public subscribe(handler: MessageHandler<RTDSMessage>): Unsubscribe {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  public onStateChange(handler: StateListener): Unsubscribe {
    this.stateListeners.add(handler);
    return () => {
      this.stateListeners.delete(handler);
    };
  }

  public subscribeTopic(topic: string, type?: string, filters?: Record<string, unknown>): void {
    const key = `${topic}:${type || '*'}`;

    if (this.subscriptions.has(key)) {
      return;
    }

    this.subscriptionBuffer.add(key);

    if (this.wsClient.getState() === 'open') {
      this.sendSubscription(topic, type, filters);
      this.subscriptions.add(key);
    }
  }

  public unsubscribeTopic(topic: string, type?: string): void {
    const key = `${topic}:${type || '*'}`;
    this.subscriptionBuffer.delete(key);
    this.subscriptions.delete(key);

    if (this.wsClient.getState() === 'open') {
      this.sendUnsubscription(topic, type);
    }
  }

  public getState(): WSConnectionState {
    return this.wsClient.getState();
  }

  private handleRawMessage(data: string | Buffer): void {
    try {
      const str = typeof data === 'string' ? data : data.toString();

      if (isPong(str)) {
        return;
      }

      const parsed = JSON.parse(str);

      if (!isRTDSMessage(parsed)) {
        return;
      }

      this.broadcast(parsed);
    } catch (error) {
      console.warn('[RTDS Channel] Failed to parse message:', error);
    }
  }

  private broadcast(message: RTDSMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('[RTDS Channel] Message handler error:', error);
      }
    });
  }

  private notifyStateChange(state: WSConnectionState): void {
    this.stateListeners.forEach((handler) => {
      try {
        handler(state);
      } catch (error) {
        console.error('[RTDS Channel] State listener error:', error);
      }
    });
  }

  private sendSubscription(
    topic: string,
    type?: string,
    filters?: Record<string, unknown>
  ): void {
    const subscription: RTDSSubscription = {
      topic,
      type,
      filters: filters ? JSON.stringify(filters) : undefined,
    };

    const request: RTDSSubscriptionRequest = {
      action: 'subscribe',
      subscriptions: [subscription],
    };

    this.wsClient.send(request);
  }

  private sendUnsubscription(topic: string, type?: string): void {
    const subscription: RTDSSubscription = {
      topic,
      type,
    };

    const request: RTDSSubscriptionRequest = {
      action: 'unsubscribe',
      subscriptions: [subscription],
    };

    this.wsClient.send(request);
  }
}

function isPong(data: string): boolean {
  return data === 'PONG' || data === 'pong';
}
