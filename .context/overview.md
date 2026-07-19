# Project Overview

## Name
GitHub PR Chrome Extension (`github-extension`)

## Purpose
A Chrome browser extension that gives developers a fast, centralized view of all open
Pull Requests (and, in future, GitLab Merge Requests) across repositories they actively
contribute to. It replaces the noisy GitHub Notifications page with a clean, one-click popup.

## Vision
- **v1**: GitHub-focused, multi-PAT support (multiple orgs/accounts), polished PR dashboard
- **v2**: GitLab MR support via platform abstraction layer, badge/notification system

See `.context/decisions.md` for architectural direction.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 5 |
| UI Framework | React 18 |
| Component Library | MUI v5 (Material UI) + Emotion |
| Icons | `@mui/icons-material` |
| GitHub API | Octokit 3 |
| State Management | React Context + `useReducer` |
| Build | Webpack 5 (dev: `webpack.dev.js`, prod: `webpack.prod.js`) |
| Testing | Jest 29 + ts-jest + `@faker-js/faker` |
| Chrome API | Manifest V3, `chrome.storage.sync`, `chrome.tabs` |
| Styling | MUI `sx` prop, Emotion, custom theme (`src/theme.ts`) |

## Entry Points

| File | Role |
|------|------|
| `src/popup.tsx` | Main popup app — navigation, page routing, context providers |
| `src/options.tsx` | Chrome options page (currently minimal) |
| `src/content_script.tsx` | Injected into all pages (minimal) |
| `src/background.ts` | Service worker — 30s polling loop (no-op in v1) |
| `public/manifest.json` | Chrome Extension Manifest v3 |

## Source Structure

```
src/
  components/         # React UI components
  hooks/              # Custom React hooks (useFetch)
  lib/
    models/           # Data model classes and types
      github/         # Raw GitHub API shapes (UserRepo)
    services/         # API service classes (GithubService, API queue)
  popup.tsx           # Popup entrypoint + navigation
  style.css           # Global CSS (minimal — prefer MUI sx)
  theme.ts            # MUI theme customization
```

## Navigation Structure

The popup uses a permanent side drawer with:
- **Home** (index 0) — PR dashboard, 2-column repo grid
- **Settings** (collapsible group)
  - **Configuration** (index 1) — PAT management
  - **Repos** (index 2) — fetch and enable/disable repos

## Data Persistence

All user data stored via `chrome.storage.sync`:
- Key `configs` → `ConfigSchema` (PAT, settings)
- Key `repos` → `RepoSchema[]` (fetched repos + enabled flags)

## Build & Run

```bash
npm install          # Install dependencies
npm run watch        # Dev build with file watching
npm run build        # Production build → dist/
npm test             # Run Jest tests
```

Load `dist/` as an unpacked extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked).

## Known Gaps / Roadmap
<!-- TODO: Link to GitHub Issues when created -->
- Single PAT only (multi-PAT is v1 target)
- No PR title displayed
- No max-height/scroll on PR list
- No GitLab support (v2)
- Background worker is no-op (v2 adds badge notifications)
