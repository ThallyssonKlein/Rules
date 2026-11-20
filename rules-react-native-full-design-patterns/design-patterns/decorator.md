# Decorator Pattern Rule

**Category:** Structural

Attach additional responsibilities to an object dynamically, as a flexible alternative to subclassing.

## When to Use

- You add responsibilities to individual objects dynamically and transparently, without affecting other objects.
- Responsibilities can be added or withdrawn at composition time (logging, caching, retry, metrics, auth).
- Extension by subclassing would cause a subclass explosion for every combination of features.

## When NOT to Use

- Code relies on object identity — a decorated object is not the same as the component.
- The component is heavyweight; prefer changing its guts with Strategy.
- The result is many small, look-alike objects that are hard to debug: keep chains short and name each decorator after its single concern.
- A single call site needs the extra behavior — a plain function call is simpler.

## Hard Rules

1. **Apply Decorator only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Native Example

**React Native note:** In RN, custom hooks and wrapper components replace most decorators; avoid HOC chains that obscure props and hurt debugging.

```tsx
// ✅ Correct — same interface, added behavior (caching) wrapped around a service
class CachedProductService implements ProductService {
  private readonly cache = new Map<string, Product>();
  constructor(private readonly inner: ProductService) {}
  async getById(id: string): Promise<Product> {
    const cached = this.cache.get(id);
    if (cached) return cached;
    const product = await this.inner.getById(id);
    this.cache.set(id, product);
    return product;
  }
}

// ❌ Wrong — a deep withA(withB(withC(Component))) HOC stack just to share one hook
```

## Related Patterns

- Adapter (changes the interface)
- Proxy (controls access, static 1-to-1)
- Strategy (changes the guts, Decorator changes the skin)
- Composite (degenerate composite with one child)

## Why

Patterns buy flexibility with indirection. Use Decorator when the flexibility it provides is actually needed today — not "just in case".
