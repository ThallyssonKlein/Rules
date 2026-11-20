# Design Patterns Overview Rule

Design patterns are tools, not goals. Apply one only to solve a concrete, present problem.

## Hard Rules

1. **Never apply a pattern indiscriminately.**
   Patterns buy flexibility with extra indirection. Introduce one only when that flexibility is actually needed now. Before adding a pattern, state the problem it solves in one sentence.

2. **Prefer the simplest React / TypeScript construct first.**
   Functions, closures, props, hooks, context, union types, `Iterable`, options objects and dependency injection replace many classic patterns: Strategy → function or prop, Observer → state/context/`useSyncExternalStore`, Composite → `children`, Decorator → custom hook or wrapper component, Iterator → generator or array methods, Visitor → discriminated union + `switch`, State → `useReducer` + union, Singleton → instance created once at app startup and provided via context, Builder → options object, Template Method → composition.

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
