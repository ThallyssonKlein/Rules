# Language Rule

All code written under `src/main/java` and `src/test/java` must be in **English** — no exceptions.

## Scope

Applies to every file in the repository:
- Variable names, method names, class names, record and enum names, package names
- Comments and Javadoc
- Log messages (`log.info`, `log.warn`, `log.error`)
- Exception messages
- Test names and `@DisplayName` values
- Commit messages and PR descriptions

## Hard Rules

1. **All identifiers must be English.**
   No Portuguese (or any other language) variable, method, class, or package names.

2. **All string literals intended for logging or exceptions must be English.**
   ```java
   // ✅ Correct
   log.info("[SettingService] Setting not found");
   throw new IllegalArgumentException("Invalid setting id");

   // ❌ Wrong
   log.info("[SettingService] Configuração não encontrada");
   throw new IllegalArgumentException("Id de configuração inválido");
   ```

3. **All comments must be English.**
   ```java
   // ✅ Correct
   // Validates that the tenant header is present before processing the request

   // ❌ Wrong
   // Valida que o header de tenant está presente antes de processar a requisição
   ```

4. **All test names must be English.**
   ```java
   // ✅ Correct
   class SettingServiceTest {
       @Test
       void shouldReturnAllSettingsForTheGivenTenant() { ... }
   }

   // ❌ Wrong
   class SettingServiceTest {
       @Test
       void deveRetornarTodasAsConfiguracoesDoTenant() { ... }
   }
   ```

## Why

A consistent English codebase is readable by the full team regardless of native language, aligns with open-source and industry conventions, and prevents mixed-language identifiers that are harder to search and maintain.
