# Unit Testing

## Framework

- **Jest 29** with **ts-jest** transformer
- Config: `jest.config.js` + `tsconfig.test.json`
- Run: `npm test` or `npx jest`

## Test File Location

```
src/__tests__/
  models/
    configuration.ts    ← Tests for Configuration model
```

Tests live in `src/__tests__/` mirroring the `src/` structure.
Name test files to match the source file they test (no `.test.` suffix currently — just `.ts`).

## Test Naming Convention

Descriptive string format: `"[Domain]: [Scenario Description]"`

```typescript
test("Configuration Model: Base Test for Configuration", () => { ... });
test("Configuration Model: No Payload for Configuration", () => { ... });
```

## What to Test

- **Model constructors**: verify data mapping, defaults, and edge cases (empty payload, partial data)
- **Service methods**: mock Octokit; test data transformation logic
- **Reducer functions**: test all action types (`add`, `update`, `delete`)
- **Utilities**: test `API` queue ordering, `debounce` behavior

## Mocking Approach

- Use `@faker-js/faker` for generating realistic test data (see `github.mock.ts`)
- For Chrome APIs: mock `chrome.storage` and `chrome.tabs` in test setup
  <!-- TODO: Add chrome API mock setup to jest.config.js or a global setup file -->
- For Octokit: mock at the `GithubService` level using `jest.spyOn` or by injecting `MockGithubService`

## Example Test

```typescript
// src/__tests__/models/configuration.ts
import { Configuration } from "../../lib/models/configuration";

test("Configuration Model: Base Test for Configuration", () => {
  const model = new Configuration({ personal_access_token: 'aklsdjfds;kfj' });
  expect(model.personal_access_token).toBe('aklsdjfds;kfj');
});

test("Configuration Model: No Payload for Configuration", () => {
  const model = new Configuration({});
  expect(model.personal_access_token).toBe('');
});
```

## Coverage Gaps (Current)

- No tests for `Repo` model
- No tests for `GithubService` / `MockGithubService`
- No tests for `API` queue class
- No tests for context reducers (`configurationReducer`, `reposReducer`)
- No component tests (React Testing Library not yet installed)
