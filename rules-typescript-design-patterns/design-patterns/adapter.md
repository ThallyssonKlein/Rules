# Adapter Pattern Rule

**Category:** Structural

Convert the interface of a class into another interface clients expect.

## When to Use

- You want to use an existing class (SDK, legacy module, third-party API) whose interface does not match the one you need.
- You want to create a reusable class that cooperates with unrelated or unforeseen classes.
- At an architectural boundary: wrap an external SDK behind a port so the domain never imports it.

## When NOT to Use

- You can change the original interface directly or a small refactor removes the mismatch.
- You only need to change responsibilities, not the interface — that is Decorator.
- The adaptee behavior must be overridden deeply: an object adapter makes this harder.

## Hard Rules

1. **Apply Adapter only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## TypeScript Example

```typescript
// ✅ Correct — adapt a vendor SDK to the port the application owns
interface PaymentGateway { charge(amountInCents: number, token: string): Promise<PaymentResult>; }

class StripePaymentAdapter implements PaymentGateway {
  constructor(private readonly stripe: Stripe) {}
  async charge(amountInCents: number, token: string): Promise<PaymentResult> {
    const response = await this.stripe.paymentIntents.create({ amount: amountInCents, payment_method: token });
    return { id: response.id, status: response.status === 'succeeded' ? 'paid' : 'failed' };
  }
}

// ❌ Wrong — an adapter that maps field by field to the identical interface
```

## Related Patterns

- Bridge (similar structure, designed up-front)
- Decorator (same interface, new behavior)
- Proxy (same interface, controlled access)

## Why

Patterns buy flexibility with indirection. Use Adapter when the flexibility it provides is actually needed today — not "just in case".
