# Prototype Pattern Rule

**Category:** Creational

Specify the kinds of objects to create using a prototypical instance, and create new objects by copying it.

## When to Use

- The classes to instantiate are specified at run time.
- You want to avoid a hierarchy of factories parallel to the product hierarchy.
- Instances have only a few combinations of state, so cloning pre-configured prototypes is easier than building them each time.

## When NOT to Use

- Objects are easily built by a constructor or factory — cloning adds friction.
- Objects hold circular references, handles, sockets or other non-copyable members: deep vs. shallow copy becomes error-prone.
- Plain data objects: use a `data class` and `copy()` instead of a Prototype hierarchy.

## Hard Rules

1. **Apply Prototype only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** In Kotlin, `data class` + `copy()` replaces Prototype. Keep the properties `val` so copies never share mutable state.

```kotlin
// ✅ Correct — copy a pre-configured instance and change only what differs
data class SearchFilter(
    val category: String = "all",
    val maxPrice: Int = NO_PRICE_LIMIT,
    val onlyInStock: Boolean = false,
)

val cheapInStock = defaultFilter.copy(maxPrice = CHEAP_PRICE_LIMIT, onlyInStock = true)

// ❌ Wrong — Cloneable/clone() or a hand-written copy constructor with mutable fields shared between copies
class SearchFilter : Cloneable { var tags: MutableList<String> = mutableListOf() }
```

## Related Patterns

- Abstract Factory (competitor; prototypes can replace factory subclasses)
- Composite and Decorator (cloning whole trees)
- Singleton (prototype registries)

## Why

Patterns buy flexibility with indirection. Use Prototype when the flexibility it provides is actually needed today — not "just in case".
