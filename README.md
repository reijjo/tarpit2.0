# 🎯 Tarpit 2.0

A full-stack bet tracking application built with Next.js and Rust(Axum), allowing users to manage and analyze their betting history.

## 🛠️ Tech Stack

**Frontend:** Next.js 16+, React 19+, TypeScript
**Backend:** Rust, Axum, PostgreSQL
**Runtime:** Bun

---

## 📋 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Docker Desktop (for local PostgreSQL + Adminer)

---

## 🚀 Running the Project

### Frontend

Navigate to the `client/` folder:

```bash
cd client/
mv .env.example .env  # Configure environment variables
bun install
bun dev
```

The frontend will run on `http://localhost:3000`

### Backend

Navigate to the `rust-server/` folder:

```bash
cd rust-server
cargo run
```

The backend will run on `http://localhost:3001`

---

## 🗄️ Database Setup

Local PostgreSQL + Adminer + Prisma setup is documented in:

- [DATABASE.md](./DATABASE.md)

Quick start:

```bash
cd rust-server
docker compose -f compose.yml up -d
```

This starts:

- `postgres` (dev DB)
- `postgres_test` (test DB)
- `adminer` on `http://localhost:8080`

Use the same Adminer URL for both databases.

---

## 🔑 Environment Variables

### Frontend (`client/.env`)

```env
NEXT_PUBLIC_DEV_BACKEND=http://localhost:3001
```

### Backend (`rust-server/.env`)

```env
APP_ENV=development
PORT=3001

# Database
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

# URLs
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Email
RESEND_API_KEY=<your_resend_api_key>
TARPIT_DOMAIN=<your_domain>

# Authentication
JWT_ACCESS_SECRET=<openssl_rand_hex_64>
JWT_ACCESS_TTL_SECONDS=600
REFRESH_TOKEN_PEPPER=<openssl_rand_hex_64>
REFRESH_TTL_SECONDS=604800
```

---

## 🧪 Testing

### Frontend

**Unit tests:**

```bash
cd client/
bun test
```

**E2E tests:**

```bash
cd client/
bun test:e2e
```

### Rust Backend (Axum)

**Unit tests:**

```bash
cd rust-server
cargo test
```

**Integration tests (single target):**

```bash
cd rust-server
cargo test --test api
```

**Coverage summary (terminal):**

```bash
cd rust-server
cargo llvm-cov
```

**Coverage report (HTML):**

```bash
cd rust-server
cargo llvm-cov --html --open
```

If `cargo llvm-cov` is missing:

```bash
cargo install cargo-llvm-cov
```

**Data source:**

- [cargo-llvm-cov](https://github.com/taiki-e/cargo-llvm-cov)

---

## 📖 Documentation

- [Frontend Documentation](./client/documentation.md)
- [Rust Backend Documentation](./rust-server/documentation.md)
- [Database Setup](./DATABASE.md)

---

## 📁 Project Structure

```text
tarpit2.0/
├── client/          # Next.js frontend
├── rust-server/     # Rust + Axum backend
└── README.md
```
