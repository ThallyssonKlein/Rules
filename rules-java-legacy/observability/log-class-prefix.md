# Log Class Prefix Rule

Every log statement must be prefixed with `[ClassName]` — the exact name of the class where the log is written.

## Hard Rules

1. **All log calls must start with `[ClassName]` at the beginning of the message.**
   Use the literal class name, not a variable, alias, or `getClass()`.

2. **The prefix must be the exact class name, PascalCase, in square brackets.**
   This codebase does not have one single logging facade — different modules use different logging APIs (a custom trace-logger abstraction with `entering`/`exiting`/`catching` methods, `java.util.logging`, or SLF4J in newer modules). This rule applies regardless of which one a given module uses: match whatever facade the module already uses, and keep the `[ClassName]` prefix consistent across all of them.

   ```java
   // ✅ Correct — SLF4J-style facade, parameterized message
   logger.info("[SettingRequestHandler] request received");
   logger.warn("[SettingDao] setting not found for id: {}", id);

   // ✅ Correct — custom trace-logger facade used by older modules
   getLogger().errorT(methodName, "[OverviewServiceImpl] " + e.toString());

   // ❌ Wrong — no prefix
   logger.info("request received");

   // ❌ Wrong — wrong format
   logger.info("SettingRequestHandler: request received");
   logger.info("[settingRequestHandler] request received");
   ```

   When the module's logging facade supports parameterized/placeholder messages (SLF4J-style `{}`), use them instead of string concatenation. When it doesn't (older trace-logger / `java.util.logging` style), concatenate explicitly and keep the prefix as the first element of the string.

3. **When logging an exception, always pass the exception object itself — never only `e.getMessage()`.**
   Whichever logging facade is in use, make sure the full stack trace is captured, not just the message text.

   ```java
   // ✅ Correct — SLF4J-style, exception as last argument preserves the stack trace
   logger.error("[SettingDao] operation failed", exception);

   // ❌ Wrong — stack trace lost
   logger.error("[SettingDao] operation failed: {}", exception.getMessage());

   // ❌ Wrong — exception swallowed entirely
   logger.error("[SettingDao] operation failed");
   ```

4. **The message after the prefix must be descriptive and in English.**
   Avoid generic messages like `[ClassName] error` or `[ClassName] ok`.

5. **Use the right level.**
   `error` for failures that need attention, `warn` for recoverable anomalies, `info` for significant business events, `debug`/`trace` for diagnostics. Never log secrets, tokens, or personal data.

## Why

A consistent `[ClassName]` prefix makes log lines instantly filterable and traceable to their source without needing a stack trace — this matters even more in a codebase where several logging backends coexist, since grepping for `[ClassName]` is the one thing that works the same way regardless of which facade produced the line.
