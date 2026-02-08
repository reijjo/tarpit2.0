# 🎯 Tarpit 2.0

A full-stack bet tracking application built with Next.js and Express, allowing users to manage and analyze their betting history.

## 🛠️ Tech Stack

**Frontend:** Next.js 16+, React 19+, TypeScript
**Backend:** Express, TypeScript, PostgreSQL
**Runtime:** Bun

---

## 📋 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- PostgreSQL (v14+)

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
mv .env.example .env  # Configure environment variables
bun install
bun dev
```

The backend will run on `http://localhost:3001`

---

## 🔑 Environment Variables

### Frontend (`client/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (`server/.env`)

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/tarpit
NODE_ENV=development
```

---

## 🧪 Testing

### Frontend

**Unit tests:**

```bash
cd client/
bun test
```

- Run tests in watch mode:

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

---

## 📖 Documentation

- [Frontend Documentation](./client/documentation.md)
- [Backend Documentation](./server/documentation.md)

---

## 📁 Project Structure

```text
tarpit2.0/
├── client/          # Next.js frontend
├── server/          # Express backend
└── README.md
```
