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

## React Native Example

**React Native note:** In React, prefer composition (props, children, hooks, render props) over class inheritance with overridable steps.

```tsx
// ✅ Correct — fixed algorithm, variable steps injected as functions
interface ScreenSteps<T> { load(): Promise<T>; render(data: T): ReactElement }

function DataScreen<T>({ load, render }: ScreenSteps<T>) {
  const { data, isLoading } = useAsync(load);
  if (isLoading || !data) return <LoadingView />;
  return render(data);
}

// ❌ Wrong — an abstract BaseScreen class with many overridable lifecycle hooks
```

## Related Patterns

- Factory Method (often called inside template methods)
- Strategy (delegation to vary the whole algorithm)

## Why

Patterns buy flexibility with indirection. Use Template Method when the flexibility it provides is actually needed today — not "just in case".
