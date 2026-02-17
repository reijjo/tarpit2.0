# Database Setup (PostgreSQL + Adminer + Prisma)

This project uses Docker for local PostgreSQL, Adminer for web-based database management, and Prisma for schema/migrations.

## Prerequisites

- Docker Desktop with Docker Compose
- Bun installed
- Repo cloned locally

## 1. Configure Environment Variables

Edit `server/.env`.

```env
# Server
PORT=3001
NODE_ENV=development

# Dockerized PostgreSQL
DB_PORT=5432
DB_TEST_PORT=5433
DB_NAME=tarpit_v2
DB_TEST_NAME=tarpit_test_v2
POSTGRES_USER=repe
POSTGRES_PASSWORD=Repe_123

# Prisma connection strings
DB_URL=postgresql://repe:Repe_123@localhost:5432/tarpit_v2
DB_TEST_URL=postgresql://repe:Repe_123@localhost:5433/tarpit_test_v2
```

## 2. Start and Stop Database Services

Run from `server/`:

```bash
cd /Users/reijjo/workspace/projects/fullstack/react_node/tarpit2.0/server

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
docker compose -f compose.yml exec postgres psql -U repe -d tarpit_v2

# Test DB
docker compose -f compose.yml exec postgres_test psql -U repe -d tarpit_test_v2
```

Useful psql commands:

- `\l` list databases
- `\dt` list tables
- `\q` quit

## 4. Open Adminer (No Desktop App Needed)

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

## 5. Prisma Workflow

Run from `server/`:

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

## 6. Verify Connection Through the App

When backend starts successfully, you should see:

- `Database connection established`
- `Server is running on port 3001`

Run backend:

```bash
cd /Users/reijjo/workspace/projects/fullstack/react_node/tarpit2.0/server
bun dev
```

## 7. Troubleshooting

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

- Confirm `server/.env` has `DB_URL`.
- Restart backend after updating env.
