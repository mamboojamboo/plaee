export const GAMMA_API_URL = "https://gamma-api.polymarket.com";

export const LOCAL_EVENTS_API_PATH = "/api/events";

export const LOCAL_EVENTS_PAGINATION_API_PATH = "/api/events/pagination";

export const LOCAL_MARKETS_API_PATH = "/api/markets";

export const FEATURED_EVENTS_QUERY =
  "closed=false&active=true&limit=500&order=volume_24hr&ascending=false";

export const JSON_REQUEST_HEADERS = {
  "Content-Type": "application/json",
} as const;
