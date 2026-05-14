# Frontend Guidelines

## Technology Stack Standards

- Use Next.js 16+ app router patterns.
- Use React 19+ features where they fit the codebase.
- Write all code in TypeScript.
- Do not use `any`; define proper types instead.
- Do not use `@ts-ignore`; fix the type issue properly.
- Use Zod for form validation, API schemas, and runtime validation.
- Keep TypeScript strict and resolve type errors instead of suppressing them.

## Implementation Standards

- Prefer app-router conventions with clear server/client boundaries.
- Keep components, hooks, and utilities small and focused.
- Use proper types for props, state, API responses, and form data.
- Handle errors explicitly and use typed error states where needed.
- Follow the existing project patterns before introducing a new approach.

## Package Management

- Use Bun exclusively for installs and scripts.
- Use `bun install`, `bun add`, and `bun remove` for dependency changes.
- Do not introduce npm or yarn commands into the workflow.

## Testing and Verification

- Check the implementation before writing tests.
- Follow existing test structure and naming: `*.spec.ts` for utilities, `*.spec.tsx` for components.
- Focus on real scenarios, not coverage padding or mock-only tests.
- Use `bun lint`, `bun run test`, `bun run test:cover`, and `bun run test:e2e` as the standard checks.
- Use `bun run test:e2e:ui` or `bun run test:e2e:headed` only when debugging.
- Do not add or update tests unless the user explicitly asks for test changes.
- Still run the relevant tests after making code changes so regressions are caught.

## Documentation

- Update frontend docs when behavior, setup, or user flows change.
- Keep docs short and practical, using relative paths only.
- Keep docs aligned with the code, especially `client/documentation.md` and related setup notes.

## Project Layout

- `src/app/` contains route groups, layouts, pages, and route-local components.
- `src/app/**/_components/` holds components that are only used inside a single route tree.
- `src/components/` holds reusable UI and layout pieces.
- `src/features/` holds feature-owned logic and UI for areas like `auth`, `bets`, and `dashboard`.
- `src/lib/` holds shared client-side helpers, hooks, stores, types, and utilities.
- `src/test/` contains shared test setup, fixtures, and utilities.
- `e2e/` contains Playwright tests and helpers.
- `public/` holds static assets.
- Keep route-specific logic close to the route when that makes the code easier to follow; promote only reusable pieces into `src/components/`, `src/features/`, or `src/lib/`.
