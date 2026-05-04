import { API_PROXY_INTL, API_PROXY_LOG } from "@/app/api/constants";
import { fetchGammaTagsUpstream } from "@/src/features/tags-feed/server";
import {
  devGammaProxyLog,
  gammaProxyErrorNextResponse,
  gammaUpstreamToNextJson,
  GAMMA_PROXY_CACHE_TAGS,
} from "@/src/shared/api";

export async function GET(request: Request) {
  try {
    const response = await fetchGammaTagsUpstream(request);
    devGammaProxyLog(API_PROXY_LOG.TAGS_RESPONSE_STATUS, response.status);

    const type = new URL(request.url).searchParams.get("type") ?? "all";

    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_TAGS, {
      onParsed: (data) => {
        devGammaProxyLog(
          API_PROXY_LOG.TAGS_FETCHED,
          Array.isArray(data) ? data.length : 0,
          `${type}${API_PROXY_LOG.TAGS_SUFFIX}`,
        );
      },
    });
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      API_PROXY_INTL.FETCH_EVENTS_ERROR,
      API_PROXY_LOG.TAGS_ERROR,
    );
  }
}
