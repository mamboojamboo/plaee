import { WSClient } from '../client';
import type {
  MarketMessage,
  MarketSubscriptionRequest,
  MarketSubscriptionUpdate,
  MessageHandler,
  StateListener,
  Unsubscribe,
  WSConnectionState,
} from '../types';
import { normalizeMarketWirePayload } from '../normalize';
import { isMarketMessage } from '../validators';

export class MarketWsChannel {
  private wsClient: WSClient;
  private messageHandlers = new Set<MessageHandler<MarketMessage>>();
  private stateListeners = new Set<StateListener>();
  private subscriptions = new Set<string>();
  private subscriptionBuffer = new Set<string>();
  private marketChannelPrimed = false;

  constructor() {
    this.wsClient = new WSClient({
      endpoint: 'wss://ws-subscriptions-clob.polymarket.com/ws/market',
      heartbeatInterval: 10000,
      heartbeat: 'send-ping',
    });

    this.wsClient.onStateChange((state: WSConnectionState) => {
      if (state === 'open') {
        this.resyncSubscriptionsAfterOpen();
      }
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

  public subscribe(handler: MessageHandler<MarketMessage>): Unsubscribe {
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

  public subscribeAsset(tokenId: string): void {
    if (this.subscriptions.has(tokenId)) {
      return;
    }

    if (this.wsClient.getState() !== 'open') {
      this.subscriptionBuffer.add(tokenId);
      return;
    }

    if (!this.marketChannelPrimed) {
      const initial: MarketSubscriptionRequest = {
        type: 'market',
        assets_ids: [tokenId],
        custom_feature_enabled: true,
      };
      this.wsClient.send(initial);
      this.subscriptions.add(tokenId);
      this.marketChannelPrimed = true;
      return;
    }

    const add: MarketSubscriptionUpdate = {
      operation: 'subscribe',
      assets_ids: [tokenId],
      custom_feature_enabled: true,
    };
    this.wsClient.send(add);
    this.subscriptions.add(tokenId);
  }

  public unsubscribeAsset(tokenId: string): void {
    this.subscriptionBuffer.delete(tokenId);
    const had = this.subscriptions.delete(tokenId);

    if (had && this.wsClient.getState() === 'open') {
      this.sendUnsubscription(tokenId);
    }
  }

  public getState(): WSConnectionState {
    return this.wsClient.getState();
  }

  private handleRawMessage(data: string | Buffer): void {
    try {
      const str = typeof data === 'string' ? data : data.toString();
      if (str === 'PONG' || str === 'pong') {
        return;
      }

      const parsed = JSON.parse(str);
      const messages = normalizeMarketWirePayload(parsed);

      for (const message of messages) {
        if (!isMarketMessage(message)) {
          continue;
        }
        this.broadcast(message);
      }
    } catch (error) {
      console.warn('[Market Channel] Failed to parse message:', error);
    }
  }

  private broadcast(message: MarketMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('[Market Channel] Message handler error:', error);
      }
    });
  }

  private notifyStateChange(state: WSConnectionState): void {
    this.stateListeners.forEach((handler) => {
      try {
        handler(state);
      } catch (error) {
        console.error('[Market Channel] State listener error:', error);
      }
    });
  }

  private resyncSubscriptionsAfterOpen(): void {
    const ids = new Set<string>([...this.subscriptionBuffer, ...this.subscriptions]);
    this.subscriptionBuffer.clear();
    this.subscriptions.clear();
    this.marketChannelPrimed = false;

    if (ids.size === 0) {
      return;
    }

    const request: MarketSubscriptionRequest = {
      type: 'market',
      assets_ids: [...ids],
      custom_feature_enabled: true,
    };
    this.wsClient.send(request);
    for (const id of ids) {
      this.subscriptions.add(id);
    }
    this.marketChannelPrimed = true;
  }

  private sendUnsubscription(tokenId: string): void {
    const request: MarketSubscriptionUpdate = {
      operation: 'unsubscribe',
      assets_ids: [tokenId],
    };
    this.wsClient.send(request);
  }
}
