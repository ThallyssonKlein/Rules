# Mediator Pattern Rule

**Category:** Behavioral

Define an object that encapsulates how a set of objects interact, promoting loose coupling.

## When to Use

- A set of objects communicates in well-defined but complex ways, producing tangled interdependencies.
- An object is hard to reuse because it refers to many others.
- Behavior distributed among several classes should be customizable without much subclassing.

## When NOT to Use

- There are only two collaborators — let them talk directly.
- The mediator absorbs every rule and becomes a monolith: keep it a coordinator, not a dumping ground.
- A simple event or callback is enough.

## Hard Rules

1. **Apply Mediator only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## React Native Example

**React Native note:** A context provider, store or screen-level hook that coordinates sibling components is a Mediator; keep it small or it becomes a monolith.

```tsx
// ✅ Correct — a hook coordinates form fields so they do not reference each other
function useSignupForm() {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const canSubmit = email.length > 0 && acceptedTerms;
  return { email, setEmail, acceptedTerms, setAcceptedTerms, canSubmit };
}

// ❌ Wrong — components calling each other's refs/callbacks directly to keep state in sync
```

## Related Patterns

- Facade (unidirectional vs. multidirectional)
- Observer (colleagues can notify the mediator through it)

## Why

Patterns buy flexibility with indirection. Use Mediator when the flexibility it provides is actually needed today — not "just in case".
