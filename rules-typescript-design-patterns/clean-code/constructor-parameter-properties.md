---
name: Constructor Parameter Properties Rule
description: Never declare class properties at the top of the class when they can be declared inline in the constructor using TypeScript parameter property shorthand.
type: feedback
---

# Constructor Parameter Properties Rule

Use TypeScript's **parameter property shorthand** to declare and initialize class properties directly in the constructor signature. Never declare the property at the top of the class separately.

## Hard Rules

1. **Never declare a class property at the top if it is only assigned in the constructor.**
   Use the access modifier (`private`, `protected`, `public`, `readonly`) directly on the constructor parameter instead.

2. **The top-level property declaration is only allowed when:**
   - The property has a default value not derived from a constructor argument.
   - The property is mutated after construction (and the declaration makes the intent clearer).
   - A decorator must be applied to the property (e.g., `@Inject()`).

## Standard Pattern

```typescript
// ✅ Correct — parameter property shorthand
class SettingController {
  constructor(private readonly settingUseCase: ISettingUseCase) {}
}

class SettingUseCase {
  constructor(
    private readonly settingRepository: ISettingRepositoryPort,
    private readonly logger: ILogger,
  ) {}
}
```

```typescript
// ❌ Wrong — redundant top-level declaration
class SettingController {
  private readonly settingUseCase: ISettingUseCase; // ← remove this

  constructor(settingUseCase: ISettingUseCase) {
    this.settingUseCase = settingUseCase; // ← and this
  }
}
```

## Why

Parameter properties eliminate boilerplate: one token does the work of three lines (declaration, parameter, assignment). The result is shorter, less error-prone, and instantly readable — the constructor signature is the single source of truth for what a class depends on.
