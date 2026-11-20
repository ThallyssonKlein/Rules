# Observer Pattern Rule

**Category:** Behavioral

Define a one-to-many dependency so that when one object changes state, all its dependents are notified automatically.

## When to Use

- An abstraction has two dependent aspects and you want to vary them independently.
- A change to one object requires changing an unknown or open-ended number of others.
- An object should notify others without assuming who they are (domain events, UI state).

## When NOT to Use

- Updates can cascade unexpectedly because observers do not know about each other.
- There is exactly one fixed listener — call it directly.
- Observers leak: always provide `unsubscribe` and remove listeners on teardown.
- A cross-process or durable notification is needed — use a message broker, not an in-memory observer.

## Hard Rules

1. **Apply Observer only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Native Example

**React Native note:** In React, state, context and store subscriptions (`useSyncExternalStore`) are Observer. Always unsubscribe in the effect cleanup.

```tsx
// ✅ Correct — typed subject with explicit unsubscribe, consumed through a hook
type Listener<T> = (event: T) => void;

class EventEmitter<T> {
  private readonly listeners = new Set<Listener<T>>();
  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  emit(event: T): void { this.listeners.forEach((listener) => listener(event)); }
}

function useConnectivity(emitter: EventEmitter<boolean>) {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => emitter.subscribe(setIsOnline), [emitter]);
  return isOnline;
}

// ❌ Wrong — subscribing in an effect without returning the unsubscribe (leak after unmount)
```

## Related Patterns

- Mediator (change manager)
- Singleton (change manager)

## Why

Patterns buy flexibility with indirection. Use Observer when the flexibility it provides is actually needed today — not "just in case".
