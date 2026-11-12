# Language Rule

All code written under `src/` and `tests/` must be in **English** — no exceptions.

## Scope

Applies to every file in the repository:
- Variable names, function names, class names, type names
- Comments and inline documentation
- Log messages (`logger.info`, `logger.warn`, `logger.error`)
- Error messages thrown or returned
- Test descriptions (`describe`, `it`, `test`)
- Commit messages and PR descriptions

## Hard Rules

1. **All identifiers must be English.**
   No Portuguese (or any other language) variable, function, class, or type names.

2. **All string literals intended for logging or errors must be English.**
   ```typescript
   // ✅ Correct
   logger.info('[SettingService] Setting not found');
   throw new Error('Invalid setting id');

   // ❌ Wrong
   logger.info('[SettingService] Configuração não encontrada');
   throw new Error('Id de configuração inválido');
   ```

3. **All comments must be English.**
   ```typescript
   // ✅ Correct
   // Validates that the tenant header is present before processing the request

   // ❌ Wrong
   // Valida que o header de tenant está presente antes de processar a requisição
   ```

4. **All test descriptions must be English.**
   ```typescript
   // ✅ Correct
   describe('SettingService', () => {
     it('should return all settings for the given tenant', async () => { ... });
   });

   // ❌ Wrong
   describe('SettingService', () => {
     it('deve retornar todas as configurações do tenant', async () => { ... });
   });
   ```

## Why

A consistent English codebase is readable by the full team regardless of native language, aligns with open-source and industry conventions, and prevents mixed-language identifiers that are harder to search and maintain.
