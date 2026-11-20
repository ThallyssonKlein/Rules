# Error Handling Rule

Errors are part of the domain. Handle them explicitly, with context, and without hiding failures behind null or error codes.

## Hard Rules

1. **Prefer exceptions to error codes.**
   Throw when something goes wrong. Never return a sentinel value (e.g. `null`, `-1`, `false`) to signal failure — it forces every caller to inspect the return value and silently propagates failures when callers forget to check.

   ```typescript
   // ✅ Correct — caller does not need to check the return value
   async fetchById(id: string): Promise<Domain> {
     const domain = await this.domainRepository.findById(id);
     this.assertExists(domain);
     return domain;
   }

   // ❌ Wrong — caller must remember to check for null
   async fetchById(id: string): Promise<Domain | null> {
     return this.domainRepository.findById(id);
   }
   ```

2. **Provide context in every exception.**
   Every thrown error must carry a message that identifies the class, the operation, and what went wrong. A generic `'Not found'` message is useless in a log without knowing where it came from.

   ```typescript
   // ✅ Correct — message includes class, operation, and failing value
   private assertExists(domain: Domain | null, id: string): asserts domain is Domain {
     if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);
   }

   // ❌ Wrong — no origin, no context
   if (!domain) throw new Error('Not found');
   ```

3. **Never return null. Never accept null as a parameter.**
   Returning `null` shifts the burden of null-checking onto every caller. Accepting `null` as an argument makes method contracts ambiguous. Use typed domain errors or exceptions to communicate absence.

   ```typescript
   // ✅ Correct — absence expressed as a thrown exception
   async fetchById(id: string): Promise<Domain> {
     const domain = await this.domainRepository.findById(id);
     if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);
     return domain;
   }

   // ❌ Wrong — returns null, caller must guard
   async fetchById(id: string): Promise<Domain | null> {
     return this.domainRepository.findById(id) ?? null;
   }

   // ❌ Wrong — accepts null, contract is ambiguous
   async update(id: string, data: DomainUpdateBody | null): Promise<void> { ... }
   ```

4. **Log errors at the boundary, not at every layer.**
   Only the outermost handler (controller or route middleware) should log the error. Intermediate layers must let exceptions propagate. Logging at every layer produces duplicate noise and hides the real origin.

   ```typescript
   // ✅ Correct — controller logs once at the boundary
   async fetchById(req: Request, res: Response): Promise<void> {
     try {
       const domain = await this.domainUseCase.fetchById(req.params.id);
       res.status(200).json(domain);
     } catch (err: unknown) {
       logger.error('[DomainController] failed to fetch domain', err);
       res.status(500).send();
     }
   }

   // ❌ Wrong — use case also logs the same error
   async fetchById(id: string): Promise<Domain> {
     try {
       ...
     } catch (err: unknown) {
       logger.error('[DomainUseCase] failed to fetch domain', err); // duplicate
       throw err;
     }
   }
   ```

5. **Use `unknown` in catch blocks, never `any`.**
   TypeScript cannot guarantee the thrown value is an `Error`. Narrow it before accessing `.message` or any other property.

   ```typescript
   // ✅ Correct
   } catch (err: unknown) {
     logger.error('[ClassName] operation failed', err);
   }

   // ❌ Wrong
   } catch (err: any) {
     logger.error('[ClassName] operation failed', err.message);
   }
   ```

## Why

Error codes scatter failure-handling logic across every call site and are silently ignored when callers forget to check. Null return values multiply null-guards across the codebase and hide the moment a failure actually occurred. Exceptions with context make failures explicit, self-documenting, and traceable to a single origin — which is all that is needed to diagnose a production incident.
