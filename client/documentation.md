# Frontend Documentation

## Overview

Current frontend structure and the packages that matter in day-to-day work. This is a curated guide, not a full dependency inventory.

## Project Structure

```text
src/
├── app/ # Routes, layouts, page entrypoints, route-local UI, and app-wide CSS
├── components/ # Shared layout and reusable UI components
├── features/ # Domain logic and feature-owned UI
├── lib/ # API clients, auth helpers, hooks, schemas, stores, types, utils
└── test/ # Test setup, fixtures, and helpers
e2e/ # Playwright specs and helpers
public/ # Static assets
```

The current split is:

- `src/app/` keeps route composition, layouts, and thin page entrypoints.
- `src/app/**/_components/` holds route-local components that are only used by a single route tree.
- `src/features/` holds reusable business logic and feature UI that would become awkward inside a single page tree.
- `src/components/` holds shared UI and layout primitives that are not domain-specific.

---

## `public/`

Static assets directory for images, fonts, and other media files.

---

## `src/app/`

### Core files

| File | Purpose |
| --- | --- |
| `error.tsx` | Error boundary fallback |
| `layout.tsx` | Root app layout |
| `not-found.tsx` | 404 handler |
| `globals.css` | App-wide styles and CSS vars |

### Route groups

- `(public)/` - Public landing pages
- `(auth)/` - Login, register, verify, and forgot-password flows
- `(app)/` - Bets and dashboard pages

### Notes

- Public and auth pages keep route-local components under `_components/` next to the page.
- `src/app/(public)/_components/features/` contains the landing-page feature blocks.
- `src/app/(app)/` stays intentionally thin and delegates page logic to `src/features/`.

---

## `src/features/`

Feature code is grouped by product area.

| Directory | Purpose |
| --- | --- |
| `auth/` | Auth API calls, server actions, validation schemas, and auth types |
| `bets/` | Bet-related constants, schemas, and types |
| `dashboard/` | Dashboard cards and feature UI |

### Notes

- `src/features/auth/` is the main home for auth behavior used by login and register flows.
- `src/features/dashboard/` contains the reusable dashboard sections rendered by the app dashboard page.
- `src/features/bets/` holds the domain types and validation used around bet entry and display.

---

## `src/components/`

Shared, reusable components organized by purpose.

### `layout/`

App shell and structure components such as `Navbar`, `Footer`, `Sidebar`, and `AppContent`.

### `ui/`

Primitive and reusable UI pieces such as `Button`, `TextInput`, `Divider`, cards, and message components.

---

## `src/lib/`

Support code organized by concern.

| Directory | Purpose |
| --- | --- |
| `auth/` | Session helpers such as `getMe` |
| `constants/` | Shared constants |
| `hooks/` | Reusable client hooks |
| `stores/` | Zustand stores |
| `types/` | TypeScript type definitions |
| `utils/` | Pure utility functions and helpers |

### Notes

- `src/lib/auth/` contains auth-session helpers used across the app.
- `src/lib/stores/` currently includes the sidebar UI state store.
- `src/lib/utils/envConfig.ts` is the central place for frontend environment access.

---

## `e2e/`

Playwright end-to-end tests and helpers.

- Specs live under `client/e2e/**/*.spec.ts`
- Shared helpers live under `client/e2e/helpers/`
- Configuration lives in `client/playwright.config.ts`
- The Playwright config starts both the Rust backend and the Next.js app automatically

Run with:

```bash
bun test:e2e
bun test:e2e:ui
bun test:e2e:headed
```

---

## `src/test/`

Shared Vitest setup, fixtures, and utilities.

- Configuration lives in `client/vitest.config.ts`
- Setup runs from `src/test/setup/vitest.setup.ts`
- Unit and component specs use `*.spec.ts` and `*.spec.tsx`

Run with:

```bash
bun test
bun test:cover
```

---

## Installed Packages

### App Packages

- `next` - App router framework
- `react` / `react-dom` - UI runtime
- `lucide-react` - Icons used across the app
- `recharts` - Dashboard charts and summary visualizations
- `zod` - Form and payload validation
- `zustand` - Client-side UI state

### Testing Packages

- `vitest` - Unit and component tests
- `@testing-library/react` - Component rendering and queries
- `@testing-library/jest-dom` - DOM matchers
- `@playwright/test` - End-to-end tests

### Tooling Packages

- `eslint` and `eslint-config-next` - Linting
- `typescript` and `@types/*` - Type checking
- `@vitejs/plugin-react` - Vitest React support
- `@vitest/coverage-v8` - Coverage reporting
- `babel-plugin-react-compiler` - React compiler support
- `@trivago/prettier-plugin-sort-imports` - Import sorting

---

## Common Scripts

Current package scripts in `client/package.json`:

```json
{
  "dev": "bun --bun next dev",
  "build": "bun --bun next build",
  "start": "bun --bun next start",
  "lint": "eslint",
  "test": "vitest",
  "test:cover": "vitest run --coverage",
  "test:e2e": "NODE_ENV=test playwright test",
  "test:e2e:ui": "NODE_ENV=test playwright test --ui",
  "test:e2e:headed": "NODE_ENV=test playwright test --headed"
}
```
