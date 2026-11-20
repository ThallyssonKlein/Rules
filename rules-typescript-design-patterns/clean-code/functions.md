# Functions Rule

Functions must be small, single-purpose, and predictable.

## Hard Rules

1. **A function does exactly one thing.**
   If you can describe what it does with "and", split it.

2. **Keep all statements at the same abstraction level.**
   A service method orchestrates calls to repositories and other dependencies — it does not format strings or parse dates inline.

3. **Limit parameters to two. Group anything beyond that into a typed object.**

   ```typescript
   // ✅ Correct
   interface PublishEventParams {
     tenantId: string;
     eventType: string;
     payload: Record<string, unknown>;
   }
   publishEvent(params: PublishEventParams): Promise<void>

   // ❌ Wrong
   publishEvent(tenantId: string, eventType: string, payload: Record<string, unknown>): Promise<void>
   ```

4. **No hidden side effects.**
   A function must only do what its name promises. Do not log, mutate external state, or call unrelated services inside a function that claims to do something else.

5. **Obey Command-Query Separation.**
   Methods that change state return `void`. Methods that return data do not change state. Never both.

   ```typescript
   // ✅ Correct
   deleteById(id: string): Promise<void>
   findById(id: string): Promise<Domain>

   // ❌ Wrong — deletes and returns the deleted entity
   deleteById(id: string): Promise<Domain>
   ```

## Why

A function that does one thing at one abstraction level can be named precisely, tested in isolation, and replaced without side effects. Functions that mix concerns, accumulate parameters, or violate CQS become the source of bugs that are hard to trace and tests that are hard to write.
