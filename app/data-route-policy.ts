/**
 * App Router segment policy for market listing and event pages.
 *
 * IMPORTANT: Route segment config values such as `revalidate` must remain
 * literal values in each `page.tsx` so Next.js can statically analyze them.
 *
 * Current policy:
 * - Home, crypto hub, crypto sub-routes, and event detail use short route
 *   revalidation (`revalidate = 30`) for a fresh server snapshot.
 * - Live prices still come from the client WebSocket layer after hydration.
 *
 * Where caching still happens:
 * - Route output / server fetches: short ISR on the page routes.
 * - Request-scope memoization: `react/cache` in server feature helpers avoids
 *   duplicated work during a single render pass.
 * - Small payloads: `unstable_cache` in tags-feed/server (`tags` tag).
 * - app/api route handlers: Cache-Control s-maxage and stale-while-revalidate
 *   for CDN edge caching of JSON proxies.
 *
 * If a route ever needs truly request-time rendering again, prefer a targeted
 * `connection()` / `no-store` decision over blanket dynamic rendering.
 */
export {};
