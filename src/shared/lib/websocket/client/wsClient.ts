import type { WSClientConfig, WSConnectionState, StateListener, Unsubscribe } from '../types';
import { getWebSocketConstructor } from './wsClientFactory';

type RawMessageHandler = (data: Buffer | string) => void;

export class WSClient {
  private ws: WebSocket | null = null;
  private state: WSConnectionState = 'closed';

  private messageHandlers = new Set<RawMessageHandler>();
  private stateListeners = new Set<StateListener>();

  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts: number;
  private readonly baseReconnectDelay: number;
  private readonly maxReconnectDelay: number;

  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly heartbeatInterval_ms: number;
  private readonly heartbeatMode: 'send-ping' | 'respond-to-ping' | 'none';

  private readonly endpoint: string;
  private readonly name: string;
  private lastErrorLogAt = 0;
  private hasConnectedOnce = false;

  constructor(config: WSClientConfig) {
    this.endpoint = config.endpoint;
    this.name = config.endpoint.split('/').pop() || 'WebSocket';
    this.maxReconnectAttempts = config.maxReconnectAttempts ?? 10;
    this.baseReconnectDelay = config.baseReconnectDelay ?? 1000;
    this.maxReconnectDelay = config.maxReconnectDelay ?? 30000;
    this.heartbeatInterval_ms = config.heartbeatInterval ?? 10000;
    this.heartbeatMode = config.heartbeat ?? 'send-ping';
  }

  public connect(): void {
    if (this.state !== 'closed') return;

    this.setState('connecting');

    try {
      const WebSocketConstructor = getWebSocketConstructor();
      this.ws = new WebSocketConstructor(this.endpoint);

      this.ws.onopen = () => {
        this.onOpen();
      };

      this.ws.onmessage = (event) => {
        this.onMessage(event);
      };

      this.ws.onerror = (error) => {
        this.onError(error);
      };

      this.ws.onclose = () => {
        this.onClose();
      };
    } catch (error) {
      console.warn(`[${this.name}] Connection failed:`, error);
      this.setState('error');
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
    this.setState('closed');
    this.reconnectAttempts = 0;
  }

  public subscribe(handler: RawMessageHandler): Unsubscribe {
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

  public send(message: string | object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      try {
        this.ws.send(data);
      } catch (error) {
        console.warn(`[${this.name}] Failed to send message:`, error);
      }
    }
  }

  public getState(): WSConnectionState {
    return this.state;
  }

  private setState(newState: WSConnectionState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.notifyStateChange();
    }
  }

  private notifyStateChange(): void {
    this.stateListeners.forEach((handler) => {
      try {
        handler(this.state);
      } catch (error) {
        console.error(`[${this.name}] State listener error:`, error);
      }
    });
  }

  private onOpen(): void {
    console.log(`[${this.name}] Connected`);
    this.reconnectAttempts = 0;
    this.hasConnectedOnce = true;
    this.setState('open');
    this.startHeartbeat();
  }

  private onMessage(event: Event): void {
    try {
      const messageEvent = event as MessageEvent;
      let data: Buffer | string = messageEvent.data;

      if (typeof data !== 'string' && Buffer.isBuffer(data)) {
        data = data.toString();
      }

      if (data === 'ping' && this.heartbeatMode === 'respond-to-ping') {
        this.send('pong');
        return;
      }

      if (data === 'PONG' || data === 'pong') {
        return;
      }

      this.messageHandlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[${this.name}] Message handler error:`, error);
        }
      });
    } catch (error) {
      console.warn(`[${this.name}] Failed to process message:`, error);
    }
  }

  private onError(error: Event): void {
    const now = Date.now();
    const shouldLog = now - this.lastErrorLogAt > 5000;
    if (shouldLog) {
      const eventType = error.type || "unknown";
      const readyState = this.ws?.readyState ?? -1;
      console.warn(`[${this.name}] Connection error (type=${eventType}, readyState=${readyState})`);
      this.lastErrorLogAt = now;
    }
    this.setState('error');
  }

  private onClose(): void {
    if (this.hasConnectedOnce) {
      console.log(`[${this.name}] Disconnected`);
    }
    this.ws = null;
    this.setState('closed');
    this.stopHeartbeat();
    this.scheduleReconnect();
  }

  private startHeartbeat(): void {
    if (this.heartbeatMode === 'none') return;

    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        if (this.heartbeatMode === 'send-ping') {
          this.send('PING');
        }
      }
    }, this.heartbeatInterval_ms);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`[${this.name}] Max reconnection attempts reached`);
      return;
    }

    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );

    this.reconnectAttempts++;
    this.setState('reconnecting');

    const shouldLog = this.reconnectAttempts <= 3 || this.reconnectAttempts % 5 === 0;
    if (shouldLog) {
      console.log(`[${this.name}] Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    }

    setTimeout(() => {
      this.connect();
    }, delay);
  }
}
