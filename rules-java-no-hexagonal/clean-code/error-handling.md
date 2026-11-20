# Error Handling Rule

Errors are part of the domain. Handle them explicitly, with context, and without hiding failures behind null or error codes.

## Hard Rules

1. **Prefer exceptions to error codes.**
   Throw when something goes wrong. Never return a sentinel value (e.g. `null`, `-1`, `false`) to signal failure — it forces every caller to inspect the return value and silently propagates failures when callers forget to check.

   ```java
   // ✅ Correct — caller does not need to check the return value
   Customer fetchById(String id) {
       return customerRepository.findById(id)
           .orElseThrow(() -> new CustomerNotFoundException(id));
   }

   // ❌ Wrong — caller must remember to check for null
   Customer fetchById(String id) {
       return customerRepository.findById(id).orElse(null);
   }
   ```

2. **Provide context in every exception.**
   Every thrown exception must carry a message that identifies the class, the operation, and what went wrong. A generic `"Not found"` message is useless in a log without knowing where it came from. Use dedicated exception types and keep the failing value as a field.

   ```java
   // ✅ Correct — dedicated type, message includes class and failing value
   public class CustomerNotFoundException extends RuntimeException {
       private final String customerId;

       public CustomerNotFoundException(String customerId) {
           super("[CustomerService] Customer not found for id: " + customerId);
           this.customerId = customerId;
       }

       public String customerId() { return customerId; }
   }

   // ❌ Wrong — no origin, no context
   throw new RuntimeException("Not found");
   ```

3. **Never return `null`. Never accept `null` as a parameter.**
   Returning `null` shifts the burden of null-checking onto every caller. Accepting `null` makes method contracts ambiguous. Express absence with `Optional` (only as a return type), an empty collection, or an exception.

   ```java
   // ✅ Correct — repository expresses possible absence with Optional
   Optional<Customer> findById(String id);

   // ✅ Correct — empty collection instead of null
   List<Order> findByCustomer(String customerId);  // returns List.of() when none

   // ❌ Wrong — returns null, caller must guard
   Customer findById(String id);

   // ❌ Wrong — accepts null, contract is ambiguous
   void update(String id, CustomerUpdateBody body);  // called with body == null
   ```

   `Optional` must not be used as a field, a method parameter, or in collections; call `isPresent()`/`get()` only through `orElseThrow`, `map`, `ifPresent`, or `orElse`.

4. **Use unchecked exceptions for business and programming errors; never leak checked exceptions through your API.**
   Wrap checked exceptions from I/O libraries at the boundary and rethrow a domain-specific unchecked exception, always preserving the cause.

   ```java
   // ✅ Correct — wrapped once, cause preserved
   try {
       return objectMapper.readValue(json, Setting.class);
   } catch (JsonProcessingException e) {
       throw new SettingParseException("[SettingParser] Invalid setting payload", e);
   }

   // ❌ Wrong — cause lost
   } catch (JsonProcessingException e) {
       throw new SettingParseException("Invalid setting payload");
   }
   ```

5. **Catch the most specific exception. Never catch `Exception`, `Throwable`, or `RuntimeException` to hide a failure, and never leave a `catch` block empty.**

   ```java
   // ✅ Correct
   } catch (CustomerNotFoundException e) {
       return ResponseEntity.notFound().build();
   }

   // ❌ Wrong — swallows every failure
   } catch (Exception e) {
       // ignore
   }
   ```

6. **Always release resources with try-with-resources.**
   Never rely on `finally` blocks that call `close()` manually.

   ```java
   // ✅ Correct
   try (InputStream in = Files.newInputStream(path)) {
       return parse(in);
   }
   ```

7. **Log errors at the boundary, not at every layer.**
   Only the outermost handler (controller or `@ControllerAdvice` / exception mapper) should log the error. Intermediate layers must let exceptions propagate. Logging at every layer produces duplicate noise and hides the real origin. Never both log and rethrow.

   ```java
   // ✅ Correct — a single handler logs once at the boundary
   @ExceptionHandler(CustomerNotFoundException.class)
   ResponseEntity<Void> handleNotFound(CustomerNotFoundException e) {
       log.warn("[CustomerExceptionHandler] customer not found", e);
       return ResponseEntity.notFound().build();
   }

   // ❌ Wrong — service also logs the same error and rethrows
   Customer fetchById(String id) {
       try {
           ...
       } catch (CustomerNotFoundException e) {
           log.error("[CustomerService] failed to fetch customer", e); // duplicate
           throw e;
       }
   }
   ```

## Why

Error codes scatter failure-handling logic across every call site and are silently ignored when callers forget to check. Null return values multiply null-guards across the codebase and hide the moment a failure actually occurred. Exceptions with context make failures explicit, self-documenting, and traceable to a single origin — which is all that is needed to diagnose a production incident.
