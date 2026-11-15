# Project Structure Rule

## Hard Rules

1. **Organize by feature, not by file type.** Each feature folder owns its components, hooks, services, schemas, types, and tests (`features/orders/{components,hooks,services,...}`).
2. **Shared code lives in `shared/` (or `components/ui`, `lib`)** and must not import from `features/`. Features never import from each other's internals — only from a feature's public `index.ts`.
3. **Dependencies flow one way:** `app/pages` → `features` → `shared`. No circular imports (enforce with `eslint-plugin-import` / `madge`).
4. **Colocate tests, styles, and stories** next to the component (`OrderCard.tsx`, `OrderCard.test.tsx`, `OrderCard.module.css`).
5. **One component per file;** file name equals the component name (see `formatting.md`). Avoid giant `index.tsx` barrels that re-export everything; barrels only at feature boundaries.
6. **Types shared across layers live in the feature's `types.ts`;** API DTOs are separate from UI models and mapped at the service boundary.
7. **Environment access goes through one typed `env.ts`** validated at startup; no `import.meta.env`/`process.env` reads scattered in components.
8. **Keep `app/` (providers, router, global styles) free of business logic.**

```
src/
  app/            providers, router, global styles
  features/
    orders/
      components/ hooks/ services/ schemas.ts types.ts index.ts
  shared/         ui/ hooks/ lib/ utils/
```

## Why

Feature-based structure keeps changes local, makes ownership clear, and prevents the tangled imports that make large React codebases hard to refactor.
