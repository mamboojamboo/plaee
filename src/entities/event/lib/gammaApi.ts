import type { Event } from "../types";
import type { Market, Outcome } from "@/src/entities/market";
import {
  FEATURED_EVENTS_QUERY,
  GAMMA_API_URL,
  JSON_REQUEST_HEADERS,
  LOCAL_EVENTS_API_PATH,
  LOCAL_EVENTS_PAGINATION_API_PATH,
  LOCAL_MARKETS_API_PATH,
} from "@/src/shared/api";
import {
  parseGammaEventsList,
  parseGammaEventsPagination,
  parseGammaMarketsList,
  parseGammaSingleEvent,
  parseWireOutcomePriceList,
  parseWireStringList,
  readJsonResponse,
  type RawEvent,
  type RawMarket,
} from "./gammaApi.schema";

function parseNumeric(value: string | number | undefined): number {
  if (!value) return 0;
  const n = parseFloat(String(value));
  return Number.isFinite(n) ? n : 0;
}

function mapRawMarket(raw: RawMarket & { closed?: boolean }): Market | null {
  if (raw.outcomes == null || raw.outcomePrices == null) return null;
  const outcomesArray = parseWireStringList(raw.outcomes);
  const pricesArray = parseWireOutcomePriceList(raw.outcomePrices);

  if (!outcomesArray || !pricesArray) return null;
  if (outcomesArray.length < 2 || pricesArray.length < 2) return null;

  let clobTokenIds: string[] = [];
  if (raw.clobTokenIds) {
    if (typeof raw.clobTokenIds === "string") {
      const parsedTokenIds = parseWireStringList(raw.clobTokenIds);
      clobTokenIds = parsedTokenIds ?? [];
    } else if (Array.isArray(raw.clobTokenIds)) {
      clobTokenIds = raw.clobTokenIds;
    }
  }

  const outcomes: Outcome[] = outcomesArray.map((name: string, idx: number) => ({
    id: `${raw.id}-${idx}`,
    name,
    price: parseNumeric(pricesArray[idx]),
    probability: parseNumeric(pricesArray[idx]) * 100,
    volume: 0,
  }));

  return {
    id: raw.id,
    question: raw.question,
    groupItemTitle: raw.groupItemTitle,
    outcomes,
    volume: parseNumeric(raw.volume),
    liquidity: parseNumeric(raw.liquidity),
    createdAt: raw.createdAt || new Date().toISOString(),
    resolutionDate: raw.endDate || "",
    clobTokenIds,
    active: raw.active,
    closed: raw.closed,
    archived: raw.archived,
    isNew: raw.new,
    featured: raw.featured,
    fpmmLive: raw.fpmmLive,
  };
}

function isUpDownShortWindowEvent(raw: RawEvent): boolean {
  const slug = (raw.slug ?? "").toLowerCase();
  if (
    slug.includes("updown-5m-") ||
    slug.includes("updown-15m-") ||
    slug.includes("updown-4h-")
  ) {
    return true;
  }
  const s0 = raw.series?.[0]?.slug;
  if (s0 == null) return false;
  const s = String(s0).toLowerCase();
  if (s.includes("updown-5m") || s.includes("updown-15m") || s.includes("updown-4h")) {
    return true;
  }
  if (s.endsWith("-hourly")) return true;
  return false;
}

function isWithinActiveTradingWindow(
  startDate: string | undefined,
  endDate: string | undefined,
  now: number = Date.now(),
): boolean {
  const endTs = endDate ? Date.parse(endDate) : NaN;
  if (!Number.isFinite(endTs) || now >= endTs) return false;
  const startTs = startDate ? Date.parse(startDate) : NaN;
  if (Number.isFinite(startTs) && now < startTs) return false;
  return true;
}

function inferLiveRollingCrypto(raw: RawEvent): boolean {
  if (!isUpDownShortWindowEvent(raw)) return false;
  return isWithinActiveTradingWindow(raw.startDate, raw.endDate);
}

function mapRawEvent(raw: RawEvent): Event {
  const seriesFirst = raw.series?.[0];
  const seriesSlug =
    seriesFirst?.slug != null && String(seriesFirst.slug).trim() !== ""
      ? String(seriesFirst.slug).trim()
      : undefined;
  const seriesTitleRaw = seriesFirst?.title != null ? String(seriesFirst.title).trim() : "";
  const seriesTitle = seriesTitleRaw !== "" ? seriesTitleRaw : undefined;
  return {
    id: raw.id,
    slug: raw.slug,
    seriesSlug,
    seriesTitle,
    title: raw.title,
    description: raw.description,
    markets: raw.markets
      .filter((m: RawMarket & { closed?: boolean }) => !m.closed && m.outcomePrices != null)
      .map((m) => mapRawMarket(m))
      .filter((m): m is Market => m !== null),
    tags: raw.tags || [],
    categories: raw.categories || [],
    volume: parseNumeric(raw.volume),
    volume24hr: parseNumeric(raw.volume24hr),
    liquidity: parseNumeric(raw.liquidity),
    imageUrl: raw.image || raw.icon,
    iconUrl: raw.icon,
    startDate: raw.startDate,
    resolutionDate: raw.endDate,
    createdAt: raw.createdAt || new Date().toISOString(),
    active: raw.active,
    closed: raw.closed,
    archived: raw.archived,
    isNew: raw.new,
    featured: raw.featured,
    live: raw.live === true || inferLiveRollingCrypto(raw),
  };
}

