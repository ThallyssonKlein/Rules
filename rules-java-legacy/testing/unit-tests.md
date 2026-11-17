---
name: Unit Test Rule
description: Isolate the subject under test; mock all dependencies; use builder methods for repeated mock shapes. JUnit 4 + Mockito 1.x — no JUnit 5, no AssertJ, no Spring Test.
type: feedback
---

# Unit Test Rule

## The Three Laws of TDD

1. Do not write production code without a failing test first.
2. Do not write more test code than is necessary to fail.
3. Do not write more production code than is necessary to pass the failing test.

## F.I.R.S.T. Rules

Tests must be **Fast**, **Independent**, **Repeatable** (in any environment), **Self-validating** (boolean pass/fail), and **Timely** (written just before the production code).

---

When writing unit tests, **isolate the subject under test completely**. Every external dependency must be mocked — no real database connections, no real JMS, no real EJB/JNDI lookups, no real HTTP calls.

Stack: **JUnit 4** (`org.junit.Test`, `org.junit.Assert.*`) + **Mockito 1.x** (`org.mockito.Mockito`, imported as `org.mockito.runners.MockitoJUnitRunner` if ever referenced — see `test-mocks-inside-test.md` for why not to use it for field injection). No AssertJ, no JUnit 5 (`org.junit.jupiter.*`), no `@ParameterizedTest`, no Spring Test (`@SpringBootTest`, `@ContextConfiguration`), no `assertThrows` (added in JUnit 4.13 — this workspace is on JUnit 4.10). Tests are named `<ClassName>Test`.

## Hard Rules

1. **Mock all dependencies injected into the subject under test.**
   Use `Mockito.mock(...)` for collaborators. Never instantiate a real Dao, EJB reference, JMS session, or external client inside a unit test.

2. **Never test more than one layer at a time.**
   - Testing a request handler / Servlet entry point? Mock the `Service` it calls — do not stand up a real servlet container and do not instantiate a real `Service`.
   - Testing an EJB bean implementation? Mock whatever it resolves collaborators through (the Spring bean locator/factory, or a directly injected `Service`/`Processor`) — do not let the test touch a real Spring `ApplicationContext` or a real EJB container.
   - Testing a `Service`? Mock the `Dao` — do not use a real database connection.
   - Testing a `Dao`? Mock the underlying JDBC objects (`DataSource`/`Connection`/`PreparedStatement`/`ResultSet`) or the EJB/JNDI resource it wraps — do not connect to a real database. SQL correctness belongs in an integration test, not here.

   Every testable layer must have its own test class. Do not skip layers.

3. **Never import a concrete `Dao` implementation in a `Service` test.**
   `Service` tests must only import the service class and the `Dao` interface. The concrete `DaoImpl` must never be imported in a `Service` test.

4. **Never open a real JDBC connection, JNDI lookup, JMS session, or EJB container in a unit test.**
   If a test does any of these — even inside a one-time setup — it is an integration test, not a unit test, and must be named and placed accordingly (e.g. in a separate `integration-test` source folder or suffixed `*IT`, matching whatever convention the module already uses for integration tests, if any).

5. **Assert on mock interactions and returned values, not on side effects.**
   Verify behavior with `verify(mockDao).findAll()` — not by querying a database or inspecting external state.

6. **Never assert on log calls.**
   Logging is an observability side effect, not behavior — this holds regardless of which logging facade a module uses (see `log-class-prefix.md`). Do not mock the logger, do not use log-capturing appenders, and do not write `verify(logger).info(...)`.

   ```java
   // ✅ Correct — assert on observable output, not on logging
   @Test
   public void shouldThrowWhenCustomerIsNotFound() {
       CustomerDao customerDao = mock(CustomerDao.class);
       when(customerDao.findById("x")).thenReturn(Optional.empty());
       CustomerServiceImpl service = new CustomerServiceImpl(customerDao);

       try {
           service.fetchById("x");
           fail("expected CustomerNotFoundException");
       } catch (CustomerNotFoundException e) {
           assertEquals("x", e.getCustomerId());
       }
   }

   // ❌ Wrong — asserting on a log side-effect
   @Test
   public void shouldLogWhenCustomerIsNotFound() {
       // ... captures appender output
       assertTrue(appender.contains("[CustomerServiceImpl] Customer not found for id: x"));
   }
   ```

