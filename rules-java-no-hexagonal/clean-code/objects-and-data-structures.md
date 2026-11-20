# Objects and Data Structures Rule

Objects hide data behind abstractions and expose behavior. Data structures expose data and carry no meaningful behavior. Never mix these two roles in the same type.

## Hard Rules

1. **Expose abstractions, not internals.**
   A class must not expose its fields through raw getters and setters. It must expose an interface that lets callers manipulate the *essence* of the data without knowing how it is stored.

   ```java
   // ✅ Correct — abstract interface hides the storage detail
   interface FuelGauge {
       double percentFull();
   }

   // ❌ Wrong — exposes raw fields through trivial accessors
   class Vehicle {
       private double gallonsOfGasoline;
       public double getGallonsOfGasoline() { return gallonsOfGasoline; }
       public void setGallonsOfGasoline(double value) { this.gallonsOfGasoline = value; }
   }
   ```

2. **Obey the Law of Demeter.**
   A method may only call methods on: its own class, objects passed as arguments, objects it creates directly, or direct component fields. Never chain calls into objects returned by other methods.

   ```java
   // ✅ Correct — talks only to its direct collaborator
   class EventProducerController {
       ResponseEntity<Void> publish(PublishEventBody body) {
           eventProducerService.publishEvent(body);
           return ResponseEntity.accepted().build();
       }
   }

   // ❌ Wrong — reaches into internals through a chain
   String connectionString = context.getEnvironment().getConfig().getDatabase().getConnectionString();
   ```

3. **Never mix object and data-structure roles.**
   A type is either an object (hides data, exposes behavior) or a data structure (exposes data, has no behavior). A class with both real business methods and public fields or trivial getters/setters is a hybrid — it carries the downsides of both and the benefits of neither.

   ```java
   // ✅ Correct — pure data structure (DTO): an immutable record
   record PublishEventBody(String tenantId, String eventType, Map<String, Object> payload) {}

   // ✅ Correct — pure object: data hidden, only behavior exposed
   class EventProducerService {
       private final EventPublisher eventPublisher;

       EventProducerService(EventPublisher eventPublisher) { this.eventPublisher = eventPublisher; }

       void publishEvent(PublishEventBody body) { ... }
   }

   // ❌ Wrong — hybrid: mutable public data with business logic
   class Event {
       public String tenantId;
       public Map<String, Object> payload;
       void publish() { ... }  // behavior on a data bag
   }
   ```

4. **Use `record` for data structures; use classes for objects.**
   - Use **records** for DTOs, request bodies, response shapes, value objects, and configuration. Validate invariants in the compact constructor.
   - Use **sealed interfaces + records** to model closed variants (e.g. results with several outcomes), consumed with pattern-matching `switch`.
   - Use **classes** for services, controllers, repositories, and any type that encapsulates behavior behind an interface.
   - Do not use Lombok `@Data` / `@Getter` / `@Setter` on types that have behavior.

   ```java
   // ✅ Correct — invariant validated once, in the compact constructor
   record Money(BigDecimal amount, Currency currency) {
       Money {
           Objects.requireNonNull(amount, "amount is required");
           Objects.requireNonNull(currency, "currency is required");
           if (amount.signum() < 0) throw new IllegalArgumentException("[Money] amount must not be negative");
       }
   }

   // ✅ Correct — sealed result consumed with a pattern-matching switch
   sealed interface PaymentResult permits Approved, Declined {}
   record Approved(String transactionId) implements PaymentResult {}
   record Declined(String reason) implements PaymentResult {}

   String message = switch (result) {
       case Approved approved -> "Paid: " + approved.transactionId();
       case Declined declined -> "Declined: " + declined.reason();
   };
   ```

5. **Prefer immutability.**
   Fields are `private final` by default; mutate only when the object's purpose is to manage changing state.

## Why

Mixing roles produces types that are hard to change: altering a data structure's fields forces changes in every caller that inspects those fields, while adding behavior to a data bag makes the type harder to test and replace. Keeping the two roles separate makes each type's purpose obvious, minimizes coupling, and makes it straightforward to swap implementations behind interfaces.
