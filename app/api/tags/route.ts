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
    devGammaProxyLog("[Tags API Proxy] Response status:", response.status);

    const type = new URL(request.url).searchParams.get("type") ?? "all";

    return await gammaUpstreamToNextJson(response, GAMMA_PROXY_CACHE_TAGS, {
      onParsed: (data) => {
        devGammaProxyLog(
          "[Tags API Proxy] Fetched",
          Array.isArray(data) ? data.length : 0,
          `${type} tags`,
        );
      },
    });
  } catch (error) {
    return gammaProxyErrorNextResponse(
      error,
      "Failed to fetch from Polymarket API",
      "[Tags API Proxy] Error:",
    );
  }
}
