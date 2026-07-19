# Architecture Patterns

## Pattern 1 — React Context + useReducer (State Domain)

Each global state domain is encapsulated in its own Context file with a consistent shape:

**Structure** (see `src/components/ConfigurationContext.tsx`, `ReposContext.tsx`):

```
1. Define dispatch type(s)
2. Create Context and DispatchContext (both start as null)
3. Export Provider component:
   - Initialize state with chrome.storage.sync on mount
   - Wrap children with Context + DispatchContext providers
4. Export useX() hook → reads context value
5. Export useXDispatch() hook → reads dispatch context
6. Implement xReducer(state, action) handling 'add' | 'update' | 'delete'
```

**When adding a new state domain**:
- Follow this exact structure
- Always load from `chrome.storage.sync` in `useEffect` of the Provider
- Always write back to `chrome.storage.sync` in a `useEffect` watching the state value (done at component level)

---

## Pattern 2 — Service + Queue for API Calls

All external API calls follow this two-layer pattern:

**Layer 1 — Service class** (e.g., `src/lib/services/github.ts`):
- Encapsulates all Octokit logic, pagination, and backoff
- Returns typed domain objects (not raw API responses)
- Has a `Mock` subclass for development: `src/lib/services/github.mock.ts`

**Layer 2 — API Queue** (`src/lib/services/api.ts`):
- Serializes all calls: `API.queue(() => service.getPullRequests(repo.full_name))`
- Prevents rate limit violations when many repos are enabled
- Used in `useEffect` inside `RepoCard.tsx`

**Do not** call service methods directly from components — always go through `API.queue()`.

---

## Pattern 3 — RepoCard as Self-Fetching Unit

Each repo card is responsible for fetching its own PR data:

```
HomePage → renders one <RepoCard repo={repo}> per enabled repo
RepoCard → useEffect → API.queue(getPullRequests) → renders <PullRequestWrapper>
PullRequestWrapper → renders list of <PullRequest> items
```

This keeps fetching isolated and allows per-card loading/error states.
The trade-off is that cards fetch sequentially (through the API queue) rather than in parallel.

---

## Pattern 4 — DEVELOPMENT Mode Mock

A `DEVELOPMENT` global (injected via Webpack DefinePlugin — check `webpack/`) switches
`RepoCard.tsx` between real and mock services:

```typescript
const service = DEVELOPMENT
  ? new MockGithubService(configs?.personal_access_token ?? '')
  : new GithubService(configs?.personal_access_token ?? '');
```

`MockGithubService` extends `GithubService` and overrides `getPullRequests` with
`@faker-js/faker` generated data. Add mock data for new service methods in the same file.

---

## Component Hierarchy

```
App (popup.tsx)
  └── ConfigsRepo (ConfigurationContext provider)
      └── ReposProvider (ReposContext provider)
          ├── Drawer (nav)
          └── Box (main content)
              ├── HomePage
              │   └── RepoCard[]
              │       └── PullRequestWrapper
              │           └── PullRequest[]
              ├── Configuration
              └── ReposPage
```
