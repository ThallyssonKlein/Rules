# Comments Rule

Code must explain itself. A comment is an admission that the code failed to communicate its intent on its own.

## Hard Rules

1. **Do not comment bad code — clean it instead.**
   If a block requires a comment to be understood, refactor it until the code speaks for itself.

2. **Never write redundant comments or Javadoc.**
   Do not restate what the code already says. Javadoc that only repeats the method name and signature (`@param id the id`) is noise — delete it.

   ```java
   // ✅ Correct — no comment needed; the name is self-explanatory
   long daysSinceLastModification = ChronoUnit.DAYS.between(lastModifiedAt, now);

   // ❌ Wrong — comment repeats the code
   // Gets the days since last modification
   long daysSinceLastModification = ChronoUnit.DAYS.between(lastModifiedAt, now);

   // ❌ Wrong — Javadoc restates the signature
   /**
    * Finds a setting by id.
    * @param id the id
    * @return the setting
    */
   Setting findById(String id);
   ```

3. **Never commit commented-out code.**
   Delete it. Version control preserves history — commented-out code is noise that misleads future readers.

   ```java
   // ❌ Wrong
   // Result result = oldImplementation(id);
   Result result = newImplementation(id);
   ```

4. **Never write historical, changelog, or `@author` / `@since` comments.**
   That information belongs in git commits and PR descriptions, not in source files.

   ```java
   // ❌ Wrong
   // 2024-03-01 — changed by Alice to fix the tenant resolution bug
   String tenantId = resolveTenant(headers);
   ```

5. **Good comments are allowed when they add information the code cannot.**
   Acceptable uses:
   - **Legal notices** at the top of a file (copyright, license).
   - **Intent explanations** — *why* a non-obvious decision was made, not *what* the code does.
   - **Consequence warnings** — side effects or gotchas a caller must know.
   - **Javadoc on public API** of a library module, when it documents contract details the signature cannot (units, thread-safety, nullability, thrown exceptions).
   - **TODO notes** — tracked, actionable, and short.

   ```java
   // ✅ Intent — explains a non-obvious constraint
   // Azure Storage Queue requires messages to be base64-encoded; raw JSON is rejected.
   String encoded = Base64.getEncoder().encodeToString(json.getBytes(StandardCharsets.UTF_8));

   // ✅ Warning — consequence a caller must know
   // Calling this method closes the connection; do not reuse the client afterward.
   client.disconnect();

   // ✅ TODO — actionable and short
   // TODO: replace with streaming once the SDK supports it
   List<Record> data = fetchAll();
   ```

## Why

Every comment is maintenance debt: it must stay in sync with the code it describes, or it becomes a lie. Code that needs a comment to be understood is code that needs to be rewritten. Comments that survive are the ones that capture intent, constraints, or context that no identifier or structure can express alone.
