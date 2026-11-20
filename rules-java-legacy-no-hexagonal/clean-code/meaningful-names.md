# Meaningful Names Rule

Every identifier — variable, method, class, interface — must reveal its purpose without requiring a comment.

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

   // ❌ Wrong
   Set<Account> accountList = new HashSet<>(); // it's a Set, not a List
   class UserInfo { ... }                      // what distinguishes it from UserData?
   class UserData { ... }
   ```

3. **Make meaningful distinctions.**
   If two names exist for two different things, the names must reflect the actual difference. Do not use numbered suffixes (`a1`, `a2`) or noise words (`Manager`, `Helper`, `Util`) unless the distinction is real and clear. `Processor`, `Handler`, and `Dao` are meaningful in this codebase's established vocabulary (see rule 5) — they are not noise words here.

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
   users.stream().map(user -> user.getName())

   // ❌ Wrong
   Instant crtmp = Instant.now();
   Exception e = new IllegalStateException("...");
   ```

5. **Follow Java naming conventions, and this codebase's established suffix vocabulary.**
   - Classes, interfaces, enums: `PascalCase`.
   - Methods, fields, parameters, local variables: `camelCase`.
   - Constants (`static final`): `UPPER_SNAKE_CASE`.
   - Packages: all lowercase, no underscores (`com.acme.billing.invoice`).
   - Business logic: interface `SettingService`, implementation `SettingServiceImpl` — the `Impl` suffix is the established convention here for the single concrete implementation of a service/Dao interface (unlike a project with many interchangeable implementations, where a more descriptive name would be warranted).
   - Data access: interface `SettingDao`, implementation `SettingDaoImpl`. Use `Dao`, not `Repository` — this codebase is raw-JDBC, not Spring Data/JPA, and `Dao` is the term already used throughout.
   - EJB implementation classes: suffix `EjbBean` or `Bean` for session beans, `Mdb` for message-driven beans, matching the module's existing pattern.
   - Plain data holders (request/response bodies, JDBC row mappings, EJB remote value objects): suffix `Bean`.
   - Boolean accessors read as predicates: `isActive()`, `hasExpired()`.

6. **Classes must be nouns; methods must be verbs.**
   A class name describes a thing (`Customer`, `SettingDao`, `EventPublisherService`). A method name describes an action (`fetchById`, `publishEvent`, `validateSchema`).

   ```java
   // ✅ Correct
   class CustomerService { ... }
   List<Customer> fetchAll() { ... }
   void deleteById(String id) { ... }

   // ❌ Wrong
   class CustomerManager { ... }          // "Manager" is a noise word — what does it manage?
   List<Customer> allCustomers() { ... }  // missing verb
   ```

## Why

Poorly named identifiers shift cognitive load onto every reader of the code. A name that reveals intent is self-documenting: it removes the need for comments, makes diffs easier to review, and reduces bugs caused by misreading what a variable holds or what a method does. Following the vocabulary this codebase already established (`Dao`, `Impl`, `Bean`, `Ejb`/`Mdb`) keeps new code recognizable alongside the old, instead of introducing a second naming system a reader has to learn to tell apart.
