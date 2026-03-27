# Backend Documentation (Rust + Axum)

## 📁 Project Structure (Current)

```text
src/
├── lib.rs                # Main library exports (public API entry point)
├── main.rs               # Startup flow, startup error categories, graceful shutdown
├── app.rs                # Router composition + fallback + layers
├── config.rs             # Env loading, app config struct
├── state.rs              # Shared AppState
├── errors.rs             # AppError enum + IntoResponse impl
│
├── db/                   # Database connection and migration layer
│   ├── mod.rs
│   ├── connect.rs        # Database connection pool and migration runner
│   └── queries.rs        # Low-level database query functions
│
├── features/
│   ├── mod.rs
│   ├── auth/             # Authentication feature
│   │   ├── mod.rs
│   │   ├── types.rs      # Auth data structures (RegisterData with validation)
│   │   ├── queries.rs    # Auth-specific database operations
│   │   ├── routes.rs     # Auth routes (/api/auth/register)
│   │   └── handlers.rs   # Auth handler functions
│   └── health/
│       ├── mod.rs
│       ├── routes.rs     # Router for /health
│       ├── handlers.rs   # handler functions
│       └── types.rs      # Health response types (HealthResponse, HealthStatus)
│
├── middleware/
│   ├── mod.rs
│   ├── logger.rs         # request → response logging
│   └── cors.rs           # CORS layer builder (Result, no panic)
│
└── utils/                # Utility modules
    ├── mod.rs
    ├── api_response.rs   # Structured API response types
    ├── password.rs       # Password hashing and verification utilities
    ├── tracing.rs        # init_tracing() function
    └── validators.rs     # Input validation functions (email, username, password)

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
| `lib.rs`    | Main library exports - public API entry point for external crates                 |
| `main.rs`   | Initializes tracing, loads config/state, starts server, handles graceful shutdown |
| `app.rs`    | Composes feature routes, fallback 404, CORS layer and logger middleware           |
| `config.rs` | Loads `.env` values into typed config                                             |
| `state.rs`  | Shared `AppState` for handlers                                                    |
| `errors.rs` | Custom API error enum + HTTP response conversion                                  |

---

## 🔧 src/utils/

| File            | Purpose                                   |
| --------------- | ----------------------------------------- |
| `api_response.rs` | Structured API response types for consistent JSON responses |
| `password.rs`   | Password hashing and verification utilities |
| `tracing.rs`    | Rust logging setup (`tracing_subscriber`) |
| `validators.rs` | Input validation functions for user data  |

<details>
<summary><strong>api_response.rs</strong></summary>

Structured API response types for consistent JSON responses across the application.

**Key types:**

- `ApiResponse<T>` - Enum for different response types (Ok, Created)
- `ResponseBody<T>` - Internal structure for JSON serialization

**Usage patterns:**

- `ApiResponse::ok(message, data)` - Success responses with optional data
- `ApiResponse::created(message, data)` - Resource creation responses with optional data

**Response format:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* optional data */ }
}
```

```rs
use axum::{Json, http::StatusCode, response::IntoResponse};
use serde::Serialize;

pub enum ApiResponse<T: Serialize> {
    Ok(String, Option<T>),
    Created(String, Option<T>),
}

#[derive(Serialize)]
struct ResponseBody<T: Serialize> {
    success: bool,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

#[allow(dead_code)]
impl<T: Serialize> ApiResponse<T> {
    pub fn ok(message: impl Into<String>, data: Option<T>) -> Self {
        Self::Ok(message.into(), data)
    }

    pub fn created(message: impl Into<String>, data: Option<T>) -> Self {
        Self::Created(message.into(), data)
    }
}

impl<T: Serialize> IntoResponse for ApiResponse<T> {
    fn into_response(self) -> axum::response::Response {
        let (status, message, data) = match self {
            ApiResponse::Ok(message, data) => (StatusCode::OK, message, data),
            ApiResponse::Created(message, data) => (StatusCode::CREATED, message, data),
        };

        let body: ResponseBody<T> = ResponseBody {
            success: true,
            message,
            data,
        };
        (status, Json(body)).into_response()
    }
}
```

</details>

<details>
<summary><strong>password.rs</strong></summary>

