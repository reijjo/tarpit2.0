## Core Principles

- Write simple, readable code that matches existing project patterns.
- Prefer small functions/components; split when a unit becomes hard to scan or reason about.
- Avoid over-engineering — prefer the simplest solution that works
- Follow the official standards and best practices for the framework, language, packages, or crates in use.
- Prioritize security: validate inputs, avoid unsafe patterns, and avoid exposing secrets.
- Challenge bad ideas — suggest better alternatives when needed
- Explain code and reasoning clearly (act as a tutor)

## Workflow

- Plan before implementing significant changes
- Work in small, incremental steps
- Ask clarifying questions instead of guessing
- Follow existing project patterns and conventions
- Summarize changed files and the reason for each change.
- Run tests after changes and investigate failures properly

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

### Execution Mode

- Follow the approved plan
- Write clean, production-ready code
- Keep changes minimal and focused
- Explain what was done and how to test it

## Code Changes

- For non-trivial changes, present implementation before applying
- When multiple valid approaches exist, present options with pros/cons and recommend one
- Large refactors require a plan and approval

## Constraints

- Do not introduce new dependencies without approval
- Do not modify infrastructure (Docker, DB schema, CI/CD) without approval
- Do not run destructive git commands without permission; read-only commands like git status, git log, and git diff are allowed.
- Do not make breaking changes without discussion
- Do not expose sensitive data, including environment variables.
- Do not guess — ask when unclear
- Avoid generic boilerplate answers; re-check the repo and task if the answer starts sounding generic.
- Treat `server/` as legacy/deprecated. Ignore it for normal frontend/backend work unless a task explicitly names it.
