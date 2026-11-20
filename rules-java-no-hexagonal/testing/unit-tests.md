---
name: Unit Test Rule
description: Isolate the subject under test; mock all dependencies; use builder methods for repeated mock shapes.
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

When writing unit tests, **isolate the subject under test completely**. Every external dependency must be mocked — no real implementations, no real I/O, no real databases, no real HTTP calls.

Stack: **JUnit 5** + **Mockito** + **AssertJ** (or JUnit assertions). Tests are named `<ClassName>Test`.

## Hard Rules

1. **Mock all dependencies injected into the subject under test.**
   Use `Mockito.mock(...)` for collaborators. Never instantiate real implementations of repositories, services, or external clients inside a unit test.

2. **Never test more than one layer at a time.**
   - Testing a Controller? Use standalone `MockMvc` (`MockMvcBuilders.standaloneSetup(controller)`) with a mocked Service — do not start the Spring context and do not instantiate a real Service.
   - Testing a Service? Mock the Repository — do not use a real database implementation.
   - Testing a Repository or API client? Mock the underlying client (e.g. `EntityManager`, `RestClient`, SDK client) — do not connect to a real service. Query correctness belongs in an integration test.
   - Testing a request/validation type? Call the `Validator` directly with valid and invalid inputs — no HTTP layer needed.

   Every testable layer must have its own test class. Do not skip layers.

3. **Never import concrete repositories or infrastructure in service tests.**
   Service tests must only import the service class and the repository interface. Concrete repositories must never be imported in service tests.

4. **Never use `@SpringBootTest`, Testcontainers, an embedded database, or a real network call in unit tests.**
   If a test starts a Spring context or touches real infrastructure, it is an integration test (`*IT`), not a unit test, and must be placed and labeled accordingly (run by Failsafe, not Surefire).

5. **Assert on mock interactions and returned values, not on side effects.**
   Verify behavior with `verify(mockRepo).findAll()` — not by querying a database or inspecting external state.

6. **Never assert on log calls.**
   Logging is an observability side effect, not behavior. Do not mock the logger, do not use log-capturing appenders, and do not write `verify(log).info(...)`. Tests that assert on log output become brittle the moment a message is rephrased and add no confidence about correctness.

   ```java
   // ✅ Correct — assert on observable output, not on logging
   @Test
   void shouldThrowWhenCustomerIsNotFound() {
       CustomerRepository repository = makeMockRepository();
       when(repository.findById("x")).thenReturn(Optional.empty());
       CustomerService service = new CustomerService(repository);

       assertThrows(CustomerNotFoundException.class, () -> service.fetchById("x"));
   }

   // ❌ Wrong — asserting on a log side-effect
   @Test
   void shouldLogWhenCustomerIsNotFound() {
       // ... captures appender output
       assertTrue(appender.contains("[CustomerService] Customer not found for id: x"));
   }
   ```

7. **Use mock builder methods when the same mock shape appears in more than one test.**
   Define a private static builder method that returns a fresh mock on every call. Call it inside each test method — never store the result in a field.

8. **Test names describe behavior: `should<Outcome>When<Condition>`.**
   Use `@DisplayName` only when the method name cannot express the case. Prefer `@ParameterizedTest` over copy-pasted tests that differ only by input.

## Standard Pattern

```java
// ✅ Mock builder — defined in the test class, called inside each test
private static SettingRepository makeMockRepository() {
    return mock(SettingRepository.class);
}

// ✅ Service unit test — builder called inside the test
@Test
void shouldReturnAllSettings() {
    SettingRepository repository = makeMockRepository();
    when(repository.findAll()).thenReturn(List.of(new Setting("1", "x")));
    SettingService service = new SettingService(repository);

    List<Setting> result = service.getAll();

    verify(repository).findAll();
    assertEquals(List.of(new Setting("1", "x")), result);
}

// ✅ Controller unit test — standalone MockMvc with a mocked service
@Test
void shouldRespond200WithSettings() throws Exception {
    SettingService service = mock(SettingService.class);
    when(service.getAll()).thenReturn(List.of(new Setting("1", "x")));
    MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new SettingController(service)).build();

    mockMvc.perform(get("/settings"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value("1"));
}
```

```java
// ❌ Wrong — real repository injected into service test
SettingRepository realRepository = new JpaSettingRepository(entityManager);
SettingService service = new SettingService(realRepository); // crosses layer boundary

// ❌ Wrong — real service injected into controller test
SettingService realService = new SettingService(mockRepository);
SettingController controller = new SettingController(realService); // crosses layer boundary

// ❌ Wrong — whole Spring context for a unit test
@SpringBootTest
class SettingServiceTest { ... }
```

## Why

Unit tests must be fast, deterministic, and scoped to a single class's behavior. Crossing layer boundaries turns a unit test into an integration test — it slows down the suite, introduces non-determinism, and makes failures harder to locate.

Builder methods eliminate copy-paste drift: when an interface gains a new method, you update one builder instead of every test.
