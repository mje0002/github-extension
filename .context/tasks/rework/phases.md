# Completion Plan — GitHub PR Chrome Extension

**Progress:** Phase 0-2 complete (13/25 tasks done) | **Next:** Phase 3 - Test Coverage

## Completed Phases

- ✅ Phase 0: Code Cleanup (4 tasks)
- ✅ Phase 1: PR Display Quality (3 tasks)
- ✅ Phase 2: Multi-PAT Support (6 tasks)

## Remaining Phases

- 🔄 Phase 3: Test Coverage (6 tasks) ← **START HERE**
- ⏳ Phase 4: UX Polish (3 tasks)
- ⏳ Phase 5: v2 Foundation (3 tasks)

---

## Reference

Vision & Directive: `.context/tasks/vision-directive.md`

---

## Phase 0 — Cleanup & Code Quality (Foundation)

These are blocking issues or dead code that must be resolved before building on top of.

### 0.1 — Fix `DEVELOPMENT` type declaration and prod webpack gap

- **Files**: `src/@types/*.d.ts`, `webpack/webpack.prod.js`
- `DEVELOPMENT` is declared as `string` but used as `boolean`. Fix type to `boolean`.
- `webpack.prod.js` does not define `DEVELOPMENT` via `DefinePlugin`. Add `DEVELOPMENT: JSON.stringify(false)` so prod builds don't hit undefined.

### 0.2 — Remove starter kit dead code

- **Files**: `src/options.tsx`, `public/options.html`, `src/content_script.tsx`
- `options.tsx` is the template starter (color picker) — not wired to extension functionality. Either repurpose or remove.
- `content_script.tsx` is the template starter (color change listener) — not used. Remove or repurpose.
- `useFetch.ts` is a generic hook referenced by nothing in the codebase. Remove or document intended use.

### 0.3 — Remove dead service code

- **File**: `src/lib/services/github.ts`
- `processPullRequests()` method is dead — replaced by inline logic in `getPullRequests()`. Remove.

### 0.4 — Fix minor bugs and typos

- **File**: `src/components/home.tsx` — "configureation" → "configuration"
- **File**: `src/components/Configuration.tsx` — `configerror` → `configError` (naming convention)
- **File**: `src/lib/models/configuration.ts` — `has_assigned` field: remove it or file a clear TODO with intent; currently misleads readers
- **File**: `src/components/Configuration.tsx` — `modifyErrorState` takes a `type` param that is never used

---

## Phase 1 — PR List Quality (v1 Quick Win)

These are high-impact, low-risk changes that improve the core feature immediately.

### 1.1 — Add PR title to data model and display

- **Files**: `src/components/RepoCard.tsx`, `src/lib/services/github.ts`, `src/lib/services/github.mock.ts`, `src/components/PullRequet.tsx`
- Add `title: string` to `basePullRequest` type
- Update `GithubService.getPullRequests()` to capture `curr.title` from search API response
- Update `MockGithubService.getPullRequests()` to include a faker title
- Update `PullRequest.tsx` to display title text alongside PR number

### 1.2 — Sort PRs by `created_at` descending

- **File**: `src/components/RepoCard.tsx` or `PullRequestWrapper.tsx`
- After receiving `response`, sort by `created_at` descending before passing to `PullRequestWrapper`

### 1.3 — Max-height + scrollbar on PR list

- **File**: `src/components/PullRequestWrapper.tsx`
- Wrap the `AccordionDetails` list in a container with `maxHeight` (e.g., `150px`) and `overflow: auto`

---

## Phase 2 — Multi-PAT Support (v1 Core Feature)

The largest and most impactful v1 change. Has breaking model changes requiring a data migration.

### 2.1 — Create `PATEntry` model

- **New file**: `src/lib/models/pat-entry.ts`
- Shape: `{ id: string, label: string, platform: 'github' | 'gitlab', token: string }`
- This is the foundation everything in Phase 2 builds on.

### 2.2 — Update `ConfigSchema` to use `tokens: PATEntry[]`

- **Files**: `src/lib/models/configuration.ts`
- Replace `personal_access_token: string | undefined` with `tokens: PATEntry[]`
- Remove `has_assigned` (or preserve with TODO comment)
- Update `Configuration` class constructor

### 2.3 — Update `ConfigurationContext` reducer for new schema + migration

- **File**: `src/components/ConfigurationContext.tsx`
- Update `configurationReducer` for add/update/delete of `PATEntry` items in `tokens[]`
- Add migration logic in `ConfigsRepo` Provider `useEffect`: detect legacy `personal_access_token` string and convert to a `PATEntry` with label "Default"
- Persist migrated data back to `chrome.storage.sync`

