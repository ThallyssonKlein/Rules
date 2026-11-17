# Early Return Rule

Exit a method as soon as preconditions fail. Never wrap the happy path in a conditional block.

## Hard Rules

1. **Guard at the top, return early, keep the happy path flat.**
   Validate preconditions and edge cases first. Once all guards pass, the rest of the method executes without nesting.

   ```java
   // ✅ Correct — guards up top, happy path flat
   public void publishEvent(PublishEventParams params) {
       if (params.getBranch() == null) throw new IllegalArgumentException("[EventPublisherService] branch is required");
       if (params.getEventType() == null) throw new IllegalArgumentException("[EventPublisherService] eventType is required");

       Destination destination = resolveDestination(params.getBranch());
       destination.publish(params);
   }

   // ❌ Wrong — happy path buried inside nested if
   public void publishEvent(PublishEventParams params) {
       if (params.getBranch() != null) {
           if (params.getEventType() != null) {
               Destination destination = resolveDestination(params.getBranch());
               destination.publish(params);
           }
       }
   }
   ```

   Prefer `Objects.requireNonNull(value, "message")` for null guards on constructor and method arguments.

2. **Never use `else` after a block that throws or returns.**
   Once a branch exits the method, the `else` is redundant and adds indentation for no reason.

   ```java
   // ✅ Correct — no else after throw
   public Customer fetchById(String id) {
       Customer customer = customerDao.findById(id)
           .orElseThrow(() -> new CustomerNotFoundException(id));

       return customer;
   }

   // ❌ Wrong — else after throw is dead indentation
   public Customer fetchById(String id) {
       Optional<Customer> customer = customerDao.findById(id);
       if (!customer.isPresent()) {
           throw new CustomerNotFoundException(id);
       } else {
           return customer.get();
       }
   }
   ```

3. **Never use `else` after a block that contains a `return`.**
   If the `if` branch returns, the `else` body is already the continuation.

   ```java
   // ✅ Correct
   public String resolveStatus(int code) {
       if (code == NOT_FOUND_CODE) return "not_found";
       if (code == BAD_REQUEST_CODE) return "bad_request";

       return "unknown";
   }

   // ✅ Correct — a traditional switch statement for a closed set of values
   // (Java 8 has no switch *expression* — that was added in Java 14)
   public String describe(OrderStatus status) {
       switch (status) {
           case ACTIVE:
               return "active";
           case CANCELLED:
               return "cancelled";
           case SHIPPED:
               return "shipped";
           default:
               throw new IllegalArgumentException("[OrderStatusFormatter] unknown status: " + status);
       }
   }

   // ❌ Wrong
   public String resolveStatus(int code) {
       if (code == NOT_FOUND_CODE) {
           return "not_found";
       } else if (code == BAD_REQUEST_CODE) {
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
   public void handleCreate(HttpServletRequest request, HttpServletResponse response) throws IOException {
       if (isReadOnlyMode()) {
           response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
           return;
       }

       Result result = service.execute(request);
       respondWithCreated(response, result);
   }

   // ❌ Wrong — entire happy path wrapped in else
   public void handleCreate(HttpServletRequest request, HttpServletResponse response) throws IOException {
       if (isReadOnlyMode()) {
           response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
       } else {
           Result result = service.execute(request);
           respondWithCreated(response, result);
       }
   }
   ```

## Why

Nesting is the enemy of readability. Every additional level of indentation pushes the reader to hold more context in their head. Early returns keep methods linear: a reader scans top-to-bottom through a list of exit conditions, then reaches the single happy path at the bottom — unindented, unambiguous, and easy to follow.
