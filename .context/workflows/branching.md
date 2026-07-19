# Branching Strategy

Inferred from `git branch -a` and commit history.

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `master` | Production — protected; requires PR to merge |
| `develop` | Integration branch — merge feature branches here first |
| `mje0002/<feature-name>` | Feature / fix branches — owned by developer `mje0002` |

## Branch Naming

Format: `{github-username}/{short-description}`

Examples from history:
- `mje0002/github` — GitHub service work
- `mje0002/home` — Home page feature
- `mje0002/refactor-layout` — Layout refactor
- `mje0002/bug-storage` — Storage bug fix
- `mje0002/mocks` — Mock service work

## Workflow

1. Branch from `develop` (or `master` for hotfixes)
2. Name branch `{username}/{description}`
3. Open PR targeting `master`
4. CI must pass (build + tests) before merge
5. Merge via GitHub pull request

## CI Triggers

- Push to `master` → CI runs
- PR targeting `master` → CI runs

See `.context/workflows/ci-cd.md` for CI details.
