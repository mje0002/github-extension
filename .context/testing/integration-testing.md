# Integration Testing

## Current State

No integration or end-to-end tests exist in this project.

The CI pipeline runs `npm test` which covers unit tests only (Jest).

## Recommended Approach (Future)

### Browser Extension Testing

For testing the full extension flow (popup → GitHub API → storage → UI):

- **Puppeteer** or **Playwright** with Chrome extension support
- Load the built `dist/` as an unpacked extension in the test browser
- Test scenarios:
  1. User enters a PAT and saves → storage has correct value
  2. User fetches repos → repo list populates
  3. User enables a repo → it appears on Home page
  4. Home page loads → PR cards appear with correct data

### API Integration Tests

For testing `GithubService` against real GitHub API:

- Use a test GitHub account with a scoped PAT
- Store in CI secrets (`GITHUB_TEST_PAT`)
- Run separately from unit tests (e.g., `npm run test:integration`)

<!-- TODO: Implement integration tests when the feature set stabilizes -->
