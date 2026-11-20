# Mock Locality Rule

All mock setup — values, return values, and subject instantiation — must live **inside the test method** where they are used. Never hoist mocks into fields, `@BeforeEach`, `@BeforeAll`, or `@Mock` / `@InjectMocks` annotations.

## Hard Rules

1. **Declare mocks inside the `@Test` method, not in fields or `@BeforeEach`.**
   Every test is self-contained: the reader sees everything that matters without scrolling up. Create mocks with `Mockito.mock(...)` inside the test.

2. **Do not use `@BeforeEach` to configure mocks.**
   Mock *configuration* (stubbing and instantiation) belongs inside the test. `@AfterEach` cleanup of static state (e.g. `Mockito.framework().clearInlineMocks()`) is fine.

3. **Do not use `@Mock`, `@InjectMocks`, `@Spy`, or `@ExtendWith(MockitoExtension.class)` field injection.**
   Re-create the mock and the subject under test inside each test method.

4. **Do not share mocked instances across tests via fields.**
   No `private SettingRepository repository;` at class level.

5. **Static mocking (`mockStatic`) is allowed only inside a try-with-resources in the test itself.**

## Standard Pattern

```java
// ✅ Correct — mock setup inside the test
@Test
void shouldReturnSettings() {
    SettingRepository repository = mock(SettingRepository.class);
    when(repository.findByName("x")).thenReturn(List.of(new Setting("1", "x")));

    SettingService service = new SettingService(repository);
    List<Setting> result = service.findSettings("x");

    verify(repository).findByName("x");
    assertEquals(List.of(new Setting("1", "x")), result);
}
```

```java
// ❌ Wrong — mock hoisted to a field / @BeforeEach
class SettingServiceTest {
    @Mock SettingRepository repository;     // ← violates this rule
    SettingService service;

    @BeforeEach
    void setUp() {
        service = new SettingService(repository);  // ← and this
    }

    @Test
    void shouldReturnSettings() {
        when(repository.findByName("x")).thenReturn(...);  // stubbing is here, but the mock lives up there
        ...
    }
}
```

## Why

Self-contained tests are easier to read, debug, and refactor. When a test fails, everything needed to understand it is visible in a single method — no need to trace `@BeforeEach` chains or shared state mutations. Tests that share mock instances via fields can also interfere with each other when call counts or state leak between runs.
