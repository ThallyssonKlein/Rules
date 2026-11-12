---
name: Unit Test Rule
description: Isolate the subject under test; mock all dependencies; use builder functions for repeated mock shapes.
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

## Hard Rules

1. **Mock all dependencies injected into the subject under test.**
   Use `jest.fn()` for individual functions and `jest.mock()` for modules. Never instantiate real implementations of repositories, use cases, or adapters inside a unit test.

2. **Never test more than one layer at a time.**
   - Testing a Route? Mock the Controller or use `supertest` against the Express router — do not instantiate real use cases.
   - Testing a Controller? Mock the UseCase — do not instantiate a real UseCase.
   - Testing a UseCase? Mock the repository port — do not use a real adapter.
   - Testing an Adapter? Mock the external client (e.g., mongoose model, Redis client, Azure SDK) — do not connect to a real service.
   - Testing a Schema? Call the Zod/Joi parser directly with valid and invalid inputs — no HTTP layer needed.

   Every testable layer must have its own test file. Do not skip layers.

3. **Never import concrete adapters or infrastructure in use case tests.**
   Use case tests must only import the use case class and the port interface. Adapters (`src/adapter/`) must never be imported in `tests/application/` tests.

4. **Never call `mongoose.connect()`, Redis, or any external service** in unit tests — even inside a `beforeAll`. If a test file touches real infrastructure, it is an integration test, not a unit test, and must be placed and labeled accordingly.

5. **Assert on mock calls, not on side effects.**
   Verify behavior by checking `expect(mockRepo.findAll).toHaveBeenCalledWith(...)` — not by querying a database or inspecting external state.

6. **Never assert on log calls.**
   `logger.info`, `logger.warn`, and `logger.error` are observability side-effects, not behavior. Do not mock `nbra-logger` and do not write `expect(logger.info).toHaveBeenCalledWith(...)`. Tests that assert on log output become brittle the moment a message is rephrased and add no confidence about correctness.

   ```typescript
   // ✅ Correct — assert on observable output, not on logging
   it('should throw when domain is not found', async () => {
     const mockRepo = makeMockRepo({ findById: jest.fn().mockResolvedValue(null) });
     const useCase = new DomainUseCase(mockRepo);

     await expect(useCase.fetchById('x')).rejects.toThrow();
   });

   // ❌ Wrong — asserting on a log side-effect
   it('should log when domain is not found', async () => {
     jest.spyOn(logger, 'error');
     // ...
     expect(logger.error).toHaveBeenCalledWith('[DomainUseCase] Domain not found for id: x');
   });
   ```

7. **Use mock builder functions when the same mock shape appears in more than one test.**
   Define a file-scoped builder function that returns a fresh `jest.Mocked<T>` on every call. Call it inside each `it` block — never hoist the result to `describe` scope.

## Standard Pattern

```typescript
// ✅ Mock builder — defined at file scope, called inside each it
function makeMockRepo(overrides?: Partial<jest.Mocked<ISettingRepositoryPort>>): jest.Mocked<ISettingRepositoryPort> {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

// ✅ UseCase unit test — builder called inside it
it('should return all settings', async () => {
  const mockRepo = makeMockRepo({ findAll: jest.fn().mockResolvedValue([{ id: '1' }]) });
  const useCase = new SettingUseCase(mockRepo);

  const result = await useCase.getAll();

  expect(mockRepo.findAll).toHaveBeenCalled();
  expect(result).toEqual([{ id: '1' }]);
});

// ✅ Controller unit test — same pattern
function makeMockUseCase(overrides?: Partial<jest.Mocked<ISettingUseCase>>): jest.Mocked<ISettingUseCase> {
  return {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    ...overrides,
  };
}

it('should respond 200 with settings', async () => {
  const mockUseCase = makeMockUseCase({ getAll: jest.fn().mockResolvedValue([{ id: '1' }]) });
  const controller = new SettingController(mockUseCase);
  // ...
});
```

```typescript
// ❌ Wrong — inline mock object duplicated across every it (use a builder instead)
it('test A', async () => {
  const mockRepo: jest.Mocked<ISettingRepositoryPort> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  // ...
});

it('test B', async () => {
  const mockRepo: jest.Mocked<ISettingRepositoryPort> = { // duplicated shape
    findAll: jest.fn(),
    // ...
  };
});

// ❌ Wrong — real repository injected into use case test
const realRepo = new SettingMongoAdapter(connection);
const useCase = new SettingUseCase(realRepo); // crosses layer boundary

// ❌ Wrong — real use case injected into controller test
const realUseCase = new SettingUseCase(mockRepo);
const controller = new SettingController(realUseCase); // crosses layer boundary
```

## Why

Unit tests must be fast, deterministic, and scoped to a single class's behavior. Crossing layer boundaries turns a unit test into an integration test — it slows down the suite, introduces non-determinism, and makes failures harder to locate.

Builder functions eliminate copy-paste drift: when an interface gains a new method, you update one builder instead of every `it` block.
