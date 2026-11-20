# Flyweight Pattern Rule

**Category:** Structural

Use sharing to support large numbers of fine-grained objects efficiently.

## When to Use

- The application creates a huge number of objects and storage cost is high.
- Most object state can be made extrinsic (passed in by the caller).
- Groups of objects can be replaced by few shared instances once extrinsic state is removed.
- The application does not depend on object identity.

## When NOT to Use

- The object count is small — measure first; the pattern adds complexity and run-time cost for looking up or passing extrinsic state.
- Objects have mostly unique, non-shareable state.
- Identity checks (`===`) matter to the logic.
- Shared instances are mutable — they must be immutable (`readonly`).

## Hard Rules

1. **Apply Flyweight only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Native Example

**React Native note:** In RN, rarely hand-written: `FlatList`/`FlashList` already recycle rows and `React.memo` shares render output. Reach for it only after profiling.

```tsx
// ✅ Correct — shared immutable intrinsic state; extrinsic state is passed in
const iconCache = new Map<string, ImageSourcePropType>();
function getIcon(name: string): ImageSourcePropType {
  const cached = iconCache.get(name);
  if (cached) return cached;
  const source = loadIcon(name);
  iconCache.set(name, source);
  return source;
}
<Image source={getIcon(item.icon)} style={{ width: size }} />

// ❌ Wrong — creating a flyweight pool for a few dozen objects, with no measured memory problem
```

## Related Patterns

- Composite (shared leaves in a DAG)
- State and Strategy (stateless instances can be flyweights)

## Why

Patterns buy flexibility with indirection. Use Flyweight when the flexibility it provides is actually needed today — not "just in case".
