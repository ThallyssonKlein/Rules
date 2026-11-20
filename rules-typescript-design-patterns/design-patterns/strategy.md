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

## TypeScript Example

```typescript
// ✅ Correct — the strategy is just a function type
type DiscountStrategy = (subtotalInCents: number) => number;

const noDiscount: DiscountStrategy = () => 0;
const tenPercent: DiscountStrategy = (subtotal) => Math.round(subtotal * 0.1);

function total(subtotalInCents: number, discount: DiscountStrategy): number {
  return subtotalInCents - discount(subtotalInCents);
}

// ❌ Wrong — if/else chain on a string "type" inside the class, or one class per trivial lambda
```

## Related Patterns

- Template Method (inheritance vs. delegation)
- Flyweight (stateless strategies can be shared)
- Decorator (skin vs. guts)

## Why

Patterns buy flexibility with indirection. Use Strategy when the flexibility it provides is actually needed today — not "just in case".
