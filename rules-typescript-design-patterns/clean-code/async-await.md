# Async/Await Rule

Always use `async/await` to handle promises. Never use raw `.then()` / `.catch()` chains or Node-style callbacks.

## Hard Rules

1. **All async operations must use `async/await`.**
   Declare the function `async` and `await` every promise. Never chain `.then()` or `.catch()` on the result.

   ```typescript
   // ✅ Correct
   async fetchById(id: string): Promise<Domain> {
     const domain = await this.domainRepository.findById(id);
     if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);
     return domain;
   }

   // ❌ Wrong — promise chain instead of await
   fetchById(id: string): Promise<Domain> {
     return this.domainRepository.findById(id).then(domain => {
       if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);
       return domain;
     });
   }
   ```

2. **Never use Node-style callbacks (`(err, result) => {}`).**
   Wrap callback-based APIs with `util.promisify` or a manual `new Promise()` wrapper at the adapter boundary. The wrapper is the only place a callback is allowed; all callers use `await`.

   ```typescript
   // ✅ Correct — callback wrapped once at the adapter boundary
   import { promisify } from 'util';
   const readFileAsync = promisify(fs.readFile);

   async readConfig(path: string): Promise<string> {
     const buffer = await readFileAsync(path);
     return buffer.toString('utf-8');
   }

   // ❌ Wrong — callback leaks into business code
   readConfig(path: string): void {
     fs.readFile(path, (err, buffer) => {
       if (err) throw err;
       this.applyConfig(buffer.toString('utf-8'));
     });
   }
   ```

3. **Never mix `await` and `.then()` on the same value.**
   Pick one. Mixing creates ambiguity about error propagation and makes the control flow harder to follow.

   ```typescript
   // ✅ Correct
   const result = await this.eventPublisher.publish(payload);
   logger.info('[EventProducerAdapter] event published');

   // ❌ Wrong — await then chain on the same call
   const result = await this.eventPublisher.publish(payload).then(r => {
     logger.info('[EventProducerAdapter] event published');
     return r;
   });
   ```

4. **Use `try/catch` for error handling in async functions, never `.catch()`.**
   Combining `await` with `try/catch` keeps the error-handling style consistent with synchronous code and avoids swallowing errors in silent `.catch()` blocks.

   ```typescript
   // ✅ Correct
   async publish(req: Request, res: Response): Promise<void> {
     try {
       await this.eventProducerUseCase.publishEvent(req.body);
       res.status(HTTP_ACCEPTED).send();
     } catch (err: unknown) {
       logger.error('[EventProducerController] failed to publish event', err);
       res.status(HTTP_INTERNAL_SERVER_ERROR).send();
     }
   }

   // ❌ Wrong — .catch() hides the flow and makes early-return harder
   async publish(req: Request, res: Response): Promise<void> {
     await this.eventProducerUseCase.publishEvent(req.body)
       .then(() => res.status(HTTP_ACCEPTED).send())
       .catch(err => res.status(HTTP_INTERNAL_SERVER_ERROR).send());
   }
   ```

## Why

`async/await` makes asynchronous code read and behave like synchronous code: the control flow is linear, errors surface naturally through `try/catch`, and stack traces point to the actual `await` line rather than a promise internals frame. Callback-based code inverts control and forces error handling into every leaf node; `.then()` chains split a single logical operation across multiple closures and make it harder to apply early-return or share local variables.
