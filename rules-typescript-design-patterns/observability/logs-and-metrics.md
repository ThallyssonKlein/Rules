---
name: Logs and Metrics Rule
description: Every src/ implementation file (not interfaces, not plain models, not tests) must include structured logs and metrics.
type: feedback
---

# Logs and Metrics Rule

When writing or editing any implementation file under `src/` (controllers, services, repositories), **always include both structured logs and metrics**.

## Scope

Applies to: `src/**/*.ts` — except:
- `src/**/interfaces/**` — interfaces don't need metrics
- `src/**/models/**` — plain models don't need metrics
- `*.spec.ts` — test files

## Required Patterns

### Logs

Use the project's configured logging library through a shared logger instance — never `console.log`. Use the appropriate level (`info`, `warn`, `error`) and pass the error object as an extra argument on `error`. The message prefix rule is defined in `log-class-prefix.md`.

```typescript
logger.info('[ClassName] descriptive message');
logger.warn('[ClassName] descriptive message');
logger.error('[ClassName] descriptive message', error);
```

### Metrics

Use the project's configured metrics library. Publish counters for operations (with a `status` label) and timers/histograms for latency of external calls. Keep label cardinality low (no ids, emails, or free text as label values).

```typescript
metrics.increment('setting.operations', { operation: 'create', status: 'ok' });
```

> The snippets above are illustrative. Use whichever logging and metrics libraries the project already adopts.

## Reference Implementation

See `src/controllers/SettingController.ts` for the canonical example of both patterns applied together.
