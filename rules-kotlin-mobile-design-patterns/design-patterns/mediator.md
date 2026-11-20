# Mediator Pattern Rule

**Category:** Behavioral

Define an object that encapsulates how a set of objects interact, promoting loose coupling.

## When to Use

- A set of objects communicates in well-defined but complex ways, producing tangled interdependencies.
- An object is hard to reuse because it refers to many others.
- Behavior distributed among several classes should be customizable without much subclassing.

## When NOT to Use

- There are only two collaborators — let them talk directly.
- The mediator absorbs every rule and becomes a monolith: keep it a coordinator, not a dumping ground.
- A simple event or callback is enough.

## Hard Rules

1. **Apply Mediator only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** On Android, the ViewModel is the natural mediator: the UI parts report events to it and render the state it exposes, instead of referring to each other.

```kotlin
// ✅ Correct — widgets know only the ViewModel; the ViewModel coordinates them
class CheckoutViewModel(private val shippingCalculator: ShippingCalculator) : ViewModel() {
    private val _state = MutableStateFlow(CheckoutState())
    val state: StateFlow<CheckoutState> = _state.asStateFlow()

    fun onAddressChanged(address: Address) {
        _state.update { it.copy(address = address, shippingCost = shippingCalculator.calculate(address)) }
    }

    fun onPaymentChanged(payment: Payment) {
        _state.update { it.copy(payment = payment) }
    }
}

// ❌ Wrong — the address form holds references to the payment form and the summary and calls them directly
class AddressForm(private val paymentForm: PaymentForm, private val summary: SummaryView)
```

## Related Patterns

- Facade (unidirectional vs. multidirectional)
- Observer (colleagues can notify the mediator through it)

## Why

Patterns buy flexibility with indirection. Use Mediator when the flexibility it provides is actually needed today — not "just in case".
