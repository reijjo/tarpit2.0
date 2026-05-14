# Backend Documentation (Rust + Axum)

Use this as a short map. The source files are the source of truth; this doc only keeps the architecture, ownership, and a few practical entry points.

## Architecture Overview

| Path | What it owns | Why it matters |
| --- | --- | --- |
| [src/lib.rs](src/lib.rs) | Public module exports | Lets the integration tests and the app import the backend cleanly. |
| [src/main.rs](src/main.rs) | Startup flow | Initializes tracing, config, DB, and graceful shutdown. |
| [src/app.rs](src/app.rs) | Router composition | Connects routes, fallback handling, middleware, and state. |
| [src/config.rs](src/config.rs) | Typed env config | Keeps runtime settings in one place. |
| [src/errors.rs](src/errors.rs) | App-wide API errors | Normalizes HTTP error responses and status codes. |
| [src/state.rs](src/state.rs) | Shared app state | Holds values handlers and middleware need. |
| [src/types.rs](src/types.rs) | Shared domain types | Keeps common types like `User` and `UserRole` reusable. |
| [src/db/](src/db/) | DB pool + shared queries | Owns database setup and lookups shared across features. |
| [src/features/](src/features/) | Feature modules | Keeps auth, health, and bets isolated by domain. |
| [src/middleware/](src/middleware/) | Request plumbing | Handles auth extraction, logging, and CORS. |
| [src/utils/](src/utils/) | Cross-cutting helpers | Holds password, validation, email, tracing, and response helpers. |
| [tests/](tests/) | Unit + integration tests | Organizes coverage by area instead of mixing it with `src/`. |

## Module Map

```text
src/
├── app.rs
├── config.rs
├── db/
├── errors.rs
├── features/
│   ├── auth/
│   ├── bets/
│   └── health/
├── main.rs
├── middleware/
├── state.rs
├── types.rs
└── utils/
```

## Useful Entry Points

- Password hashing and verification: [src/utils/password.rs](src/utils/password.rs)
- Input validation helpers: [src/utils/validators.rs](src/utils/validators.rs)
- DB pool and migrations: [src/db/connect.rs](src/db/connect.rs)
- Shared DB lookups: [src/db/queries.rs](src/db/queries.rs)
- Auth flow: [src/features/auth/routes.rs](src/features/auth/routes.rs), [src/features/auth/service.rs](src/features/auth/service.rs), [src/features/auth/handlers/](src/features/auth/handlers/), [src/features/auth/tokens/](src/features/auth/tokens/)
- Error mapping: [src/errors.rs](src/errors.rs)
- Health endpoint: [src/features/health/routes.rs](src/features/health/routes.rs), [src/features/health/handlers.rs](src/features/health/handlers.rs), [src/features/health/types.rs](src/features/health/types.rs)
- Route composition: [src/features/mod.rs](src/features/mod.rs)

## Key Patterns

<details>
<summary><strong>Auth flow</strong></summary>

- Routes stay in [src/features/auth/routes.rs](src/features/auth/routes.rs).
- Business logic lives in [src/features/auth/service.rs](src/features/auth/service.rs).
- Token and cookie helpers stay under [src/features/auth/tokens/](src/features/auth/tokens/).
- Handler modules under [src/features/auth/handlers/](src/features/auth/handlers/) should stay thin and delegate to service code.

</details>

<details>
<summary><strong>Error handling</strong></summary>

- [src/errors.rs](src/errors.rs) is the single HTTP error surface.
- JSON, validation, SQL, DB, and auth failures are converted there instead of being handled ad hoc in handlers.
- Prefer returning `AppError` from new backend code so status mapping stays consistent.

</details>

<details>
<summary><strong>Database layer</strong></summary>

- [src/db/connect.rs](src/db/connect.rs) owns pool setup and migrations.
- [src/db/queries.rs](src/db/queries.rs) holds shared lookups used by multiple features.
- Feature-specific SQL stays inside the feature module unless it is genuinely shared.

</details>

<details>
<summary><strong>Testing shape</strong></summary>

- Integration tests live in the crate-root [tests/](tests/) directory.
- [tests/api.rs](tests/api.rs) is the integration test entrypoint.
- API tests use `axum-test::TestServer` and the helpers in [tests/api/common.rs](tests/api/common.rs).

</details>

## Setup

- `cd rust-server`
- `cargo check`
- `cargo run`
- `cargo test`
- `cargo test --test api`

## Environment Notes

