# Builder Pattern Rule

**Category:** Creational

Separate the construction of a complex object from its representation so the same construction process can create different representations.

## When to Use

- The algorithm for creating a complex object must be independent of the parts and how they are assembled.
- The construction process must allow different representations of the object being built.
- Construction is multi-step, with optional parts, ordering rules or validation before the final object exists.

## When NOT to Use

- The object can be built in one shot — use a constructor with named arguments.
- There are only a few optional fields — Kotlin default and named arguments (plus `data class` + `copy`) already solve this.
- The products share no structure, so the builder adds classes without adding clarity.

## Hard Rules

1. **Apply Builder only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** In Kotlin, named arguments with default values (and `data class` + `copy`) replace most builders. When the Android SDK imposes a builder (`NotificationCompat.Builder`, `OkHttpClient.Builder`, `Room.databaseBuilder`), use it as-is — do not wrap it again.

```kotlin
// ✅ Correct — named arguments with defaults
data class RequestOptions(
    val method: HttpMethod = HttpMethod.GET,
    val headers: Map<String, String> = emptyMap(),
    val timeoutInMs: Long = DEFAULT_TIMEOUT_IN_MS,
)

suspend fun request(url: String, options: RequestOptions = RequestOptions()): Response =
    client.execute(url, options)

request(url, RequestOptions(timeoutInMs = LONG_TIMEOUT_IN_MS))

// ❌ Wrong — a hand-written fluent builder for a 3-field object
RequestBuilder(url).method(HttpMethod.GET).timeout(DEFAULT_TIMEOUT_IN_MS).build()
```

## Related Patterns

- Abstract Factory (families in one shot vs. step-by-step construction)
- Composite (Builder often assembles trees)

## Why

Patterns buy flexibility with indirection. Use Builder when the flexibility it provides is actually needed today — not "just in case".
