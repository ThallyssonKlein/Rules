---
name: Verify After Edit Rule
description: After modifying any Java source file, always recompile the affected module(s) and run the affected tests before finishing. Fix all failures before finishing.
type: feedback
---

# Verify After Edit Rule

After **any** modification to a module's Java source, you must make sure the module still compiles and its tests still pass. There is no Maven/Gradle `verify` goal in this build — verification is done per module.

## Hard Rules

1. **Only after ALL edits are done — compile, then run the affected tests.**
   Do not stop halfway to "check progress" with a partial compile; wait until the change set for the task is complete, then verify it as a whole.

2. **Recompile every module you touched, and every module that depends on it.**
   A module can be a compile-time dependency of another through a project classpath reference (not just `lib/` jars). If you change a public method's signature, a field's type, or remove a class, check which other modules reference it (`grep` for the fully-qualified class name, or look for a `classpathentry kind="src"` pointing at your module in other modules' `.classpath`) and fix those too.

   ```bash
   # Compile a single module with javac using its own classpath
   # (or trigger an Eclipse headless build if the workspace is open in an IDE)
   javac -cp "<module>/lib/*;<module>/bin" -d <module>/bin <module>/ejbModule/**/*.java
   ```

3. **Run the affected module's JUnit 4 tests before finishing.**
   There is no Surefire/Failsafe split in this build — run the test classes directly (via your IDE's JUnit runner, or an Ant `junit` task if the module defines one) and confirm they're green.

   ```bash
   # Example Ant-based run, if the module's build.xml defines a test target
   ant -f <module>/build.xml test
   ```

4. **If tests fail — fix the failures before finishing.**
   Read the error output, identify the root cause, fix the code or the test, then re-run until green. Never comment out a `@Test` method or delete an assertion to make a failure disappear.

5. **If compilation fails — fix the compiler errors before finishing.**
   Do not leave a module in a non-compiling state. Pay special attention to Java 8 compliance — a common failure mode is using a language feature newer than Java 8 (see `build-tool.md`).

6. **No automatic formatter or static analyzer is configured in this stack.**
   There is no Spotless/Checkstyle/PMD/SpotBugs gate to run. Match the surrounding code's existing style by eye (tab indentation, brace placement, import ordering) rather than relying on a tool to normalize it. If the team later adds one of these tools to a module, follow it and update this rule.

7. **Do not skip verification even for "small" edits.**
   A one-line change in a shared module (`Common*`, `util`) can silently break every module that references it at compile time, since there is no dependency-version isolation between modules.

## Order of Operations

```
1. Make ALL code changes
2. Recompile every touched module and its dependents  ← fix until it compiles
3. Run the affected module's tests                    ← fix until green
4. Task is done
```

## Why

Without a Maven/Gradle reactor, nothing automatically rebuilds dependent modules or runs their tests for you — skipping this step lets a broken contract silently ship in a module nobody rebuilt. Verifying compilation and tests per module, by hand, is the equivalent safety net this stack has in place of `./mvnw verify`.
