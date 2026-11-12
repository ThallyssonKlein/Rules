# Concurrency Rule

Use the modern `java.util.concurrent` toolbox for asynchronous work. Never manage raw threads, and never block without a bound.

## Hard Rules

1. **Never create or start a raw `Thread` for application work.**
   Use an `ExecutorService` (preferably `Executors.newVirtualThreadPerTaskExecutor()` on Java 21+) or a framework-managed executor. Always close executors (try-with-resources) or manage their lifecycle in the container.

   ```java
   // ✅ Correct — virtual-thread executor, closed automatically
   try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
       Future<Customer> customer = executor.submit(() -> customerClient.fetch(id));
       return customer.get(FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);
   }

   // ❌ Wrong — raw thread, no result handling, no lifecycle
   new Thread(() -> customerClient.fetch(id)).start();
   ```

2. **Compose asynchronous steps with `CompletableFuture` — never nest callbacks.**
   Chain with `thenApply` / `thenCompose` / `thenCombine`, and handle failure once with `exceptionally` or `handle`.

   ```java
   // ✅ Correct — flat composition
   CompletableFuture<OrderSummary> summary = orderClient.fetchAsync(orderId)
       .thenCompose(order -> customerClient.fetchAsync(order.customerId())
           .thenApply(customer -> OrderSummary.of(order, customer)));

   // ❌ Wrong — callback pyramid
   orderClient.fetchAsync(orderId, order -> {
       customerClient.fetchAsync(order.customerId(), customer -> {
           callback.accept(OrderSummary.of(order, customer));
       });
   });
   ```

3. **Never block indefinitely.**
   `Future.get()`, `CompletableFuture.get()`, `join()`, and `BlockingQueue.take()` must use a timeout when the wait is on an external dependency. Name the timeout as a constant.

   ```java
   // ✅ Correct
   Customer customer = future.get(FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);

   // ❌ Wrong — a stuck dependency hangs the caller forever
   Customer customer = future.get();
   ```

4. **Never swallow `InterruptedException`.**
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

5. **Prefer immutable objects and concurrent collections over `synchronized`.**
   Share state through immutable records, `ConcurrentHashMap`, `AtomicInteger`, or `LongAdder`. Use `synchronized` / `ReentrantLock` only when an invariant spans several fields, and keep the critical section minimal.

   ```java
   // ✅ Correct
   private final ConcurrentMap<String, Tenant> tenants = new ConcurrentHashMap<>();

   // ❌ Wrong — synchronized wrapper around a plain map for a simple cache
   private final Map<String, Tenant> tenants = new HashMap<>();
   public synchronized Tenant get(String id) { return tenants.get(id); }
   ```

6. **Never use `parallelStream()` for I/O or inside request handling.**
   It uses the shared common pool and starves unrelated work. Use an explicit executor instead.

## Why

Raw threads, unbounded waits, and ad-hoc locking produce failures that appear only under load and are almost impossible to reproduce. Executors, bounded timeouts, and immutable state make concurrency explicit, observable, and safe to reason about.