- [src/config.rs](src/config.rs) loads `.env` via `dotenvy` and `envy`.
- [`.env_example`](.env_example) lists the full variable set.
- Important variables: `APP_ENV`, `PORT`, `DB_URL`, `DB_TEST_URL`, `FRONTEND_URL`, `RESEND_API_KEY`, `TARPIT_DOMAIN`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_TTL_SECONDS`, `REFRESH_TTL_SECONDS`, `REFRESH_TOKEN_PEPPER`.

## Routes

- `GET /health` returns the health snapshot.
- `GET /api/auth/available`
- `POST /api/auth/register`
- `GET /api/auth/verify`
- `POST /api/auth/verify`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/bets/*` and other bets routes live under [src/features/bets/](src/features/bets/)

## Quick Manual Checks

```bash
cd rust-server
cargo check
cargo run

curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3001/THIS_DOES_NOT_EXIST
```

## Testing

- Core test layout: [tests/api.rs](tests/api.rs), [tests/errors/app_error.rs](tests/errors/app_error.rs), [tests/features/auth/types.rs](tests/features/auth/types.rs), [tests/utils/password.rs](tests/utils/password.rs), [tests/utils/validators.rs](tests/utils/validators.rs).
- Auth and health API coverage lives under [tests/api/auth/](tests/api/auth/) and [tests/api/health.rs](tests/api/health.rs).
- Use `cargo test --test api` for the API suite and `cargo test` for the full Rust test run.
- Use `cargo llvm-cov` when you want coverage output.

## Installed Crates

<details>
<summary><strong>Axum & Tokio</strong></summary>

**Axum** — Modern web framework

- Version: `0.8.9`
- Purpose: HTTP server framework built on Tower ecosystem
- Documentation: https://docs.rs/axum/latest/axum/

**Tokio** — Async runtime

- Version: `1.52.1`
- Features: `["full"]`
- Purpose: async runtime for server, networking and signals
- Documentation: https://docs.rs/tokio/latest/tokio/

```bash
cargo add axum
cargo add tokio
```

</details>

<details>
<summary><strong>axum-extra + time</strong></summary>

**axum-extra** — Extra Axum extractors and helpers.

- Version: `0.12.6`
- Features: `cookie`
- Purpose: Cookie jar support for auth login/logout flows
- Documentation: https://docs.rs/axum-extra/latest/axum_extra/

**time** — Time types and durations used by cookie helpers.

- Version: `0.3.47`
- Purpose: Cookie max-age handling
- Documentation: https://docs.rs/time/latest/time/

```bash
cargo add axum-extra --features cookie
cargo add time
```

</details>

<details>
<summary><strong>tower-http</strong></summary>

**tower-http** — HTTP middleware/layers for Tower/Axum.

- Version: `0.6.8`
- Used for: `CorsLayer`
- Documentation: https://docs.rs/tower-http/latest/tower_http/

```bash
cargo add tower-http --features cors,trace
```

</details>

<details>
<summary><strong>tracing + tracing-subscriber</strong></summary>

**tracing** — structured diagnostics/events.

- Version: `0.1.44`
- Documentation: https://docs.rs/tracing/latest/tracing/

**tracing-subscriber** — tracing backend/configuration.

- Version: `0.3.23`
- Features used: `env-filter`, `fmt`, `ansi`
- Documentation: https://docs.rs/tracing-subscriber/latest/tracing_subscriber/

```bash
cargo add tracing
cargo add tracing-subscriber --features env-filter,fmt,ansi
```

</details>

<details>
<summary><strong>dotenvy + envy</strong></summary>

**dotenvy** — loads `.env` file.

- Version: `0.15.7`
- Documentation: https://docs.rs/dotenvy/latest/dotenvy/

**envy** — deserializes env vars into typed Rust structs.

- Version: `0.4.2`
- Documentation: https://docs.rs/envy/latest/envy/

```bash
cargo add dotenvy
cargo add envy
```

</details>

<details>
<summary><strong>Serde</strong></summary>

**Serde** — serialization/deserialization framework.

- Version: `1.0.228`
- Used for: config and API response structs (`Serialize`/`Deserialize`)
- Documentation: https://docs.rs/serde/latest/serde/

```bash
cargo add serde --features derive
```

</details>

<details>
<summary><strong>owo-colors</strong></summary>

**owo-colors** — terminal color formatting.

- Version: `4.3.0`
- Used in: request logger output coloring
- Documentation: https://docs.rs/owo-colors/latest/owo_colors/

```bash
cargo add owo-colors
```

</details>

<details>
<summary><strong>sqlx</strong></summary>

**sqlx** — Async, compile-time checked SQL for PostgreSQL.

- Version: `0.8.6`
- Features: `postgres`, `runtime-tokio`, `tls-rustls`, `macros`, `migrate`, `uuid`, `chrono`
- Purpose: DB connection pool (`PgPool`), compile-time verified queries, automatic migrations on startup
- Documentation: https://docs.rs/sqlx/latest/sqlx/

