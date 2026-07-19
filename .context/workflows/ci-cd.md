# CI / CD

## Pipeline

**Provider**: GitHub Actions  
**Config**: `.github/workflows/build.yml`

## Triggers

- `push` to `master`
- `pull_request` targeting `master`

## Jobs

| Step | Command |
|------|---------|
| Checkout | `actions/checkout@v2` |
| Setup Node | `actions/setup-node@v1` |
| Install | `npm ci` |
| Build | `npm run build --if-present` |
| Test | `npm test` |

**Node versions tested**: 16.x and 18.x (matrix strategy)

## Local Commands

```bash
npm install          # Install deps
npm run build        # Production build → dist/
npm run watch        # Dev build with watch
npm test             # Run Jest tests
npm run style        # Format with Prettier (src/**/*.{ts,tsx})
```

## Deployment

There is no automated deployment. The extension is distributed manually:

1. `npm run build` → produces `dist/`
2. Load `dist/` as unpacked extension in Chrome for testing
3. For Chrome Web Store: zip `dist/` and upload via the developer dashboard

<!-- TODO: Add automated Chrome Web Store deployment via GitHub Actions when ready -->
