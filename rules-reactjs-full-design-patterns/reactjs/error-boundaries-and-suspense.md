# Error Boundaries and Loading States Rule

## Hard Rules

1. **Wrap the app root and every route in an `ErrorBoundary`** with a friendly fallback and a retry/reload action. Add boundaries around independent widgets so one failure does not blank the page.
2. **Error boundaries report to the crash-reporting tool and the logger** (see `logs-and-metrics.md`). They never swallow errors silently.
3. **Boundaries catch render errors only.** Errors in event handlers and async code are handled with `try/catch` at the boundary of the handler (see `error-handling.md`).
4. **Use `Suspense` with meaningful fallbacks** (skeletons matching the final layout) for lazy components and suspense-enabled data; avoid a single full-page spinner.
5. **Place `Suspense` boundaries deliberately,** around the smallest region that can load independently, to avoid waterfalls and layout shifts.
6. **Fallbacks are accessible:** loading regions use `aria-busy`/`role="status"`; error fallbacks use `role="alert"`.
7. **Never show stack traces or raw error messages** to users.

## Why

Without boundaries one thrown render error unmounts the entire React tree into a white page. Granular boundaries and skeletons keep the app usable and the experience stable during failures and loading.
