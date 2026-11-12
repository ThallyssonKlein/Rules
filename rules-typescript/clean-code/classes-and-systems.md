# Classes and Systems Rule

A class must have one reason to change. A system is healthy when each of its classes is cohesive, minimal, and expressive.

## Hard Rules

1. **Apply the Single Responsibility Principle (SRP).**
   A class must have exactly one reason to change. If a class handles HTTP parsing, business logic, *and* persistence, it has three reasons to change — split it.

   ```typescript
   // ✅ Correct — each class owns one responsibility
   class EventProducerController {
     async publish(req: Request, res: Response): Promise<void> {
       await this.eventProducerUseCase.publishEvent(req.body);
       res.status(202).send();
     }
   }

   class EventProducerUseCase {
     async publishEvent(params: PublishEventParams): Promise<void> {
       await this.eventPublisher.publish(params);
     }
   }

   // ❌ Wrong — one class handles routing, validation, business logic, and persistence
   class EventProducerService {
     async handle(req: Request, res: Response): Promise<void> {
       if (!req.body.tenantId) { res.status(400).send(); return; }
       const event = buildEvent(req.body);
       await mongoose.model('Event').create(event);
       await this.queue.send(event);
       res.status(202).send();
     }
   }
   ```

2. **Keep classes cohesive.**
   Most methods in a class should use most of its instance variables. If a subset of methods only touches a subset of fields, those methods and fields belong in a separate class.

   ```typescript
   // ✅ Correct — every method uses the single injected dependency
   class SettingUseCase {
     constructor(private readonly settingRepository: ISettingRepositoryPort) {}

     async getAll(): Promise<Setting[]> { return this.settingRepository.findAll(); }
     async getById(id: string): Promise<Setting> { return this.settingRepository.findById(id); }
     async create(data: SettingBody): Promise<void> { await this.settingRepository.create(data); }
   }

   // ❌ Wrong — two unrelated groups of methods share one class
   class SettingAndCacheUseCase {
     constructor(
       private readonly settingRepository: ISettingRepositoryPort,
       private readonly cacheClient: ICacheClient,
     ) {}

     async getAll(): Promise<Setting[]> { return this.settingRepository.findAll(); } // never touches cacheClient
     async flushCache(): Promise<void> { await this.cacheClient.flush(); }           // never touches settingRepository
   }
   ```

3. **Follow the four rules of Simple Design (Kent Beck — in priority order).**
   A design is simple when it:
   1. Passes all tests.
   2. Contains no duplication.
   3. Expresses the intent of the author.
   4. Minimizes the number of classes and methods.

   Rules 1–3 take priority over rule 4: do not merge classes or collapse abstractions just to reduce count if doing so introduces duplication or obscures intent.

   ```typescript
   // ✅ Correct — intent expressed through a named private method; no duplication
   class DomainUseCase {
     async fetchById(id: string): Promise<Domain> {
       const domain = await this.domainRepository.findById(id);
       this.assertExists(domain, id);
       return domain;
     }

     private assertExists(domain: Domain | null, id: string): asserts domain is Domain {
       if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);
     }
   }

   // ❌ Wrong — intent buried in inline logic duplicated across methods
   class DomainUseCase {
     async fetchById(id: string): Promise<Domain> {
       const domain = await this.domainRepository.findById(id);
       if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`);
       return domain;
     }

     async update(id: string, data: DomainBody): Promise<void> {
       const domain = await this.domainRepository.findById(id);
       if (!domain) throw new Error(`[DomainUseCase] Domain not found for id: ${id}`); // duplicated
       await this.domainRepository.update(id, data);
     }
   }
   ```

## Why

A class with a single responsibility is easy to name, easy to test, and easy to replace. Cohesion ensures that every field is pulling its weight — a class with unrelated groups of methods is two classes waiting to be separated. The four rules of simple design impose a floor: the test suite catches regressions, no-duplication enforces a single point of change, expressiveness makes the code self-documenting, and minimalism resists the accumulation of speculative abstractions.
