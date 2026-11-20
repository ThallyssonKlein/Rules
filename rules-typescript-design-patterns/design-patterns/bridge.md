# Bridge Pattern Rule

**Category:** Structural

Decouple an abstraction from its implementation so the two can vary independently.

## When to Use

- You want to avoid a permanent binding between an abstraction and its implementation (e.g. choose the implementation at run time).
- Both the abstraction and the implementation need to be extended independently.
- You face a class explosion from combining two dimensions (e.g. N message types × M channels).

## When NOT to Use

- The abstraction will only ever have one implementation and no variation is expected.
- Only one dimension varies — plain inheritance or an interface is enough.
- The two hierarchies would be designed after the fact to reconcile incompatible classes — that is Adapter.

## Hard Rules

1. **Apply Bridge only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — two hierarchies connected by composition
interface MessageChannel { deliver(to: string, body: string): Promise<void>; }  // implementor

abstract class Notification {                                                 // abstraction
  constructor(protected readonly channel: MessageChannel) {}
  abstract send(to: string): Promise<void>;
}
class WelcomeNotification extends Notification {
  async send(to: string): Promise<void> { await this.channel.deliver(to, 'Welcome!'); }
}
// new WelcomeNotification(new SmsChannel()) / new WelcomeNotification(new EmailChannel())

// ❌ Wrong — WelcomeSmsNotification, WelcomeEmailNotification, ResetSmsNotification, ...
```

## Related Patterns

- Adapter (reconciles existing classes; Bridge is planned up-front)
- Abstract Factory (can create and configure bridges)

## Why

Patterns buy flexibility with indirection. Use Bridge when the flexibility it provides is actually needed today — not "just in case".
