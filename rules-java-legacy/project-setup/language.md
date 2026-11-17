# Language Rule

All Java source in this workspace must be in **English** — no exceptions.

## Scope

Applies to every module's source roots (`ejbModule/`, `src/`, `src.api/`, `src.core/`, `test/`, or whichever a module's `.classpath` declares):
- Variable names, method names, class names, interface and enum names, package names
- Comments and Javadoc
- Log messages, regardless of which logging facade the module uses
- Exception messages
- Test method names
- Commit messages and PR descriptions

## Hard Rules

1. **All identifiers must be English.**
   No Portuguese (or any other language) variable, method, class, or package names.

2. **All string literals intended for logging or exceptions must be English.**
   ```java
   // ✅ Correct
   logger.info("[SettingDao] Setting not found for id: " + id);
   throw new IllegalArgumentException("Invalid setting id");

   // ❌ Wrong
   logger.info("[SettingDao] Configuração não encontrada para id: " + id);
   throw new IllegalArgumentException("Id de configuração inválido");
   ```

3. **All comments must be English.**
   ```java
   // ✅ Correct
   // Validates that the branch code is present before querying the database

   // ❌ Wrong
   // Valida que o código da filial está presente antes de consultar o banco
   ```

4. **All test names must be English.**
   ```java
   // ✅ Correct
   public class SettingServiceTest {
       @Test
       public void shouldReturnAllSettingsForTheGivenBranch() { ... }
   }

   // ❌ Wrong
   public class SettingServiceTest {
       @Test
       public void deveRetornarTodasAsConfiguracoesDaFilial() { ... }
   }
   ```

## Why

A consistent English codebase is readable by the full team regardless of native language, aligns with industry conventions, and prevents mixed-language identifiers that are harder to search and maintain — this matters even more in a codebase with decades of history across many contributors.
