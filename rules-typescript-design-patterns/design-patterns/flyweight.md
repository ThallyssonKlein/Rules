# Flyweight Pattern Rule

**Category:** Structural

Use sharing to support large numbers of fine-grained objects efficiently.

## When to Use

- The application creates a huge number of objects and storage cost is high.
- Most object state can be made extrinsic (passed in by the caller).
- Groups of objects can be replaced by few shared instances once extrinsic state is removed.
- The application does not depend on object identity.

## When NOT to Use

- The object count is small — measure first; the pattern adds complexity and run-time cost for looking up or passing extrinsic state.
- Objects have mostly unique, non-shareable state.
- Identity checks (`===`) matter to the logic.
- Shared instances are mutable — they must be immutable (`readonly`).

## Hard Rules

1. **Apply Flyweight only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — immutable shared instances behind a factory; extrinsic state passed in
class GlyphStyle { constructor(readonly font: string, readonly size: number) {} }

class GlyphStyleFactory {
  private readonly pool = new Map<string, GlyphStyle>();
  get(font: string, size: number): GlyphStyle {
    const key = `${font}:${size}`;
    const existing = this.pool.get(key);
    if (existing) return existing;

    const created = new GlyphStyle(font, size);
    this.pool.set(key, created);
    return created;
  }
}

// ❌ Wrong — flyweight for a few dozen objects, "just in case"
```

## Related Patterns

- Composite (shared leaves in a DAG)
- State and Strategy (stateless instances can be flyweights)

## Why

Patterns buy flexibility with indirection. Use Flyweight when the flexibility it provides is actually needed today — not "just in case".