Password hashing and verification utilities using Argon2 algorithm.

**Key functions:**

- `hash_password()` - Hashes a password using Argon2 with random salt
- `verify_password()` - Verifies a password against a stored hash

**Security features:**

- Uses Argon2id algorithm (memory-hard function)
- Random salt generation for each password
- Constant-time comparison to prevent timing attacks

**Usage:**

```rs
// Hash a password
let hashed = hash_password("user_password")?;

// Verify a password
let is_valid = verify_password("user_password", &hashed)?;
```

```rs
use argon2::{
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
    password_hash::{SaltString, rand_core::OsRng},
};

pub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {
    let salt = SaltString::generate(&mut OsRng);
    let hash = Argon2::default().hash_password(password.as_bytes(), &salt)?;
    Ok(hash.to_string())
}

#[allow(dead_code)]
pub fn verify_password(password: &str, hash: &str) -> Result<bool, argon2::password_hash::Error> {
    let parsed_hash = PasswordHash::new(hash)?;
    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}
```

</details>

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

<details>
<summary><strong>validators.rs</strong></summary>

Input validation functions for user registration and authentication data.

**Key validation functions:**

- `validate_username()` - Validates username format (alphanumeric, dots, underscores, hyphens)
- `validate_password()` - Validates password strength (uppercase, lowercase, number, special character)

**Username validation rules:**

- Only allows lowercase letters, numbers, dots, underscores, and hyphens
- Pattern: `^[a-z0-9_.\-]+$`

**Password validation rules:**

- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character (`!@#$%&*_+-=.?`)

```rs
#![allow(dead_code)]
use std::sync::LazyLock;

use regex::Regex;
use validator::ValidationError;

static USERNAME_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^[a-z0-9_.\-]+$").unwrap());
static UPPERCASE_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[A-Z]").unwrap());
static LOWERCASE_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[a-z]").unwrap());
static NUMBER_REGEX: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"[0-9]").unwrap());
static SPECIALCHAR_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"[!@#$%&*_+\-=.?]").unwrap());

pub fn validate_username(username: &str) -> Result<(), ValidationError> {
    if !USERNAME_REGEX.is_match(username) {
        return Err(ValidationError::new(
            "Only numbers, letters, and ._- allowed",
        ));
    }
    Ok(())
}

pub fn validate_password(password: &str) -> Result<(), ValidationError> {
    if !UPPERCASE_REGEX.is_match(password) {
        return Err(ValidationError::new("Must contain one uppercase letter"));
    }

    if !LOWERCASE_REGEX.is_match(password) {
        return Err(ValidationError::new("Must contain one lowercase letter"));
    }

    if !NUMBER_REGEX.is_match(password) {
        return Err(ValidationError::new("Must contain one number"));
    }

    if !SPECIALCHAR_REGEX.is_match(password) {
        return Err(ValidationError::new(
            "Must contain one special character (!@#$%&*_+-=.?)",
        ));
    }

    Ok(())
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

- `NotFound(String)` - Resource not found errors
- `Internal(String)` - Internal server errors
- `Database(String)` - Database connection and migration errors
- `BadRequest(String)` - Invalid request data
- `Json(JsonRejection)` - JSON parsing/validation errors
- `Validation(ValidationErrors)` - Input validation errors
- `Sql(sqlx::Error)` - Database query errors (conditional status mapping)
- `Conflict(String)` - Resource conflict errors (e.g., duplicate username/email)

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
- `Database` → 503 (Service Unavailable)
- `BadRequest` → 400
- `Json` → 400 (with specific error messages)
- `Validation` → 400
- `Sql` → 404 (RowNotFound) or 500 (other SQL errors)
- `Conflict` → 409 (Conflict)

### Database Error Integration

The `AppError` type implements `From<DbError>` to automatically convert database errors:

- `DbError::DbConnection` → `AppError::Database` (connection failures)
- `DbError::DbMigration` → `AppError::Database` (migration failures)

This ensures that database issues are properly handled and returned as HTTP 503 responses to clients.

### Additional Error Conversions

The error system also implements `From` conversions for:

- `JsonRejection` → `AppError::Json` (JSON parsing errors)
- `ValidationErrors` → `AppError::Validation` (validation failures)
- `argon2::password_hash::Error` → `AppError::Internal` (password hashing errors)
- `sqlx::Error` → `AppError::Sql` (database query errors)

### New Error Types Details

#### Conflict Error (409)

Used when a resource conflict occurs, typically during user registration:

```json
{
  "success": false,
  "error": "Username already exists"
}
```

**Common scenarios:**
- Duplicate username during registration
- Duplicate email during registration
- Attempting to create a resource that already exists

#### SQL Error (Conditional 404/500)

Provides conditional status mapping based on the specific SQL error:

- `sqlx::Error::RowNotFound` → HTTP 404 (Resource not found)
- All other SQL errors → HTTP 500 (Internal server error)

**Example responses:**

Resource not found:
```json
{
  "success": false,
  "error": "Resource not found"
}
```

Database error:
```json
{
  "success": false,
  "error": "Shady SQL error: database is locked"
}
```

**Common scenarios:**
- Querying for a non-existent user → 404
- Database connection issues → 500
- Constraint violations → 500
- Query syntax errors → 500

---

## 🗄️ Database Layer (src/db/)

| File         | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `mod.rs`     | Database module exports                             |
| `connect.rs` | Database connection pool setup and migration runner |

### Database Connection

`src/db/connect.rs` provides database initialization with connection pooling and automatic migrations.

**Key functions:**

- `init_db()` - Main entry point that connects and runs migrations
- `connect_db()` - Establishes connection pool with configurable settings
- `run_migrations()` - Executes SQL migrations from `./migrations` directory

**Connection pool configuration:**

- Max connections: 20
- Min connections: 1
- Acquire timeout: 5 seconds
- Idle timeout: 10 minutes

**Migration system:**

- Uses `sqlx::migrate!("./migrations")` macro for compile-time migration verification
- Automatic migration execution on startup
- Structured logging for migration status

**Adding tables**

Example:

- Run `sqlx migrate add create_users_table` makes a file like _20260326_create_users_table.sql_ in the migrations folder
- Then create the schema in it:

```sql
CREATE TYPE user_role AS ENUM ('GUEST', 'GUEST2');


CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    role user_role NOT NULL DEFAULT 'GUEST',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

```

### Database Queries (src/db/queries.rs)

Low-level database query functions for user existence checks and basic operations.

**Key functions:**

- `find_user_by_email()` - Checks if a user exists by email address
- `find_user_by_username()` - Checks if a user exists by username

**Usage patterns:**

- Returns `Result<Option<PgRow>, AppError>` for flexible row handling
- Used by authentication handlers for duplicate validation
- Integrates with `AppError::Sql` for proper error handling

**Example usage:**

```rs
// Check if email already exists
let user_exists = find_user_by_email(&db_pool, "user@example.com").await?;
if user_exists.is_some() {
    return Err(AppError::Conflict("Email already registered".to_string()));
}

// Check if username already exists
let username_exists = find_user_by_username(&db_pool, "username").await?;
if username_exists.is_some() {
    return Err(AppError::Conflict("Username already taken".to_string()));
}
```

**Error handling:**

- Database errors are automatically converted to `AppError::Sql`
- Row not found returns `Ok(None)` rather than error
- Enables graceful handling of missing records

<details>
<summary><strong>queries.rs</strong></summary>

Low-level database query functions for user existence checks:

```rs
use sqlx::{PgPool, postgres::PgRow};

use crate::errors::AppError;

pub async fn find_user_by_email(db: &PgPool, email: &str) -> Result<Option<PgRow>, AppError> {
    sqlx::query("SELECT id FROM users WHERE email = $1")
        .bind(email)
        .fetch_optional(db)
        .await
        .map_err(AppError::Sql)
}

pub async fn find_user_by_username(db: &PgPool, username: &str) -> Result<Option<PgRow>, AppError> {
    sqlx::query("SELECT id FROM users WHERE username = $1")
        .bind(username)
        .fetch_optional(db)
        .await
        .map_err(AppError::Sql)
}
```

</details>

<details>
<summary><strong>connect.rs</strong></summary>

Database connection and migration setup:

```rs
use sqlx::{PgPool, migrate, postgres::PgPoolOptions};
use std::time::Duration;

use crate::config::Config;

