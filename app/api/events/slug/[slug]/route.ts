import { NextResponse } from "next/server";

import { API_PROXY_INTL, API_PROXY_LOG } from "@/app/api/constants";
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
      return NextResponse.json(
        { error: API_PROXY_INTL.EVENT_NOT_FOUND },
        { status: 404 },
      );
    }

    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_EVENTS);
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      API_PROXY_INTL.FETCH_EVENT_ERROR,
      API_PROXY_LOG.EVENT_SLUG_ERROR,
    );
  }
}
