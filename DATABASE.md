# Database Setup (PostgreSQL + Adminer + sqlx)

This project uses Docker for local PostgreSQL, Adminer for web-based
database management, and sqlx for migrations and queries.

## Port Strategy (Important)

- One Adminer service and one Adminer port: `http://localhost:8080`
- Two PostgreSQL containers: `postgres` (dev) and `postgres_test` (test)
- Two host DB ports: `DB_PORT` and `DB_TEST_PORT`

Why this is correct:

- Both Postgres containers expose internal port `5432`
- Host ports must be different when both run at the same time
- Adminer is just a UI client, so one Adminer port is enough
- In Adminer, choose `Server=postgres` for dev or `Server=postgres_test` for test

## Prerequisites

- Docker Desktop with Docker Compose
- Rust + Cargo installed
- `sqlx-cli` installed (see below)
- Repo cloned locally

## 0. Install sqlx-cli

```bash
cargo install sqlx-cli --no-default-features --features postgres,rustls
```

This gives you the `sqlx` command globally for creating and running migrations.

## 1. Configure Environment Variables

Edit `rust-server/.env`:

```text
# Environment
APP_ENV=development
PORT=3001

# Dockerized PostgreSQL
DB_PORT=5432
DB_TEST_PORT=5433
DB_NAME=tarpit
DB_TEST_NAME=tarpit_test

# Database URLs
DB_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5432/tarpit
DB_TEST_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5433/tarpit_test

# PostgreSQL credentials
POSTGRES_USER=<your_username>
POSTGRES_PASSWORD=<your_password>

# Other required vars
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=re_xxxx
TARPIT_DOMAIN=spam.example.com
```

Contract in this repository:

- `DB_URL` → dev database
- `DB_TEST_URL` → test database
- `DB_PORT` → host port for `postgres` container
- `DB_TEST_PORT` → host port for `postgres_test` container

## 2. Start and Stop Database Services

Run from `rust-server/`:

```bash
cd rust-server

# Start Postgres (dev + test) and Adminer
docker compose -f compose.yml up -d

# Check status
docker compose -f compose.yml ps
```

Stop services:

```bash
docker compose -f compose.yml down
```

Reset services and volumes (wipes all data):

```bash
docker compose -f compose.yml down -v --remove-orphans
```

## 3. Verify Databases Are Reachable

```bash
# Dev DB
docker compose -f compose.yml exec postgres psql -U <postgres_user> -d <db_name>

# Test DB
docker compose -f compose.yml exec postgres_test psql -U <postgres_user> -d <db_test_name>
```

Useful psql commands:

- `\l` — list databases
- `\dt` — list tables
- `\q` — quit

## 4. Open Adminer (One Port For Both Databases)

Open: `http://localhost:8080`

**Login for dev database:**

| Field    | Value                        |
| -------- | ---------------------------- |
| System   | PostgreSQL                   |
| Server   | `postgres`                   |
| Username | value of `POSTGRES_USER`     |
| Password | value of `POSTGRES_PASSWORD` |
| Database | value of `DB_NAME`           |

**Login for test database:**

| Field    | Value                        |
| -------- | ---------------------------- |
| System   | PostgreSQL                   |
| Server   | `postgres_test`              |
| Username | value of `POSTGRES_USER`     |
| Password | value of `POSTGRES_PASSWORD` |
| Database | value of `DB_TEST_NAME`      |

## 5. sqlx Migration Workflow

Migrations live in `rust-server/migrations/` as plain `.sql` files.
sqlx runs them automatically on server startup via `sqlx::migrate!()`.

Run from `rust-server/`:

```bash
# Create a new migration file
sqlx migrate add <migration_name>
# Example: sqlx migrate add create_users_table
# Creates: migrations/20260308_create_users_table.sql

# Run pending migrations manually against dev DB
sqlx migrate run --database-url $DB_URL

# Run pending migrations against test DB
sqlx migrate run --database-url $DB_TEST_URL

# Revert last migration
sqlx migrate revert --database-url $DB_URL
```

Migrations run automatically on startup — no manual step needed in normal dev flow.

## 6. sqlx Compile-time Query Checks

sqlx verifies SQL queries at compile time against your real database.
This requires a live DB connection during `cargo build`.

```bash
# Save query metadata so offline builds work (CI without a live DB)
cargo sqlx prepare --database-url $DB_URL

# Check saved metadata is up to date
cargo sqlx prepare --check --database-url $DB_URL
```

Commit the generated `.sqlx/` folder to git — CI uses it to compile without a DB.

## 7. Default Dev/Test Workflow

- Backend in development uses `DB_URL`
- Backend in test uses `DB_TEST_URL` (selected automatically by `AppEnv::Test`)

Run backend:

```bash
cd rust-server
cargo run
```

Run backend tests against test DB:

```bash
cd rust-server
cargo test
```

## 8. Validation Scenarios

1. Start stack and verify all 3 services are healthy (`postgres`, `postgres_test`, `adminer`).
2. Connect to dev DB through Adminer (`Server=postgres`) and confirm dev tables.
3. Connect to test DB through Adminer (`Server=postgres_test`) and confirm separate test tables.
4. Run tests with `APP_ENV=test` and confirm writes happen only in test DB.
5. Verify dev data remains unchanged after test runs.

## 9. Troubleshooting

**Port conflict (5432, 5433, 8080):**

```bash
lsof -nP -iTCP:5432 -sTCP:LISTEN
lsof -nP -iTCP:5433 -sTCP:LISTEN
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

**Wrong credentials or wrong DB name:**

- Check `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DB_NAME`, `DB_TEST_NAME`
- Ensure `DB_URL` and `DB_TEST_URL` match those values

**Stale or incompatible volumes:**

```bash
docker compose -f compose.yml down -v --remove-orphans
docker compose -f compose.yml up -d
```

**Missing env variable at startup:**

- Confirm `rust-server/.env` has all required vars
- Restart backend after updating `.env`

**sqlx compile error (no DATABASE_URL set):**

```bash
# Either set it in your shell
export DATABASE_URL=postgresql://...

# Or use the saved .sqlx/ metadata
cargo sqlx prepare --database-url $DB_URL
```
