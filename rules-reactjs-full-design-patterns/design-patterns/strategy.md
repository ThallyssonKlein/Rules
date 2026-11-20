# Strategy Pattern Rule

**Category:** Behavioral

Define a family of algorithms, encapsulate each one, and make them interchangeable.

## When to Use

- Many related classes differ only in behavior.
- You need variants of an algorithm (pricing, sorting, routing, retry policy).
- An algorithm uses data that clients should not know about.
- A class has large conditionals that select among behaviors.

## When NOT to Use

- Only one algorithm exists or the variation is a single parameter.
- A function parameter suffices: in TypeScript prefer passing a function over a one-method class.
- Clients must understand the differences between strategies to choose; if they cannot, selection logic belongs elsewhere.
- It would add classes and context-to-strategy parameter passing that most strategies ignore.

## Hard Rules

1. **Apply Strategy only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Example

**React note:** In React, pass a function or a prop (e.g. `renderItem`, `onSort`, a `compare` function) instead of creating strategy classes.

```tsx
// ✅ Correct — the strategy is just a function type
type SortStrategy = (a: Product, b: Product) => number;

const byPrice: SortStrategy = (a, b) => a.priceInCents - b.priceInCents;
const byName: SortStrategy = (a, b) => a.name.localeCompare(b.name);

function useSortedProducts(products: Product[], strategy: SortStrategy): Product[] {
  return useMemo(() => [...products].sort(strategy), [products, strategy]);
}

// ❌ Wrong — an if/else chain on a string "sortType" inside the component, or one class per trivial comparator
```

## Related Patterns

- Template Method (inheritance vs. delegation)
- Flyweight (stateless strategies can be shared)
- Decorator (skin vs. guts)

## Why

Patterns buy flexibility with indirection. Use Strategy when the flexibility it provides is actually needed today — not "just in case".
