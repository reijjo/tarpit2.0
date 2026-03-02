# Backend Documentation (Rust + Axum)

The current date is March 02, 2026.

## 📁 Project Structure (Feature-based)

```text
src/
├── main.rs               # Server startup, global router composition, layers
├── config.rs             # Env loading, structs (AppConfig, DbConfig, ...)
├── state.rs              # AppState (Clone + Send + Sync → db pool, cookie key, ...)
├── errors.rs             # AppError enum + IntoResponse impl
│
├── common/               # Cross-cutting helpers (used by many features)
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
| errors.rs | custon errors + response conversion |

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
```
