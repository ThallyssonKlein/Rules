# No Magic Numbers Rule

Every numeric (or string) literal that carries domain meaning must be extracted to a named constant. A bare number in the middle of logic is a magic number — it silently encodes intent that the reader cannot recover without context.

## Hard Rules

1. **Never use a bare numeric or string literal where its meaning is not self-evident from immediate context.**
   Extract it to a `const` with a name that captures *why* the value exists.

   ```typescript
   // ✅ Correct — intent is explicit
   const MAX_RETRY_ATTEMPTS = 3;
   const HTTP_STATUS_ACCEPTED = 202;
   const TENANT_HEADER = 'x-tenant-id';

   if (attempt > MAX_RETRY_ATTEMPTS) throw new Error('[RetryPolicy] max retries exceeded');
   res.status(HTTP_STATUS_ACCEPTED).send();
   const tenantId = req.headers[TENANT_HEADER];

   // ❌ Wrong — reader must guess what 3, 202, or 'x-tenant-id' mean
   if (attempt > 3) throw new Error('[RetryPolicy] max retries exceeded');
   res.status(202).send();
   const tenantId = req.headers['x-tenant-id'];
   ```

2. **Place constants as close as possible to their use, but no closer than needed.**
   - **Module-scoped** (`const` at the top of the file, below imports): for values used by multiple members of the same module.
   - **Class-scoped** (`private static readonly`): for values that are an internal detail of one class.
   - Do not export module-scoped constants unless another module actually imports them.

   ```typescript
   // ✅ Correct — module-scoped, used by multiple methods in the file
   const MAX_PAYLOAD_SIZE_BYTES = 65_536;

   export class EventProducerClient {
     async publish(payload: Buffer): Promise<void> {
       if (payload.byteLength > MAX_PAYLOAD_SIZE_BYTES) {
         throw new Error('[EventProducerClient] payload exceeds size limit');
       }
       // ...
     }
   }

   // ✅ Correct — class-scoped private constant
   export class RateLimiter {
     private static readonly WINDOW_SIZE_MS = 60_000;
     private static readonly MAX_REQUESTS_PER_WINDOW = 100;
   }
   ```

3. **HTTP status codes must always be named constants — never inline numbers.**
   Standard status codes are well-known, but inline numbers create friction when they need to change and obscure intent when stacked.

   ```typescript
   // ✅ Correct
   const HTTP_OK = 200;
   const HTTP_CREATED = 201;
   const HTTP_ACCEPTED = 202;
   const HTTP_BAD_REQUEST = 400;
   const HTTP_NOT_FOUND = 404;
   const HTTP_INTERNAL_SERVER_ERROR = 500;

   res.status(HTTP_CREATED).json(result);

   // ❌ Wrong
   res.status(201).json(result);
   ```

4. **The only exempt literals are universally self-evident values.**
   The following may appear inline without a named constant:
   - `0` and `1` used as array indices or loop seeds where context makes meaning obvious.
   - Boolean literals (`true`, `false`).
   - Empty string `''` used as a default or sentinel where context is clear.

   Any other numeric literal — including `2`, `-1`, `404`, `1000`, `86400` — requires a named constant.

5. **Use numeric separators (`_`) for readability on large literals.**

   ```typescript
   // ✅ Correct
   const SESSION_TTL_MS = 86_400_000;
   const MAX_PAYLOAD_SIZE_BYTES = 65_536;

   // ❌ Wrong
   const SESSION_TTL_MS = 86400000;
   ```

## Why

A magic number is a contract between the author and the future reader that the reader was never told about. The moment a bare `202`, `3`, or `86400000` appears in code, any maintainer must either guess its meaning or grep for context. A named constant makes the intent explicit, creates a single point of change, and allows the compiler to catch accidental use of the wrong literal.
