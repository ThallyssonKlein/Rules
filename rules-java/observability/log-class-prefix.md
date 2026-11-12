# Log Class Prefix Rule

Every log statement must be prefixed with `[ClassName]` — the exact name of the class where the log is written.

## Hard Rules

1. **All `log.*` calls must start with `[ClassName]` at the beginning of the message.**
   Use the literal class name, not a variable, alias, or `getClass()`.

2. **The prefix must be the exact class name, PascalCase, in square brackets.**
   Use SLF4J with parameterized messages — never string concatenation.

   ```java
   // ✅ Correct
   log.info("[EventProducerController] request received");
   log.warn("[EventProducerService] event not found for id: {}", eventId);
   log.error("[EventProducerClient] failed to publish", exception);

   // ❌ Wrong — no prefix
   log.info("request received");

   // ❌ Wrong — wrong format
   log.info("EventProducerController: request received");
   log.info("[eventProducerController] request received");

   // ❌ Wrong — string concatenation instead of placeholders
   log.warn("[EventProducerService] event not found for id: " + eventId);
   ```

3. **For `log.error`, pass the exception as the last argument.**
   SLF4J prints the stack trace when a `Throwable` is the final argument. Never log only `e.getMessage()`.

   ```java
   // ✅ Correct
   log.error("[ClassName] operation failed", exception);

   // ❌ Wrong — stack trace lost
   log.error("[ClassName] operation failed: {}", exception.getMessage());

   // ❌ Wrong — exception swallowed
   log.error("[ClassName] operation failed");
   ```

4. **The message after the prefix must be descriptive and in English.**
   Avoid generic messages like `[ClassName] error` or `[ClassName] ok`.

5. **Use the right level.**
   `error` for failures that need attention, `warn` for recoverable anomalies, `info` for significant business events, `debug` for diagnostics. Never log secrets, tokens, or personal data.

## Why

A consistent `[ClassName]` prefix makes log lines instantly filterable and traceable to their source without needing a stack trace.
