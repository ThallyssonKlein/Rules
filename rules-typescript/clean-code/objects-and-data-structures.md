# Objects and Data Structures Rule

Objects hide data behind abstractions and expose behavior. Data structures expose data and carry no meaningful behavior. Never mix these two roles in the same type.

## Hard Rules

1. **Expose abstractions, not internals.**
   A class must not expose its fields through raw getters and setters. It must expose an interface that lets callers manipulate the *essence* of the data without knowing how it is stored.

   ```typescript
   // ✅ Correct — abstract interface hides the storage detail
   interface IFuelGauge {
     getPercentFull(): number;
   }

   // ❌ Wrong — exposes raw fields through trivial accessors
   class Vehicle {
     private gallonsOfGasoline: number;
     getGallonsOfGasoline(): number { return this.gallonsOfGasoline; }
     setGallonsOfGasoline(value: number): void { this.gallonsOfGasoline = value; }
   }
   ```

2. **Obey the Law of Demeter.**
   A method may only call methods on: its own class, objects passed as arguments, objects it creates directly, or direct component fields. Never chain calls into objects returned by other methods.

   ```typescript
   // ✅ Correct — talks only to its direct collaborator
   class EventProducerController {
     async publish(req: Request, res: Response): Promise<void> {
       await this.eventProducerUseCase.publishEvent(req.body);
       res.status(202).send();
     }
   }

   // ❌ Wrong — controller reaches into the use case's internals through a chain
   const connectionString = req.app.get('db').getConfig().getConnectionString();
   ```

3. **Never mix object and data-structure roles.**
   A type is either an object (hides data, exposes behavior) or a data structure (exposes data, has no behavior). A class with both real business methods and public fields or trivial getters/setters is a hybrid — it carries the downsides of both and the benefits of neither.

   ```typescript
   // ✅ Correct — pure data structure (DTO / schema type)
   interface PublishEventBody {
     tenantId: string;
     eventType: string;
     payload: Record<string, unknown>;
   }

   // ✅ Correct — pure object: data hidden, only behavior exposed
   class EventProducerUseCase {
     constructor(private readonly eventPublisher: IEventPublisher) {}
     async publishEvent(params: PublishEventBody): Promise<void> { ... }
   }

   // ❌ Wrong — hybrid: mixes public data fields with business logic
   class Event {
     public tenantId: string;
     public payload: Record<string, unknown>;
     async publish(): Promise<void> { ... }  // behavior on a data bag
   }
   ```

4. **Choose the right shape for the context.**
   - Use **interfaces / plain types** (data structures) for DTOs, request bodies, response shapes, and configuration objects.
   - Use **classes** (objects) for use cases, controllers, adapters, and any type that encapsulates behavior behind a port interface.

## Why

Mixing roles produces types that are hard to change: altering a data structure's fields forces changes in every caller that inspects those fields, while adding behavior to a data bag makes the type harder to test and replace. Keeping the two roles separate makes each type's purpose obvious, minimizes coupling, and makes it straightforward to swap implementations behind port interfaces.
