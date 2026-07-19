# Domain Entities

## ConfigSchema / Configuration

**File**: `src/lib/models/configuration.ts`

Represents the user's extension settings, persisted to `chrome.storage.sync` under key `configs`.

| Field | Type | Description |
|-------|------|-------------|
| `personal_access_token` | `string \| undefined` | GitHub Personal Access Token |
| `has_assigned` | `boolean \| undefined` | Filter PRs assigned to user (unused — planned) |

**Business rules**:
- A PAT is required before repos can be fetched or PRs displayed
- No token validation at model level — validation happens in `ReposPage` before calling GitHub API
- `has_assigned` is currently a no-op placeholder

**v1 Evolution**: Replace `personal_access_token` with `tokens: PATEntry[]` to support
multiple GitHub orgs/accounts. See `decisions.md` ADR-006 and `architecture/migration-guide-template.md`.

---

## RepoSchema / Repo

**Files**: `src/lib/models/repo.ts`, `src/lib/models/github/UserRepo.ts`

Represents a GitHub repository the user has access to. Persisted to `chrome.storage.sync`
under key `repos`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | GitHub repo ID (or random negative int if unknown) |
| `name` | `string` | Short repo name (e.g., `"github-extension"`) |
| `full_name` | `string` | Org/repo name (e.g., `"mje0002/github-extension"`) |
| `url` | `string` | HTML URL for the repo (maps from `html_url` in GitHub API) |
| `open_issues_count` | `number` | Total open issues (from GitHub API) |
| `open_issues` | `number` | Alias for `open_issues_count` |
| `isEnabled` | `boolean` | Whether to show this repo on the Home page (user-controlled) |

**Business rules**:
- `isEnabled = false` by default — user must explicitly enable repos
- `full_name` is used as the identifier for GitHub API PR queries: `repo:${full_name}`
- Repos are deduplicated by `id` when added to context (see `reposReducer`)
- Displayed repos on Home page are those where `isEnabled === true`

**v1 Evolution**: Add `pat_id: string` to link each repo to the PAT used to fetch it,
and `platform: 'github' | 'gitlab'` for multi-platform support.

---

## PullRequest (basePullRequest)

**File**: `src/components/RepoCard.tsx` (type defined inline)

Represents an open pull request returned by the GitHub search API.
Not persisted — fetched fresh on each popup open.

| Field | Type | Description |
|-------|------|-------------|
| `pr_number` | `number` | GitHub PR number |
| `comments` | `number` | Number of comments |
| `update_at` | `Date` | Last updated timestamp |
| `link` | `string` | Full HTML URL to the PR |
| `created_at` | `Date` | PR creation timestamp |

**Business rules**:
- PRs are fetched via GitHub search API: `is:pr state:open repo:{full_name}`
- Only open PRs are shown
- Click on `pr_number` opens the PR URL in a new Chrome tab
- **Planned**: Sort by `created_at` descending; display PR title alongside number

---

## UserRepo

**File**: `src/lib/models/github/UserRepo.ts`

Raw shape from GitHub API `/user/repos` endpoint. `RepoSchema` extends this type
by adding `isEnabled`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | GitHub repo ID |
| `name` | `string` | Short repo name |
| `full_name` | `string` | `owner/repo` |
| `url` | `string` | Repo HTML URL |
| `open_issues_count` | `number` | Open issues |
| `open_issues` | `number` | Open issues (alternate field) |
