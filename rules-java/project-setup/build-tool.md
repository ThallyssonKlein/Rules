# Build Tool Rule

Always use **Maven through the Maven Wrapper (`./mvnw`)** as the build tool. Never use Gradle, Ant, or a globally installed `mvn`.

## Hard Rules

1. **Use `./mvnw` for all build and dependency commands.**
   The wrapper pins the Maven version so every machine and CI agent builds identically.

   ```bash
   # ✅ Correct
   ./mvnw clean verify
   ./mvnw test
   ./mvnw dependency:tree
   ./mvnw spotless:apply

   # ❌ Wrong
   mvn clean verify
   gradle build
   ```

2. **Never add `build.gradle`, `settings.gradle`, or other build-tool descriptors.**
   The only build descriptor of this project is `pom.xml`.

3. **Declare every dependency version in `pom.xml` — through a BOM or `<dependencyManagement>`, never inline and never `LATEST` / `RELEASE` / version ranges.**
   Reproducible builds require explicit, pinned versions.

   ```xml
   <!-- ✅ Correct — pinned property -->
   <properties>
       <mockito.version>5.14.2</mockito.version>
   </properties>

   <!-- ❌ Wrong -->
   <version>LATEST</version>
   <version>[5.0,)</version>
   ```

4. **Pin the Java version in `pom.xml` (`maven.compiler.release`) to a modern LTS (21 or newer).**
   Use `release`, not `source` / `target`, so the compiler also checks against the right API.

   ```xml
   <properties>
       <maven.compiler.release>21</maven.compiler.release>
   </properties>
   ```

5. **Add a dependency only with the narrowest scope that works.**
   Test-only libraries use `<scope>test</scope>`; compile-time-only tools use `provided` or `optional`.

6. **Use `./mvnw verify` in CI/CD and scripted environments.**
   `verify` runs compilation, unit tests, packaging, and integration tests. Reserve single-phase commands (`test`, `compile`) for local iteration.

7. **Never commit build output.**
   `target/` is always git-ignored.

## Why

A single build tool pinned through its wrapper guarantees a reproducible dependency graph and build lifecycle. Floating versions and mixed tools produce builds that pass on one machine and fail on another, and drift that is hard to diagnose.

> If the project uses Gradle instead, replace `./mvnw` with `./gradlew` and `pom.xml` with `build.gradle(.kts)` throughout — the rule is the same: one tool, via its wrapper, with pinned versions.
