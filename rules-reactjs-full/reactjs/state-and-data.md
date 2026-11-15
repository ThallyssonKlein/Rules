# State and Data Fetching Rule

## Hard Rules

1. **Keep state as local as possible.** Lift only when siblings need it; use context or the project's adopted store only for truly shared state.
2. **Separate server state from UI state.** Remote data lives in a data-fetching/cache layer such as TanStack Query (loading, error, refetch, caching, invalidation) — do not hand-roll `useState`+`useEffect` fetching in every page.
3. **Every remote-data view handles four states:** loading, error (with retry), empty, success.
4. **Put shareable UI state in the URL** (filters, sort, pagination, selected tab, search term) via route/search params, not in component state, so it survives refresh and can be shared.
5. **Validate external data at the boundary** (API responses, URL params, `localStorage` reads, `postMessage`) with a `zod` schema and convert to app types. Never trust `JSON.parse` output (`unknown` → validated type).
6. **Use query keys from a single factory** per feature and invalidate precisely; never invalidate the whole cache by default.
7. **Use optimistic updates only with rollback on failure.**
8. **Cancel or ignore stale requests** when inputs change or the component unmounts (`AbortSignal` supported by the fetch layer).
9. **Persist only what must survive reloads,** version the persisted shape, and handle migration or corrupted data gracefully. Never store tokens or secrets in `localStorage` (see `security.md`).
10. **Forms:** see `forms.md`.

## Why

Treating server state and UI state differently removes most loading/caching bugs and duplicated fetch code. URL state and boundary validation turn silent crashes from malformed input into handled errors.