```bash
cargo add sqlx --features postgres,runtime-tokio,tls-rustls,macros,migrate,uuid,chrono
```

**sqlx-cli** — Command line tool for managing migrations (installed globally):

```bash
cargo install sqlx-cli --no-default-features --features postgres,rustls
```

</details>

<details>
<summary><strong>validator + regex</strong></summary>

**validator** — Runtime validation framework with derive macros.

- Version: `0.20.0`
- Features: `derive`
- Purpose: Field-level validation on structs (e.g., email format, length constraints)
- Documentation: https://docs.rs/validator/latest/validator/

**regex** — Regular expression library.

- Version: `1.12.3`
- Purpose: Used by validator for pattern validation (e.g., email regex)
- Documentation: https://docs.rs/regex/latest/regex/

```bash
cargo add validator --features derive
cargo add regex
```

</details>

<details>
<summary><strong>uuid</strong></summary>

**uuid** — UUID generation and parsing library.

- Version: `1.23.1`
- Features: `serde`, `v4`
- Purpose: UUID generation for user IDs and verification tokens
- Documentation: https://docs.rs/uuid/latest/uuid/

```bash
cargo add uuid --features serde,v4
```

</details>

<details>
<summary><strong>resend-rs</strong></summary>

**resend-rs** — Resend email API client.

- Version: `0.21.1`
- Purpose: Send transactional emails via Resend API
- Documentation: https://docs.rs/resend-rs/latest/resend_rs/

```bash
cargo add resend-rs
```

</details>

<details>
<summary><strong>urlencoding</strong></summary>

**urlencoding** — URL encoding/decoding library.

- Version: `2.1.3`
- Purpose: Encode verification tokens in email URLs
- Documentation: https://docs.rs/urlencoding/latest/urlencoding/

```bash
cargo add urlencoding
```

</details>

<details>
<summary><strong>jsonwebtoken</strong></summary>

**jsonwebtoken** — JWT signing and verification library.

- Version: `10.3.0`
- Purpose: Access token generation and validation
- Documentation: https://docs.rs/jsonwebtoken/latest/jsonwebtoken/

```bash
cargo add jsonwebtoken
```

</details>

<details>
<summary><strong>sha2 + hex</strong></summary>

**sha2** — SHA-2 hashing algorithms.

- Version: `0.11.0`
- Purpose: Token/session hashing helpers
- Documentation: https://docs.rs/sha2/latest/sha2/

**hex** — Hex encoding/decoding utilities.

- Version: `0.4.3`
- Purpose: Hex formatting for hashed values
- Documentation: https://docs.rs/hex/latest/hex/

```bash
cargo add sha2
cargo add hex
```

</details>

<details>
<summary><strong>sysinfo</strong></summary>

**sysinfo** — System information library.

- Version: `0.31.4`
- Purpose: Collects system memory usage statistics for health checks
- Documentation: https://docs.rs/sysinfo/latest/sysinfo/

```bash
cargo add sysinfo
```

</details>

<details>
<summary><strong>chrono</strong></summary>

**chrono** — Date and time handling library.

- Version: `0.4.44`
- Features: `serde`
- Purpose: Timestamp handling and serialization in health responses
- Documentation: https://docs.rs/chrono/latest/chrono/

```bash
cargo add chrono --features serde
```

</details>

<details>
<summary><strong>rand</strong></summary>

**rand** — Random number generation library.

- Version: `0.10.1`
- Purpose: Used by Argon2 for generating random salts
- Documentation: https://docs.rs/rand/latest/rand/

```bash
cargo add rand
```

</details>

<details>
<summary><strong>argon2</strong></summary>

**argon2** — Password hashing library using Argon2 algorithm.

- Version: `0.5.3`
- Features: `std`
- Purpose: Secure password hashing and verification
- Documentation: https://docs.rs/argon2/latest/argon2/

```bash
cargo add argon2 --features std
```

</details>

<details>
<summary><strong>axum-test</strong></summary>

**axum-test** — Testing utilities for Axum applications.

- Version: `19.1.1`
- Purpose: Integration testing with `TestServer` for in-process HTTP testing
- Documentation: https://docs.rs/axum-test/latest/axum_test/

```bash
cargo add --dev axum-test
```

</details>

<details>
<summary><strong>serde_json</strong></summary>

**serde_json** — JSON serialization/deserialization.

- Version: `1.0.149`
- Purpose: JSON parsing in tests and API responses
- Documentation: https://docs.rs/serde_json/latest/serde_json/

```bash
cargo add --dev serde_json
```

</details>
