import { API_PROXY_INTL, API_PROXY_LOG } from "@/app/api/constants";
import { fetchGammaMarketsUpstream } from "@/src/entities/event/server";
import {
  gammaProxyErrorNextResponse,
  gammaUpstreamToNextJson,
  GAMMA_PROXY_CACHE_EVENTS,
} from "@/src/shared/api";

export async function GET(request: Request) {
  try {
    const response = await fetchGammaMarketsUpstream(request);
    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_EVENTS);
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      API_PROXY_INTL.FETCH_MARKETS_ERROR,
      API_PROXY_LOG.MARKETS_ERROR,
    );
  }
}
