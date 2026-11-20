# Composite Pattern Rule

**Category:** Structural

Compose objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.

## When to Use

- You represent part-whole hierarchies (menus, file systems, permission groups, UI trees, rule sets).
- Clients should ignore the difference between a single element and a group of elements.

## When NOT to Use

- The structure is flat or has a fixed depth — a plain array is enough.
- You must restrict which component types a composite may hold: the pattern makes the design overly general and pushes checks to run time.
- Leaves would be forced to implement child-management methods they cannot support.

## Hard Rules

1. **Apply Composite only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Native Example

**React Native note:** React component composition (`children`) is already Composite; do not build a parallel class tree.

```tsx
// ✅ Correct — leaf and container share the same component contract
function MenuItem({ label }: { label: string }) { return <Text>{label}</Text>; }
function MenuGroup({ label, children }: PropsWithChildren<{ label: string }>) {
  return <View><Text>{label}</Text>{children}</View>;
}

// ❌ Wrong — separate render paths with `if (node.children)` checks scattered across screens
```

## Related Patterns

- Decorator (similar structure, different intent)
- Iterator and Visitor (traverse/operate on composites)
- Flyweight (share leaf nodes)
- Chain of Responsibility (parent links as successor chain)

## Why

Patterns buy flexibility with indirection. Use Composite when the flexibility it provides is actually needed today — not "just in case".
