# Singleton Pattern Rule

**Category:** Creational

Ensure a class has only one instance and provide a global point of access to it.

## When to Use

- There must be exactly one instance and clients need a well-known access point (e.g. a connection pool, a configuration registry).
- The sole instance should be extensible by subclassing without changing client code.

## When NOT to Use

- Almost always in application code: it introduces global state, hides dependencies and makes tests hard to isolate.
- The dependency can be injected instead — create the object once at the composition root and pass it in.
- You might need more than one instance later (per tenant, per test).

## Hard Rules

1. **Apply Singleton only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Example

**React note:** In React, a module-scoped instance created once at app startup and provided through context or passed in is "singleton by lifetime". Avoid `getInstance()` globals.

```tsx
// ✅ Correct — one instance created at the composition root and provided
const apiClient = new ApiClient(config.baseUrl);
export function App() {
  return <ApiClientContext.Provider value={apiClient}><RouterProvider router={router} /></ApiClientContext.Provider>;
}

// ❌ Wrong — global access point imported everywhere, impossible to replace in tests
class ApiClient {
  private static instance?: ApiClient;
  static getInstance(): ApiClient { return (this.instance ??= new ApiClient()); }
}
```

## Related Patterns

- Abstract Factory, Builder, Prototype (their managers are often singletons)
- Facade and State (often singletons)

## Why

Patterns buy flexibility with indirection. Use Singleton when the flexibility it provides is actually needed today — not "just in case".
