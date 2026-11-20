# Formatting Rule

Code must be readable top-to-bottom. Structure and placement are part of the design.

## Hard Rules

1. **Apply the Newspaper Metaphor.**
   Organize files so high-level concepts appear first and implementation details emerge as you read down. A reader should understand *what* the class does before seeing *how*. Within a class: constants, fields, constructors, public methods, then private helpers.

   ```java
   // ✅ Correct — public API at top, private helpers at bottom
   class EventProducerService {
       void publishEvent(PublishEventParams params) { ... }

       private EventPayload buildPayload(PublishEventParams params) { ... }
       private void validateTenant(String tenantId) { ... }
   }

   // ❌ Wrong — private helpers above public methods
   class EventProducerService {
       private EventPayload buildPayload(PublishEventParams params) { ... }
       private void validateTenant(String tenantId) { ... }

       void publishEvent(PublishEventParams params) { ... }
   }
   ```

2. **Keep related concepts vertically close.**
   A caller and its callee belong near each other. Do not scatter related methods across the file and force the reader to hunt for definitions.

   ```java
   // ✅ Correct — fetchById and its direct helper are adjacent
   Customer fetchById(String id) {
       return customerRepository.findById(id).orElseThrow(() -> notFound(id));
   }

   private CustomerNotFoundException notFound(String id) {
       return new CustomerNotFoundException(id);
   }

   // ❌ Wrong — unrelated method between caller and callee
   Customer fetchById(String id) { ... }
   void deleteById(String id) { ... }  // unrelated
   private CustomerNotFoundException notFound(String id) { ... }
   ```

3. **Declare variables as close as possible to their first use.**
   Do not hoist variables to the top of a method body unless they are needed throughout. Proximity reduces the cognitive distance between declaration and use. Declare variables `final` (or use `var` for obvious types) and never reuse a variable for a different meaning.

   ```java
   // ✅ Correct — declared right before use
   void publishEvent(PublishEventParams params) {
       validateTenant(params.tenantId());

       EventPayload payload = buildPayload(params);
       eventRepository.publish(payload);
   }

   // ❌ Wrong — variable hoisted regardless of when it is used
   void publishEvent(PublishEventParams params) {
       EventPayload payload = buildPayload(params);  // used later, declared too early
       validateTenant(params.tenantId());
       eventRepository.publish(payload);
   }
   ```

4. **Use an automatic formatter and never format by hand.**
   The project's formatter (Spotless with google-java-format, or the one configured in the build) is the single source of truth. Do not fight it, and do not commit unformatted code.

5. **One top-level type per file, and no wildcard imports.**
   Import each class explicitly; remove unused imports.

## Why

Code that flows top-to-bottom mirrors how people read. High-level intent at the top lets a reader decide whether to keep reading or stop. Vertical proximity eliminates the need to scroll and cross-reference. Variables declared near their use shrink the mental context a reader must hold at any given line.
