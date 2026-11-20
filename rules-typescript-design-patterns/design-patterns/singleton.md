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

## TypeScript Example

```typescript
// ✅ Correct — "singleton" by lifetime: one instance created at the composition root and injected
const pool = new PgPool(config.database);
const userRepository = new PgUserRepository(pool);
const createUser = new CreateUserUseCase(userRepository);

// ❌ Wrong — global access point hides the dependency and blocks test isolation
class Database {
  private static instance?: Database;
  static getInstance(): Database { return (this.instance ??= new Database()); }
}
class CreateUserUseCase { run() { Database.getInstance().insert(/* ... */); } }
```

## Related Patterns

- Abstract Factory, Builder, Prototype (their managers are often singletons)
- Facade and State (often singletons)

## Why

Patterns buy flexibility with indirection. Use Singleton when the flexibility it provides is actually needed today — not "just in case".
