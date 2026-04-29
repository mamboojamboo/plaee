import { z } from "zod";

const gammaId = z.union([z.string(), z.number()]).transform(String);

export const RawTagSchema = z
  .object({
    id: gammaId,
    label: z.string(),
    slug: z.string(),
    forceShow: z.boolean().optional(),
    forceHide: z.boolean().optional(),
    isCarousel: z.boolean().optional(),
    publishedAt: z.string().optional(),
    createdBy: z.union([z.number(), z.string()]).optional(),
    updatedBy: z.union([z.number(), z.string()]).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export const RawCategorySchema = z
  .object({
    id: gammaId,
    label: z.string(),
    slug: z.string(),
    parentCategory: z.string().optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
    publishedAt: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

export const RawMarketSchema = z
  .object({
    id: gammaId,
    question: z.string(),
    outcomes: z.string().optional(),
    outcomePrices: z.string().optional(),
    groupItemTitle: z.string().optional(),
    volume: z.union([z.string(), z.number()]).optional(),
    liquidity: z.union([z.string(), z.number()]).optional(),
    createdAt: z.string().optional(),
    endDate: z.string().optional(),
    lastTradePrice: z.number().optional(),
    closed: z.boolean().optional(),
    active: z.boolean().optional(),
    archived: z.boolean().optional(),
    new: z.boolean().optional(),
    featured: z.boolean().optional(),
    fpmmLive: z.boolean().optional(),
    clobTokenIds: z.union([z.array(z.string()), z.string()]).optional(),
    events: z.array(z.object({ id: z.string().optional() }).passthrough()).optional(),
  })
  .passthrough();

export const RawEventSchema = z
  .object({
    id: gammaId,
    slug: z.union([z.string(), z.null()]).transform((s) => s ?? ""),
    title: z.union([z.string(), z.null()]).transform((s) => s ?? ""),
    description: z.string().optional(),
    markets: z.array(RawMarketSchema),
    series: z
      .array(
        z
          .object({
            id: z.string().optional(),
            slug: z.string().optional(),
            title: z.string().optional(),
          })
          .passthrough(),
      )
      .optional(),
    tags: z.array(RawTagSchema).optional(),
    categories: z.array(RawCategorySchema).optional(),
    volume: z.union([z.string(), z.number()]).optional(),
    volume24hr: z.union([z.string(), z.number()]).optional(),
    liquidity: z.union([z.string(), z.number()]).optional(),
    image: z.string().optional(),
    icon: z.string().optional(),
    endDate: z.string().optional(),
    startDate: z.string().optional(),
    createdAt: z.string().optional(),
    active: z.boolean().optional(),
    closed: z.boolean().optional(),
    archived: z.boolean().optional(),
    new: z.boolean().optional(),
    featured: z.boolean().optional(),
    live: z.boolean().optional(),
  })
  .passthrough();

export type RawTag = z.infer<typeof RawTagSchema>;
export type RawCategory = z.infer<typeof RawCategorySchema>;
export type RawMarket = z.infer<typeof RawMarketSchema>;
export type RawEvent = z.infer<typeof RawEventSchema>;

const GammaPaginationSchema = z
  .object({
    hasMore: z.boolean().optional(),
    totalResults: z.number().optional(),
  })
  .passthrough();

export const GammaEventsPaginationSchema = z
  .object({
    data: z.array(RawEventSchema).optional(),
    pagination: GammaPaginationSchema.optional(),
  })
  .passthrough();

export const GammaEventsListSchema = z.union([
  z.array(RawEventSchema),
  z.object({ data: z.array(RawEventSchema).optional() }).passthrough(),
]);

export const GammaMarketsListSchema = z.union([
  z.array(RawMarketSchema),
  z.object({ data: z.array(RawMarketSchema).optional() }).passthrough(),
]);

const stringListFromJsonString = z.array(z.string());
const outcomePriceListFromJsonString = z.array(z.union([z.string(), z.number()]));

export async function readJsonResponse(response: Response): Promise<unknown> {
  const body: unknown = await response.json();
  return body;
}

export function parseWireStringList(jsonString: string): string[] | null {
  try {
    const parsed: unknown = JSON.parse(jsonString);
    const result = stringListFromJsonString.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function parseWireOutcomePriceList(jsonString: string): Array<string | number> | null {
  try {
    const parsed: unknown = JSON.parse(jsonString);
    const result = outcomePriceListFromJsonString.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function flattenGammaEventsList(data: z.infer<typeof GammaEventsListSchema>): RawEvent[] {
  if (Array.isArray(data)) return data;
  const inner = data.data;
  return Array.isArray(inner) ? inner : [];
}

export function parseGammaEventsList(body: unknown): RawEvent[] {
  const result = GammaEventsListSchema.safeParse(body);
  if (!result.success) return [];
  return flattenGammaEventsList(result.data);
}

export function parseGammaEventsPagination(body: unknown): {
  rawEvents: RawEvent[];
  total: number;
  hasMore: boolean;
} {
  const result = GammaEventsPaginationSchema.safeParse(body);
  if (!result.success) {
    return { rawEvents: [], total: 0, hasMore: false };
  }
  const { data, pagination } = result.data;
  const rawEvents = Array.isArray(data) ? data : [];
  const total =
    typeof pagination?.totalResults === "number" ? pagination.totalResults : rawEvents.length;
  const hasMore = Boolean(pagination?.hasMore);
  return { rawEvents, total, hasMore };
}

function flattenGammaMarketsList(data: z.infer<typeof GammaMarketsListSchema>): RawMarket[] {
  if (Array.isArray(data)) return data;
  const inner = data.data;
  return Array.isArray(inner) ? inner : [];
}

export function parseGammaMarketsList(body: unknown): RawMarket[] {
  const result = GammaMarketsListSchema.safeParse(body);
  if (!result.success) return [];
  return flattenGammaMarketsList(result.data);
}

export function parseGammaSingleEvent(body: unknown): RawEvent | null {
  const result = RawEventSchema.safeParse(body);
  return result.success ? result.data : null;
}
