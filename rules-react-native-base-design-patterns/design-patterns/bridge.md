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

## React Native Example

**React Native note:** Do not confuse with the React Native "bridge" (JS ↔ native). This rule is about GoF Bridge: separating an abstraction from its implementation.

```tsx
// ✅ Correct — the abstraction depends on an implementation interface injected at runtime
interface StorageDriver { get(key: string): Promise<string | null>; set(key: string, value: string): Promise<void> }

class PreferencesStore {
  constructor(private readonly driver: StorageDriver) {}
  async theme(): Promise<string> { return (await this.driver.get('theme')) ?? 'light'; }
}

// ❌ Wrong — one subclass per (abstraction × implementation): MmkvPreferencesStore, AsyncStoragePreferencesStore, MmkvSessionStore...
```

## Related Patterns

- Adapter (reconciles existing classes; Bridge is planned up-front)
- Abstract Factory (can create and configure bridges)

## Why

Patterns buy flexibility with indirection. Use Bridge when the flexibility it provides is actually needed today — not "just in case".
