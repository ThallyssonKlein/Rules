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

## React Example

**React note:** In React state, immutable snapshots make Memento cheap: keep previous state values (undo stack) instead of building originator/caretaker classes.

```tsx
// ✅ Correct — immutable snapshots as history
function useUndo<T>(initial: T) {
  const [history, setHistory] = useState<T[]>([initial]);
  const current = history[history.length - 1];
  const push = (next: T) => setHistory((previous) => [...previous, next]);
  const undo = () => setHistory((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
  return { current, push, undo };
}

// ❌ Wrong — mutating state in place and trying to "restore" it later
```

## Related Patterns

- Command (uses mementos for undo)
- Iterator (iteration state)

## Why

Patterns buy flexibility with indirection. Use Memento when the flexibility it provides is actually needed today — not "just in case".
