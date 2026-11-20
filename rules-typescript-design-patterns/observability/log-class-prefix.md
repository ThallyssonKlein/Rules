# Log Class Prefix Rule

Every log statement must be prefixed with `[ClassName]` — the exact name of the class where the log is written.

## Hard Rules

1. **All `logger.*` calls must start with `[ClassName]` as the first argument.**
   Use the literal class name, not a variable or alias.

2. **The prefix must be the exact class name, PascalCase, in square brackets.**
   ```typescript
   // ✅ Correct
   logger.info('[EventProducerController] request received');
   logger.warn('[EventProducerUseCase] event not found');
   logger.error('[EventProducerAdapter] failed to publish', err);

   // ❌ Wrong — no prefix
   logger.info('request received');

   // ❌ Wrong — wrong format
   logger.info('EventProducerController: request received');
   logger.info('[eventProducerController] request received');
   ```

3. **For `logger.error`, pass the error object as the second argument.**
   ```typescript
   // ✅ Correct
   logger.error('[ClassName] operation failed', err);

   // ❌ Wrong — error swallowed
   logger.error('[ClassName] operation failed');
   ```

4. **The message after the prefix must be descriptive and in English.**
   Avoid generic messages like `[ClassName] error` or `[ClassName] ok`.

## Why

A consistent `[ClassName]` prefix makes log lines instantly filterable and traceable to their source without needing a stack trace.
