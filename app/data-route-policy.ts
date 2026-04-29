/**
 * App Router segment policy for market listing and event pages.
 *
 * IMPORTANT: Each app route `page.tsx` must use the literal
 * `export const dynamic = "force-dynamic"` — Next.js statically parses route
 * segment config and rejects a shared imported constant (Turbopack build).
 *
 * Why force-dynamic: these routes run on every request so Server Components
 * receive up-to-date props for hydration (Jotai useHydrateAtoms, live prices).
 * This opts out of the Full Route Cache for the page shell.
 *
 * Where caching still happens:
 * - Large `Event[]` payloads: in-process TTL maps in feature modules (Next.js
 *   Data Cache / `unstable_cache` rejects entries over ~2MB).
 * - Small payloads: `unstable_cache` in tags-feed/server (`tags` tag).
 * - app/api route handlers: Cache-Control s-maxage and stale-while-revalidate
 *   for CDN edge caching of JSON proxies.
 *
 * If you need ISR or static shells later: drop force-dynamic, set revalidate
 * on the segment, and verify client islands still hydrate with WebSocket UI.
 */
export {};
