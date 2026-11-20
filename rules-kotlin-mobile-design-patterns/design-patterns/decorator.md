# Decorator Pattern Rule

**Category:** Structural

Attach additional responsibilities to an object dynamically, as a flexible alternative to subclassing.

## When to Use

- You add responsibilities to individual objects dynamically and transparently, without affecting other objects.
- Responsibilities can be added or withdrawn at composition time (logging, caching, retry, metrics, auth).
- Extension by subclassing would cause a subclass explosion for every combination of features.

## When NOT to Use

- Code relies on object identity — a decorated object is not the same as the component.
- The component is heavyweight; prefer changing its guts with Strategy.
- The result is many small, look-alike objects that are hard to debug: keep chains short and name each decorator after its single concern.
- A single call site needs the extra behavior — a plain function call is simpler.

## Hard Rules

1. **Apply Decorator only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** Kotlin class delegation (`by`) removes the boilerplate: override only what the decorator changes. In Compose, the `Modifier` chain is the decorator.

```kotlin
// ✅ Correct — one concern per decorator, composed at the DI module
class LoggingUserRepository(
    private val delegate: UserRepository,
) : UserRepository by delegate {
    override suspend fun findById(id: String): User? {
        Timber.i("[LoggingUserRepository] findById id=%s", id)
        return delegate.findById(id)
    }
}

val repository: UserRepository = LoggingUserRepository(CachedUserRepository(RemoteUserRepository(api)))

// ❌ Wrong — one subclass per combination of features
class CachedLoggingRemoteUserRepository : RemoteUserRepository()
```

## Related Patterns

- Adapter (changes the interface)
- Proxy (controls access, static 1-to-1)
- Strategy (changes the guts, Decorator changes the skin)
- Composite (degenerate composite with one child)

## Why

Patterns buy flexibility with indirection. Use Decorator when the flexibility it provides is actually needed today — not "just in case".
