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

## React Native Example

**React Native note:** Typical RN use: map API payloads or native-module results to the app model at the boundary — a mapper function is the adapter.

```tsx
// ✅ Correct — adapter converts a third-party/native shape into the app's own type
interface Location { latitude: number; longitude: number }

function toLocation(position: GeolocationPosition): Location {
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}

// ❌ Wrong — components consume the raw native/API shape and each one re-maps it
<Text>{position.coords.latitude}</Text>
```

## Related Patterns

- Bridge (similar structure, designed up-front)
- Decorator (same interface, new behavior)
- Proxy (same interface, controlled access)

## Why

Patterns buy flexibility with indirection. Use Adapter when the flexibility it provides is actually needed today — not "just in case".