function mapAndFilterEvents(rawEvents: RawEvent[]): Event[] {
  return rawEvents
    .map(mapRawEvent)
    .filter((event: Event) => event.markets.length > 0);
}

const isServer = typeof window === "undefined";

function getBrowserLocalUrl(pathWithQuery: string): string {
  return pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
}

async function fetchJson(
  localPathWithQuery: string,
  upstreamUrl: string,
): Promise<Response> {
  if (isServer) {
    return fetch(upstreamUrl, { headers: JSON_REQUEST_HEADERS });
  }
  return fetch(getBrowserLocalUrl(localPathWithQuery), {
    headers: JSON_REQUEST_HEADERS,
  });
}

export async function fetchEventsFromGamma(query: string): Promise<Event[]> {
  try {
    const response = await fetchJson(
      `${LOCAL_EVENTS_API_PATH}?${query}`,
      `${GAMMA_API_URL}/events?${query}`,
    );

    if (response.ok) {
      const body = await readJsonResponse(response);
      return mapAndFilterEvents(parseGammaEventsList(body));
    }

    console.warn(`[API] Events request failed with status ${response.status}`);
  } catch (error) {
    console.error("[API] Failed to fetch events:", error);
  }

  return [];
}

export async function fetchEventsPaginatedFromGamma(query: string): Promise<{
  events: Event[];
  total: number;
  hasMore: boolean;
}> {
  try {
    const response = await fetchJson(
      `${LOCAL_EVENTS_PAGINATION_API_PATH}?${query}`,
      `${GAMMA_API_URL}/events/pagination?${query}`,
    );

    if (response.ok) {
      const body = await readJsonResponse(response);
      const { rawEvents, total, hasMore } = parseGammaEventsPagination(body);
      return { events: mapAndFilterEvents(rawEvents), total, hasMore };
    }

    console.warn(
      `[API] Events pagination request failed with status ${response.status}`,
    );
  } catch (error) {
    console.error("[API] Failed to fetch paginated events:", error);
  }

  return { events: [], total: 0, hasMore: false };
}

export async function fetchFeaturedEventsFromGamma(): Promise<Event[]> {
  return fetchEventsFromGamma(FEATURED_EVENTS_QUERY);
}

function mapRawMarketList(rawMarkets: RawMarket[], eventId: string): Market[] {
  return rawMarkets
    .filter((m) => {
      if (m.closed || m.outcomePrices == null) return false;
      const parents = m.events;
      if (!parents?.length) {
        return true;
      }
      return parents.some((e) => e.id === eventId);
    })
    .map((m) => mapRawMarket(m))
    .filter((m): m is Market => m !== null);
}

export async function fetchEventBySlugFromGamma(slug: string): Promise<Event | null> {
  const encoded = encodeURIComponent(slug);

  try {
    const response = await fetchJson(
      `${LOCAL_EVENTS_API_PATH}/slug/${encoded}`,
      `${GAMMA_API_URL}/events/slug/${encoded}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (response.ok) {
      const body = await readJsonResponse(response);
      const data = parseGammaSingleEvent(body);
      if (data) return mapRawEvent(data);
      return null;
    }

    console.warn(
      `[API] Event-by-slug request failed with status ${response.status}`,
    );
  } catch (error) {
    console.error("[API] Failed to fetch event by slug:", error);
  }

  return null;
}

export async function fetchMarketsByEventIdFromGamma(
  eventId: string,
  eventSlug: string,
): Promise<Market[]> {
  const query = `closed=false&limit=500&slug=${encodeURIComponent(eventSlug)}`;

  try {
    const response = await fetchJson(
      `${LOCAL_MARKETS_API_PATH}?${query}`,
      `${GAMMA_API_URL}/markets?${query}`,
    );

    if (response.ok) {
      const body = await readJsonResponse(response);
      return mapRawMarketList(parseGammaMarketsList(body), eventId);
    }

    console.warn(`[API] Markets request failed with status ${response.status}`);
  } catch (error) {
    console.error("[API] Failed to fetch markets:", error);
  }

  return [];
}
