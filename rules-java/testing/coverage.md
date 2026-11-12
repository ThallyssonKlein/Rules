---
name: Coverage Rule
description: Implementation classes in src/main/java must have >= 80% test coverage across instructions, branches, methods, and lines (JaCoCo).
type: feedback
---

# Coverage Rule

When writing or editing implementation classes under `src/main/java`, ensure the corresponding test class covers **>= 80%** on all four JaCoCo metrics: instructions, branches, methods, and lines.

## How to apply

- Write comprehensive tests upfront — cover happy path, error paths, and edge cases.
- If editing an existing class, check whether new branches or methods are already covered by existing tests and add missing cases.
- The test class mirrors the source path and package: `src/main/java/com/acme/SettingService.java` → `src/test/java/com/acme/SettingServiceTest.java`.

## Verification

To check coverage for a specific class:

```bash
./mvnw test -Dtest=SettingServiceTest jacoco:report
# report: target/site/jacoco/index.html
```

Enforce the threshold in the build with the `jacoco:check` goal (`<minimum>0.80</minimum>` for `INSTRUCTION`, `BRANCH`, `METHOD`, and `LINE`), so a drop below 80% fails `./mvnw verify`.
