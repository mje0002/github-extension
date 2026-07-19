# Glossary

Terms used in the codebase, UI, and documentation.

| Term | Definition |
|------|-----------|
| **PAT** | Personal Access Token — a GitHub (or GitLab) API credential scoped to a user account. Required for authenticating all GitHub API calls. |
| **Repo / Repository** | A GitHub repository the user has access to. Stored as `RepoSchema` in context. |
| **Enabled repo** | A repo where `isEnabled === true` — shown on the Home page dashboard. Controlled by the user via the Repos page. |
| **PR** | Pull Request — an open code review request on GitHub. Displayed per repo on the Home page. |
| **MR** | Merge Request — GitLab's equivalent of a GitHub PR. Target for v2 platform support. |
| **Home page** | The main popup view (nav index 0). Shows a 2-column grid of enabled repos with their open PRs. |
| **Configuration page** | Nav index 1. Manages PAT(s) — add, update, delete. |
| **Repos page** | Nav index 2. Shows all fetched repos and lets users enable/disable tracking per repo. |
| **API Queue** | `src/lib/services/api.ts` — a static serial queue that prevents concurrent GitHub API calls and handles rate-limit backoff. |
| **GithubService** | `src/lib/services/github.ts` — wraps Octokit to fetch repos and PRs with pagination and backoff support. |
| **MockGithubService** | `src/lib/services/github.mock.ts` — extends `GithubService`, overrides `getPullRequests` with faker data. Used in `DEVELOPMENT` mode. |
| **ConfigsRepo** | The Context Provider for `ConfigSchema` state. Name is a legacy artifact — new providers should use `XxxProvider` naming. |
| **ReposProvider** | The Context Provider for `RepoSchema[]` state. |
| **chrome.storage.sync** | Chrome Extension API for persisting data synced across the user's Chrome profile. Quota: ~100KB. |
| **DEVELOPMENT** | Webpack `DefinePlugin` global — `true` in dev builds, `false` in prod. Switches `RepoCard` between real and mock services. |
| **full_name** | `owner/repo` format string (e.g., `"mje0002/github-extension"`). Used as the GitHub API identifier for PR queries. |
| **Octokit** | Official GitHub REST API client library. Wrapped by `GithubService`. |
| **VCSService** | Planned (v2) — interface abstracting `GithubService` and `GitlabService` behind a common contract. |
| **PATEntry** | Planned (v1) — named, labeled token entry: `{ id, label, platform, token }`. Will replace the single `personal_access_token` field. |
