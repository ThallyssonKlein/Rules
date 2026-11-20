# Facade Pattern Rule

**Category:** Structural

Provide a unified interface to a set of interfaces in a subsystem.

## When to Use

- You want a simple default interface to a complex or evolving subsystem.
- There are many tight dependencies between clients and the implementation classes of a subsystem.
- You want to layer subsystems by defining an entry point for each layer.

## When NOT to Use

- The subsystem is small and clients interact with only one or two classes.
- The facade accumulates real logic and becomes a god object — logic belongs in the subsystem or in use cases.
- Clients need fine-grained control; a facade does not stop them from bypassing it, so do not pretend it hides everything.

## Hard Rules

1. **Apply Facade only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — one entry point over several collaborators; no business rules inside
class CheckoutFacade {
  constructor(
    private readonly cart: CartService,
    private readonly payments: PaymentGateway,
    private readonly shipping: ShippingService,
  ) {}
  async checkout(cartId: string, token: string): Promise<Order> {
    const cart = await this.cart.load(cartId);
    await this.payments.charge(cart.totalInCents, token);
    return this.shipping.schedule(cart);
  }
}

// ❌ Wrong — facade that wraps a single class and forwards every method
```

## Related Patterns

- Adapter (new interface for a subsystem vs. reuse of an existing interface)
- Mediator (multidirectional vs. unidirectional)
- Abstract Factory (create subsystem objects)
- Singleton (facades are often single instances)

## Why

Patterns buy flexibility with indirection. Use Facade when the flexibility it provides is actually needed today — not "just in case".
