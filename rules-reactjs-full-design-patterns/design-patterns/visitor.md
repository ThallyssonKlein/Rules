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

## React Example

**React note:** A discriminated union + exhaustive `switch` replaces Visitor in TypeScript; use it for heterogeneous node trees (e.g. CMS / server-driven content blocks).

```tsx
// ✅ Correct — exhaustive switch over a closed union
type Block =
  | { type: 'text'; value: string }
  | { type: 'image'; src: string };

function renderBlock(block: Block): ReactElement {
  switch (block.type) {
    case 'text': return <p>{block.value}</p>;
    case 'image': return <img src={block.src} alt="" />;
  }
}

// ❌ Wrong — accept(visitor)/visitText/visitImage boilerplate when the union is closed
```

## Related Patterns

- Composite (visitors traverse composites)
- Interpreter (evaluate ASTs)

## Why

Patterns buy flexibility with indirection. Use Visitor when the flexibility it provides is actually needed today — not "just in case".