7. **Use mock builder methods when the same mock shape appears in more than one test.**
   Define a private static builder method that returns a fresh mock on every call. Call it inside each test method — never store the result in a field (see `test-mocks-inside-test.md`).

8. **Test names describe behavior: `should<Outcome>When<Condition>`.**
   JUnit 4 has no `@ParameterizedTest`/`@DisplayName` from JUnit 5. For input variations, either write one `@Test` method per case with a descriptive name, or use `@RunWith(Parameterized.class)` on a dedicated test class when the same assertions genuinely repeat across many inputs — don't reach for `Parameterized` for just two or three cases.

9. **To assert a thrown exception, catch it explicitly (or use `@Rule public ExpectedException`) — not a lambda-based `assertThrows`.**
   `assertThrows` requires JUnit 4.13+; this workspace is on 4.10.

   ```java
   // ✅ Correct — explicit try/catch, available on JUnit 4.10
   @Test
   public void shouldThrowWhenCustomerIsNotFound() {
       CustomerDao customerDao = mock(CustomerDao.class);
       when(customerDao.findById("x")).thenReturn(Optional.empty());
       CustomerServiceImpl service = new CustomerServiceImpl(customerDao);

       try {
           service.fetchById("x");
           fail("expected CustomerNotFoundException");
       } catch (CustomerNotFoundException expected) {
           // assert on the exception's fields if relevant
       }
   }

   // ✅ Also correct — @Rule ExpectedException, available since JUnit 4.7
   @Rule
   public ExpectedException thrown = ExpectedException.none();

   @Test
   public void shouldThrowWhenCustomerIsNotFound() {
       CustomerDao customerDao = mock(CustomerDao.class);
       when(customerDao.findById("x")).thenReturn(Optional.empty());
       CustomerServiceImpl service = new CustomerServiceImpl(customerDao);

       thrown.expect(CustomerNotFoundException.class);
       service.fetchById("x");
   }

   // ❌ Wrong — assertThrows needs JUnit 4.13+, unavailable on this workspace's JUnit 4.10
   assertThrows(CustomerNotFoundException.class, () -> service.fetchById("x"));
   ```

## Standard Pattern

```java
// ✅ Mock builder — defined in the test class, called inside each test
private static SettingDao makeMockDao() {
    return mock(SettingDao.class);
}

// ✅ Service unit test — builder called inside the test
@Test
public void shouldReturnAllSettings() {
    SettingDao settingDao = makeMockDao();
    when(settingDao.findAll()).thenReturn(Arrays.asList(new Setting("1", "x")));
    SettingServiceImpl service = new SettingServiceImpl(settingDao);

    List<Setting> result = service.getAll();

    verify(settingDao).findAll();
    assertEquals(Arrays.asList(new Setting("1", "x")), result);
}

// ✅ Request handler unit test — mocked service, no servlet container
@Test
public void shouldRespond201OnCreate() throws Exception {
    SettingService service = mock(SettingService.class);
    SettingRequestHandler handler = new SettingRequestHandler(service);
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    when(request.getParameter("name")).thenReturn("x");

    handler.handleCreate(request, response);

    verify(service).create(any(SettingBody.class));
    verify(response).setStatus(HttpServletResponse.SC_CREATED);
}
```

```java
// ❌ Wrong — real Dao injected into a service test
SettingDao realDao = new SettingDaoImpl(dataSource);
SettingServiceImpl service = new SettingServiceImpl(realDao); // crosses layer boundary

// ❌ Wrong — real service injected into a request-handler test
SettingService realService = new SettingServiceImpl(mockDao);
SettingRequestHandler handler = new SettingRequestHandler(realService); // crosses layer boundary

// ❌ Wrong — a real Spring ApplicationContext or EJB container for a unit test
ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");
```

## Why

Unit tests must be fast, deterministic, and scoped to a single class's behavior. Crossing layer boundaries — a real `Dao`, a real Spring context, a real JDBC connection — turns a unit test into an integration test: it slows down the suite, introduces non-determinism, and makes failures harder to locate. Builder methods eliminate copy-paste drift: when an interface gains a new method, you update one builder instead of every test.
