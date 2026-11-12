# Early Return Rule

Exit a method as soon as preconditions fail. Never wrap the happy path in a conditional block.

## Hard Rules

1. **Guard at the top, return early, keep the happy path flat.**
   Validate preconditions and edge cases first. Once all guards pass, the rest of the method executes without nesting.

   ```java
   // ✅ Correct — guards up top, happy path flat
   void publishEvent(PublishEventParams params) {
       if (params.tenantId() == null) throw new IllegalArgumentException("[EventProducerService] tenantId is required");
       if (params.eventType() == null) throw new IllegalArgumentException("[EventProducerService] eventType is required");

       EventHub hub = resolveHub(params.tenantId());
       hub.publish(params);
   }

   // ❌ Wrong — happy path buried inside nested if
   void publishEvent(PublishEventParams params) {
       if (params.tenantId() != null) {
           if (params.eventType() != null) {
               EventHub hub = resolveHub(params.tenantId());
               hub.publish(params);
           }
       }
   }
   ```

   Prefer `Objects.requireNonNull(value, "message")` for null guards on constructor and method arguments.

2. **Never use `else` after a block that throws or returns.**
   Once a branch exits the method, the `else` is redundant and adds indentation for no reason.

   ```java
   // ✅ Correct — no else after throw
   Customer fetchById(String id) {
       Customer customer = customerRepository.findById(id)
           .orElseThrow(() -> new CustomerNotFoundException(id));

       return customer;
   }

   // ❌ Wrong — else after throw is dead indentation
   Customer fetchById(String id) {
       Optional<Customer> customer = customerRepository.findById(id);
       if (customer.isEmpty()) {
           throw new CustomerNotFoundException(id);
       } else {
           return customer.get();
       }
   }
   ```

3. **Never use `else` after a block that contains a `return`.**
   If the `if` branch returns, the `else` body is already the continuation. For mapping values, prefer a `switch` expression.

   ```java
   // ✅ Correct
   String resolveStatus(int code) {
       if (code == HTTP_NOT_FOUND) return "not_found";
       if (code == HTTP_BAD_REQUEST) return "bad_request";

       return "unknown";
   }

   // ✅ Correct — switch expression for closed sets of values
   String describe(OrderStatus status) {
       return switch (status) {
           case ACTIVE -> "active";
           case CANCELLED -> "cancelled";
           case SHIPPED -> "shipped";
       };
   }

   // ❌ Wrong
   String resolveStatus(int code) {
       if (code == HTTP_NOT_FOUND) {
           return "not_found";
       } else if (code == HTTP_BAD_REQUEST) {
           return "bad_request";
       } else {
           return "unknown";
       }
   }
   ```

4. **For `void` methods, return early to skip the rest of the body.**
   Do not wrap the remaining logic in an `if` when a plain `return` communicates the intent more clearly.

   ```java
   // ✅ Correct — skip early, no wrapping
   ResponseEntity<Result> handle(CreateRequest request) {
       if (isProduction()) {
           return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
       }

       Result result = service.execute(request);
       return ResponseEntity.status(HttpStatus.CREATED).body(result);
   }

   // ❌ Wrong — entire happy path wrapped in else
   ResponseEntity<Result> handle(CreateRequest request) {
       if (isProduction()) {
           return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
       } else {
           Result result = service.execute(request);
           return ResponseEntity.status(HttpStatus.CREATED).body(result);
       }
   }
   ```

## Why

Nesting is the enemy of readability. Every additional level of indentation pushes the reader to hold more context in their head. Early returns keep methods linear: a reader scans top-to-bottom through a list of exit conditions, then reaches the single happy path at the bottom — unindented, unambiguous, and easy to follow.
