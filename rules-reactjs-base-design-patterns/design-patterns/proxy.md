# Proxy Pattern Rule

**Category:** Structural

Provide a surrogate or placeholder for another object to control access to it.

## When to Use

- Remote proxy: represent an object in another address space (HTTP/gRPC client behind the interface).
- Virtual proxy: defer creation of an expensive object until it is needed (lazy loading).
- Protection proxy: check caller permissions before delegating.
- Smart reference: add housekeeping on access (rate limiting, reference counting, copy-on-write).

## When NOT to Use

- Direct access is already fast, safe and local.
- The goal is to add responsibilities — that is Decorator.
- The indirection would hide real costs (network trips, lazy initialization) from callers; make them visible in the type or name (`Promise`, `Remote*`).

## Hard Rules

1. **Apply Proxy only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Example

**React note:** Typical React uses: lazy loading (`React.lazy`/lazy images), caching or access checks in front of a service. Same interface as the real subject.

```tsx
// ✅ Correct — virtual proxy defers expensive creation until first use
class LazyAnalytics implements Analytics {
  private instance?: Analytics;
  track(event: string): void {
    this.instance ??= createAnalytics();
    this.instance.track(event);
  }
}

// ❌ Wrong — a proxy that changes the subject's interface or hides slow work without a reason
```

## Related Patterns

- Adapter (different interface)
- Decorator (adds behavior, composes recursively)

## Why

Patterns buy flexibility with indirection. Use Proxy when the flexibility it provides is actually needed today — not "just in case".
