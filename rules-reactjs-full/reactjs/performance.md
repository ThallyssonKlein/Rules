# Performance Rule

## Hard Rules

1. **Measure before optimizing.** Use the React Profiler, browser performance panel, and Lighthouse/Web Vitals. Do not add `memo`/`useMemo`/`useCallback` without a measured or obvious reason (see `components.md`).
2. **Code-split by route** with `React.lazy` + `Suspense` (or the framework's equivalent). Lazy-load heavy, below-the-fold, or rarely used components (charts, editors, maps).
3. **Keep the initial bundle small.** Import named members from libraries that tree-shake; never import a whole library for one function. Review the bundle analyzer output when adding a dependency.
4. **Virtualize long lists** (hundreds of rows or more) with a windowing library; paginate or infinite-scroll server data.
5. **Optimize images:** modern formats (`webp`/`avif`), explicit `width`/`height`, `loading="lazy"` below the fold, `srcset`/`sizes` for responsive images, and eager/high-priority only for the LCP image.
6. **Avoid expensive work during render.** Move heavy computation to `useMemo`, a Web Worker, or the server. Debounce/throttle input-driven work (`useDeferredValue`/`useTransition` for non-urgent updates).
7. **Do not read layout in loops** (`getBoundingClientRect`, `offsetHeight`) interleaved with DOM writes.
8. **Stable references for context and store selectors.** Select the smallest slice of state a component needs; never subscribe a whole tree to a large object.
9. **Preconnect/prefetch deliberately** (fonts, API origin, next-route data); self-host or `font-display: swap` web fonts.
10. **Track Core Web Vitals** (LCP, INP, CLS) in production and treat regressions as bugs.

## Why

Web performance is bundle size, network, and main-thread time. Splitting, virtualization, and slim subscriptions fix the vast majority of real-world slowness without micro-optimizing renders.
