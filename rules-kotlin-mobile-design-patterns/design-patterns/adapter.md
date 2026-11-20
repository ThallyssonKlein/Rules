# Adapter Pattern Rule

**Category:** Structural

Convert the interface of a class into another interface clients expect.

## When to Use

- You want to use an existing class (SDK, legacy module, third-party API) whose interface does not match the one you need.
- You want to create a reusable class that cooperates with unrelated or unforeseen classes.
- At an architectural boundary: wrap an external SDK behind a port so the domain never imports it.

## When NOT to Use

- You can change the original interface directly or a small refactor removes the mismatch.
- You only need to change responsibilities, not the interface — that is Decorator.
- The adaptee behavior must be overridden deeply: an object adapter makes this harder.

## Hard Rules

1. **Apply Adapter only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** Typical mobile use: map DTOs, SDK results and Android framework types to the domain model at the boundary — an extension function or mapper is the adapter.

```kotlin
// ✅ Correct — the adapter converts the API shape into the app's own type at the data boundary
@Serializable
data class UserDto(val id: String, @SerialName("full_name") val fullName: String?)

data class User(val id: String, val name: String)

fun UserDto.toDomain(): User = User(id = id, name = fullName.orEmpty())

// ❌ Wrong — the UI layer consumes the raw DTO and every screen re-maps it
Text(text = userDto.fullName ?: "")
```

## Related Patterns

- Bridge (similar structure, designed up-front)
- Decorator (same interface, new behavior)
- Proxy (same interface, controlled access)

## Why

Patterns buy flexibility with indirection. Use Adapter when the flexibility it provides is actually needed today — not "just in case".
