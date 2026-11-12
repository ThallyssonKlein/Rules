# TypeScript Path Aliases Rule

Always use TypeScript path aliases for imports. Never use relative paths (`../`) to cross layer or directory boundaries.

## Available Aliases

Check `tsconfig.json` (`compilerOptions.paths`) for the full list of available aliases.

## Hard Rules

1. **Never use `../` paths when an alias covers the target.**
   Check `tsconfig.json` and use the matching alias instead.

2. **`./` is allowed only within the same immediate folder.**

3. **Apply aliases in both `src/` and `tests/` files.**

## Why

Relative paths that climb multiple directory levels (`../../../`) are fragile and obscure architecture boundaries. Path aliases make imports self-documenting and resilient to directory restructuring.
