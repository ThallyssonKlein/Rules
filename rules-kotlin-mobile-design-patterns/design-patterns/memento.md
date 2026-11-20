# Memento Pattern Rule

**Category:** Behavioral

Without violating encapsulation, capture and externalize an object's internal state so it can be restored later.

## When to Use

- A snapshot of an object's state must be saved to restore it later (undo, drafts, checkpoints).
- A direct interface to the state would expose implementation details and break encapsulation.

## When NOT to Use

- State is large or snapshots are frequent: memory and copy costs add up, and the caretaker cannot see what it is storing.
- State is already an immutable value — keep the previous value; no memento class is needed.
- State is persisted in a database — use versioning or event sourcing.

## Hard Rules

1. **Apply Memento only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** An immutable `data class` is the memento. For process death, `SavedStateHandle` and `rememberSaveable` already snapshot and restore UI state — do not build your own.

```kotlin
// ✅ Correct — immutable snapshots of the editor state are kept for undo
data class EditorState(val text: String = "", val cursor: Int = 0)

class EditorViewModel : ViewModel() {
    private val _state = MutableStateFlow(EditorState())
    val state: StateFlow<EditorState> = _state.asStateFlow()
    private val history = ArrayDeque<EditorState>()

    fun onTextChanged(text: String) {
        if (history.size == MAX_HISTORY_SIZE) history.removeFirst()
        history.addLast(_state.value)
        _state.update { it.copy(text = text) }
    }

    fun onUndo() {
        history.removeLastOrNull()?.let { previous -> _state.value = previous }
    }

    private companion object {
        const val MAX_HISTORY_SIZE = 50
    }
}

// ❌ Wrong — undo by re-running inverse operations that can drift, or exposing mutable internals as the snapshot
```

## Related Patterns

- Command (uses mementos for undo)
- Iterator (iteration state)

## Why

Patterns buy flexibility with indirection. Use Memento when the flexibility it provides is actually needed today — not "just in case".
