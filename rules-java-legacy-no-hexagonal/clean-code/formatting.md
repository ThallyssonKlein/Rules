# Formatting Rule

Code must be readable top-to-bottom. Structure and placement are part of the design.

## Hard Rules

1. **Apply the Newspaper Metaphor.**
   Organize files so high-level concepts appear first and implementation details emerge as you read down. A reader should understand *what* the class does before seeing *how*. Within a class: constants, fields, constructors, public methods, then private helpers.

   ```java
   // ✅ Correct — public API at top, private helpers at bottom
   public class EventPublisherService {
       public void publishEvent(PublishEventParams params) { ... }

       private EventPayload buildPayload(PublishEventParams params) { ... }
       private void validateBranch(String branch) { ... }
   }

   // ❌ Wrong — private helpers above public methods
   public class EventPublisherService {
       private EventPayload buildPayload(PublishEventParams params) { ... }
       private void validateBranch(String branch) { ... }

       public void publishEvent(PublishEventParams params) { ... }
   }
   ```

2. **Keep related concepts vertically close.**
   A caller and its callee belong near each other. Do not scatter related methods across the file and force the reader to hunt for definitions.

   ```java
   // ✅ Correct — fetchById and its direct helper are adjacent
   public Customer fetchById(String id) {
       return customerDao.findById(id).orElseThrow(() -> notFound(id));
   }

   private CustomerNotFoundException notFound(String id) {
       return new CustomerNotFoundException(id);
   }

   // ❌ Wrong — unrelated method between caller and callee
   public Customer fetchById(String id) { ... }
   public void deleteById(String id) { ... }  // unrelated
   private CustomerNotFoundException notFound(String id) { ... }
   ```

3. **Declare variables as close as possible to their first use.**
   Do not hoist variables to the top of a method body unless they are needed throughout. Declare variables `final` whenever they are not reassigned, and never reuse a variable for a different meaning. Java 8 has no `var` (added in Java 10) — always spell out the explicit type.

   ```java
   // ✅ Correct — declared right before use, explicit type, final where possible
   public void publishEvent(PublishEventParams params) {
       validateBranch(params.getBranch());

       final EventPayload payload = buildPayload(params);
       eventDestination.publish(payload);
   }

   // ❌ Wrong — variable hoisted regardless of when it is used
   public void publishEvent(PublishEventParams params) {
       EventPayload payload = buildPayload(params);  // used later, declared too early
       validateBranch(params.getBranch());
       eventDestination.publish(payload);
   }
   ```

4. **No automatic formatter is configured in this workspace — match the surrounding code by eye.**
   There is no Spotless/google-java-format step in the build. Follow the file's existing conventions exactly: **tab indentation** (the Eclipse default this workspace uses), brace on the same line as the declaration, and the import ordering already present in the file. Do not introduce a different indentation style or reflow lines a formatter would otherwise normalize — it will show up as unrelated diff noise in every file you touch.

5. **One top-level type per file, and no wildcard imports.**
   Import each class explicitly; remove unused imports.

## Why

Code that flows top-to-bottom mirrors how people read. High-level intent at the top lets a reader decide whether to keep reading or stop. Vertical proximity eliminates the need to scroll and cross-reference. Variables declared near their use shrink the mental context a reader must hold at any given line. Without a formatter to normalize style automatically, consistency only survives if every contributor matches what's already there.
