# ESM Imports Rule

Always use ES module syntax (`import` / `export`). Never use CommonJS (`require` / `module.exports`).

## Hard Rules

1. **Always use `import`.** Never call `require()` inline, dynamically, or inside a function body.

   ```typescript
   // ✅ Correct
   import { View } from 'react-native';
   import { useOrders } from '@hooks/useOrders';

   // ❌ Wrong
   const { View } = require('react-native');
   ```

   **Only exception:** static asset references that Metro requires, e.g. `require('./logo.png')` or `source={require('@assets/logo.png')}`. Prefer a typed asset map module that holds these in one place.

2. **Always use `export`; never `module.exports` / `exports.x`.**
   Config files read by tooling that mandates CommonJS (`metro.config.js`, `babel.config.js`, `jest.config.js`) are exempt.

3. **Prefer named exports over default exports.** Exception: files whose default export is mandated by a framework (e.g. Expo Router route files).

   ```typescript
   // ✅ Correct
   export function OrderCard(props: OrderCardProps) { ... }
   ```

4. **Never use dynamic `require()` to break a circular dependency.** Extract the shared type/value into a third module.

5. **Re-exports must use ESM syntax** (`export { X } from './x'`, `export type { T } from './types'`).

6. **Use `import type` for type-only imports.** It keeps them out of the Metro bundle.

## Why

`import`/`export` are statically analyzable, enabling type checking, tree-shaking, and reliable IDE navigation. Inline `require` also defeats Metro's static dependency graph.
