# Error Handling Rule

Errors are part of the domain. Handle them explicitly, with context, and without hiding failures behind null or error codes.

## Hard Rules

1. **Prefer exceptions to error codes.**
   Throw when something goes wrong. Never return a sentinel value (e.g. `null`, `-1`, `false`) to signal failure — it forces every caller to inspect the return value and silently propagates failures when callers forget to check.

   ```java
   // ✅ Correct — caller does not need to check the return value
   public Customer fetchById(String id) {
       return customerDao.findById(id)
           .orElseThrow(() -> new CustomerNotFoundException(id));
   }

   // ❌ Wrong — caller must remember to check for null
   public Customer fetchById(String id) {
       return customerDao.findById(id).orElse(null);
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

       public String getCustomerId() { return customerId; }
   }

   // ❌ Wrong — no origin, no context
   throw new RuntimeException("Not found");
   ```

3. **Never return `null` from a method that models absence as a possibility. Never accept `null` as a parameter.**
   Express absence with `Optional` (only as a return type — Java 8's `java.util.Optional` is fine to use here), an empty collection, or an exception.

   ```java
   // ✅ Correct — Dao expresses possible absence with Optional
   Optional<Customer> findById(String id);

   // ✅ Correct — empty collection instead of null
   List<Order> findByCustomer(String customerId); // returns an empty list when none

   // ❌ Wrong — returns null, caller must guard
   Customer findById(String id);

   // ❌ Wrong — accepts null, contract is ambiguous
   void update(String id, CustomerUpdateBody body); // called with body == null
   ```

   `Optional` must not be used as a field, a method parameter, or inside a collection; resolve it through `orElseThrow`, `map`, `ifPresent`, or `orElse`.

   This rule applies to newly written business/service/Dao APIs. Many existing `Bean` classes in this codebase expose plain nullable getters because they are populated by reflection-based row mapping or remote serialization — don't rewrite those wholesale, but don't introduce new nullable-returning business methods either.

4. **Use unchecked exceptions for business and programming errors; never leak a raw `SQLException`/`NamingException`/`JMSException` through a Service or Dao's public API.**
   Wrap checked exceptions from JDBC, JNDI, or JMS at the boundary (inside the Dao/client method, in its `catch` block) and rethrow a domain-specific unchecked exception, always preserving the cause.

   ```java
   // ✅ Correct — wrapped once, at the Dao boundary, cause preserved
   public Optional<Customer> findById(String id) {
       String sql = "SELECT * FROM customer WHERE id = ?";
       try (Connection conn = dataSource.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {
           stmt.setString(1, id);
           try (ResultSet rs = stmt.executeQuery()) {
               return rs.next() ? Optional.of(mapRow(rs)) : Optional.empty();
           }
       } catch (SQLException e) {
           throw new CustomerDaoException("[CustomerDao] failed to query customer by id: " + id, e);
       }
   }

   // ❌ Wrong — checked exception leaks into the Service layer, cause lost if rethrown as a new message
   public Optional<Customer> findById(String id) throws SQLException { ... }
   ```

5. **Catch the most specific exception. Never catch `Exception`, `Throwable`, or `RuntimeException` to hide a failure, and never leave a `catch` block empty.**

   ```java
   // ✅ Correct
   } catch (CustomerNotFoundException e) {
       response.sendError(HttpServletResponse.SC_NOT_FOUND);
   }

   // ❌ Wrong — swallows every failure
   } catch (Exception e) {
       // ignore
   }
   ```

6. **Always release resources with try-with-resources.**
   This applies in particular to `Connection`, `PreparedStatement`, `ResultSet`, `InputStream`, and JMS `Session`/`MessageProducer` — never rely on a manual `finally` block calling `close()`.

   ```java
   // ✅ Correct
   try (Connection conn = dataSource.getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) {
       return execute(stmt);
   }
   ```

7. **Log errors at the boundary, not at every layer.**
   Only the outermost handler (the request handler/servlet, the EJB method directly invoked remotely, or the MDB's `onMessage`) should log the error. Intermediate layers (Service, Dao) must let exceptions propagate. Logging at every layer produces duplicate noise and hides the real origin. Never both log and rethrow.

   ```java
   // ✅ Correct — a single boundary handler logs once
   public void handleCreate(HttpServletRequest request, HttpServletResponse response) {
       try {
           service.create(SettingBody.fromRequest(request));
       } catch (CustomerNotFoundException e) {
           logger.error("[SettingRequestHandler] failed to create setting", e);
           response.sendError(HttpServletResponse.SC_NOT_FOUND);
       }
   }

   // ❌ Wrong — service also logs the same error and rethrows
   public Customer fetchById(String id) {
       try {
           ...
       } catch (CustomerNotFoundException e) {
           logger.error("[CustomerService] failed to fetch customer", e); // duplicate
           throw e;
       }
   }
   ```

## Why

Error codes scatter failure-handling logic across every call site and are silently ignored when callers forget to check. Null return values multiply null-guards across the codebase and hide the moment a failure actually occurred. Checked exceptions from JDBC/JNDI/JMS leaking past the Dao boundary force every caller up the stack to either declare or swallow them. Exceptions with context, wrapped once at the right boundary, make failures explicit, self-documenting, and traceable to a single origin.
