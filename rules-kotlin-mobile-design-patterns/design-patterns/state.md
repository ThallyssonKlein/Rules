# State Pattern Rule

**Category:** Behavioral

Allow an object to alter its behavior when its internal state changes.

## When to Use

- Behavior depends on state and must change at run time.
- Operations contain large multipart conditionals that depend on the object's state.

## When NOT to Use

- There are two or three states and a few transitions — a `sealed interface` plus an exhaustive `when` is simpler.
- Fixed transitions: a transition table is enough, though less flexible for arbitrary actions.
- State classes would multiply with little behavior in each.

## Hard Rules

1. **Apply State only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** Prefer a `sealed interface` plus an exhaustive `when` over a class per state. Model screen status explicitly (idle/loading/success/error) in the UI state.

```kotlin
// ✅ Correct — explicit states as a sealed interface; user-facing text comes from resources
sealed interface UploadState {
    data object Idle : UploadState
    data class Uploading(val progress: Int) : UploadState
    data class Done(val url: String) : UploadState
    data class Failed(val reason: UploadError) : UploadState
}

@Composable
fun UploadLabel(state: UploadState) {
    val label = when (state) {
        UploadState.Idle -> stringResource(R.string.upload_ready)
        is UploadState.Uploading -> stringResource(R.string.upload_progress, state.progress)
        is UploadState.Done -> stringResource(R.string.upload_done)
        is UploadState.Failed -> stringResource(state.reason.messageRes)
    }
    Text(label)
}

// ❌ Wrong — separate booleans (isLoading, isError, isDone) that can contradict each other
```

## Related Patterns

- Flyweight (share stateless State objects)
- Singleton (State objects are often single instances)

## Why

Patterns buy flexibility with indirection. Use State when the flexibility it provides is actually needed today — not "just in case".
