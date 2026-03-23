# Backend Documentation (Rust + Axum)

## 📁 Project Structure (Current)

```text
src/
├── main.rs               # Startup flow, startup error categories, graceful shutdown
├── app.rs                # Router composition + fallback + layers
├── config.rs             # Env loading, app config struct
├── state.rs              # Shared AppState
├── errors.rs             # AppError enum + IntoResponse impl
│
├── features/
│   ├── mod.rs
│   ├── auth/             # scaffold folder (in progress)
│   └── health/
│       ├── mod.rs
│       ├── routes.rs     # Router for /health
│       └── handlers.rs   # handler functions
│
├── middleware/
│   ├── mod.rs
│   ├── logger.rs         # request → response logging
│   └── cors.rs           # CORS layer builder (Result, no panic)
│
└── utils/
    ├── mod.rs
    └── tracing.rs        # init_tracing() function

tests/
├── api.rs                # single integration test target
└── api/
    ├── common.rs         # shared build_test_server() helper
    └── health.rs         # health endpoint integration tests
```

---

## 🚀 src/

| File        | Purpose                                                                           |
| ----------- | --------------------------------------------------------------------------------- |
| `main.rs`   | Initializes tracing, loads config/state, starts server, handles graceful shutdown |
| `app.rs`    | Composes feature routes, fallback 404, CORS layer and logger middleware           |
| `config.rs` | Loads `.env` values into typed config                                             |
| `state.rs`  | Shared `AppState` for handlers                                                    |
| `errors.rs` | Custom API error enum + HTTP response conversion                                  |

---

## 🔧 src/utils/

| File         | Purpose                                   |
| ------------ | ----------------------------------------- |
| `tracing.rs` | Rust logging setup (`tracing_subscriber`) |

<details>
<summary><strong>tracing.rs</strong></summary>

Used as structured logger setup (similar role to console + logger config in Node apps).

```rs
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

pub fn init_tracing() {
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));

    tracing_subscriber::registry()
        .with(env_filter)
        .with(
            tracing_subscriber::fmt::layer()
                .with_level(true)
                .with_target(true)
                .with_ansi(true)
                .compact(),
        )
        .try_init()
        .unwrap_or_else(|err| eprintln!("tracing subscriber initialization skipped: {err}"));
}
```

</details>

---

## 🛡️ src/middleware/

| File        | Purpose                                                           |
| ----------- | ----------------------------------------------------------------- |
| `logger.rs` | Morgan-like route logger                                          |
| `cors.rs`   | Builds CORS layer from `FRONTEND_URL` with `Result` (no `expect`) |

<details>
<summary><strong>cors.rs</strong></summary>

Builds CorsLayer safely from config:

```rs
use tower_http::cors::CorsLayer;

pub fn build_cors(frontend_url: &str) -> Result<CorsLayer, String> {
    use axum::http::{HeaderValue, Method, header};

    let origin: HeaderValue = frontend_url
        .parse()
        .map_err(|_| format!("Invalid FRONTEND_URL '{frontend_url}'"))?;

    Ok(CorsLayer::new()
        .allow_origin(origin)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
        ])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
        .allow_credentials(true))
}
```

</details>

---

## ❌ Error Handling

`src/errors.rs` provides centralized API error responses.

**Current `AppError` variants:**

- `NotFound(String)`
- `Internal(String)`

**Response shape:**

```json
{
  "success": false,
  "error": "message"
}
```

**Status mapping:**

- `NotFound` → 404
- `Internal` → 500

---

## 🌐 App Composition (app.rs)

`create_app` returns `Result<Router, String>`.

**Current flow:**

1. Build CORS layer from config (`build_cors`)
2. Merge feature routes
3. Register fallback handler for unknown routes
4. Apply CORS + logger layers
5. Attach app state

Fallback handler returns `AppError::NotFound`, so unknown routes produce JSON 404.

---

## 🧠 Startup Flow (main.rs)

`main.rs` startup steps:

1. `init_tracing()`
2. Load typed config (`Config::from_env`)
3. Build app state
4. Build router (`app::create_app`)
5. Bind listener
6. `axum::serve(...).with_graceful_shutdown(...)`

**Startup uses categorized errors:**

- `ConfigLoad`
- `AppBuild`
- `Bind`
- `Serve`

Real error details are logged with `tracing::error!(...)`.

---

## 🛣️ Routes (Current)

**`GET /health`** — Returns plain text:

```
OK
```

**Unknown routes** — Handled by app fallback, returns JSON 404 via `AppError`.

---

## 🔐 Environment Notes

Config is loaded via `dotenvy` + `envy` in `config.rs`.

- `FRONTEND_URL` must be a valid HTTP origin string (used by CORS builder).

Check `.env_example` for variable names.

---

## 🧪 Quick Manual Checks

```bash
cd rust-server
cargo check
cargo run

curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3001/THIS_DOES_NOT_EXIST
```

---

## ✅ Testing (integration + coverage)

- Integration tests live in crate-root `tests/` (not inside `src/`).
- Single integration target entrypoint: `tests/api.rs`.
- Shared test server helper: `tests/api/common.rs`.
- Current first API test module: `tests/api/health.rs`.
- Tests use `axum-test::TestServer` to call routes in-process.
- Test helper forces `AppEnv::Test` and maps `db_url` to `db_test_url` for safety.

Run integration API tests:

```bash
cd rust-server
cargo test --test api
```

Show integration test stdout/stderr (for debug lines like APP_ENV):

```bash
cd rust-server
cargo test --test api -- --nocapture
```

Run all Rust tests (unit + integration + doctests):

```bash
cd rust-server
cargo test
```

Coverage summary (terminal):

```bash
cd rust-server
cargo llvm-cov
```

Coverage report (HTML):

```bash
cd rust-server
cargo llvm-cov --html --open
```

If `cargo llvm-cov` is missing:

```bash
cargo install cargo-llvm-cov
```

Data source:

- https://github.com/taiki-e/cargo-llvm-cov

Project now exposes modules for integration tests via `src/lib.rs`.

---

## 📦 Installed Crates

<details>
<summary><strong>Axum & Tokio</strong></summary>

**Axum** — Modern web framework

- Version: `0.8.8`
- Purpose: HTTP server framework built on Tower ecosystem
- Documentation: https://docs.rs/axum/latest/axum/

**Tokio** — Async runtime

- Version: `1.49.0`
- Features: `["full"]`
- Purpose: async runtime for server, networking and signals
- Documentation: https://docs.rs/tokio/latest/tokio/

```bash
cargo add axum
cargo add tokio
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

- Version: `0.3.22`
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

- Version: `0.8.x`
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
