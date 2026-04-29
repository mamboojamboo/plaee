import { MarketWsChannel, RtdsWsChannel } from "./channels";
import type {
  MarketMessage,
  RTDSMessage,
  MessageHandler,
  Unsubscribe,
  WSConnectionState,
} from "./types";

type ConnectionStates = {
  market: WSConnectionState;
  rtds: WSConnectionState;
};

type ConnectionStateListener = (states: ConnectionStates) => void;

export class WebSocketManager {
  private marketChannel: MarketWsChannel;
  private rtdsChannel: RtdsWsChannel;
  private stateListeners = new Set<ConnectionStateListener>();

  constructor() {
    this.marketChannel = new MarketWsChannel();
    this.rtdsChannel = new RtdsWsChannel();

    this.marketChannel.onStateChange(() => this.notifyStateChange());
    this.rtdsChannel.onStateChange(() => this.notifyStateChange());
  }

  public connect(): void {
    this.marketChannel.connect();
    this.rtdsChannel.connect();
  }

  public disconnect(): void {
    this.marketChannel.disconnect();
    this.rtdsChannel.disconnect();
  }

  public subscribeMarket(handler: MessageHandler<MarketMessage>): Unsubscribe {
    return this.marketChannel.subscribe(handler);
  }

  public subscribeRTDS(handler: MessageHandler<RTDSMessage>): Unsubscribe {
    return this.rtdsChannel.subscribe(handler);
  }

  public onConnectionStateChange(handler: ConnectionStateListener): Unsubscribe {
    this.stateListeners.add(handler);
    return () => {
      this.stateListeners.delete(handler);
    };
  }

  public subscribeAsset(tokenId: string): void {
    this.marketChannel.subscribeAsset(tokenId);
  }

  public unsubscribeAsset(tokenId: string): void {
    this.marketChannel.unsubscribeAsset(tokenId);
  }

  public subscribeTopic(
    topic: string,
    type?: string,
    filters?: Record<string, unknown>,
  ): void {
    this.rtdsChannel.subscribeTopic(topic, type, filters);
  }

  public unsubscribeTopic(topic: string, type?: string): void {
    this.rtdsChannel.unsubscribeTopic(topic, type);
  }

  public getConnectionStates(): ConnectionStates {
    return {
      market: this.marketChannel.getState(),
      rtds: this.rtdsChannel.getState(),
    };
  }

  private notifyStateChange(): void {
    const states = this.getConnectionStates();
    this.stateListeners.forEach((handler) => {
      try {
        handler(states);
      } catch (error) {
        console.error("[WebSocketManager] State listener error:", error);
      }
    });
  }
}

let instance: WebSocketManager | null = null;

export function getWebSocketManager(): WebSocketManager {
  if (!instance) {
    instance = new WebSocketManager();
  }
  return instance;
}

export function resetWebSocketManager(): void {
  if (instance) {
    instance.disconnect();
    instance = null;
  }
}