### 2.4 — Redesign `Configuration.tsx` UI for multi-PAT CRUD

- **File**: `src/components/Configuration.tsx`
- Replace single-input form with a list of existing PAT entries (label + masked token + edit/delete per row)
- Add "New PAT" form: label field + token field (masked/toggle) + platform select (defaulting to `github`)
- Per-entry: edit in-place or modal, delete with confirmation

### 2.5 — Add `pat_id` and `platform` to `RepoSchema`

- **File**: `src/lib/models/repo.ts`
- Add `pat_id: string` and `platform: 'github' | 'gitlab'` to `RepoSchema` and `Repo` class
- Update constructor with defaults

### 2.6 — Update `ReposPage` to fetch per PAT and tag repos

- **File**: `src/components/ReposPage.tsx`
- "Fetch" button must iterate over all `tokens[]` in config, create a `GithubService` per token, fetch repos for each, and tag each result with `pat_id`
- Show PAT label column in the repos table

---

## Phase 3 — Test Coverage

Currently only `Configuration` model is tested. All new and existing logic needs coverage.

### 3.1 — Add chrome API mock setup

- **Files**: `jest.config.js` or a new `src/__tests__/setup.ts`
- Mock `chrome.storage` and `chrome.tabs` so context and component tests can run

### 3.2 — Add `Repo` model tests

- **New file**: `src/__tests__/models/repo.ts`
- Cover constructor mapping, `isEnabled` default, random ID fallback

### 3.3 — Add `PATEntry` model tests (after Phase 2.1)

- **New file**: `src/__tests__/models/pat-entry.ts`

### 3.4 — Add `configurationReducer` tests

- **New file**: `src/__tests__/reducers/configuration.ts`
- Cover: add (new token to empty list), update (edit existing), delete, full-load, migration path

### 3.5 — Add `reposReducer` tests

- **New file**: `src/__tests__/reducers/repos.ts`
- Cover: add (deduplication by id), update, delete

### 3.6 — Add `API` queue tests

- **New file**: `src/__tests__/services/api.ts`
- Cover: sequential execution order, error propagation, dequeue after completion

### 3.7 — Add `GithubService` unit tests

- **New file**: `src/__tests__/services/github.ts`
- Mock Octokit; test `getPullRequests` data mapping, pagination exit condition, rate-limit backoff

---

## Phase 4 — UX Polish

### 4.1 — Empty state messaging

- **File**: `src/components/home.tsx`
- Existing "No Repos configured" message is helpful but text has a typo ("configureation"). Fix + improve copy.
- Add a distinct state for "repos configured but all PRs loading" vs "no open PRs"

### 4.2 — Popup dimensions review

- **File**: `src/style.css`
- `#root` is fixed `350px × 750px`. Review if this works well with multi-PAT content and PR titles. Adjust if needed.

### 4.3 — Error state improvements

- Replace bare `<div style={{ color: 'red' }}>` error display with MUI `Alert` component for consistency

---

## Phase 5 — v2 Foundation (Groundwork, Not Full Impl)

Plant the interfaces so v2 can be layered in without rework.

### 5.1 — Extract `VCSService` interface

- **New file**: `src/lib/services/vcs-service.ts`
- Define interface with `getRepos()` and `getPullRequests()`
- Update `GithubService` to `implements VCSService`
- No behavior changes — purely structural

### 5.2 — `platform` field plumbing

- Ensure `PATEntry.platform` and `RepoSchema.platform` are wired through all layers
- Groundwork for `GitlabService` without implementing it

---

## Dependency Order

```
Phase 0 (cleanup)
    ↓
Phase 1 (PR quality — independent of Phase 2)
    ↓
Phase 2.1 (PATEntry model)
    ↓
Phase 2.2 (ConfigSchema update)
    ↓
Phase 2.3 (Context reducer + migration)
    ↓
Phase 2.4 (Configuration UI)
    ↓
Phase 2.5 (Repo model update)
    ↓
Phase 2.6 (ReposPage multi-PAT fetch)
    ↓
Phase 3 (Tests — can start after 0; fully after Phase 2)
    ↓
Phase 4 (UX Polish — after Phase 1 and 2)
    ↓
Phase 5 (v2 Foundation — after all v1)
```

---

## Out of Scope (v2 — Not Planned Here)

- GitLab `GitlabService` implementation
- Background worker badge notifications
- Desktop notification system
