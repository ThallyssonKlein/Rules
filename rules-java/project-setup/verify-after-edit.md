---
name: Verify After Edit Rule
description: After modifying any file under src/main or src/test, always run format, the affected tests, and the full build — fix all failures before finishing.
type: feedback
---

# Verify After Edit Rule

After **any** modification to files under `src/main/java` or `src/test/java`, you must run the formatter, the affected tests, and the full build. Do not consider a task done until all three pass.

## Hard Rules

1. **Only after ALL edits are done — run the formatter, then the affected tests, then the build.**
   Do not run any of these between individual file edits. Wait until the full change set is complete.

   ```bash
   ./mvnw spotless:apply
   ./mvnw test -Dtest=SettingServiceTest
   ./mvnw verify
   ```

2. **If formatting or static analysis fails — fix all findings before proceeding.**
   Run `./mvnw spotless:apply` to auto-fix what's possible, then manually resolve any remaining Checkstyle / PMD / SpotBugs issues. Re-run until clean.

3. **If tests fail — fix the failures before finishing.**
   Do not leave a failing test suite. Read the error output, identify the root cause, fix the code or the test, then re-run until green. Never `@Disabled` a test or use `-DskipTests` to get past a failure.

4. **If the build fails — fix the compiler errors before finishing.**
   Do not ignore compiler errors or warnings promoted to errors. Fix the source, then re-run `./mvnw verify` until it exits with code 0.

5. **Do not skip verification even for "small" edits.**
   A one-line change can break a formatting rule, a type, or a test. Always verify.

## Order of Operations

```
1. Make ALL code changes
2. ./mvnw spotless:apply                  ← fix until clean
3. ./mvnw test -Dtest=<AffectedTest>      ← fix until green
4. ./mvnw verify                          ← fix until exits 0
5. Task is done
```

## Why

Unverified changes break the pipeline and shift debugging burden to the next person. Running the formatter, tests, and build locally — and fixing failures immediately — keeps the branch in an always-green state.
