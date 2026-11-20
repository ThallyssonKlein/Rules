# Mock Locality Rule

All mock setup — values, return values, and subject instantiation — must live **inside the test method** where they are used. Never hoist mocks into fields, `@Before`, `@BeforeClass`, or `@Mock` / `@InjectMocks` annotations.

## Hard Rules

1. **Declare mocks inside the `@Test` method, not in fields or `@Before`.**
   Every test is self-contained: the reader sees everything that matters without scrolling up. Create mocks with `Mockito.mock(...)` inside the test — this works the same way on the Mockito version used in this workspace as on any newer one.

2. **Do not use `@Before` to configure mocks.**
   Mock *configuration* (stubbing and instantiation) belongs inside the test. `@After` cleanup of static state is fine.

3. **Do not use `@Mock`, `@InjectMocks`, `@Spy`, or `@RunWith(MockitoJUnitRunner.class)` field injection.**
   Re-create the mock and the subject under test inside each test method, even though `@RunWith(MockitoJUnitRunner.class)` with field-level `@Mock` is a pattern you will see in older tests in this codebase — that pattern is exactly what this rule replaces going forward, not a precedent to follow in new tests.

4. **Do not share mocked instances across tests via fields.**
   No `private SettingDao settingDao;` at class level.

5. **Static mocking is not available on this stack's Mockito version.**
   The vendored Mockito jar in this workspace predates `Mockito.mockStatic` (added in Mockito 3.4). If a test genuinely needs to replace a static method's behavior, restructure the production code to go through an injectable collaborator instead of reaching for a static-mocking library — do not add PowerMock or a newer standalone Mockito jar to a module just to work around this.

## Standard Pattern

```java
// ✅ Correct — mock setup inside the test, plain JUnit 4 + Mockito
@Test
public void shouldReturnSettings() {
    SettingDao settingDao = mock(SettingDao.class);
    when(settingDao.findByName("x")).thenReturn(Arrays.asList(new Setting("1", "x")));

    SettingServiceImpl service = new SettingServiceImpl(settingDao);
    List<Setting> result = service.findSettings("x");

    verify(settingDao).findByName("x");
    assertEquals(Arrays.asList(new Setting("1", "x")), result);
}
```

```java
// ❌ Wrong — mock hoisted to a field / @RunWith(MockitoJUnitRunner.class) + @Before
@RunWith(MockitoJUnitRunner.class)
public class SettingServiceImplTest {
    @Mock SettingDao settingDao;             // ← violates this rule
    SettingServiceImpl service;

    @Before
    public void setUp() {
        service = new SettingServiceImpl(settingDao);  // ← and this
    }

    @Test
    public void shouldReturnSettings() {
        when(settingDao.findByName("x")).thenReturn(...);  // stubbing is here, but the mock lives up there
        ...
    }
}
```

## Why

Self-contained tests are easier to read, debug, and refactor. When a test fails, everything needed to understand it is visible in a single method — no need to trace `@Before` chains or shared state mutations. Tests that share mock instances via fields can also interfere with each other when call counts or state leak between runs.
