# 🎯 Tarpit 2.0

A full-stack bet tracking application built with Next.js and Express, allowing users to manage and analyze their betting history.

## 🛠️ Tech Stack

**Frontend:** Next.js 16+, React 19+, TypeScript
**Backend:** Express, TypeScript, PostgreSQL
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

Navigate to the `server/` folder:

```bash
cd server/
bun install
bun dev
```

The backend will run on `http://localhost:3001`

---

## 🗄️ Database Setup

Local PostgreSQL + Adminer + Prisma setup is documented in:

- [DATABASE.md](./DATABASE.md)

Quick start:

```bash
cd server/
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
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (`server/.env`)

```env
PORT=3001
NODE_ENV=development

DB_PORT=5432
DB_TEST_PORT=5433
DB_NAME=<db_name>
DB_TEST_NAME=<db_test_name>
POSTGRES_USER=<postgres_user>
POSTGRES_PASSWORD=<postgres_password>

DB_URL=postgresql://<postgres_user>:<postgres_password>@localhost:5432/<db_name>
DB_TEST_URL=postgresql://<postgres_user>:<postgres_password>@localhost:5433/<db_test_name>
```

---

## 🧪 Testing

### Frontend

**Unit tests:**

```bash
cd client/
bun test
```

Run tests in watch mode:

```bash
bun test:watch
```

**E2E tests:**

```bash
cd client/
bun test:e2e
```

### Backend

**Unit tests:**

```bash
cd server/
bun test
```

Backend tests run with `NODE_ENV=test` and target `DB_TEST_URL`.

---

## 📖 Documentation

- [Frontend Documentation](./client/documentation.md)
- [Backend Documentation](./server/documentation.md)
- [Database Setup](./DATABASE.md)

---

## 📁 Project Structure

```text
tarpit2.0/
├── client/          # Next.js frontend
├── server/          # Express backend
└── README.md
```
