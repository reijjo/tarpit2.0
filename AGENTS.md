# Core Principles

- Write simple, readable code that matches existing project patterns.
- Prefer small functions/components; split when a unit becomes hard to scan or reason about.
- Minimum code that solves the problem — prefer the simplest solution that works.
- Follow the official standards and best practices for the framework, language, packages, or crates in use.
- Prioritize security: validate inputs, avoid unsafe patterns, and avoid exposing secrets.
- Challenge bad ideas — suggest better alternatives when needed.
- Explain code and reasoning clearly (act as a tutor).
- DO NOT GUESS! Ask or double check yourself but never guess or assume something without validating it first

## Workflow

- Plan before implementing significant changes.
- Work in small, incremental steps.
- Ask clarifying questions instead of guessing.
- Follow existing project patterns and conventions
- Summarize changed files and the reason for each change.
- Run tests after changes and investigate failures properly.
- Do not add or update tests unless the user explicitly asks for test changes.

## Documentation

- Update docs when behavior, setup, environment variables, or folder structure change.
- Skip docs for refactors or style-only changes, and say why when skipping.

## Modes

### Planning Mode

- Do NOT write production code
- Explain the approach step-by-step
- You may include small illustrative code snippets if helpful
- Focus on structure, decisions, and trade-offs
- Ask for approval before implementation
- When proposing a change, include concise code examples of the intended edits before requesting approval

### Execution Mode

- Follow the approved plan
- Write clean, production-ready code
- Keep changes minimal and focused
- Explain what was done and how to test it

## Code Changes

- For non-trivial changes, present implementation before applying
- When multiple valid approaches exist, present options with pros/cons and recommend one
- Large refactors require a plan and approval
- Touch only what you must. Clean up your own mess.

## Constraints

- Do not introduce new dependencies without approval
- Do not modify infrastructure (Docker, DB schema, CI/CD) without approval
- Do not run destructive git commands without permission; read-only commands like git status, git log, and git diff are allowed.
- Do not make breaking changes without discussion
- Do not expose sensitive data, including environment variables.
- Do not guess — ask when unclear
- Do not assume. Do not hide confusion. Surface tradeoffs
- Avoid generic boilerplate answers; re-check the repo and task if the answer starts sounding generic.
- Treat `server/` as legacy/deprecated. Ignore it for normal frontend/backend work unless a task explicitly names it.

## Repo Map

- `client/` - Next.js frontend. Use `client/AGENTS.md` for app-specific guidance before making changes there.
- `rust-server/` - Rust/Axum backend. Use `rust-server/AGENTS.md` for backend-specific guidance before making changes there.
- `server/` - Legacy/deprecated backend area. Leave untouched unless the task explicitly targets it.
- `README.md`, `DATABASE.md`, and the app docs are the shared top-level references.
- When a task crosses folders, check the matching subfolder instructions for each area instead of relying only on the root file.
