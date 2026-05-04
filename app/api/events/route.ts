import { API_PROXY_INTL, API_PROXY_LOG } from "@/app/api/constants";
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
    devGammaProxyLog(API_PROXY_LOG.EVENTS_RESPONSE_STATUS, response.status);

    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_EVENTS, {
      onParsed: (data) => {
        devGammaProxyLog(
          API_PROXY_LOG.EVENTS_FETCHED,
          Array.isArray(data) ? data.length : 0,
          API_PROXY_LOG.EVENTS_NOUN,
        );
      },
    });
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      API_PROXY_INTL.FETCH_EVENTS_ERROR,
      API_PROXY_LOG.EVENTS_ERROR,
    );
  }
}
