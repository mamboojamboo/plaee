import { NextResponse } from "next/server";

import { fetchGammaEventBySlugUpstream } from "@/src/entities/event/server";
import {
  gammaProxyErrorNextResponse,
  gammaUpstreamToNextJson,
  GAMMA_PROXY_CACHE_EVENTS,
} from "@/src/shared/api";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const response = await fetchGammaEventBySlugUpstream(slug);

    if (response.status === 404) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_EVENTS);
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      "Failed to fetch event from Polymarket API",
      "[API Proxy] Event slug error:",
    );
  }
}
