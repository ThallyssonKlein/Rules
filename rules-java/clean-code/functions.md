# Functions Rule

Methods must be small, single-purpose, and predictable.

## Hard Rules

1. **A method does exactly one thing.**
   If you can describe what it does with "and", split it.

2. **Keep all statements at the same abstraction level.**
   A service method orchestrates calls to repositories and other dependencies — it does not format strings or parse dates inline.

3. **Limit parameters to two. Group anything beyond that into a record.**
   Use a `record` for the parameter object; never use a long list of positional arguments.

   ```java
   // ✅ Correct
   record PublishEventParams(String tenantId, String eventType, Map<String, Object> payload) {}
   void publishEvent(PublishEventParams params)

   // ❌ Wrong
   void publishEvent(String tenantId, String eventType, Map<String, Object> payload)
   ```

4. **Never use boolean flag parameters.**
   A `boolean` argument means the method does two things. Split it into two methods.

   ```java
   // ✅ Correct
   void renderForPrint(Document document)
   void renderForScreen(Document document)

   // ❌ Wrong
   void render(Document document, boolean forPrint)
   ```

5. **No hidden side effects.**
   A method must only do what its name promises. Do not log, mutate external state, or call unrelated services inside a method that claims to do something else.

6. **Obey Command-Query Separation.**
   Methods that change state return `void`. Methods that return data do not change state. Never both.

   ```java
   // ✅ Correct
   void deleteById(String id)
   Customer findById(String id)

   // ❌ Wrong — deletes and returns the deleted entity
   Customer deleteById(String id)
   ```

7. **Prefer pure methods and immutable arguments.**
   Never reassign a parameter and never mutate an argument the caller owns.

## Why

A method that does one thing at one abstraction level can be named precisely, tested in isolation, and replaced without side effects. Methods that mix concerns, accumulate parameters, or violate CQS become the source of bugs that are hard to trace and tests that are hard to write.
