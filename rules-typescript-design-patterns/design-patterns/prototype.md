# Prototype Pattern Rule

**Category:** Creational

Specify the kinds of objects to create using a prototypical instance, and create new objects by copying it.

## When to Use

- The classes to instantiate are specified at run time.
- You want to avoid a hierarchy of factories parallel to the product hierarchy.
- Instances have only a few combinations of state, so cloning pre-configured prototypes is easier than building them each time.

## When NOT to Use

- Objects are easily built by a constructor or factory — cloning adds friction.
- Objects hold circular references, handles, sockets or other non-copyable members: deep vs. shallow copy becomes error-prone.
- Plain data objects: use `structuredClone` or spread instead of a Prototype hierarchy.

## Hard Rules

1. **Apply Prototype only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — clone a pre-configured template
interface Cloneable<T> { clone(): T; }

class ReportTemplate implements Cloneable<ReportTemplate> {
  constructor(private readonly sections: readonly Section[], private readonly style: Style) {}
  clone(): ReportTemplate {
    return new ReportTemplate(this.sections.map((s) => s.clone()), { ...this.style });
  }
}

// ❌ Wrong — a Prototype class for plain data
const copy = structuredClone(config); // ✅ already enough
```

## Related Patterns

- Abstract Factory (competitor; prototypes can replace factory subclasses)
- Composite and Decorator (cloning whole trees)
- Singleton (prototype registries)

## Why

Patterns buy flexibility with indirection. Use Prototype when the flexibility it provides is actually needed today — not "just in case".
