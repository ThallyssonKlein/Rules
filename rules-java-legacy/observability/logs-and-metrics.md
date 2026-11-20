---
name: Logs Rule
description: Every implementation class (not interfaces, not Bean/DTO types, not tests) must include structured, meaningful logs at its boundary points.
type: feedback
---

# Logs Rule

When writing or editing any implementation class (request handlers, EJB beans, `Service`/`Dao`/`Processor` classes), **always include logs at meaningful points** — entry of a significant operation, a recoverable failure, and any thrown exception at the boundary where it's finally handled (see `error-handling.md` rule 7).

## Scope

Applies to: request handlers, EJB session/message-driven beans, `Service`, `Dao`, `Processor`, and client classes — except:
- Interfaces — interfaces don't need logs.
- `Bean`/DTO types and enums — data carriers don't need logs.
- Exceptions and configuration classes.
- Test classes.

## Required Pattern

Use whichever logging facade the module already depends on — do not add a new logging library to a module that doesn't already have one. The message prefix rule is defined in `log-class-prefix.md`.

```java
// Module already on SLF4J
private static final Logger logger = LoggerFactory.getLogger(SettingServiceImpl.class);

logger.info("[SettingServiceImpl] descriptive message");
logger.warn("[SettingServiceImpl] descriptive message for id: {}", id);
logger.error("[SettingServiceImpl] descriptive message", exception);
```

```java
// Module on the project's custom trace-logger abstraction
getLogger().entering("create");
try {
    ...
} catch (SQLException e) {
    getLogger().catching(e);
    getLogger().errorT("create", "[SettingDaoImpl] failed to persist setting: " + e.getMessage());
    throw new SettingDaoException("[SettingDaoImpl] failed to persist setting", e);
} finally {
    getLogger().exiting("create");
}
```

## No metrics library is currently configured in this stack

There is no Micrometer/Dropwizard Metrics (or similar) dependency in this workspace, so **do not add metric-emitting code** (counters, timers, gauges) as part of a change — there is nothing in the build to collect or export them, and a half-wired metrics call is dead code. If the team later adopts a metrics library in a module, update this rule with the required pattern, matching how the original (non-legacy) rules-java-no-hexagonal pack documents its logs-and-metrics rule.

## Why

Logs are the only observability signal this stack has end-to-end today. A boundary that fails silently, or logs a message with no class context, is effectively invisible in production — there's no metrics dashboard to catch it instead.
