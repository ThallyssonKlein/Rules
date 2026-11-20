# Meaningful Names Rule

Every identifier — variable, function, class, type, interface — must reveal its purpose without requiring a comment.

## Hard Rules

1. **Names must reveal intent.**
   The name alone should answer: why it exists, what it does, and how it is used. If you need a comment to explain the name, rename it.

   ```typescript
   // ✅ Correct
   const daysSinceLastModification = 5;
   function getUserActiveAccounts(userId: string): Account[] { ... }

   // ❌ Wrong
   const d = 5; // elapsed days
   function get(id: string) { ... }
   ```

2. **Avoid disinformation.**
   Do not use names that imply a type or concept that does not apply. Do not use `List` unless the value is actually a list; do not use `Data` or `Info` as meaningless suffixes.

   ```typescript
   // ✅ Correct
   const accountGroup: Account[] = [];
   class UserRecord { ... }

   // ❌ Wrong
   const accountList: Account[] = []; // it's an array, not a List
   class UserInfo { ... }             // what distinguishes it from UserData?
   class UserData { ... }
   ```

3. **Make meaningful distinctions.**
   If two names exist for two different things, the names must reflect the actual difference. Do not use numbered suffixes (`a1`, `a2`) or noise words (`Manager`, `Processor`, `Handler`) unless the distinction is real and clear.

   ```typescript
   // ✅ Correct
   function copyChars(source: string, destination: string): void { ... }

   // ❌ Wrong
   function copyChars(a1: string, a2: string): void { ... }
   ```

4. **Use pronounceable and searchable names.**
   Single-letter names are allowed **only** for loop counters in a tiny local scope (`i`, `j`). All other identifiers must be full words or well-known abbreviations.

   ```typescript
   // ✅ Correct
   const creationTimestamp = Date.now();
   for (let i = 0; i < items.length; i++) { ... }

   // ❌ Wrong
   const crtmp = Date.now();
   const e = new Error('...');
   ```

5. **Classes must be nouns; methods must be verbs.**
   A class name describes a thing (`Customer`, `OrderRepository`, `EventProducerClient`). A method name describes an action (`fetchById`, `publishEvent`, `validateSchema`).

   ```typescript
   // ✅ Correct
   class DomainService { ... }
   fetchAll(): Promise<Domain[]> { ... }
   deleteById(id: string): Promise<void> { ... }

   // ❌ Wrong
   class DomainManager { ... }  // "Manager" is a noise word — what does it manage?
   allDomains(): Promise<Domain[]> { ... }  // missing verb
   ```

## Why

Poorly named identifiers shift cognitive load onto every reader of the code. A name that reveals intent is self-documenting: it removes the need for comments, makes diffs easier to review, and reduces bugs caused by misreading what a variable holds or what a function does.
