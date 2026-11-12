---
name: Logs and Metrics Rule
description: Every implementation class in src/main/java (not interfaces, not records/models, not tests) must include structured logs and metrics.
type: feedback
---

# Logs and Metrics Rule

When writing or editing any implementation class under `src/main/java` (controllers, services, repositories, clients), **always include both structured logs and metrics**.

## Scope

Applies to: `src/main/java/**/*.java` — except:
- Interfaces — interfaces don't need metrics
- Records, enums, and plain model/DTO types — data carriers don't need metrics
- Exceptions and configuration classes
- `src/test/**` — test classes

## Required Patterns

### Logs — SLF4J

Declare the logger as a `private static final` field named `log` (Lombok `@Slf4j` is acceptable if the project already uses Lombok). The message prefix rule is defined in `log-class-prefix.md`.

```java
private static final Logger log = LoggerFactory.getLogger(SettingService.class);

log.info("[SettingService] descriptive message");
log.warn("[SettingService] descriptive message for id: {}", id);
log.error("[SettingService] descriptive message", exception);
```

### Metrics — Micrometer

Inject a `MeterRegistry` through the constructor — never use a global registry. Define metric names as constants, and keep tag cardinality low (no ids, emails, or free text as tag values).

```java
private static final String OPERATIONS_METRIC = "setting.operations";

private final MeterRegistry meterRegistry;

void create(SettingBody data) {
    settingRepository.save(Setting.from(data));
    meterRegistry.counter(OPERATIONS_METRIC, "operation", "create", "status", "ok").increment();
}
```

Use a `Timer` (`meterRegistry.timer(...)` / `@Timed`) for latency of external calls.

## Reference Implementation

Point to the project's canonical class that applies both patterns together (for example `src/main/java/<base-package>/controller/SettingController.java`) and keep this reference up to date.
