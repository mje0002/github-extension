# Migration Guide

## chrome.storage.sync Data Migrations

When `ConfigSchema` or `RepoSchema` shapes change, existing user data in
`chrome.storage.sync` must be migrated on first load.

### Current Schema Versions

| Key | Shape | Since |
|-----|-------|-------|
| `configs` | `ConfigSchema` (`personal_access_token`, `has_assigned`) | v1.0 |
| `repos` | `RepoSchema[]` (`id`, `name`, `full_name`, `url`, `open_issues`, `open_issues_count`, `isEnabled`) | v1.0 |

### Planned Breaking Changes

**v1 — Multi-PAT Migration** (see `decisions.md` ADR-006):

`configs.personal_access_token: string` → `configs.tokens: PATEntry[]`

Migration logic (to implement in `ConfigsRepo` Provider `useEffect`):

```typescript
// On load from storage:
if (storage.configs?.personal_access_token && !storage.configs?.tokens) {
  // Migrate legacy single token to new tokens array
  const migratedTokens: PATEntry[] = [{
    id: crypto.randomUUID(),
    label: 'Default',
    platform: 'github',
    token: storage.configs.personal_access_token,
  }];
  dispatch({ type: 'migrate', tokens: migratedTokens });
}
```

<!-- TODO: Implement this migration when multi-PAT work begins -->

### Adding a Migration

1. Add a version field to `ConfigSchema` or `RepoSchema`
2. In the Provider's `useEffect`, check stored version against current
3. Transform data inline before dispatching to context
4. Write migrated data back to `chrome.storage.sync`
