# State Pattern Rule

**Category:** Behavioral

Allow an object to alter its behavior when its internal state changes.

## When to Use

- Behavior depends on state and must change at run time.
- Operations contain large multipart conditionals that depend on the object's state.

## When NOT to Use

- There are two or three states and a few transitions — a union type plus `switch` is simpler.
- Fixed transitions: a transition table is enough, though less flexible for arbitrary actions.
- State classes would multiply with little behavior in each.

## Hard Rules

1. **Apply State only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — per-state behavior in its own object
interface OrderState {
  pay(order: Order): void;
  ship(order: Order): void;
}
class PendingState implements OrderState {
  pay(order: Order): void { order.setState(new PaidState()); }
  ship(): void { throw new Error('[PendingState] Cannot ship an unpaid order'); }
}
class PaidState implements OrderState {
  pay(): void { throw new Error('[PaidState] Already paid'); }
  ship(order: Order): void { order.setState(new ShippedState()); }
}

// ❌ Wrong — State pattern for a boolean flag
```

## Related Patterns

- Flyweight (share stateless State objects)
- Singleton (State objects are often single instances)

## Why

Patterns buy flexibility with indirection. Use State when the flexibility it provides is actually needed today — not "just in case".
