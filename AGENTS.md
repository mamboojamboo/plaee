<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## FSD slice public API (`src/`)

- **`index.ts`** — only what is safe to import from Client Components and shared UI. Prefer exporting hooks, atoms, types, and presentational pieces here.
- **`server.ts`** — server-only surface (`import "server-only"` at the top). Re-export or define RSC helpers, data loaders, and anything that must not ship to the client bundle. Route handlers and `page.tsx` (Server Components) import from here, e.g. `@/src/features/event-feed/server`, `@/src/entities/event/server`.
- **Implementation** — keep `api.ts`, `lib/`, `model/` as internal segments; do not import them from outside the slice except via `index.ts` or `server.ts`.

When adding a new server-only loader, add it to `server.ts` (or create `server.ts`) instead of exporting it from `index.ts`, so client code cannot accidentally depend on server-only modules.

### Entity public APIs

- Import each slice’s own types from that slice (e.g. `Tag` from `@/src/entities/tag`, `Market` from `@/src/entities/market`). `@/src/entities/event` exposes `Event`, list atoms, and event-specific selectors only — not re-exports of other entities.
- Nav / filter chip definitions: `CATEGORY_TAGS` from `@/src/entities/category`.

### Live prices

- **`usePriceUpdates`** — subscribe to market WebSocket for all outcomes in the current `eventsAtom` list: import from `@/src/features/price-updates` (orchestration lives in the feature layer).
- **`useOutcomePrice`**, **`usePriceUpdateFlash`**, and market price atoms — import from `@/src/entities/market`.

### Home listing filter

- Tag selection, derived filtered events, layout, and search atoms (`searchQueryAtom`, `searchedEventsAtom`), plus **`useCategoryFilter`**, are exported from `@/src/features/event-filter`.

### `shared/ui` segments

Each folder under `src/shared/ui/<segment>/` exposes its public API through **`index.ts`**. Import from `@/src/shared/ui/<segment>` (no deep paths like `.../badge/Badge`).

### `app/api/*` route handlers

Keep handlers thin: call upstream helpers from `@/src/entities/event/server` or `@/src/features/*/server` (e.g. `fetchGammaEventsListUpstream`, `fetchGammaTagsUpstream`), then map the `Response` to `NextResponse` with shared CORS/cache headers. Do not duplicate Gamma URL or query-forwarding logic in `app/api`.

### ESLint (`eslint.config.mjs`)

- **`import/no-restricted-paths`**: per-slice zones under `src/features/*` and `src/widgets/*` block imports from sibling slices in the same layer (each slice may import only from its own folder under that layer, plus lower layers). Widgets must not import `page-templates`.
- **`no-restricted-imports` (patterns)**: `@/src/features/<slice>/…` must not go past the public API except `…/server`; same for `@/src/entities/<slice>/…`; `@/src/widgets/<slice>/…` must be only the slice root (no extra path segments).
