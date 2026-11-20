# Builder Pattern Rule

**Category:** Creational

Separate the construction of a complex object from its representation so the same construction process can create different representations.

## When to Use

- The algorithm for creating a complex object must be independent of the parts and how they are assembled.
- The construction process must allow different representations of the object being built.
- Construction is multi-step, with optional parts, ordering rules or validation before the final object exists.

## When NOT to Use

- The object can be built in one shot — use a constructor or an options object (`{ a, b, c }`).
- There are only a few optional fields — TypeScript optional properties and defaults already solve this.
- The products share no structure, so the builder adds classes without adding clarity.

## Hard Rules

1. **Apply Builder only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Native Example

**React Native note:** In TypeScript, an options object with defaults (typed params object) replaces most builders — e.g. navigation or request options.

```tsx
// ✅ Correct — typed options object with defaults
interface RequestOptions { method?: 'GET' | 'POST'; headers?: Record<string, string>; timeoutInMs?: number }

function request(url: string, { method = 'GET', headers = {}, timeoutInMs = 10_000 }: RequestOptions = {}): Promise<Response> {
  return fetch(url, { method, headers, signal: AbortSignal.timeout(timeoutInMs) });
}

// ❌ Wrong — a fluent builder for a 3-field object: new RequestBuilder(url).method('GET').timeout(10_000).build()
```

## Related Patterns

- Abstract Factory (families in one shot vs. step-by-step construction)
- Composite (Builder often assembles trees)

## Why

Patterns buy flexibility with indirection. Use Builder when the flexibility it provides is actually needed today — not "just in case".
