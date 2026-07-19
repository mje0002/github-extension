# Code Style

Inferred from reading `src/components/`, `src/lib/`, and `src/popup.tsx`.

## Language

- **TypeScript strict mode** — always type function parameters and return values
- Prefer `type` for object shapes, `interface` only when extension/merging is needed
- Use `FC<Props>` for React functional components with explicit prop types

## File Organization

- One component per file; file name matches the exported component name
- Entry point files (`popup.tsx`, `options.tsx`) handle wiring only — no business logic
- Context files export: Provider component, `useX()` hook, `useXDispatch()` hook

## Imports

- Named imports preferred over default where practical
- React import omitted (React 18 JSX transform — no `import React` needed unless
  using `React.useState` etc. explicitly)
- Order: React → MUI → internal components → hooks → lib (models, services) → styles

Example from `src/components/ReposPage.tsx`:
```typescript
import { FC, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import { TableContainer, Table, ... } from "@mui/material";
import { Repo } from "../lib/models/repo";
import { GithubService } from "../lib/services/github";
import { useRepos, useReposDispatch } from "./ReposContext";
import { useConfiguration } from "./ConfigurationContext";
```

## React Components

- Use `FC<Props>` type annotation on all components
- Destructure props inline: `const MyComp: FC<{ repo: RepoSchema }> = ({ repo }) => {`
- Keep JSX logic minimal — extract complex conditionals to variables before return
- Prefer conditional rendering with ternary for simple cases:
  ```tsx
  {loading ? <div>Loading...</div> : <Content />}
  ```

## Styling

- Use MUI `sx` prop for all component-level styling — avoid inline `style` except for
  simple single-property overrides (e.g., `style={{ paddingRight: '5px' }}`)
- Use `theme` callback in `sx` for palette-dependent styles:
  ```tsx
  sx={(theme) => ({ backgroundColor: theme.palette.primary.light })}
  ```
- Global CSS (`src/style.css`) is minimal — prefer component-scoped `sx`

## State

- Component-local state: `useState`
- Cross-component state: React Context + `useReducer` (see `ConfigurationContext.tsx`, `ReposContext.tsx`)
- Loading and error are always co-located with their data state:
  ```typescript
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  ```

## Async / Side Effects

- All GitHub API calls go through `API.queue()` — never call service methods directly
- Use `useEffect` with an `ignore` flag to prevent state updates on unmounted components:
  ```typescript
  useEffect(() => {
    let ignore = false;
    // ...
    return () => { ignore = true; }
  }, []);
  ```
- Always wrap async work in try/catch/finally with loading state cleanup

## Chrome API Usage

- Always guard Chrome API calls: `if (chrome.storage) { ... }` and `if (chrome.tabs) { ... }`
- Provide a browser fallback (e.g., `window.open`) for non-extension environments (dev/test)
