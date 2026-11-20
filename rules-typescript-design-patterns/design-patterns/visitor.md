# Visitor Pattern Rule

**Category:** Behavioral

Represent an operation to be performed on the elements of an object structure without changing their classes.

## When to Use

- An object structure has many classes with different interfaces and operations depend on the concrete class.
- Many unrelated operations must be performed over the structure without polluting element classes.
- The element hierarchy is stable but new operations are added often.

## When NOT to Use

- The element hierarchy changes often: each new element forces a change in the visitor interface and every concrete visitor.
- It forces elements to expose internals so visitors can work, breaking encapsulation.
- In TypeScript a discriminated union with an exhaustive `switch` replaces most visitors with less ceremony.

## Hard Rules

1. **Apply Visitor only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — discriminated union + exhaustive switch (no accept/visit boilerplate)
type Shape = { kind: 'circle'; radius: number } | { kind: 'rect'; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rect': return shape.width * shape.height;
    default: { const unreachable: never = shape; return unreachable; }
  }
}

// ✅ Use the classic Visitor only when elements are classes you cannot restructure
// ❌ Wrong — Visitor over a hierarchy that gains a new element every sprint
```

## Related Patterns

- Composite (visitors traverse composites)
- Interpreter (evaluate ASTs)

## Why

Patterns buy flexibility with indirection. Use Visitor when the flexibility it provides is actually needed today — not "just in case".
