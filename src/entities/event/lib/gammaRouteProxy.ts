import "server-only";

import { GAMMA_API_URL, JSON_REQUEST_HEADERS } from "@/src/shared/api";

const GAMMA_PROXY_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function upstreamHeaders(): HeadersInit {
  return {
    ...JSON_REQUEST_HEADERS,
    "User-Agent": GAMMA_PROXY_USER_AGENT,
  };
}

const GAMMA_EVENT_FORWARD_PARAMS = new Set([
  "tag_id",
  "tag_slug",
  "related_tags",
  "exclude_tag_id",
  "active",
  "archived",
  "slug",
  "live",
  "cyom",
  "include_chat",
  "include_template",
  "recurrence",
  "liquidity_min",
  "liquidity_max",
  "volume_min",
  "volume_max",
  "start_date_min",
  "start_date_max",
  "end_date_min",
  "end_date_max",
  "offset",
  "id",
]);

const GAMMA_EVENT_MULTI_VALUE_PARAMS = new Set(["exclude_tag_id", "id", "slug"]);

export function buildGammaEventsProxySearchParams(request: Request): URLSearchParams {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  params.set("closed", searchParams.get("closed") ?? "false");
  params.set("limit", searchParams.get("limit") ?? "500");
  params.set("active", searchParams.get("active") ?? "true");

  const featured = searchParams.get("featured");
  if (featured !== null && featured !== "") {
    params.set("featured", featured);
  }
  const order = searchParams.get("order");
  if (order !== null && order !== "") {
    params.set("order", order);
  }
  const ascending = searchParams.get("ascending");
  if (ascending !== null && ascending !== "") {
    params.set("ascending", ascending);
  }

  for (const key of GAMMA_EVENT_FORWARD_PARAMS) {
    if (GAMMA_EVENT_MULTI_VALUE_PARAMS.has(key)) {
      for (const value of searchParams.getAll(key)) {
        if (value !== "") {
          params.append(key, value);
        }
      }
    } else {
      const value = searchParams.get(key);
      if (value !== null && value !== "") {
        params.set(key, value);
      }
    }
  }

  return params;
}

export async function fetchGammaEventsListUpstream(request: Request): Promise<Response> {
  const q = buildGammaEventsProxySearchParams(request);
  return fetch(`${GAMMA_API_URL}/events?${q.toString()}`, {
    headers: upstreamHeaders(),
  });
}

export async function fetchGammaEventsPaginationUpstream(
  request: Request,
): Promise<Response> {
  const q = buildGammaEventsProxySearchParams(request);
  return fetch(`${GAMMA_API_URL}/events/pagination?${q.toString()}`, {
    headers: upstreamHeaders(),
  });
}

export async function fetchGammaEventBySlugUpstream(slug: string): Promise<Response> {
  return fetch(`${GAMMA_API_URL}/events/slug/${encodeURIComponent(slug)}`, {
    headers: upstreamHeaders(),
  });
}

const GAMMA_MARKET_FORWARD_PARAMS = new Set([
  "tag_id",
  "related_tags",
  "cyom",
  "uma_resolution_status",
  "game_id",
  "rewards_min_size",
  "include_tag",
  "closed",
  "liquidity_num_min",
  "liquidity_num_max",
  "volume_num_min",
  "volume_num_max",
  "start_date_min",
  "start_date_max",
  "end_date_min",
  "end_date_max",
  "offset",
  "order",
  "ascending",
]);

const GAMMA_MARKET_MULTI_VALUE_PARAMS = new Set([
  "id",
  "slug",
  "clob_token_ids",
  "condition_ids",
  "market_maker_address",
  "sports_market_types",
  "question_ids",
]);

export function buildGammaMarketsProxySearchParams(request: Request): URLSearchParams {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  params.set("closed", searchParams.get("closed") ?? "false");
  params.set("limit", searchParams.get("limit") ?? "500");

  for (const key of GAMMA_MARKET_FORWARD_PARAMS) {
    if (GAMMA_MARKET_MULTI_VALUE_PARAMS.has(key)) {
      continue;
    }
    const value = searchParams.get(key);
    if (value !== null && value !== "") {
      params.set(key, value);
    }
  }

  for (const key of GAMMA_MARKET_MULTI_VALUE_PARAMS) {
    for (const value of searchParams.getAll(key)) {
      if (value !== "") {
        params.append(key, value);
      }
    }
  }

  return params;
}

export async function fetchGammaMarketsUpstream(request: Request): Promise<Response> {
  const q = buildGammaMarketsProxySearchParams(request);
  return fetch(`${GAMMA_API_URL}/markets?${q.toString()}`, {
    headers: upstreamHeaders(),
  });
}
