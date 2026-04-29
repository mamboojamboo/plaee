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
      "Failed to fetch markets from Polymarket API",
      "[API Proxy] Markets:",
    );
  }
}
