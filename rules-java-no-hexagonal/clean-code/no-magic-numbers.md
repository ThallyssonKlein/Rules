# No Magic Numbers Rule

Every numeric (or string) literal that carries domain meaning must be extracted to a named constant. A bare number in the middle of logic is a magic number — it silently encodes intent that the reader cannot recover without context.

## Hard Rules

1. **Never use a bare numeric or string literal where its meaning is not self-evident from immediate context.**
   Extract it to a `static final` constant with a name that captures *why* the value exists.

   ```java
   // ✅ Correct — intent is explicit
   private static final int MAX_RETRY_ATTEMPTS = 3;
   private static final String TENANT_HEADER = "x-tenant-id";

   if (attempt > MAX_RETRY_ATTEMPTS) throw new RetryExhaustedException("[RetryPolicy] max retries exceeded");
   String tenantId = request.getHeader(TENANT_HEADER);

   // ❌ Wrong — reader must guess what 3 or "x-tenant-id" mean
   if (attempt > 3) throw new RetryExhaustedException("[RetryPolicy] max retries exceeded");
   String tenantId = request.getHeader("x-tenant-id");
   ```

2. **Place constants as close as possible to their use, but no closer than needed.**
   - **Class-scoped** (`private static final`, at the top of the class): for values that are an internal detail of one class — the default choice in Java.
   - **Shared** (a dedicated `final` constants class with a private constructor, or an `enum`): only when several classes genuinely use the same value.
   - Do not make constants `public` unless another class actually uses them.

   ```java
   // ✅ Correct — class-scoped, used by multiple methods in the class
   public class EventProducerClient {
       private static final int MAX_PAYLOAD_SIZE_BYTES = 65_536;

       public void publish(byte[] payload) {
           if (payload.length > MAX_PAYLOAD_SIZE_BYTES) {
               throw new PayloadTooLargeException("[EventProducerClient] payload exceeds size limit");
           }
           // ...
       }
   }

   // ✅ Correct — a Duration constant carries its unit in the type
   public class RateLimiter {
       private static final Duration WINDOW_SIZE = Duration.ofMinutes(1);
       private static final int MAX_REQUESTS_PER_WINDOW = 100;
   }
   ```

3. **Use the framework's named constants for HTTP status codes — never inline numbers.**
   Use `HttpStatus.CREATED` (Spring), `Response.Status.CREATED` (JAX-RS), or `HttpURLConnection.HTTP_CREATED`. If the framework offers none, declare named constants.

   ```java
   // ✅ Correct
   return ResponseEntity.status(HttpStatus.CREATED).body(result);

   // ❌ Wrong
   return ResponseEntity.status(201).body(result);
   ```

4. **Prefer enums over groups of related constants, and typed values over raw numbers.**
   Model closed sets as an `enum`; model durations as `Duration`, sizes as a named constant with the unit in the name.

   ```java
   // ✅ Correct
   enum OrderStatus { ACTIVE, CANCELLED, SHIPPED }
   private static final Duration SESSION_TTL = Duration.ofHours(24);

   // ❌ Wrong
   private static final int STATUS_ACTIVE = 1;
   private static final int STATUS_CANCELLED = 2;
   private static final long SESSION_TTL = 86400000;
   ```

5. **The only exempt literals are universally self-evident values.**
   The following may appear inline without a named constant:
   - `0` and `1` used as indices, counters, or loop seeds where context makes meaning obvious.
   - Boolean literals (`true`, `false`).
   - Empty string `""` used as a default or sentinel where context is clear.

   Any other numeric literal — including `2`, `-1`, `404`, `1000`, `86400` — requires a named constant.

6. **Use underscores for readability on large literals.**

   ```java
   // ✅ Correct
   private static final long MAX_UPLOAD_SIZE_BYTES = 10_485_760L;

   // ❌ Wrong
   private static final long MAX_UPLOAD_SIZE_BYTES = 10485760L;
   ```

## Why

A magic number is a contract between the author and the future reader that the reader was never told about. The moment a bare `202`, `3`, or `86400000` appears in code, any maintainer must either guess its meaning or grep for context. A named constant makes the intent explicit, creates a single point of change, and allows the compiler to catch accidental use of the wrong literal.
