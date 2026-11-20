# Abstract Factory Pattern Rule

**Category:** Creational

Provide an interface for creating families of related or dependent objects without specifying their concrete classes.

## When to Use

- The system must be independent of how its products are created, composed, and represented.
- The system must be configured with one of several product families (e.g. per tenant, per provider, per environment).
- Related products are designed to be used together and the constraint must be enforced.
- You expose a library of products revealing only interfaces, not implementations.

## When NOT to Use

- You create isolated, single products — use a plain factory function or Factory Method.
- The set of product kinds changes often: adding a product forces changes in the factory interface and every concrete factory.
- There is only one family and no realistic prospect of a second.

## Hard Rules

1. **Apply Abstract Factory only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — one factory per provider family; the client never names a concrete class
interface NotificationFactory {
  createSender(): NotificationSender;
  createTemplateRenderer(): TemplateRenderer;
}

class AwsNotificationFactory implements NotificationFactory {
  createSender(): NotificationSender { return new SesSender(); }
  createTemplateRenderer(): TemplateRenderer { return new SesTemplateRenderer(); }
}

// ❌ Wrong — a "family" with a single product and a single provider
interface LoggerFactory { createLogger(): Logger; }
class ConsoleLoggerFactory implements LoggerFactory { createLogger(): Logger { return new ConsoleLogger(); } }
```

## Related Patterns

- Factory Method (concrete factories are usually built with it)
- Prototype (alternative to subclassing factories)
- Singleton (a concrete factory is usually a single instance)

## Why

Patterns buy flexibility with indirection. Use Abstract Factory when the flexibility it provides is actually needed today — not "just in case".
