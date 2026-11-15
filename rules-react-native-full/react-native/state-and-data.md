# State and Data Fetching Rule

## Hard Rules

1. **Keep state as local as possible.** Lift only when siblings need it; use context or the project's adopted store only for truly shared state.
2. **Separate server state from UI state.** Remote data lives in a data-fetching/cache layer such as TanStack Query (loading, error, refetch, caching, invalidation) — do not hand-roll `useState`+`useEffect` fetching in every screen.
3. **Every remote-data view handles four states:** loading, error (with retry), empty, success.
4. **Validate external data at the boundary** (API responses, deep links, storage reads) with a `zod` schema and convert to app types. Never trust `JSON.parse` output (`unknown` → validated type).
5. **Use optimistic updates only with rollback on failure.**
6. **Cancel or ignore stale requests** when inputs change or the screen unmounts.
7. **Persist only what must survive restarts,** version the persisted shape, and handle migration or corrupted data gracefully.
8. **Forms:** use a form library or a dedicated hook; validate with a schema; disable submit while submitting; never let a double-tap submit twice.

## Why

Treating server state and UI state differently removes most loading/caching bugs and duplicated fetch code, and boundary validation turns silent crashes from malformed responses into handled errors.
