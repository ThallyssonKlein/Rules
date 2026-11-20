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

## React Native Example

**React Native note:** In React Native, a component map or a themed provider usually replaces a factory class hierarchy (e.g. iOS/Android variants via `Platform.select`).

```tsx
// ✅ Correct — one factory object returns a consistent family, created once and provided via context
interface UiKit { Button: ComponentType<ButtonProps>; Dialog: ComponentType<DialogProps> }

const iosKit: UiKit = { Button: IosButton, Dialog: IosDialog };
const androidKit: UiKit = { Button: AndroidButton, Dialog: AndroidDialog };
const uiKit: UiKit = Platform.select({ ios: iosKit, default: androidKit });

// ❌ Wrong — mixing families and branching on Platform inside every screen
function ConfirmScreen() {
  return Platform.OS === 'ios' ? <IosDialog /> : <AndroidButton />;
}
```

## Related Patterns

- Factory Method (concrete factories are usually built with it)
- Prototype (alternative to subclassing factories)
- Singleton (a concrete factory is usually a single instance)

## Why

Patterns buy flexibility with indirection. Use Abstract Factory when the flexibility it provides is actually needed today — not "just in case".
