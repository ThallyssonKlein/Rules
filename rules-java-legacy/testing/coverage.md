---
name: Coverage Rule
description: New or changed business logic (Service, Dao, Processor classes) must have tests covering the happy path, error paths, and edge cases — there is no automated coverage gate in this stack.
type: feedback
---

# Coverage Rule

When writing or editing a `Service`, `Dao`, `Processor`, or similar business class, write tests that cover the happy path, every error path, and realistic edge cases for the logic you touched.

## How to apply

- Write comprehensive tests upfront — cover happy path, error paths, and edge cases.
- If editing an existing class, check whether new branches or methods are already covered by existing tests and add missing cases; do not assume coverage because *a* test class exists for it.
- The test class mirrors the class under test's name and package: `SettingServiceImpl` → `SettingServiceImplTest` (see `unit-tests.md` for the full naming/layering rules).

## No automated coverage tool is configured in this stack

There is no JaCoCo (or Emma/Cobertura) setup wired into the Ant build, and no Maven/Gradle goal to enforce a percentage threshold. This means:
- There is **no build-enforced gate** — a PR can merge with untested new logic, so review has to catch that manually.
- Do not invent a coverage percentage claim ("this is at 80%") without a tool that actually measured it. If you want to check coverage locally, use an IDE-integrated tool (e.g. the Eclipse EclEmma plugin) and treat its number as directional, not a hard gate.
- If the team later adds a coverage tool (an Ant `jacoco` task, or similar) to a module, update this rule with the concrete command and threshold, matching how the original (non-legacy) rules-java pack documents its JaCoCo-based rule.

## Why

Without an automated gate, test coverage for new business logic depends entirely on the author and the reviewer actually writing and checking for it — treat the "write tests for every path" habit as the substitute for the missing tool, not as optional because nothing will fail the build if you skip it.
