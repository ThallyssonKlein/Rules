# Routing and Navigation Rule

## Hard Rules

1. **Use the project's router for all navigation.** Internal links use the router's `<Link>`; never `<a href>` for in-app routes and never `window.location` assignments (except deliberate full reloads/external URLs).
2. **Define routes in one typed place** with path builders (`routes.order(id)`); no string-concatenated URLs scattered in components.
3. **Routes are lazy-loaded and have an error element and a not-found route.** Every route tree has a catch-all 404.
4. **Read params through typed, validated helpers** (`zod`) — URL params are untrusted strings.
5. **Guard private routes at the router level** (loader/layout/guard component), redirect with `replace`, and preserve the intended destination for post-login redirect. Client guards are UX only; the server must enforce authorization.
6. **Update `document.title` (and meta tags) per route,** and move focus/announce on route change (see `accessibility.md`).
7. **Preserve scroll and state expectations:** restore scroll on back/forward, reset on forward navigation.
8. **External links use `rel="noopener noreferrer"`** with `target="_blank"` and are validated against open redirects when the target comes from user input.
9. **Fetch route data in route loaders (or the data layer) before render** to avoid request waterfalls; prefetch on intent (hover/focus) where it pays off.

## Why

A single typed route map and router-level guards prevent broken links, open redirects, and inconsistent loading behavior, and keep navigation accessible and shareable.