#[derive(Debug)]
pub enum DbError {
    DbConnection(sqlx::Error),
    DbMigration(sqlx::migrate::MigrateError),
}

pub async fn init_db(config: &Config) -> Result<PgPool, DbError> {
    let pool = connect_db(config).await?;
    run_migrations(&pool).await?;
    Ok(pool)
}

async fn connect_db(config: &Config) -> Result<PgPool, DbError> {
    let url = &config.active_db_url();

    tracing::info!("Connecting to database...");

    let pool = PgPoolOptions::new()
        .max_connections(20)
        .min_connections(1)
        .acquire_timeout(Duration::from_secs(5))
        .idle_timeout(Duration::from_secs(600))
        .connect(url)
        .await
        .map_err(|err| {
            tracing::error!(?err, "Failed to connect to database");
            DbError::DbConnection(err)
        })?;

    tracing::info!("Database connected");
    Ok(pool)
}

async fn run_migrations(pool: &PgPool) -> Result<(), DbError> {
    tracing::info!("Running migrations...");

    migrate!("./migrations").run(pool).await.map_err(|err| {
        tracing::error!(?err, "Failed to run migrations");
        DbError::DbMigration(err)
    })?;

    tracing::info!("Migrations applied");

    Ok(())
}
```

</details>

---

## 🏗️ Feature Types (src/features/\*/types.rs)

### Authentication Types (src/features/auth/types.rs)

| Type           | Purpose                                          |
| -------------- | ------------------------------------------------ |
| `RegisterData` | User registration data structure with full validation |

**RegisterData fields:**

- `email` - User's email address with email format validation
- `username` - User's chosen username with length (3-20 chars) and character validation
- `password` - User's password with strength validation (8-50 chars, uppercase, lowercase, number, special character)

**Validation rules:**

- Email: Must match standard email format pattern
- Username: 3-20 characters, only lowercase letters, numbers, dots, underscores, and hyphens
- Password: 8-50 characters, must contain uppercase letter, lowercase letter, number, and special character

### Authentication Queries (src/features/auth/queries.rs)

Authentication-specific database operations for user registration and management.

**Key functions:**

- `register_user()` - Inserts a new user into the database with email, username, and password

**Usage patterns:**

- Takes database pool and user registration data as parameters
- Returns `Result<(), AppError>` for error handling
- Integrates with `AppError::Sql` for proper database error handling
- Used by authentication handlers for user registration workflow

**Example usage:**

```rs
// Register a new user
let result = register_user(&db_pool, &email, &username, &password_hash).await;
match result {
    Ok(()) => {
        // User successfully registered
        Ok(ApiResponse::created("User registered successfully", None))
    }
    Err(AppError::Sql(sqlx::Error::Database(db_err))) if db_err.is_unique_violation() => {
        // Handle duplicate email or username
        Err(AppError::Conflict("Email or username already exists".to_string()))
    }
    Err(err) => {
        // Handle other database errors
        Err(err)
    }
}
```

**Error handling:**

- Database constraint violations (unique email/username) can be detected and converted to `AppError::Conflict`
- All other SQL errors are automatically converted to `AppError::Sql`
- Enables proper HTTP status codes for different error scenarios

<details>
<summary><strong>auth/queries.rs</strong></summary>

Authentication-specific database operations for user registration:

```rs
use sqlx::PgPool;

use crate::errors::AppError;

pub async fn register_user(
    db: &PgPool,
    email: &str,
    username: &str,
    password: &str,
) -> Result<(), AppError> {
    sqlx::query("INSERT INTO users (email, username, password) VALUES ($1, $2, $3)")
        .bind(email)
        .bind(username)
        .bind(password)
        .execute(db)
        .await
        .map_err(AppError::Sql)?;

    Ok(())
}
```

</details>

<details>
<summary><strong>auth/types.rs</strong></summary>

Authentication data structures for user registration with comprehensive validation:

```rs
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::utils::validators::{validate_email, validate_password, validate_username};

#[allow(dead_code)]
#[derive(Serialize, Deserialize, Debug, Validate)]
pub struct RegisterData {
    #[validate(custom(function = validate_email))]
    pub email: String,

