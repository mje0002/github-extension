# Vision & Directive Statement — GitHub PR Chrome Extension

## Purpose

A Chrome browser extension that gives developers a fast, low-friction view of all open Pull Requests (and eventually Merge Requests) across the repositories they actively contribute to. It removes the noise of native GitHub/GitLab notification pages and centralizes PR awareness into a single, always-accessible popup.

---

## Core User Problem

Developers working across multiple repositories and organizations lose time context-switching between GitHub notification pages, repository tabs, and email threads to answer one simple question:

> **"What pull requests are open right now — and which ones need my attention?"**

This extension answers that question in one click.

---

## Current State (Implemented)

### Navigation
- **Side drawer** with:
  - `Home` — main PR dashboard
  - `Settings` (collapsible group)
    - `Configuration` — PAT management
    - `Repos` — repository tracking management

### Home Page (tab 0)
- 2-column grid of all **enabled** repositories
- Each repo card shows:
  - Repo full name as a clickable link (opens `/pulls` page in new tab)
  - Collapsible accordion showing open PR count
  - On expand: list of open PRs with PR number (clickable → opens PR in new tab), created date, updated date, comment badge

### Configuration Page (tab 1)
- Single Personal Access Token input (masked/unmasked toggle)
- Add / Update / Delete actions
- Stores to `chrome.storage.sync`
- **Current limitation**: Only one PAT supported at a time despite UI suggesting multi-PAT intent

### Repos Page (tab 2)
- "Fetch" button loads all repos accessible to the configured PAT from GitHub
- Table of repos with name + enabled/disabled checkbox
- Stores selections to `chrome.storage.sync`

### Infrastructure
- TypeScript + React + MUI component library
- Octokit for GitHub REST API
- API queue class for sequential/throttled API calls
- Rate-limit and retry-after backoff handling
- Background service worker (polls every 30s — currently no-op)
- `MockGithubService` for development mode
- Jest test suite

---

## Known Gaps (Current vs. Described Intent)

| Gap | Description |
|-----|-------------|
| **Single PAT only** | `ConfigSchema` holds one `personal_access_token`; multi-PAT not yet modeled |
| **No PR title** | PR list items show number only — no title text |
| **No max-height scroll** | PR list grows unbounded; scrollable container not yet applied |
| **No explicit sort** | PRs should be ordered by `created_at` descending but no sort applied |
| **No GitLab support** | `GithubService` is GitHub-specific; no abstraction layer for other VCS platforms |
| **`has_assigned` unused** | Config field exists but no UI or logic uses it |
| **Repo ↔ PAT association** | No way to link a repo to a specific PAT (required for multi-PAT / multi-org) |
| **Background worker is no-op** | Polling loop exists but performs no work |

---

## Vision

### v1 — Reliable GitHub-Focused Dashboard (Near-Term)

**Goal**: A polished, fully functional GitHub PR viewer supporting multiple PATs for multiple GitHub orgs/accounts.

#### Feature Targets

1. **Multi-PAT Management**
   - Store a list of named PAT entries (e.g., "Personal GitHub", "Work Org")
   - Each PAT has: label, token (masked), platform = `github`
   - CRUD operations per entry (add, edit, delete)

2. **Repo ↔ PAT Association**
   - When fetching repos, associate each repo with the PAT it was fetched through
   - Repos page shows which PAT/account a repo belongs to

3. **PR List Quality**
   - Display PR title alongside PR number
   - Sort PRs by `created_at` descending
   - Max-height container with scrollbar on the PR list per repo card

4. **Refresh on Open**
   - PR data fetches fresh on popup open (no stale cache shown)
   - Background worker remains dormant (v1 behavior)

5. **Config + Repos UX Alignment**
   - PAT management and repo enable/disable may remain separate tabs but should feel cohesive (e.g., show PAT label next to repos)

---

### v2 — Multi-Platform + Badge Notifications (Future)

**Goal**: Extend to GitLab and surface PR activity passively via browser badge and desktop notifications.

#### Feature Targets

1. **GitLab Support (Merge Requests)**
   - Platform-agnostic service interface (`VCSService`) implemented by `GithubService` and `GitlabService`
   - PAT entries gain a `platform` field: `github` | `gitlab`
   - Repos fetched and MRs displayed identically to GitHub flow

2. **Badge Notifications**
   - Background worker polls at configured interval
   - Chrome extension badge shows total open PR/MR count across all enabled repos
   - Desktop notification on new PR/MR open (opt-in)

3. **Multiple PATs per Platform**
   - Support multiple GitHub PATs (different orgs/accounts) and multiple GitLab PATs
   - UI groups PATs by platform

---

## Architectural Direction

### Platform Abstraction (Required for v2, Inform v1)
```
VCSService (interface)
  ├── getRepos(): Promise<UserRepo[]>
  └── getPullRequests(repoFullName: string): Promise<PullRequest[]>

GithubService implements VCSService
GitlabService implements VCSService (v2)
```

### Config Model Evolution
```
// Current
ConfigSchema { personal_access_token: string | undefined }

// v1 Target
ConfigSchema {
  tokens: PATEntry[]           // named, platform-tagged PAT list
}

PATEntry {
  id: string
  label: string
  platform: 'github' | 'gitlab'
  token: string
}
```

### Repo Model Evolution
```
// v1 addition
RepoSchema {
  ...existing fields
  pat_id: string               // links repo to the PATEntry used to fetch it
  platform: 'github' | 'gitlab'
}
```

---

## Out of Scope (v1)
- GitLab support (v2)
- Badge/notification system (v2)
- PR assignment filtering (`has_assigned` deferred)
- PR review status / CI status indicators
- Sorting/filtering beyond created_at desc

---

## Success Criteria

| Criterion | v1 | v2 |
|-----------|----|----|
| User can add multiple named GitHub PATs | ✅ | ✅ |
| Repos are fetched per PAT and labeled accordingly | ✅ | ✅ |
| PR list shows title, number, created/updated date, comment count | ✅ | ✅ |
| PR list is sorted by created_at desc with scrollable container | ✅ | ✅ |
| User can enable/disable repos per PAT source | ✅ | ✅ |
| GitLab MR support via shared interface | — | ✅ |
| Badge shows total open count passively | — | ✅ |
| Desktop notifications for new PRs/MRs | — | ✅ |
