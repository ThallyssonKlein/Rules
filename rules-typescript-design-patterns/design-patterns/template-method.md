# Template Method Pattern Rule

**Category:** Behavioral

Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.

## When to Use

- Implement the invariant parts of an algorithm once and let subclasses supply the variable parts.
- Common behavior among subclasses should be factored out to avoid duplication.
- You want to control extension points with hook operations.

## When NOT to Use

- The variation can be a function passed in — use Strategy and favor composition over inheritance.
- Control flow becomes hard to trace (Hollywood principle) and subclass authors cannot tell mandatory steps from optional hooks.
- Subclasses override most steps: the skeleton adds no value.

## Hard Rules

1. **Apply Template Method only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — fixed skeleton, mandatory steps abstract, optional steps as hooks
abstract class DataImporter {
  async run(): Promise<void> {
    const raw = await this.read();
    const rows = this.parse(raw);
    await this.save(this.transform(rows));
  }
  protected abstract read(): Promise<string>;
  protected abstract parse(raw: string): Row[];
  protected abstract save(rows: Row[]): Promise<void>;
  protected transform(rows: Row[]): Row[] { return rows; } // hook
}

// ❌ Wrong — deep inheritance chains where each level overrides the template
```

## Related Patterns

- Factory Method (often called inside template methods)
- Strategy (delegation to vary the whole algorithm)

## Why

Patterns buy flexibility with indirection. Use Template Method when the flexibility it provides is actually needed today — not "just in case".
