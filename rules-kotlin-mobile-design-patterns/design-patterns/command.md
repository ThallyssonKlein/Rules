# Command Pattern Rule

**Category:** Behavioral

Encapsulate a request as an object, letting you parameterize clients, queue or log requests, and support undoable operations.

## When to Use

- You need an object-oriented replacement for callbacks.
- Requests must be queued, scheduled, logged or executed at a different time.
- You must support undo/redo or transactional behavior.

## When NOT to Use

- The action is simple, parameterless and not undoable — call a function.
- Undo is implemented by re-running inverse operations that can drift: store mementos or full state instead.
- A use case class already is the command; do not wrap it again.

## Hard Rules

1. **Apply Command only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** In Kotlin, a `sealed interface` of actions handled by the ViewModel (MVI intents) is a command; use it for undo/redo, analytics or offline queues (WorkManager for deferrable, persistent work).

```kotlin
// ✅ Correct — commands as plain data, executed by a single handler
sealed interface CartCommand {
    data class AddItem(val itemId: String) : CartCommand
    data class RemoveItem(val itemId: String) : CartCommand
}

class CartViewModel(private val repository: CartRepository) : ViewModel() {
    fun onCommand(command: CartCommand) {
        viewModelScope.launch {
            when (command) {
                is CartCommand.AddItem -> repository.add(command.itemId)
                is CartCommand.RemoveItem -> repository.remove(command.itemId)
            }
        }
    }
}

// ❌ Wrong — a Command class hierarchy with execute()/undo() for a one-line, non-undoable action
abstract class BaseCommand { abstract fun execute(); abstract fun undo() }
```

## Related Patterns

- Composite (macro commands)
- Memento (state needed to undo)
- Prototype (copy commands into history)

## Why

Patterns buy flexibility with indirection. Use Command when the flexibility it provides is actually needed today — not "just in case".
