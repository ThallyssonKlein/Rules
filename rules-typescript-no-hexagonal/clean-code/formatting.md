---
name: Formatting Rule
description: Code formatting standards — newspaper metaphor, vertical distance, and variable proximity
type: feedback
---

# Formatting Rule

Code must be readable top-to-bottom. Structure and placement are part of the design.

## Hard Rules

1. **Apply the Newspaper Metaphor.**
   Organize files so high-level concepts appear first and implementation details emerge as you read down. A reader should understand *what* the class does before seeing *how*.

   ```typescript
   // ✅ Correct — public interface at top, private helpers at bottom
   class EventProducerService {
     async publishEvent(params: PublishEventParams): Promise<void> { ... }

     private buildPayload(params: PublishEventParams): EventPayload { ... }
     private validateTenant(tenantId: string): void { ... }
   }

   // ❌ Wrong — private helpers above public methods
   class EventProducerService {
     private buildPayload(params: PublishEventParams): EventPayload { ... }
     private validateTenant(tenantId: string): void { ... }

     async publishEvent(params: PublishEventParams): Promise<void> { ... }
   }
   ```

2. **Keep related concepts vertically close.**
   A caller and its callee belong near each other. Do not scatter related functions across the file and force the reader to hunt for definitions.

   ```typescript
   // ✅ Correct — fetchById and its direct helper are adjacent
   async fetchById(id: string): Promise<Domain> {
     return this.domainRepository.findById(id);
   }

   private assertExists(domain: Domain | null): asserts domain is Domain {
     if (!domain) throw new Error('Domain not found');
   }

   // ❌ Wrong — unrelated method between caller and callee
   async fetchById(id: string): Promise<Domain> { ... }
   async deleteById(id: string): Promise<void> { ... }  // unrelated
   private assertExists(domain: Domain | null): asserts domain is Domain { ... }
   ```

3. **Declare variables as close as possible to their first use.**
   Do not hoist variables to the top of a function body unless they are needed throughout. Proximity reduces the cognitive distance between declaration and use.

   ```typescript
   // ✅ Correct — declared right before use
   async publishEvent(params: PublishEventParams): Promise<void> {
     await this.validateTenant(params.tenantId);

     const payload = this.buildPayload(params);
     await this.eventRepository.publish(payload);
   }

   // ❌ Wrong — all variables hoisted regardless of when they are used
   async publishEvent(params: PublishEventParams): Promise<void> {
     const payload = this.buildPayload(params);  // used later, declared too early
     await this.validateTenant(params.tenantId);
     await this.eventRepository.publish(payload);
   }
   ```

## Why

Code that flows top-to-bottom mirrors how people read. High-level intent at the top lets a reader decide whether to keep reading or stop. Vertical proximity eliminates the need to scroll and cross-reference. Variables declared near their use shrink the mental context a reader must hold at any given line.
