# TypeScript Path Aliases Rule

Always use path aliases for imports. Never use relative paths (`../`) to cross directory boundaries.

## Available Aliases

Check `tsconfig.json` (`compilerOptions.paths`) for the full list (e.g. `@components/*`, `@hooks/*`, `@screens/*`, `@services/*`, `@theme/*`, `@assets/*`).

## Hard Rules

1. **Never use `../` when an alias covers the target.**
2. **`./` is allowed only within the same immediate folder.**
3. **Apply aliases in both `src/` and test files.**
4. **Every alias must be configured in all three places, or imports will break at runtime:**
   - `tsconfig.json` → `paths`
   - `babel.config.js` → `module-resolver` (or the Expo equivalent)
   - `jest.config.js` → `moduleNameMapper`

## Why

Metro does not read `tsconfig.json` paths on its own — an alias that type-checks but is missing from Babel crashes the app at startup. Aliases make imports self-documenting and resilient to restructuring.
