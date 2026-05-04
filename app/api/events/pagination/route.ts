import { API_PROXY_INTL, API_PROXY_LOG } from "@/app/api/constants";
import { fetchGammaEventsPaginationUpstream } from "@/src/entities/event/server";
import {
  gammaProxyErrorNextResponse,
  gammaUpstreamToNextJson,
  GAMMA_PROXY_CACHE_EVENTS,
} from "@/src/shared/api";

export async function GET(request: Request) {
  try {
    const response = await fetchGammaEventsPaginationUpstream(request);
    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_EVENTS);
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      API_PROXY_INTL.FETCH_EVENTS_ERROR,
      API_PROXY_LOG.PAGINATION_ERROR,
    );
  }
}
