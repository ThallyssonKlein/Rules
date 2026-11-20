# Iterator Pattern Rule

**Category:** Behavioral

Provide a way to access the elements of an aggregate sequentially without exposing its underlying representation.

## When to Use

- You access an aggregate's contents without exposing its internal structure.
- You support multiple simultaneous traversals.
- You want a uniform interface for traversing different structures.

## When NOT to Use

- The language already provides it: use `for...of`, `Symbol.iterator`, generators and async iterators — do not hand-roll an Iterator class.
- The collection is a plain array and `map`/`filter`/`reduce` express the intent.
- Traversing a deep recursive structure with an external iterator needs explicit stack bookkeeping; a recursive generator is simpler.

## Hard Rules

1. **Apply Iterator only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Example

**React note:** Prefer built-in iteration, generators and array methods over custom iterator classes.

```tsx
// ✅ Correct — a generator exposes traversal without leaking structure
function* visibleItems(items: readonly Item[]): Generator<Item> {
  for (const item of items) {
    if (!item.isHidden) yield item;
  }
}

// ❌ Wrong — a custom Iterator class with `first()/next()/isDone()` over a plain array
```

## Related Patterns

- Composite (iterators traverse trees)
- Factory Method (polymorphic iterators)
- Memento (iteration state)

## Why

Patterns buy flexibility with indirection. Use Iterator when the flexibility it provides is actually needed today — not "just in case".
