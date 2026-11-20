# Singleton Pattern Rule

**Category:** Creational

Ensure a class has only one instance and provide a global point of access to it.

## When to Use

- There must be exactly one instance and clients need a well-known access point (e.g. a connection pool, a configuration registry).
- The sole instance should be extensible by subclassing without changing client code.

## When NOT to Use

- Almost always in application code: it introduces global state, hides dependencies and makes tests hard to isolate.
- The dependency can be injected instead — create the object once in the DI module (Hilt `@Singleton`, Koin `single`) and pass it in; avoid `object` holding state or a `Context`.
- You might need more than one instance later (per tenant, per test).

## Hard Rules

1. **Apply Singleton only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** A Kotlin `object` is a language-level singleton, but it is global state. Create one instance in the DI module (Hilt `@Singleton`, Koin `single`) and inject it; never keep a `Context` in an `object`.

```kotlin
// ✅ Correct — one instance created and scoped by the DI container, injected where needed
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient = OkHttpClient.Builder().build()
}

class ProfileRepository @Inject constructor(private val client: OkHttpClient)

// ❌ Wrong — a global object holding a Context (memory leak) that is reached from anywhere
object ApiClient {
    lateinit var context: Context
    fun get(): OkHttpClient = /* ... */
}
```

## Related Patterns

- Abstract Factory, Builder, Prototype (their managers are often singletons)
- Facade and State (often singletons)

## Why

Patterns buy flexibility with indirection. Use Singleton when the flexibility it provides is actually needed today — not "just in case".
