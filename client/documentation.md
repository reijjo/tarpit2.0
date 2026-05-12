# 📖 Frontend Documentation

## Overview

Current frontend structure and the packages that matter in day-to-day work. This is a curated guide, not a full dependency inventory.

## Project Structure

```text
src/
├── app/ # Routes, pages, route-local UI, and app-wide CSS
├── components/ # Shared layout and UI components
├── lib/ # API clients, actions, auth helpers, hooks, schemas, stores, types, utils
└── test/ # Test setup, fixtures, and helpers
e2e/ # Playwright specs and helpers
public/ # Static assets
```

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
| `(public)/page.tsx` | Home / landing page |
| `globals.css` | App-wide styles and CSS vars |

### Route groups

- `(public)/` - Public landing pages
- `(auth)/` - Login, register, verify, and forgot-password flows
- `(app)/` - Bets and dashboard pages

---

## `src/components/`

Shared, reusable components organized by purpose.

### `layout/`

App shell and structure components such as `Navbar`, `Footer`, `Sidebar`, and `AppContent`.

### `ui/`

Primitive and reusable UI pieces such as `Button`, `TextInput`, `Divider`, cards, and message components.

---

## `src/lib/`

Business logic organized by concern.

| Directory | Purpose |
| --- | --- |
| `actions/` | Next.js Server Actions |
| `api/` | Backend API client wrappers |
| `auth/` | Auth helpers such as `getMe` |
| `constants/` | Shared constants |
| `hooks/` | Reusable client hooks |
| `schemas/` | Zod validation schemas |
| `stores/` | Zustand stores |
| `types/` | TypeScript type definitions |
| `utils/` | Pure utility functions and helpers |

### Notes

- `src/lib/actions/` handles form submissions and other server-side flows.
- `src/lib/api/` contains typed wrappers around Rust backend calls.
- `src/lib/schemas/` holds validation for forms and request payloads.
- `src/lib/stores/` currently includes the sidebar UI state store.

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

