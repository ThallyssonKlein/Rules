# Concurrency Rule

This is a Java EE / EJB application: the container, not your code, owns thread management. Use asynchronous messaging and the `java.util.concurrent` toolbox available on Java 8 — never manage raw threads inside a managed component, and never block without a bound.

## Hard Rules

1. **Never create or start a raw `Thread` inside an EJB, servlet, or any container-managed component.**
   The Java EE specification forbids managed components from spawning and managing their own threads — doing so breaks the container's transaction, security, and classloading guarantees, even when it happens to work in testing. If work needs to happen asynchronously, hand it off properly:
   - For fire-and-forget or decoupled processing: send a JMS message and let a **Message-Driven Bean (MDB)** consume it.
   - For an async method on a session bean (EJB 3.1+): use `@Asynchronous`, if the target application server supports it.
   - Only in a plain (non-managed) utility module that genuinely runs outside the container should you consider an `ExecutorService` directly — and even then, prefer the narrowest tool that does the job.

   ```java
   // ✅ Correct — hand the work to a message-driven bean via JMS, instead of threading manually
   public class LabelPrintService {
       private final Queue printQueue;
       private final JmsTemplateLike jmsSender;

       public void requestPrintAsync(PrintJob job) {
           jmsSender.send(printQueue, job);
       }
   }

   // ❌ Wrong — raw thread started inside a managed EJB method
   public class LabelPrintServiceBean {
       public void requestPrint(PrintJob job) {
           new Thread(() -> printer.print(job)).start();
       }
   }
   ```

2. **If an `ExecutorService` is genuinely appropriate (plain, non-managed code only), size and close it explicitly.**
   Java 8 has no virtual threads (that's Java 21+) — use a bounded `Executors.newFixedThreadPool(n)` or `Executors.newCachedThreadPool()` sized for the actual workload, and always close it (try-with-resources is not available for `ExecutorService` until Java 19 — call `shutdown()`/`awaitTermination` explicitly, or manage its lifecycle in a dedicated class with a clear start/stop).

   ```java
   // ✅ Correct — explicit lifecycle management
   ExecutorService executor = Executors.newFixedThreadPool(POOL_SIZE);
   try {
       Future<Customer> customer = executor.submit(() -> customerClient.fetch(id));
       return customer.get(FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);
   } finally {
       executor.shutdown();
   }

   // ❌ Wrong — raw thread, no result handling, no lifecycle
   new Thread(() -> customerClient.fetch(id)).start();
   ```

3. **Compose asynchronous steps with `CompletableFuture` — never nest callbacks.**
   `CompletableFuture` is available since Java 8. Chain with `thenApply` / `thenCompose` / `thenCombine`, and handle failure once with `exceptionally` or `handle`.

   ```java
   // ✅ Correct — flat composition
   CompletableFuture<OrderSummary> summary = orderClient.fetchAsync(orderId)
       .thenCompose(order -> customerClient.fetchAsync(order.getCustomerId())
           .thenApply(customer -> OrderSummary.of(order, customer)));

   // ❌ Wrong — callback pyramid
   orderClient.fetchAsync(orderId, order -> {
       customerClient.fetchAsync(order.getCustomerId(), customer -> {
           callback.accept(OrderSummary.of(order, customer));
       });
   });
   ```

4. **Never block indefinitely.**
   `Future.get()`, `CompletableFuture.get()`, `join()`, and `BlockingQueue.take()` must use a timeout when the wait is on an external dependency (a remote EJB call, a JDBC query, another system over JMS/HTTP). Name the timeout as a constant.

   ```java
   // ✅ Correct
   Customer customer = future.get(FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);

   // ❌ Wrong — a stuck dependency hangs the caller forever
   Customer customer = future.get();
   ```

5. **Never swallow `InterruptedException`.**
   Restore the interrupt flag or propagate the exception.

   ```java
   // ✅ Correct
   try {
       return future.get(FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);
   } catch (InterruptedException e) {
       Thread.currentThread().interrupt();
       throw new CustomerFetchException(id, e);
   }

   // ❌ Wrong — interruption silently lost
   } catch (InterruptedException e) {
       // ignore
   }
   ```

6. **Prefer immutable objects and `java.util.concurrent` collections over `synchronized`.**
   Share state through `ConcurrentHashMap`, `AtomicInteger`/`AtomicLong`, or `CopyOnWriteArrayList`. Use `synchronized` / `ReentrantLock` only when an invariant spans several fields, and keep the critical section minimal. Remember EJB container concurrency rules: stateless/message-driven beans are pooled and must not hold mutable instance state across invocations; a stateful bean's instance fields are only safe because the container serializes access to a given instance.

   ```java
   // ✅ Correct
   private final ConcurrentMap<String, Branch> branchCache = new ConcurrentHashMap<>();

   // ❌ Wrong — synchronized wrapper around a plain map for a simple cache
   private final Map<String, Branch> branchCache = new HashMap<>();
   public synchronized Branch get(String id) { return branchCache.get(id); }
   ```

7. **Never use `parallelStream()` inside a managed component.**
   Like raw threads, `parallelStream()` uses the shared common `ForkJoinPool`, which the container does not manage or account for — it can starve other work and violates the same "don't manage your own threads" constraint as rule 1.

## Why

Raw threads, unbounded waits, and ad-hoc locking produce failures that appear only under load and are almost impossible to reproduce — and inside an EJB container they also silently violate the component contract the container relies on for transactions and pooling. Routing async work through JMS/MDBs, bounding every wait, and keeping concurrency explicit is what keeps this kind of application predictable in production.
