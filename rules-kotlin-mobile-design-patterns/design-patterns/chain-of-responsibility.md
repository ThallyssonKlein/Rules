# Chain of Responsibility Pattern Rule

**Category:** Behavioral

Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle it.

## When to Use

- More than one object may handle a request and the handler is not known in advance.
- You want to issue a request to one of several objects without naming the receiver.
- The set of handlers should be specified dynamically (middleware pipelines, validation, approval flows).

## When NOT to Use

- Every request must be handled: nothing guarantees receipt, a request can fall off the end of the chain.
- The order is fixed and known — a plain sequence of function calls is clearer.
- Debugging flow across many handlers would outweigh the decoupling.

## Hard Rules

1. **Apply Chain of Responsibility only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** On Android this is the OkHttp `Interceptor` chain (auth, retry, logging) — use it instead of building your own pipeline.

```kotlin
// ✅ Correct — each interceptor handles one concern and passes the request on
class AuthInterceptor(private val tokenProvider: TokenProvider) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request().newBuilder()
            .header(AUTHORIZATION_HEADER, "Bearer ${tokenProvider.token()}")
            .build()
        return chain.proceed(request)
    }
}

val client = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenProvider))
    .addInterceptor(RetryInterceptor())
    .addInterceptor(LoggingInterceptor())
    .build()

// ❌ Wrong — one giant function with nested if/else for auth, retry and logging
fun send(request: Request): Response {
    if (needsAuth(request)) { /* ... */ } else { /* ... */ }
}
```

## Related Patterns

- Composite (parent links as successor chain)
- Command (requests as objects)
- Template Method (decide to handle or forward)

## Why

Patterns buy flexibility with indirection. Use Chain of Responsibility when the flexibility it provides is actually needed today — not "just in case".
