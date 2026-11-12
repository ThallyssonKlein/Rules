---
name: Logs and Metrics Rule
description: Every src/ implementation file (not ports, not domain models, not tests) must include structured logs and metrics.
type: feedback
---

# Logs and Metrics Rule

When writing or editing any implementation file under `src/` (controllers, use cases, adapters), **always include both structured logs and metrics**.

## Scope

Applies to: `src/**/*.ts` — except:
- `src/**/ports/**` — interfaces don't need metrics
- `src/**/domain/**` — domain models don't need metrics
- `*.spec.ts` — test files

## Required Patterns

### Logs — `nbra-logger`

```typescript
import { logger } from 'nbra-logger';

logger.info('[ClassName] descriptive message');
logger.warn('[ClassName] descriptive message');
logger.error('[ClassName] descriptive message', error);
```

### Metrics — `nbra-metrics-publisher`

```typescript
import { MetricsPublisherFactory, OperationsType } from 'nbra-metrics-publisher';

const publisher = MetricsPublisherFactory.create(...);
publisher.publish({ value: 1, labels: { status: 'ok' }, type: OperationsType.INC });
```

## Reference Implementation

See `src/adapter/inbound/http/controller/SettingController.ts` for the canonical example of both patterns applied together.
