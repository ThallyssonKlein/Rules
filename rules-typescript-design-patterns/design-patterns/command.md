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

## TypeScript Example

```typescript
// ✅ Correct — undoable command with a history stack
interface Command { execute(): void; undo(): void; }

class RenameFileCommand implements Command {
  constructor(private readonly file: FileNode, private readonly newName: string, private previousName = file.name) {}
  execute(): void { this.file.name = this.newName; }
  undo(): void { this.file.name = this.previousName; }
}

// ❌ Wrong — Command class around a one-line function call with no queue or undo
```

## Related Patterns

- Composite (macro commands)
- Memento (state needed to undo)
- Prototype (copy commands into history)

## Why

Patterns buy flexibility with indirection. Use Command when the flexibility it provides is actually needed today — not "just in case".
