# Design Patterns Overview Rule

Design patterns are tools, not goals. Apply one only to solve a concrete, present problem.

## Hard Rules

1. **Never apply a pattern indiscriminately.**
   Patterns buy flexibility with extra indirection. Introduce one only when that flexibility is actually needed now. Before adding a pattern, state the problem it solves in one sentence.

2. **Prefer the simplest Kotlin construct first.**
   Lambdas and function types, default and named arguments, `data class` + `copy()`, `sealed interface` + exhaustive `when`, `by` delegation, `Sequence`, `Flow`/`StateFlow`, Compose slots and constructor injection (Hilt/Koin) replace many classic patterns: Strategy → lambda or `Comparator`, Observer → `StateFlow`/`SharedFlow`, Composite → Compose slots, Decorator → `by` delegation or `Modifier`, Iterator → `Sequence`/`Flow`/Paging, Visitor → sealed type + `when`, State → sealed UI state, Singleton → one instance provided by the DI module (Hilt `@Singleton`), Builder → named arguments with defaults, Prototype → `copy()`, Template Method → composition.

3. **Check both lists before choosing.**
   Each file in this folder has a **When to Use** and a **When NOT to Use** section. Both must be consulted.

4. **Start with Factory Method / plain functions and evolve.**
   Move to Abstract Factory, Prototype or Builder only when more flexibility is proven necessary.

5. **Do not combine patterns without a reason.**
   Every added pattern is another thing a reader must learn.

## Catalog

| Category | Patterns |
| --- | --- |
| Creational | abstract-factory, builder, factory-method, prototype, singleton |
| Structural | adapter, bridge, composite, decorator, facade, flyweight, proxy |
| Behavioral | chain-of-responsibility, command, interpreter, iterator, mediator, memento, observer, state, strategy, template-method, visitor |

## Why

Source: *Design Patterns: Elements of Reusable Object-Oriented Software* (Gamma, Helm, Johnson, Vlissides). The book itself warns that patterns "should not be applied indiscriminately" and "only when the flexibility they afford is actually needed".
