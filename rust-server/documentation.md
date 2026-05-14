# Backend Documentation (Rust + Axum)

## Overview

Current Rust backend structure and the modules that matter in day-to-day work. This is a curated guide, not a full dependency inventory.

## Project Structure

```text
src/
├── lib.rs
├── main.rs
├── app.rs
├── config.rs
├── state.rs
├── errors.rs
├── types.rs
├── db/
├── features/
├── middleware/
└── utils/

tests/
├── api.rs
├── api/
├── errors/
├── features/
└── utils/
```

---

## `src/`

### Top-level files

| File | Purpose |
| --- | --- |
| `lib.rs` | Public module exports |
| `main.rs` | Startup flow, tracing, config loading, graceful shutdown |
| `app.rs` | Router composition, fallback handler, middleware layers |
| `config.rs` | Environment loading and typed app config |
| `state.rs` | Shared `AppState` |
| `errors.rs` | Application error type and HTTP response conversion |
| `types.rs` | Shared domain types such as `User` and `UserRole` |

### `db/`

- `connect.rs` handles the database pool and migration runner.
- `queries.rs` holds low-level shared database queries.

### `features/`

Feature modules keep domain-specific logic together.

| Directory | Purpose |
| --- | --- |
| `auth/` | Authentication routes, handlers, service logic, token helpers, queries, and auth types |
| `health/` | Health check routes, handlers, and response types |

#### `features/auth/`

- `routes.rs` defines the `/api/auth` router.
- `handlers/` contains the request handlers for login, logout, me, register, and verify.
- `service.rs` holds auth business logic.
- `queries.rs` contains auth-specific database access.
- `tokens/` contains JWT, refresh-token, and cookie helpers.
- `types.rs` contains auth request/response types and validation models.

Current auth routes:

- `POST /api/auth/register`
- `GET /api/auth/available`
- `GET|POST /api/auth/verify`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

#### `features/health/`

- `routes.rs` defines the health router.
- `handlers.rs` returns the health response.
- `types.rs` contains the health response types.

### `middleware/`

- `logger.rs` provides request/response logging.
- `cors.rs` builds the CORS layer from the frontend URL.
- `auth.rs` contains auth middleware and request plumbing.

### `utils/`

Shared utility modules used across features.

| File | Purpose |
| --- | --- |
| `api_response.rs` | Consistent JSON API responses |
| `email.rs` | Email service wrapper |
| `email_templates.rs` | HTML and plain-text email templates |
| `password.rs` | Password hashing and verification |
| `tracing.rs` | Tracing setup |
| `validators.rs` | Input validation helpers |

---

## `tests/`

Test coverage is grouped by area.

- `tests/api.rs` is the integration test entrypoint.
- `tests/api/` holds API integration tests for auth and health.
- `tests/errors/` covers application error behavior.
- `tests/features/` covers feature-specific types and behavior.
- `tests/utils/` covers utility helpers such as password and validator logic.

---

## Notes

- Feature-specific logic should stay inside the feature module unless it is clearly shared.
- `src/app.rs` composes feature routers rather than owning endpoint logic.
- The backend currently exposes auth and health as the main feature areas.
