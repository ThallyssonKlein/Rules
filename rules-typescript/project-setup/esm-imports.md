# ESM Imports Rule

Always use ES module syntax (`import` / `export`). Never use CommonJS (`require` / `module.exports`).

## Hard Rules

1. **Always use `import` to consume modules.**
   Never call `require()` — not inline, not dynamically, not inside a function body.

   ```typescript
   // ✅ Correct
   import { logger } from 'nbra-logger';
   import { SettingUseCase } from '@application/usecases/SettingUseCase';

   // ❌ Wrong
   const logger = require('nbra-logger');
   const { SettingUseCase } = require('@application/usecases/SettingUseCase');
   ```

2. **Always use `export` or `export default` to expose values.**
   Never assign to `module.exports` or `exports`.

   ```typescript
   // ✅ Correct
   export class SettingUseCase { ... }
   export { RouterFactory };
   export default SettingUseCase;

   // ❌ Wrong
   module.exports = SettingUseCase;
   module.exports = { RouterFactory };
   exports.SettingUseCase = SettingUseCase;
   ```

3. **Prefer named exports over default exports for classes and functions.**
   Named exports are explicit, refactor-safe, and easier to tree-shake.

   ```typescript
   // ✅ Correct — named export
   export class EventProducerUseCase { ... }
   export interface IEventProducerUseCase { ... }

   // ✅ Acceptable — default export for a single primary class per file
   export default class EventProducerUseCase { ... }

   // ❌ Wrong — CommonJS style default
   module.exports = EventProducerUseCase;
   ```

4. **Never use dynamic `require()` as a workaround for circular dependencies.**
   Resolve circular dependencies by extracting the shared type or value into a third module that both sides import.

   ```typescript
   // ❌ Wrong — dynamic require to break a cycle
   function getUseCase() {
     return require('./EventProducerUseCase').EventProducerUseCase;
   }
   ```

5. **Re-exports must also use ESM syntax.**

   ```typescript
   // ✅ Correct
   export { RouterFactory } from './router-factory';
   export type { ISettingUseCase } from '@application/ports/inbound/ISettingUseCase';

   // ❌ Wrong
   const { RouterFactory } = require('./router-factory');
   module.exports = { RouterFactory };
   ```

## Why

`require` is evaluated at runtime, which prevents static analysis, tree-shaking, and reliable IDE navigation. `import` / `export` are analyzed at compile time — TypeScript can enforce types across module boundaries, bundlers can eliminate dead code, and editors can resolve symbols without executing the program.
