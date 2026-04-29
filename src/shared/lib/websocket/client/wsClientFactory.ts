import WebSocketFromWs from "ws";

type GlobalWithNodeWebSocket = typeof globalThis & {
  WebSocket: typeof WebSocket;
};

export function getWebSocketConstructor(): typeof WebSocket {
  if (typeof window !== "undefined") {
    return window.WebSocket;
  }

  if (typeof global !== "undefined") {
    const nodeVersion = parseInt(process.versions?.node ?? "0", 10);

    if (nodeVersion >= 22) {
      return (globalThis as GlobalWithNodeWebSocket).WebSocket;
    }
    return WebSocketFromWs as unknown as typeof WebSocket;
  }

  throw new Error("WebSocket is not available in this environment");
}
