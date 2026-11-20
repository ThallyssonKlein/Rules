# Early Return Rule

Exit a function as soon as preconditions fail. Never wrap the happy path in a conditional block.

## Hard Rules

1. **Guard at the top, return early, keep the happy path flat.**
   Validate preconditions and edge cases first. Once all guards pass, the rest of the function executes without nesting.

   ```typescript
   // ✅ Correct — guards up top, happy path flat
   async publishEvent(params: PublishEventParams): Promise<void> {
     if (!params.tenantId) throw new Error('[EventProducerUseCase] tenantId is required');
     if (!params.eventType) throw new Error('[EventProducerUseCase] eventType is required');

     const hub = this.resolveHub(params.tenantId);
     await hub.publish(params);
   }

   // ❌ Wrong — happy path buried inside nested if
   async publishEvent(params: PublishEventParams): Promise<void> {
     if (params.tenantId) {
       if (params.eventType) {
         const hub = this.resolveHub(params.tenantId);
         await hub.publish(params);
       }
     }
   }
   ```

2. **Never use `else` after a block that throws or returns.**
   Once a branch exits the function, the `else` is redundant and adds indentation for no reason.

   ```typescript
   // ✅ Correct — no else after throw
   async fetchById(id: string): Promise<Domain> {
     const domain = await this.domainRepository.findById(id);
     if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);

     return domain;
   }

   // ❌ Wrong — else after throw is dead indentation
   async fetchById(id: string): Promise<Domain> {
     const domain = await this.domainRepository.findById(id);
     if (!domain) {
       throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);
     } else {
       return domain;
     }
   }
   ```

3. **Never use `else` after a block that contains a `return`.**
   The same reasoning applies: if the `if` branch returns, the `else` body is already the continuation.

   ```typescript
   // ✅ Correct
   function resolveStatus(code: number): string {
     if (code === HTTP_NOT_FOUND) return 'not_found';
     if (code === HTTP_BAD_REQUEST) return 'bad_request';

     return 'unknown';
   }

   // ❌ Wrong
   function resolveStatus(code: number): string {
     if (code === HTTP_NOT_FOUND) {
       return 'not_found';
     } else if (code === HTTP_BAD_REQUEST) {
       return 'bad_request';
     } else {
       return 'unknown';
     }
   }
   ```

4. **For `void` functions, return early to skip the rest of the body.**
   Do not wrap the remaining logic in an `if` when a plain `return` communicates the intent more clearly.

   ```typescript
   // ✅ Correct — skip early, no wrapping
   async handle(req: Request, res: Response): Promise<void> {
     if (this.isProduction()) {
       res.status(HTTP_METHOD_NOT_ALLOWED).send();
       return;
     }

     const result = await this.useCase.execute(req.body);
     res.status(HTTP_CREATED).json(result);
   }

   // ❌ Wrong — entire happy path wrapped in else
   async handle(req: Request, res: Response): Promise<void> {
     if (this.isProduction()) {
       res.status(HTTP_METHOD_NOT_ALLOWED).send();
     } else {
       const result = await this.useCase.execute(req.body);
       res.status(HTTP_CREATED).json(result);
     }
   }
   ```

## Why

Nesting is the enemy of readability. Every additional level of indentation pushes the reader to hold more context in their head. Early returns keep functions linear: a reader scans top-to-bottom through a list of exit conditions, then reaches the single happy path at the bottom — unindented, unambiguous, and easy to follow.
