# Objects and Data Structures Rule

Objects hide data behind abstractions and expose behavior. Data structures expose data and carry no meaningful behavior. Never mix these two roles in the same type.

## Hard Rules

1. **Expose abstractions, not internals, in business classes.**
   A `Service`, `Dao`, or `Processor` class must not expose its fields through raw getters and setters. It must expose an interface that lets callers manipulate the *essence* of the data without knowing how it is stored.

   ```java
   // ✅ Correct — abstract interface hides the storage detail
   public interface FuelGauge {
       double percentFull();
   }

   // ❌ Wrong — exposes raw fields through trivial accessors on a business class
   public class FuelTank {
       private double gallons;
       public double getGallons() { return gallons; }
       public void setGallons(double value) { this.gallons = value; }
   }
   ```

2. **Obey the Law of Demeter.**
   A method may only call methods on: its own class, objects passed as arguments, objects it creates directly, or direct component fields. Never chain calls into objects returned by other methods.

   ```java
   // ✅ Correct — talks only to its direct collaborator
   public class SettingRequestHandler {
       public void handleCreate(HttpServletRequest request, HttpServletResponse response) {
           settingService.create(SettingBody.fromRequest(request));
       }
   }

   // ❌ Wrong — reaches into internals through a chain
   String connectionString = context.getEnvironment().getConfig().getDatabase().getConnectionString();
   ```

3. **Never mix object and data-structure roles.**
   A type is either an object (hides data, exposes behavior) or a data structure (exposes data, has no behavior). A class with both real business methods and public fields or trivial getters/setters is a hybrid — it carries the downsides of both and the benefits of neither.

   ```java
   // ✅ Correct — pure data structure: a Bean exposed purely for its data
   public class PublishEventBody {
       private String branch;
       private String eventType;
       private Map<String, Object> payload;

       public String getBranch() { return branch; }
       public void setBranch(String branch) { this.branch = branch; }
       // ... remaining getters/setters, no business logic
   }

   // ✅ Correct — pure object: data hidden, only behavior exposed
   public class EventPublisherService {
       private final EventDestination eventDestination;

       public EventPublisherService(EventDestination eventDestination) { this.eventDestination = eventDestination; }

       public void publishEvent(PublishEventBody body) { ... }
   }

   // ❌ Wrong — hybrid: public mutable data with business logic on the same type
   public class Event {
       public String branch;
       public Map<String, Object> payload;
       public void publish() { ... }  // behavior bolted onto a data bag
   }
   ```

4. **Data structures in this codebase are classic mutable JavaBeans — not records.**
   Java 8 has no `record` (Java 16+) and no sealed interfaces (Java 17+), and this codebase's `Bean`/DTO classes already follow one consistent, pre-existing shape for a reason: they are populated by JDBC row-mapping and/or serialized across EJB remote boundaries, both of which rely on reflection and a public no-arg constructor.
   - **New `Bean`/DTO types**: match the existing convention — `private` fields, a public no-arg constructor, and public getters/setters. Do not hand-roll an immutable all-args-constructor variant for a type that needs to cross one of those boundaries; it will not round-trip the way the framework expects.
   - **New small value objects that never cross a reflection/serialization boundary** (e.g. an internal calculation result passed between two methods in the same module): prefer an immutable shape instead — `private final` fields, an all-args constructor, no setters, getters only.
   - **Services, Dao implementations, and any type that encapsulates behavior** are still plain classes, never Beans — do not add a no-arg constructor or setters just for symmetry.

   ```java
   // ✅ Correct — a Bean crossing a JDBC/EJB-remote boundary: classic JavaBean shape
   public class WorkReleaseBean implements Serializable {
       private String branch;
       private String carCode;

       public WorkReleaseBean() {}

       public String getBranch() { return branch; }
       public void setBranch(String branch) { this.branch = branch; }
       public String getCarCode() { return carCode; }
       public void setCarCode(String carCode) { this.carCode = carCode; }
   }

   // ✅ Correct — a purely internal value object: immutable, no reflection boundary to satisfy
   public final class OptimizationResult {
       private final int runId;
       private final List<OptimizationOutput> outputs;

       public OptimizationResult(int runId, List<OptimizationOutput> outputs) {
           this.runId = runId;
           this.outputs = Collections.unmodifiableList(new ArrayList<>(outputs));
       }

       public int getRunId() { return runId; }
       public List<OptimizationOutput> getOutputs() { return outputs; }
   }
   ```

5. **Never put business logic inside a `Bean` class.**
   Validation of a Bean's own invariants on construction is fine; orchestration, external calls, or multi-field business rules belong in a `Service` or `Processor`, not in the Bean.

## Why

Mixing roles produces types that are hard to change: altering a data structure's fields forces changes in every caller that inspects those fields, while adding behavior to a data bag makes the type harder to test and replace. In this codebase specifically, the mutable-JavaBean shape for `Bean`/DTO types is not a style preference — it is a hard requirement of the JDBC row-mapping and EJB-remote-serialization mechanisms those types pass through. Keeping that shape for boundary-crossing types, while using proper immutable value objects everywhere else, gives each type's purpose a single unambiguous answer.
