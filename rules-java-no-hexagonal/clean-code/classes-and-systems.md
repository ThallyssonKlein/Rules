# Classes and Systems Rule

A class must have one reason to change. A system is healthy when each of its classes is cohesive, minimal, and expressive.

## Hard Rules

1. **Apply the Single Responsibility Principle (SRP).**
   A class must have exactly one reason to change. If a class handles HTTP parsing, business logic, *and* persistence, it has three reasons to change — split it.

   ```java
   // ✅ Correct — each class owns one responsibility
   @RestController
   class EventProducerController {
       private final EventProducerService eventProducerService;

       EventProducerController(EventProducerService eventProducerService) {
           this.eventProducerService = eventProducerService;
       }

       @PostMapping("/events")
       ResponseEntity<Void> publish(@RequestBody PublishEventRequest request) {
           eventProducerService.publishEvent(request);
           return ResponseEntity.accepted().build();
       }
   }

   class EventProducerService {
       void publishEvent(PublishEventRequest request) {
           eventPublisher.publish(request);
       }
   }

   // ❌ Wrong — one class handles HTTP, validation, business logic, and persistence
   class EventProducerService {
       ResponseEntity<Void> handle(HttpServletRequest request) {
           if (request.getParameter("tenantId") == null) return ResponseEntity.badRequest().build();
           Event event = buildEvent(request);
           entityManager.persist(event);
           queue.send(event);
           return ResponseEntity.accepted().build();
       }
   }
   ```

2. **Keep classes cohesive.**
   Most methods in a class should use most of its fields. If a subset of methods only touches a subset of fields, those methods and fields belong in a separate class.

   ```java
   // ✅ Correct — every method uses the single injected dependency
   class SettingService {
       private final SettingRepository settingRepository;

       SettingService(SettingRepository settingRepository) {
           this.settingRepository = settingRepository;
       }

       List<Setting> getAll() { return settingRepository.findAll(); }
       Setting getById(String id) { return settingRepository.findById(id).orElseThrow(() -> new SettingNotFoundException(id)); }
       void create(SettingBody data) { settingRepository.save(Setting.from(data)); }
   }

   // ❌ Wrong — two unrelated groups of methods share one class
   class SettingAndCacheService {
       private final SettingRepository settingRepository;
       private final CacheClient cacheClient;

       List<Setting> getAll() { return settingRepository.findAll(); }  // never touches cacheClient
       void flushCache() { cacheClient.flush(); }                      // never touches settingRepository
   }
   ```

3. **Depend on abstractions and inject dependencies — never `new` a collaborator inside business code.**
   Receive dependencies through the constructor so they can be replaced in tests.

   ```java
   // ✅ Correct
   class InvoiceService {
       private final TaxCalculator taxCalculator;
       InvoiceService(TaxCalculator taxCalculator) { this.taxCalculator = taxCalculator; }
   }

   // ❌ Wrong — hard-wired collaborator
   class InvoiceService {
       private final TaxCalculator taxCalculator = new BrazilTaxCalculator();
   }
   ```

4. **Follow the four rules of Simple Design (Kent Beck — in priority order).**
   A design is simple when it:
   1. Passes all tests.
   2. Contains no duplication.
   3. Expresses the intent of the author.
   4. Minimizes the number of classes and methods.

   Rules 1–3 take priority over rule 4: do not merge classes or collapse abstractions just to reduce count if doing so introduces duplication or obscures intent.

   ```java
   // ✅ Correct — intent expressed through a named private method; no duplication
   class CustomerService {
       Customer fetchById(String id) {
           return customerRepository.findById(id).orElseThrow(() -> notFound(id));
       }

       void update(String id, CustomerBody data) {
           Customer customer = fetchById(id);
           customerRepository.save(customer.with(data));
       }

       private CustomerNotFoundException notFound(String id) {
           return new CustomerNotFoundException("[CustomerService] Customer not found for id: " + id);
       }
   }

   // ❌ Wrong — intent buried in inline logic duplicated across methods
   class CustomerService {
       Customer fetchById(String id) {
           Customer customer = customerRepository.findById(id).orElse(null);
           if (customer == null) throw new CustomerNotFoundException("Customer not found for id: " + id);
           return customer;
       }

       void update(String id, CustomerBody data) {
           Customer customer = customerRepository.findById(id).orElse(null);
           if (customer == null) throw new CustomerNotFoundException("Customer not found for id: " + id); // duplicated
           customerRepository.save(customer.with(data));
       }
   }
   ```

## Why

A class with a single responsibility is easy to name, easy to test, and easy to replace. Cohesion ensures that every field is pulling its weight — a class with unrelated groups of methods is two classes waiting to be separated. The four rules of simple design impose a floor: the test suite catches regressions, no-duplication enforces a single point of change, expressiveness makes the code self-documenting, and minimalism resists the accumulation of speculative abstractions.
