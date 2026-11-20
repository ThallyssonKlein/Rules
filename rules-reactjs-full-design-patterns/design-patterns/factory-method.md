# Factory Method Pattern Rule

**Category:** Creational

Define an interface for creating an object, but let subclasses decide which class to instantiate.

## When to Use

- A class cannot anticipate the class of the objects it must create.
- A class wants its subclasses to specify the objects it creates.
- You want to localize the knowledge of which helper class is the delegate.

## When NOT to Use

- You would subclass the creator only to change which class is instantiated — prefer a plain factory function or a registry (`Record<Kind, () => Product>`).
- Only one concrete product exists and none is planned.
- Calling the factory method inside the creator's constructor: the subclass override is not ready yet; create lazily instead.

## Hard Rules

1. **Apply Factory Method only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Example

**React note:** A plain function that returns the right implementation (or component) is the preferred form.

```tsx
// ✅ Correct — a function decides which implementation to create
function createStorage(env: AppEnv): StorageDriver {
  return env.isTest ? new InMemoryStorage() : new LocalStorageDriver();
}

// ❌ Wrong — `new LocalStorageDriver()` hard-coded in every service, or an abstract creator class for one product
```

## Related Patterns

- Abstract Factory (often implemented with factory methods)
- Template Method (factory methods are usually called inside template methods)
- Prototype (avoids factory subclass hierarchies)

## Why

Patterns buy flexibility with indirection. Use Factory Method when the flexibility it provides is actually needed today — not "just in case".