    #[validate(length(
        min = 3,
        max = 20,
        message = "Username must be between 3 and 20 characters"
    ), custom(function = validate_username))]
    pub username: String,

    #[validate(length(
        min = 8,
        max = 50,
        message = "Password must be between 8 and 50 characters"
    ), custom(function = validate_password))]
    pub password: String,
}
```

</details>

### Health Check Types (src/features/health/types.rs)

| Type             | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `HealthResponse` | Complete health check response structure |
| `MemoryInfo`     | Memory usage information                 |
| `DatabaseStatus` | Database connection status               |
| `HealthStatus`   | Enum representing service health states  |

**HealthResponse fields:**

- `status` - Overall service health status
- `timestamp` - ISO 8601 timestamp of the health check
- `uptime` - Server uptime in seconds
- `environment` - Current environment (dev/test/prod)
- `memory` - Optional memory usage statistics
- `database` - Optional database connection status

**HealthStatus variants:**

- `Ok` - Service is healthy
- `NotGood` - Service has issues but is running
- `Error` - Service is experiencing errors

<details>
<summary><strong>health/types.rs</strong></summary>

Health check response types and status enums:

```rs
use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: HealthStatus,
    pub timestamp: String,
    pub uptime: f64,
    pub environment: String,
    pub memory: Option<MemoryInfo>,
    pub database: Option<DatabaseStatus>,
}

#[derive(Serialize)]
pub struct MemoryInfo {
    pub used_mb: f64,
    pub total_mb: f64,
    pub percentage: f64,
}

#[derive(Serialize)]
pub struct DatabaseStatus {
    pub status: HealthStatus,
    pub connection_test: String,
    pub latency_ms: Option<f64>,
}

impl axum::response::IntoResponse for HealthResponse {
    fn into_response(self) -> axum::response::Response {
        axum::Json(self).into_response()
    }
}

#[derive(Serialize)]
#[serde(rename_all = "lowercase")]
pub enum HealthStatus {
    Ok,
    NotGood,
    Error,
}
```

</details>

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
3. Initialize database connection (with graceful failure handling)
4. Build app state
5. Build router (`app::create_app`)
6. Bind listener
7. `axum::serve(...).with_graceful_shutdown(...)`

**Startup uses categorized errors:**

- `ConfigLoad` - Environment variable loading failures
- `AppBuild` - Router composition failures
- `Bind` - TCP listener binding failures
- `Serve` - Server runtime failures
- `DbConnect` - Database connection failures
- `DbMigrate` - Database migration failures

**Database handling:**

- Database connection is attempted but not required for startup
- If database connection fails, server starts without database functionality
- Database status is reflected in health check responses
- Structured logging provides detailed error information for debugging

Real error details are logged with `tracing::error!(...)`.

---

## 🛣️ Routes (Current)

**`GET /health`** — Returns structured JSON:

```json
{
  "status": "ok",
  "timestamp": "2026-03-26T10:18:30.123Z",
  "uptime": 123.45,
  "environment": "development",
  "memory": {
    "used_mb": 150.25,
    "total_mb": 8192.0,
    "percentage": 1.83
  },
  "database": {
    "status": "ok",
    "connection_test": "Database connection ok",
    "latency_ms": 12.34
  }
}
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
- Current API test modules: `tests/api/health.rs`.
- Tests use `axum-test::TestServer` to call routes in-process.
- Test helper forces `AppEnv::Test` and maps `db_url` to `db_test_url` for safety.
- Database connection is optional - tests can run with or without database

**Test scenarios:**

- Health check with database connection
- Health check without database connection (graceful degradation)
- Environment detection in test mode

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

<details>
<summary><strong>sysinfo</strong></summary>

**sysinfo** — System information library.

- Version: `0.31.0`
- Purpose: Collects system memory usage statistics for health checks
- Documentation: https://docs.rs/sysinfo/latest/sysinfo/

```bash
cargo add sysinfo
```

</details>

<details>
<summary><strong>chrono</strong></summary>

**chrono** — Date and time handling library.

- Version: `0.4.38`
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

- Version: `0.10.0`
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

- Version: `1.0.140`
- Purpose: JSON parsing in tests and API responses
- Documentation: https://docs.rs/serde_json/latest/serde_json/

```bash
cargo add --dev serde_json
```

</details>
