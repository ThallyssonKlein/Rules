# Classes and Systems Rule

A class must have one reason to change. A system is healthy when each of its classes is cohesive, minimal, and expressive.

## Hard Rules

1. **Apply the Single Responsibility Principle (SRP).**
   A class must have exactly one reason to change. If a class handles request parsing, business logic, *and* persistence, it has three reasons to change — split it.

   ```java
   // ✅ Correct — each class owns one responsibility
   public class SettingRequestHandler {
       private final SettingService settingService;

       public SettingRequestHandler(SettingService settingService) {
           this.settingService = settingService;
       }

       public void handleCreate(HttpServletRequest request, HttpServletResponse response) throws IOException {
           SettingBody body = SettingBody.fromRequest(request);
           settingService.create(body);
           response.setStatus(HttpServletResponse.SC_CREATED);
       }
   }

   public class SettingService {
       private final SettingDao settingDao;

       public SettingService(SettingDao settingDao) {
           this.settingDao = settingDao;
       }

       public void create(SettingBody body) {
           settingDao.save(Setting.from(body));
       }
   }

   // ❌ Wrong — one class handles request parsing, validation, business logic, and SQL
   public class SettingRequestHandler {
       public void handleCreate(HttpServletRequest request, HttpServletResponse response) throws Exception {
           if (request.getParameter("branch") == null) { response.sendError(400); return; }
           Setting setting = buildSetting(request);
           try (Connection conn = dataSource.getConnection();
                PreparedStatement stmt = conn.prepareStatement("INSERT INTO setting (...) VALUES (...)")) {
               stmt.executeUpdate();
           }
           response.setStatus(201);
       }
   }
   ```

2. **Keep classes cohesive.**
   Most methods in a class should use most of its fields. If a subset of methods only touches a subset of fields, those methods and fields belong in a separate class.

   ```java
   // ✅ Correct — every method uses the single injected dependency
   public class SettingService {
       private final SettingDao settingDao;

       public SettingService(SettingDao settingDao) { this.settingDao = settingDao; }

       public List<Setting> getAll() { return settingDao.findAll(); }
       public Setting getById(String id) { return settingDao.findById(id).orElseThrow(() -> notFound(id)); }
       public void create(SettingBody body) { settingDao.save(Setting.from(body)); }
   }

   // ❌ Wrong — two unrelated groups of methods share one class
   public class SettingAndCacheService {
       private final SettingDao settingDao;
       private final CacheClient cacheClient;

       public List<Setting> getAll() { return settingDao.findAll(); }  // never touches cacheClient
       public void flushCache() { cacheClient.flush(); }               // never touches settingDao
   }
   ```

3. **Depend on abstractions and inject dependencies through the constructor — never `new` a collaborator inside business code.**
   This applies directly to plain classes and to Spring-managed beans (`Service`, `Dao`, `Processor`). EJB session/message-driven beans are instantiated by the container and must keep a no-arg constructor, but should still avoid `new`-ing their real collaborators inline — resolve them once (through a Spring bean locator/factory, a `ServiceLocator`, or a setter called during `ejbCreate`) and store the result in a field, so a test can substitute a fake.

   ```java
   // ✅ Correct — plain/Spring-managed class, constructor injection
   public class InvoiceService {
       private final TaxCalculator taxCalculator;
       public InvoiceService(TaxCalculator taxCalculator) { this.taxCalculator = taxCalculator; }
   }

   // ✅ Correct — EJB bean resolves its collaborator once, through the project's bean locator,
   // instead of instantiating the concrete implementation inline in every business method
   public class OverviewServiceImpl implements OverviewService {
       private final ServiceProcessorFactory factory;
       private final OverviewQueryProcessor queryProcessor;

       public OverviewServiceImpl(ServiceProcessorFactory factory) {
           this.factory = factory;
           this.queryProcessor = factory.getSpringBean("overview.queryProcessor");
       }
   }

   // ❌ Wrong — hard-wired collaborator, impossible to substitute in a test
   public class InvoiceService {
       private final TaxCalculator taxCalculator = new StandardTaxCalculator();
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
   public class CustomerService {
       public Customer fetchById(String id) {
           return customerDao.findById(id).orElseThrow(() -> notFound(id));
       }

       public void update(String id, CustomerBody body) {
           Customer customer = fetchById(id);
           customerDao.save(customer.with(body));
       }

       private CustomerNotFoundException notFound(String id) {
           return new CustomerNotFoundException("[CustomerService] Customer not found for id: " + id);
       }
   }

   // ❌ Wrong — intent buried in inline logic duplicated across methods
   public class CustomerService {
       public Customer fetchById(String id) {
           Customer customer = customerDao.findById(id).orElse(null);
           if (customer == null) throw new CustomerNotFoundException("Customer not found for id: " + id);
           return customer;
       }

       public void update(String id, CustomerBody body) {
           Customer customer = customerDao.findById(id).orElse(null);
           if (customer == null) throw new CustomerNotFoundException("Customer not found for id: " + id); // duplicated
           customerDao.save(customer.with(body));
       }
   }
   ```

## Why

A class with a single responsibility is easy to name, easy to test, and easy to replace. Cohesion ensures that every field is pulling its weight — a class with unrelated groups of methods is two classes waiting to be separated. Constructor-resolved collaborators keep business classes testable even when the container (EJB) controls instantiation. The four rules of simple design impose a floor: the test suite catches regressions, no-duplication enforces a single point of change, expressiveness makes the code self-documenting, and minimalism resists the accumulation of speculative abstractions.
