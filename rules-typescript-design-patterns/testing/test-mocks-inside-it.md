# Mock Locality Rule

All mock setup — values, return values, and subject instantiation — must live **inside the `it` block** where they are used. Never hoist mocks into `describe` scope, `beforeEach`, or `beforeAll`.

## Hard Rules

1. **Declare mocks inside `it`, not in `describe` or `beforeEach`.**
   Every test is self-contained: reader sees everything that matters without scrolling up.

2. **Do not use `beforeEach` to reset or configure mocks.**
   `jest.clearAllMocks()` / `afterEach` resets are fine at file level, but mock *configuration* belongs inside the test.

3. **Do not share mocked instances across tests via outer `let` variables.**
   Re-create the mock and the subject under test inside each `it`.

4. **`jest.mock()` at the top of the file is allowed** — it is a module-level interception, not a value setup. Only the *return values* and *implementations* must stay inside the `it`.

## Standard Pattern

```typescript
// ✅ Correct — mock setup inside it
it('should return settings', async () => {
  const mockRepo: jest.Mocked<ISettingRepository> = {
    find: jest.fn().mockResolvedValue([{ id: '1', name: 'x' }]),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  const service = new SettingService(mockRepo);
  const result = await service.findSettings('x');

  expect(mockRepo.find).toHaveBeenCalledWith({ name: 'x' });
  expect(result).toEqual([{ id: '1', name: 'x' }]);
});
```

```typescript
// ❌ Wrong — mock hoisted to describe / beforeEach
describe('SettingService', () => {
  let mockRepo: jest.Mocked<ISettingRepository>;
  let service: SettingService;

  beforeEach(() => {
    mockRepo = { find: jest.fn(), ... };  // ← violates this rule
    service = new SettingService(mockRepo);
  });

  it('should return settings', async () => {
    mockRepo.find.mockResolvedValue([...]);  // ← return value must be here, but mock itself shouldn't exist up there
    ...
  });
});
```

## Why

Self-contained tests are easier to read, debug, and refactor. When a test fails, everything needed to understand it is visible in a single block — no need to trace `beforeEach` chains or shared state mutations. Tests that share mock instances via outer variables can also interfere with each other when call counts or state leaks between runs.
