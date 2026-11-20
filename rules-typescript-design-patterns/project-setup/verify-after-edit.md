---
name: Verify After Edit Rule
description: After modifying any file under src/ or tests/, always run lint, the affected tests, and the build — fix all failures before finishing.
type: feedback
---

# Verify After Edit Rule

After **any** modification to files under `src/` or `tests/`, you must run lint, the affected tests, and the full build. Do not consider a task done until all three pass.

## Hard Rules

1. **Only after ALL edits are done — run lint, then the affected tests, then the build.**
   Do not run any of these between individual file edits. Wait until the full change set is complete.

   ```bash
   npm run lint-fix
   npx jest tests/path/to/affected.spec.ts
   npm run build
   ```

2. **If lint fails — fix all lint errors before proceeding.**
   Run `npm run lint-fix` to auto-fix what's possible, then manually resolve any remaining issues. Re-run until clean.

3. **If tests fail — fix the failures before finishing.**
   Do not leave a failing test suite. Read the error output, identify the root cause, fix the code or the test, then re-run until green.

4. **If the build fails — fix the TypeScript errors before finishing.**
   Do not ignore compiler errors. Fix the source, then re-run `npm run build` until it exits with code 0.

5. **Do not skip verification even for "small" edits.**
   A one-line change can break a lint rule, a type, or a test. Always verify.

## Order of Operations

```
1. Make ALL code changes
2. npm run lint-fix                    ← fix until clean
3. npx jest tests/<affected>.spec.ts   ← fix until green
4. npm run build                        ← fix until exits 0
5. Task is done
```

## Why

Unverified changes break the pipeline and shift debugging burden to the next person. Running lint, tests, and build locally — and fixing failures immediately — keeps the branch in an always-green state.
