# Error Handling

Inferred from `src/components/RepoCard.tsx`, `src/components/ReposPage.tsx`,
`src/components/Configuration.tsx`, and `src/lib/services/github.ts`.

## Pattern: Loading / Error / Data State Trio

Every async operation co-locates three state variables:

```typescript
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(false);
const [hasError, setHasError] = useState<{ message: string } | null>(null);
```

This is the standard across all components. Do not deviate.

## Pattern: try / catch / finally

All async handler functions follow this structure:

```typescript
const handleFetch = async () => {
  if (loading) return;          // guard against double-submit
  setLoading(true);
  try {
    // ... async work ...
  } catch (error) {
    if (error instanceof Error) {
      setHasError({ message: error.message });
    }
  } finally {
    setLoading(false);           // always clear loading
  }
};
```

- Always check `if (loading) return` before starting async work.
- Always use `instanceof Error` before accessing `.message` — never assume error type.
- Always clear loading in `finally`, not in `try`.

## Pattern: Error Display

Errors are rendered inline near the relevant UI:

```tsx
{hasError && <div>Error occurred. {hasError.message}</div>}
// or
{repoError && <div style={{ color: 'red' }}>{repoError}</div>}
```

There is no global error boundary currently. Component-level error display is the norm.

## Pattern: Temporary Error Messages (Debounce Clear)

Validation errors in the Configuration and Repos pages auto-clear after 2 seconds
using a local `debounce` utility:

```typescript
const modifyErrorState = (errorMessage: string | null) => {
  setError(errorMessage);
  if (errorMessage) {
    debounce(setError, 2000)(null);
  }
};
```

## Pattern: useEffect Cleanup (Ignore Flag)

To prevent setting state on unmounted components after async calls:

```typescript
useEffect(() => {
  let ignore = false;
  API.queue(() => service.getPullRequests(repo.full_name))
    .then((res: any) => {
      if (res && !ignore) setResponse(res);
    });
  return () => { ignore = true; };
}, []);
```

See `src/components/RepoCard.tsx`.

## Pattern: Chrome API Validation

Before using Chrome-specific APIs, validate config/state and provide helpful errors:

```typescript
if (!configs || !configs.personal_access_token) {
  throw new Error('Access Token Required');
}
```

## Service Layer Error Propagation

`GithubService` does not catch errors internally — it lets Octokit errors
propagate to the caller (component level). This means network errors and
401 auth failures surface as thrown `Error` instances, caught by the
component's `catch` block.
