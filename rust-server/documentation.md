# Backend Documentation (Rust + Axum)

## 📁 Project Structure (Feature-based)

```text
src/
├── main.rs               # Server startup, global router composition, layers
├── app.rs                # Handle routes & middleware
├── config.rs             # Env loading, structs (AppConfig, DbConfig, ...)
├── state.rs              # AppState (Clone + Send + Sync → db pool, cookie key, ...)
├── errors.rs             # AppError enum + IntoResponse impl
│
├── utils/                # Cross-cutting helpers (used by many features)
│   ├── mod.rs
│   ├── response.rs       # ApiResponse<T> wrapper (success / error json shapes)
│   ├── tracing.rs        # init_tracing() function
│   └── constants.rs
│
├── middleware/           # Global / reusable axum / tower middleware
│   ├── mod.rs
│   ├── logger.rs         # request → response logging
│   ├── auth.rs           # httpOnly cookie → Extension<CurrentUser / Session>
│   └── rate_limit.rs     # (future)
│
└── features/             # ← Group by domain/feature (self-contained modules)
    ├── health/
    │   ├── mod.rs
    │   ├── routes.rs     # Router for /health
    │   └── handlers.rs   # handler functions
    │
    ├── auth/
    │   ├── mod.rs
    │   ├── routes.rs
    │   ├── handlers.rs
    │   ├── dto.rs        # LoginDto, RegisterInput, ...
    │   ├── service.rs    # auth logic (validate, create session, set cookie)
    │   └── repository.rs # db access for auth
    │
    ├── users/
    │   ├── mod.rs
    │   ├── routes.rs
    │   ├── handlers.rs
    │   ├── dto.rs
    │   ├── service.rs
    │   └── models.rs     # User struct + FromRow / Deserialize
    │
    └── bets/
        ├── mod.rs
        ├── routes.rs
        ├── handlers.rs
        ├── dto.rs
        ├── service.rs
        └── models.rs     # Bet struct
```

## 🚀 `src/`

### Files

| File      | Purpose                             |
| --------- | ----------------------------------- |
| app.rs    | Handle routes & middleware          |
| main.rs   | Starts the server                   |
| config.rs | Loads .env + structs for config     |
| state.rs  | Shared AppState                     |
| errors.rs | custom errors + response conversion |

## 🔧 `src/utils/`

| File       | Purpose                    |
| ---------- | -------------------------- |
| tracing.rs | My `console.log()` in Rust |

<!-- TRACING.RS -->
<details>
<summary><strong>tracing.rs</strong></summary>

Used as a logger (similar to `console.log()` in JavaScript)

```rs
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

pub fn init*tracing() {
let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
// 🦀 try_from_default_env reads the RUST_LOG env var
// e.g. RUST_LOG=debug cargo run → shows debug logs
// If RUST_LOG is not set, falls back to "info"

    tracing_subscriber::registry()
        .with(env_filter)
        .with(
            tracing_subscriber::fmt::layer()
                .with_level(true) // shows INFO / WARN / ERROR
                .with_target(true) // shows which module logged it e.rust_server::config
                .with_ansi(true) // colors in terminal
                .compact(), // single line per log entry
        )
        .init();

}
```

</details>

## 🛡️ `src/middleware/`

| File      | Purpose                  |
| --------- | ------------------------ |
| logger.rs | Morgan-like route logger |

<details>
<summary><strong>logger.rs</strong></summary>
Morgan like route logger for Rust

```rs
use axum::{extract::Request, middleware::Next, response::Response};
use owo_colors::OwoColorize;
use std::time::Instant;

pub async fn log_middleware(req: Request, next: Next) -> Response {
    let method = req.method().clone();
    let path = req.uri().path().to_string();

    let start = Instant::now();
    let response = next.run(req).await;
    let duration = start.elapsed();
    let status = response.status().as_u16();

    let method_colored = match method.as_str() {
        "GET"    => method.to_string().green().bold().to_string(),
        "POST"   => method.to_string().blue().bold().to_string(),
        "PUT"    => method.to_string().yellow().bold().to_string(),
        "DELETE" => method.to_string().red().bold().to_string(),
        "PATCH"  => method.to_string().cyan().bold().to_string(),
        _        => method.to_string().white().bold().to_string(),
    };

    let status_colored = match status {
        200..=299 => status.to_string().green().bold().to_string(),
        300..=399 => status.to_string().cyan().bold().to_string(),
        400..=499 => status.to_string().yellow().bold().to_string(),
        _         => status.to_string().red().bold().to_string(),
    };

    let ms = duration.as_millis();
    let duration_colored = if ms >= 500 {
        format!("{}ms", ms).red().to_string()
    } else if ms >= 100 {
        format!("{}ms", ms).yellow().to_string()
    } else {
        format!("{}ms", ms).dimmed().to_string()
    };

    // 🦀 eprintln! writes directly to stderr — bypasses tracing entirely
    // so ANSI codes are passed raw to the terminal and rendered as colors.
    // This is intentional: HTTP access logs are not structured app events.
    // stderr is the correct stream for logs (stdout is for program output).
    eprintln!("{} {} {} {}", method_colored, path, status_colored, duration_colored);

    response
}

```

</details>

## 📦 Installed crates

<details>
<summary><strong>Axum & Tokio</strong></summary>

**Axum** - Modern web framework

- Version: 0.8.8
- Purpose: HTTP server framework built on Tower ecosystem
- Documentation: <https://docs.rs/axum/latest/axum/>

**Tokio** - Async runtime

- Version: 1.49.0
- Features: ["full"] (includes networking, I/O, time, sync)
- Purpose: Handles concurrent requests and async operations
- Documentation: <https://docs.rs/tokio/latest/tokio/>

### Installation Commands

```bash
cargo add axum
cargo add tokio
```

### Cargo.toml Configuration

```toml
[package]
name = "rust-server"
version = "0.1.0"
edition = "2024"

[dependencies]
axum = "0.8.8"
tokio = { version = "1.49.0", features = ["full"] }
```

</details>

<!-- DOTENVY -->
<details>
<summary><strong>dotenvy</strong></summary>

**dotenvy** - Loads environment variables from a `.env` file

- Documentation <https://docs.rs/dotenvy/latest/dotenvy/>

</details>

<!-- ENVY -->
<details>
<summary><strong>envy</strong></summary>

**envy** - Envy is a library for deserializing environment variables into typesafe structs

- Documentation <https://docs.rs/envy/latest/envy/>

</details>

<!-- SERDE -->
<details>
<summary><strong>Serde</strong></summary>

**Serde** - Serde is a framework for serializing and deserializing Rust data structures efficiently and generically.

- Documentation <https://docs.rs/serde/latest/serde/>

</details>

<!-- TRACING -->
<details>
<summary><strong>tracing</strong></summary>

**tracing** - is a framework for instrumenting Rust programs to collect structured, event-based diagnostic information.

- Documentation <https://docs.rs/tracing/latest/tracing/>

</details>

<!-- TRACING-SUBSCRIBER -->
<details>
<summary><strong>tracing-subscriber</strong></summary>

**tracing-subscriber** - Utilities for implementing and composing tracing subscribers.

- Documentation <https://docs.rs/tracing-subscriber/latest/tracing_subscriber/>

</details>

<!-- OWO-COLORS -->
<details>
<summary><strong>owo-colors</strong></summary>

**owo-colors** - Zero-allocation terminal color library

- Version: 4.x
- Purpose: Colorizes HTTP methods, status codes and durations in the logger middleware
- Documentation: <https://docs.rs/owo-colors/latest/owo_colors/>

### Installation

```bash
cargo add owo-colors
```

</details>
