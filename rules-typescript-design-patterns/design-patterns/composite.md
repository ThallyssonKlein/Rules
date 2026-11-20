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

## TypeScript Example

```typescript
// ✅ Correct — leaf and group share one interface
interface Permission { allows(action: string): boolean; }

class SinglePermission implements Permission {
  constructor(private readonly action: string) {}
  allows(action: string): boolean { return this.action === action; }
}
class PermissionGroup implements Permission {
  constructor(private readonly children: readonly Permission[]) {}
  allows(action: string): boolean { return this.children.some((child) => child.allows(action)); }
}

// ❌ Wrong — composite for a flat list of two items
```

## Related Patterns

- Decorator (similar structure, different intent)
- Iterator and Visitor (traverse/operate on composites)
- Flyweight (share leaf nodes)
- Chain of Responsibility (parent links as successor chain)

## Why

Patterns buy flexibility with indirection. Use Composite when the flexibility it provides is actually needed today — not "just in case".
