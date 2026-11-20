# Proxy Pattern Rule

**Category:** Structural

Provide a surrogate or placeholder for another object to control access to it.

## When to Use

- Remote proxy: represent an object in another address space (HTTP/gRPC client behind the interface).
- Virtual proxy: defer creation of an expensive object until it is needed (lazy loading).
- Protection proxy: check caller permissions before delegating.
- Smart reference: add housekeeping on access (rate limiting, reference counting, copy-on-write).

## When NOT to Use

- Direct access is already fast, safe and local.
- The goal is to add responsibilities — that is Decorator.
- The indirection would hide real costs (network trips, lazy initialization) from callers; make them visible in the type or name (`suspend`, `Flow`, `Remote*`).

## Hard Rules

1. **Apply Proxy only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** Kotlin property delegates (`by lazy`) are virtual proxies; a Retrofit interface is a remote proxy generated for you. Write a proxy by hand only for protection or smart-reference concerns.

```kotlin
// ✅ Correct — protection proxy: same interface, access checked in one place
class AuthorizedDocumentRepository(
    private val delegate: DocumentRepository,
    private val session: Session,
) : DocumentRepository {
    override suspend fun delete(id: String) {
        check(session.canDelete) { "User is not allowed to delete documents" }
        delegate.delete(id)
    }
}

// ✅ Correct — virtual proxy: the expensive object is created on first use
private val database by lazy { Room.databaseBuilder(context, AppDatabase::class.java, DB_NAME).build() }

// ❌ Wrong — every caller repeats the permission check before calling delete
```

## Related Patterns

- Adapter (different interface)
- Decorator (adds behavior, composes recursively)

## Why

Patterns buy flexibility with indirection. Use Proxy when the flexibility it provides is actually needed today — not "just in case".
