# Naming Conventions

Inferred from actual file and symbol names in the codebase.

## Files

| Type | Convention | Examples |
|------|-----------|---------|
| React components | `PascalCase.tsx` | `RepoCard.tsx`, `Configuration.tsx`, `PullRequestWrapper.tsx` |
| Context files | `PascalCase + Context.tsx` | `ConfigurationContext.tsx`, `ReposContext.tsx` |
| Service classes | `PascalCase.ts` | `github.ts` (exports `GithubService`), `api.ts` (exports `API`) |
| Mock classes | `PascalCase.mock.ts` | `github.mock.ts` (exports `MockGithubService`) |
| Model files | `camelCase.ts` | `repo.ts`, `configuration.ts` |
| Hooks | `camelCase.ts` | `useFetch.ts` |
| Type-only model dirs | `PascalCase/` | `src/lib/models/github/` |

## TypeScript Symbols

| Type | Convention | Examples |
|------|-----------|---------|
| Classes | `PascalCase` | `GithubService`, `Repo`, `Configuration`, `API` |
| Interfaces / Types | `PascalCase` with descriptive suffix | `RepoSchema`, `ConfigSchema`, `UserRepo`, `basePullRequest`, `pullRequestResult` |
| React components (exported) | `PascalCase` | `RepoCard`, `HomePage`, `PullRequestWrapper` |
| Hooks | `camelCase` starting with `use` | `useFetch`, `useRepos`, `useReposDispatch`, `useConfiguration` |
| Context providers | `PascalCase + Provider` or `PascalCase + Repo` | `ReposProvider`, `ConfigsRepo` |
| Reducer dispatch types | `singleDispatch`, `multiDispatch` (local, lowercase) | See `ConfigurationContext.tsx` |
| Constants / theme exports | `camelCase` | `theTheme`, `themeOptions` |
| Event handlers | `handle + PascalCase` | `handleFetch`, `handleConfig`, `handleChange`, `handleNavToggle` |

## Props

- Prop types are defined inline or as a local `type` — not exported unless reused
- Example: `FC<{ repo: RepoSchema }>` inline, or `type pullRequestResult = Array<basePullRequest>` in `RepoCard.tsx`

## State Variables

- Data + setter follow `[noun, setNoun]` pattern: `[repos, setRepos]`, `[loading, setLoading]`
- Error state: `[hasError, setHasError]` with type `{ message: string } | null`
- Loading state: `[loading, setLoading]` as `boolean`

## Context

- Context object: `XxxContext` (not exported directly)
- Dispatch context: `XxxDispatchContext`
- Public hooks: `useXxx()` and `useXxxDispatch()`
- Provider: `XxxProvider` or `XxxsRepo` (legacy — prefer `XxxProvider` going forward)

## CSS Classes

- `kebab-case` in `style.css`: `.repo-name`, `.pull-request`, `.created-at`, `.update-at`, `.comments`, `.main-content`
