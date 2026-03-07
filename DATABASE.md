# Database Setup (PostgreSQL + Adminer + Prisma)

This project uses Docker for local PostgreSQL, Adminer for web-based database management, and Prisma for schema/migrations.

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
- Bun installed
- Repo cloned locally

## 1. Configure Environment Variables

Edit `rust-server/.env`.

```env
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

# PostgreSQL
POSTGRES_USER=<your_username>
POSTGRES_PASSWORD=<your_password>
```

Contract in this repository:

- `DB_URL` -> dev database
- `DB_TEST_URL` -> test database
- `DB_PORT` -> host port for `postgres`
- `DB_TEST_PORT` -> host port for `postgres_test`

## 2. Start and Stop Database Services

Run from `rust-server/`:

```bash
cd /Users/reijjo/workspace/projects/fullstack/react_node/tarpit2.0/rust-server

# Start Postgres (dev + test) and Adminer
docker compose -f compose.yml up -d

# Check status
docker compose -f compose.yml ps
```

Stop services:

```bash
docker compose -f compose.yml down
```

Reset services and volumes (project only):

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

- `\l` list databases
- `\dt` list tables
- `\q` quit

## 4. Open Adminer (One Port For Both Databases)

Open: `http://localhost:8080`

Login for dev database:

- System: `PostgreSQL`
- Server: `postgres`
- Username: value of `POSTGRES_USER`
- Password: value of `POSTGRES_PASSWORD`
- Database: value of `DB_NAME`

Login for test database:

- System: `PostgreSQL`
- Server: `postgres_test`
- Username: value of `POSTGRES_USER`
- Password: value of `POSTGRES_PASSWORD`
- Database: value of `DB_TEST_NAME`

No second Adminer port is needed unless you specifically want two separate Adminer browser tabs with separate services.

## 5. Prisma Workflow

Run from `rust-server/`:

```bash
# If not installed yet
bun add @prisma/client
bun add -d prisma

# Generate Prisma Client
bunx prisma generate

# Create/apply migration against dev DB and regenerate client
bunx prisma migrate dev --name init
```

Apply existing migrations to test DB:

```bash
DB_URL="$DB_TEST_URL" bunx prisma migrate deploy
```

## 6. Default Dev/Test Workflow

- Backend in development uses `DB_URL`
- Tests should run with `APP_ENV=test`, which makes app config select `DB_TEST_URL`

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

## 7. Validation Scenarios

1. Start stack and verify all 3 services are healthy (`postgres`, `postgres_test`, `adminer`).
2. Connect to dev DB through Adminer (`Server=postgres`) and confirm dev tables.
3. Connect to test DB through Adminer (`Server=postgres_test`) and confirm separate test tables.
4. Run tests with `APP_ENV=test` and confirm writes happen only in test DB.
5. Verify dev data remains unchanged after test runs.

## 8. Troubleshooting

Port conflict (`5432`, `5433`, `8080`):

```bash
lsof -nP -iTCP:5432 -sTCP:LISTEN
lsof -nP -iTCP:5433 -sTCP:LISTEN
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

Wrong credentials or wrong DB name:

- Check `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DB_NAME`, `DB_TEST_NAME`.
- Ensure `DB_URL` and `DB_TEST_URL` match those values.

Stale or incompatible volumes:

```bash
docker compose -f compose.yml down -v --remove-orphans
docker compose -f compose.yml up -d
```

Missing env variable (`DB_URL environment variable is not set`):

- Confirm `rust-server/.env` has `DB_URL`.
- Restart backend after updating env.

If you later switch to one Postgres container with two databases, then one host DB port is enough.
