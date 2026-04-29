import { fetchGammaEventsListUpstream } from "@/src/entities/event/server";
import {
  devGammaProxyLog,
  gammaProxyErrorNextResponse,
  gammaUpstreamToNextJson,
  GAMMA_PROXY_CACHE_EVENTS,
} from "@/src/shared/api";

export async function GET(request: Request) {
  try {
    const response = await fetchGammaEventsListUpstream(request);
    devGammaProxyLog("[API Proxy] Response status:", response.status);

    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_EVENTS, {
      onParsed: (data) => {
        devGammaProxyLog(
          "[API Proxy] Fetched",
          Array.isArray(data) ? data.length : 0,
          "events",
        );
      },
    });
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      "Failed to fetch from Polymarket API",
      "[API Proxy] Error:",
    );
  }
}
