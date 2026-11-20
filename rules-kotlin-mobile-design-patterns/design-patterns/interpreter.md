# Interpreter Pattern Rule

**Category:** Behavioral

Given a language, define a representation for its grammar along with an interpreter that uses it to interpret sentences.

## When to Use

- The grammar is simple and can be represented as an abstract syntax tree.
- Efficiency is not critical (small rule DSLs, filter expressions, pricing rules).

## When NOT to Use

- The grammar is complex: the class hierarchy explodes — use a parser generator or a library.
- Performance matters: translate to bytecode or a state machine instead of walking trees.
- A JSON config or a `sealed interface` evaluated by an exhaustive `when` is enough.

## Hard Rules

1. **Apply Interpreter only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** A `sealed interface` AST evaluated by an exhaustive `when` is enough for small rule DSLs (filters, pricing, feature flags).

```kotlin
// ✅ Correct — a small grammar as a sealed AST, interpreted with an exhaustive when
sealed interface Rule {
    data class Equals(val field: String, val value: String) : Rule
    data class And(val left: Rule, val right: Rule) : Rule
    data class Or(val left: Rule, val right: Rule) : Rule
}

fun Rule.matches(item: Map<String, String>): Boolean = when (this) {
    is Rule.Equals -> item[field] == value
    is Rule.And -> left.matches(item) && right.matches(item)
    is Rule.Or -> left.matches(item) || right.matches(item)
}

// ❌ Wrong — parsing rule strings with regexes and nested ifs spread across the app
```

## Related Patterns

- Composite (the AST is a composite)
- Flyweight (share terminals)
- Visitor (separate evaluation from nodes)
- Iterator (traverse the tree)

## Why

Patterns buy flexibility with indirection. Use Interpreter when the flexibility it provides is actually needed today — not "just in case".
