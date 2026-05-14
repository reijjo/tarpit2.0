# Backend Guidelines

## Technology Stack Standards

- Use stable Rust and the versions already pinned by this repo.
- Use Tokio for async code and Axum for HTTP handlers.
- Use Serde for serialization and deserialization.
- Avoid `unwrap()` and `expect()` in production code.
- Prefer explicit error types and clear propagation paths.
- Avoid unsafe code unless it is truly necessary and well-justified.
- Keep compilation warning-free.

## Implementation Standards

- Design I/O code as async-first.
- Prefer clear ownership and borrowing over unnecessary cloning.
- Use validation for incoming request data.
- Use `tracing` for structured logging.
- Keep handlers, services, and query code small and composable.
- Follow the existing module layout before introducing new abstractions.

## Package Management

- Use Cargo exclusively for Rust dependency and build workflows.
- Use `cargo add` and `cargo remove` for dependency changes.
- Keep `Cargo.lock` in sync.
- Do not add new dependencies without a clear reason.

## Testing and Verification

- Check the implementation before writing tests.
- Follow the existing test layout in `rust-server/tests/`.
- Focus on real API, DB, validation, error-handling, and security scenarios.
- Use `cargo test` for the main suite and `cargo test --test api` for API integration checks.
- Run focused tests first, then broader coverage if the change crosses modules.
- For changes to request handling, auth, DB access, or migrations, add or update tests.

## Documentation

- Update backend docs when APIs, auth flows, or setup steps change.
- Keep docs short and practical, using relative paths only.
- Keep `rust-server/documentation.md` and migration notes accurate.
- Skip docs for refactors or style-only changes, and say why when skipping.

## Project Layout

- `src/features/` holds the domain modules, including routes, handlers, service logic, queries, token helpers, and feature-local types.
- `src/features/auth/` includes `handlers/`, `queries.rs`, `routes.rs`, `service.rs`, `tokens/`, and `types.rs`.
- `src/features/health/` contains the health routes, handlers, and response types.
- `src/types.rs` holds shared top-level domain types such as `User` and `UserRole`.
- `src/middleware/auth.rs` is part of the request plumbing alongside the logger and CORS middleware.
- `src/middleware/` holds Axum middleware and request plumbing.
- `src/db/` holds connection and query helpers that are shared across features.
- `src/utils/` holds cross-cutting helpers such as validation, logging, email, tokens, and response helpers.
- `tests/` holds unit and integration coverage grouped by area, including `api/`, `errors/`, `features/`, and `utils/`.
- `migrations/` holds SQL migration files.
- Keep feature-specific logic inside the feature module unless it is clearly shared by more than one feature.
