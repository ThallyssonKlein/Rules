# Interpreter Pattern Rule

**Category:** Behavioral

Given a language, define a representation for its grammar along with an interpreter that uses it to interpret sentences.

## When to Use

- The grammar is simple and can be represented as an abstract syntax tree.
- Efficiency is not critical (small rule DSLs, filter expressions, pricing rules).

## When NOT to Use

- The grammar is complex: the class hierarchy explodes — use a parser generator or a library.
- Performance matters: translate to bytecode or a state machine instead of walking trees.
- A JSON config or a discriminated union evaluated by a `switch` is enough.

## Hard Rules

1. **Apply Interpreter only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Example

**React note:** Rare in web apps. Prefer JSON/config + a small evaluator, or a library, over a class per grammar rule.

```tsx
// ✅ Correct — tiny grammar as a discriminated union + recursive evaluator
type Expression =
  | { kind: 'number'; value: number }
  | { kind: 'add'; left: Expression; right: Expression };

function evaluate(expression: Expression): number {
  switch (expression.kind) {
    case 'number': return expression.value;
    case 'add': return evaluate(expression.left) + evaluate(expression.right);
  }
}

// ❌ Wrong — hand-rolling a class hierarchy for a complex grammar instead of using a parser library
```

## Related Patterns

- Composite (the AST is a composite)
- Flyweight (share terminals)
- Visitor (separate evaluation from nodes)
- Iterator (traverse the tree)

## Why

Patterns buy flexibility with indirection. Use Interpreter when the flexibility it provides is actually needed today — not "just in case".
