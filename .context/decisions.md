# Architecture Decision Records

## ADR-001 — React Context + useReducer for State Management

**Date**: 2024  
**Status**: Active

**Decision**: Use React Context + `useReducer` (not Redux or Zustand) for global state.

**Rationale**: The app has two small, independent state domains (`configs`, `repos`).
React's built-in Context API is sufficient. Adding Redux would be over-engineering for
an extension popup with limited state surface area.

**Implementation**: `src/components/ConfigurationContext.tsx`, `src/components/ReposContext.tsx`

---

## ADR-002 — API Queue for GitHub Calls

**Date**: 2024  
**Status**: Active

**Decision**: Serialize all GitHub API calls through a static queue (`src/lib/services/api.ts`)
rather than firing concurrent requests.

**Rationale**: Each enabled repo triggers a `getPullRequests` call on popup open. Firing
all simultaneously risks hitting GitHub rate limits. A serial queue with backoff handling
ensures reliable behavior across large repo lists.

**Implementation**: `src/lib/services/api.ts` — `API.queue()`, `API.dequeue()`

---

## ADR-003 — Octokit for GitHub API

**Date**: 2024  
**Status**: Active

**Decision**: Use the official `octokit` package for all GitHub REST API calls.

**Rationale**: Handles auth headers, response types, and pagination linkheader parsing.
`GithubService` wraps Octokit to add domain-specific logic (rate-limit backoff, paged data
processing).

**Implementation**: `src/lib/services/github.ts`

---

## ADR-004 — Chrome storage.sync for Persistence

**Date**: 2024  
**Status**: Active

**Decision**: Use `chrome.storage.sync` (not `localStorage` or `storage.local`) for
storing configs and repos.

**Rationale**: `storage.sync` persists across Chrome profiles/devices for the same
Google account — useful for a developer switching between machines.

**Trade-off**: `storage.sync` has a 100KB quota limit. If a user has many repos, the
stored repo list could approach this limit. Monitor and consider chunking if needed.

---

## ADR-005 — Multi-Platform Vision (v2)

**Date**: 2026  
**Status**: Planned

**Decision**: Abstract API interaction behind a `VCSService` interface to support
GitHub and GitLab.

**Proposed shape**:
```typescript
interface VCSService {
  getRepos(): Promise<UserRepo[]>;
  getPullRequests(repoFullName: string): Promise<PullRequest[]>;
}
```

`GithubService` and `GitlabService` will implement this interface.

**Triggers implementation when**: GitLab PAT support is added to `ConfigSchema`.

---

## ADR-006 — Multi-PAT Support (v1 target)

**Date**: 2026  
**Status**: Planned

**Decision**: Replace `ConfigSchema.personal_access_token: string` with
`ConfigSchema.tokens: PATEntry[]` where each entry has `{ id, label, platform, token }`.

**Rationale**: Users operate across multiple GitHub orgs/accounts. A named PAT list
allows per-org repo fetching and clear UI labeling.

**Impact**: Breaking change to `ConfigSchema` and `ConfigurationContext` reducer.
Requires migration of existing `chrome.storage.sync` data on first load.
