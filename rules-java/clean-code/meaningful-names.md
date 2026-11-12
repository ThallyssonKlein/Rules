# Meaningful Names Rule

Every identifier — variable, method, class, record, interface — must reveal its purpose without requiring a comment.

## Hard Rules

1. **Names must reveal intent.**
   The name alone should answer: why it exists, what it does, and how it is used. If you need a comment to explain the name, rename it.

   ```java
   // ✅ Correct
   int daysSinceLastModification = 5;
   List<Account> getActiveAccounts(String userId) { ... }

   // ❌ Wrong
   int d = 5; // elapsed days
   List<Account> get(String id) { ... }
   ```

2. **Avoid disinformation.**
   Do not use names that imply a type or concept that does not apply. Do not use `List` in a name unless the value is actually a `List`; do not use `Data` or `Info` as meaningless suffixes.

   ```java
   // ✅ Correct
   Set<Account> accountGroup = new HashSet<>();
   record UserRecord(...) {}

   // ❌ Wrong
   Set<Account> accountList = new HashSet<>(); // it's a Set, not a List
   class UserInfo { ... }                      // what distinguishes it from UserData?
   class UserData { ... }
   ```

3. **Make meaningful distinctions.**
   If two names exist for two different things, the names must reflect the actual difference. Do not use numbered suffixes (`a1`, `a2`) or noise words (`Manager`, `Processor`, `Handler`, `Helper`, `Util`) unless the distinction is real and clear.

   ```java
   // ✅ Correct
   void copyChars(String source, String destination)

   // ❌ Wrong
   void copyChars(String a1, String a2)
   ```

4. **Use pronounceable and searchable names.**
   Single-letter names are allowed **only** for loop counters in a tiny local scope (`i`, `j`) and for lambda parameters in a one-line lambda. All other identifiers must be full words or well-known abbreviations.

   ```java
   // ✅ Correct
   Instant creationTimestamp = Instant.now();
   for (int i = 0; i < items.size(); i++) { ... }
   users.stream().map(user -> user.name())

   // ❌ Wrong
   Instant crtmp = Instant.now();
   Exception e = new IllegalStateException("...");
   ```

5. **Follow Java naming conventions.**
   - Classes, records, interfaces, enums: `PascalCase`.
   - Methods, fields, parameters, local variables: `camelCase`.
   - Constants (`static final`): `UPPER_SNAKE_CASE`.
   - Packages: all lowercase, no underscores (`com.acme.billing.invoice`).
   - Do **not** prefix interfaces with `I` or suffix implementations with `Impl` when a meaningful name exists (`SettingRepository` and `JpaSettingRepository`, not `ISettingRepository` and `SettingRepositoryImpl`).
   - Boolean accessors read as predicates: `isActive()`, `hasExpired()`, or just `active()` on records.

6. **Classes must be nouns; methods must be verbs.**
   A class name describes a thing (`Customer`, `OrderRepository`, `EventProducerClient`). A method name describes an action (`fetchById`, `publishEvent`, `validateSchema`).

   ```java
   // ✅ Correct
   class CustomerService { ... }
   List<Customer> fetchAll() { ... }
   void deleteById(String id) { ... }

   // ❌ Wrong
   class CustomerManager { ... }  // "Manager" is a noise word — what does it manage?
   List<Customer> allCustomers() { ... }  // missing verb
   ```

## Why

Poorly named identifiers shift cognitive load onto every reader of the code. A name that reveals intent is self-documenting: it removes the need for comments, makes diffs easier to review, and reduces bugs caused by misreading what a variable holds or what a method does.
