# Security Rule

## Hard Rules

1. **Never use `dangerouslySetInnerHTML`** with unsanitized content. When unavoidable, sanitize with DOMPurify (or equivalent) immediately before rendering and document why.
2. **Never build URLs, HTML, or `eval`/`new Function` from user input.** Validate `href`/`src` values: allow only `http(s):`, `mailto:`, and `tel:` — block `javascript:` and `data:` URLs.
3. **Do not store tokens or secrets in `localStorage`/`sessionStorage`.** Prefer `HttpOnly`, `Secure`, `SameSite` cookies set by the server. Keep access tokens in memory when cookies are not an option.
4. **Frontend env vars are public.** Never put API secrets, private keys, or credentials in `VITE_*` / `NEXT_PUBLIC_*` / `REACT_APP_*` variables or in the bundle.
5. **Send CSRF protection** (SameSite cookies + anti-CSRF token or custom header) on state-changing requests when using cookie auth.
6. **Configure a Content Security Policy** and avoid inline scripts/styles that force `unsafe-inline`.
7. **Validate and sanitize all external input at the boundary** (see `state-and-data.md`), including `postMessage` (check `event.origin`) and URL params.
8. **Keep dependencies audited:** run `npm audit` in CI, pin via `package-lock.json` (`npm ci`), and review new packages before adding them.
9. **Do not log or track PII, tokens, or full request bodies** (see `logs-and-metrics.md`).
10. **Authorization is enforced on the server.** Hiding a button or route is never access control.

```tsx
// ❌ Wrong
<div dangerouslySetInnerHTML={{ __html: comment.body }} />
<a href={user.website}>Site</a>

// ✅ Correct
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />
<a href={toSafeUrl(user.website)} rel="noopener noreferrer">Site</a>
```

## Why

The browser is an untrusted environment: anything shipped to or read from it can be inspected or injected. XSS and token theft are the dominant frontend vulnerabilities and are prevented by default-safe rendering and server-side enforcement.
