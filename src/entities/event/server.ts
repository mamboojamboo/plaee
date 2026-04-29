import "server-only";

export {
  getFeaturedEvents,
  getEventBySlugFromGamma,
  getMarketsByEventId,
} from "./queries";
export { fetchEventsPaginatedFromGamma } from "./lib/gammaApi";

export {
  buildGammaEventsProxySearchParams,
  buildGammaMarketsProxySearchParams,
  fetchGammaEventBySlugUpstream,
  fetchGammaEventsListUpstream,
  fetchGammaEventsPaginationUpstream,
  fetchGammaMarketsUpstream,
} from "./lib/gammaRouteProxy";
