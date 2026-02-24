# Backend Documentation

## 📁 Project Structure

```text
src/
├── controllers/     # API request handlers
├── middleware/      # Request processing
├── routes/          # API route definitions
├── models/          # Database schemas
├── services/        # Business logic layer
└── utils/           # Helpers & config
```

## 🚀 `src/`

### Files

| File     | Purpose                    |
| -------- | -------------------------- |
| app.ts   | Handle routes & middleware |
| index.ts | Starts the server          |

### Runtime middleware order in `app.ts`

1. `morgan(isProduction ? "combined" : "dev")`
2. `express.json()`
3. `helmet()`
4. `cors()`
5. Route handlers (for now: `GET /`)
6. `unknownEndpoint`
7. `errorHandler`

## 🎮 `src/controllers/`

Controller functions that handle API requests and responses.

<details>
<summary><strong>Available Controllers</strong></summary>

Controllers will be added as features are implemented:

- **authController.ts** - User authentication & registration
- **betsController.ts** - Bet CRUD operations
- **userController.ts** - User profile management

</details>

## 🛣️ `src/routes/`

API route definitions that map endpoints to controllers.

<details>
<summary><strong>Route Files</strong></summary>

Routes will be added as features are implemented:

- **authRoutes.ts** - `/api/auth/*` endpoints
- **betsRoutes.ts** - `/api/bets/*` endpoints
- **userRoutes.ts** - `/api/user/*` endpoints

</details>

## 🗄️ `src/models/`

Database schemas and models for PostgreSQL.

<details>
<summary><strong>Database Models</strong></summary>

Models will be added as database schema is defined:

- **User.ts** - User table schema
- **Bet.ts** - Bet records schema

</details>

## 🔧 `src/services/`

Business logic layer that separates concerns from controllers.

<details>
<summary><strong>Service Layer</strong></summary>

Services will be added as business logic grows:

- **authService.ts** - Authentication logic
- **betsService.ts** - Bet processing logic

</details>

## 🛡️ `src/middleware/`

### Files

| File                | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| errorHandler.ts     | Catches errors & formats error responses          |
| unknownEndpoints.ts | Shows 404 - not found error for unknown endpoints |

<details>
<summary><strong>errorHandler.ts</strong></summary>

```ts
import {
  type Request,
  type Response,
  type ErrorRequestHandler,
  type NextFunction,
} from "express";

import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Ooops, error", err.stack);

  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).send(err.message);
  }

  console.error("Unexpected error", err);

  res.status(status).send(message);
};
```

</details>

<details>
<summary><strong>unknownEndpoints.ts</strong></summary>

```ts
import type { Request, Response } from "express";

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: "nothing here" });
};
```

</details>

<details>
<summary><strong>Future Middleware</strong></summary>

Additional middleware to be added:

- **authMiddleware.ts** - Verify authentication cookies/tokens
- **validateRequest.ts** - Request validation with Zod schemas

</details>

## 🔧 `src/utils/`

### Helper/Config Files

| File        | Purpose                       |
| ----------- | ----------------------------- |
| AppError.ts | Custom error handler          |
| config.ts   | Exports environment variables |

<details>
<summary><strong>AppError.ts</strong></summary>

```ts
// AppError allows us to create custom errors with status codes (e.g. 404 Not Found)
export class AppError extends Error {
  public readonly statusCode: number;

  // isOperational = true means this is a "known" error we created intentionally (like invalid input).
  // If false, it's a bug/crash we didn't expect.
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    // Call the parent Error class with the message
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Fixes the prototype chain when extending built-in Error in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);

    // Captures the spot in code where this error occurred (for debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}
```

</details>

<details>
<summary><strong>config.ts</strong></summary>

```ts
const PORT: number = Number(process.env.PORT) || 3001;

export { PORT };
```

</details>

<details>
<summary><strong>Future Utilities</strong></summary>

Utilities to be added:

- **types.ts** - TypeScript type definitions
- **db.ts** - Database connection configuration

</details>

## 📦 `Installed Packages`

<details>
<summary><strong>Express</strong></summary>

Fast, minimalist web framework for Node.js

```bash
npm install express
npm install -D @types/express
```

```typescript
import express from "express";

const app = express();
app.use(express.json());
```

</details>

<details>
<summary><strong>Morgan</strong></summary>

Request logger

```bash
bun add -d morgan @types/morgan
```

```ts
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
```

</details>

<details>
<summary><strong>Helmet</strong></summary>

Secure HTTP headers middleware.

```bash
bun add helmet
```

```ts
import helmet from "helmet";

app.use(helmet());
```

</details>

<details>
<summary><strong>Prisma</strong></summary>

Prisma ORM for PostgreSQL schema, migrations, and typed client: <https://www.prisma.io/>

```bash
bun add @prisma/client @prisma/adapter-pg
bun add -D prisma
bunx prisma init --datasource-provider postgresql
```

`prisma.config.ts` uses `DB_URL`:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DB_URL"],
  },
});
```

`prisma/schema.prisma` (Prisma 7 compatible):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Create/apply migration and regenerate Prisma Client:

```bash
bunx prisma migrate dev --name init
bunx prisma generate
```

### Prisma client

Create Prisma client in `src/utils/prisma.ts`:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error("DB_URL environment variable is not set");
}

const globalForPrisma = globalThis as { prisma?: PrismaClient };

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
```

`src/index.ts` should connect and disconnect Prisma safely:

```ts
await prisma.$connect();

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
});
```

</details>

<details>
<summary><strong>Cookie Parser</strong></summary>

Parse cookies for authentication

```bash
npm install cookie-parser
npm install -D @types/cookie-parser
```

```typescript
import cookieParser from "cookie-parser";

app.use(cookieParser());
```

</details>

<details>
<summary><strong>Zod</strong></summary>

TypeScript-first schema validation <https://zod.dev/>

```bash
npm install zod
```

```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

</details>

<details>
<summary><strong>Resend</strong></summary>

Email service <https://resend.com/>

```bash
bun add resend
```

Register to Resend and add your API key + sending domain to `.env`:
RESEND_API_KEY=<your_key>
TARPIT_DOMAIN=<your_verified_domain>

```ts
const resend = new Resend(RESEND_API);

resend.emails.send({
  from: "onboarding@resend.dev",
  to: <EMAILYOUREGISTEREDTORESEND>,
  subject: "Welcome to Tärpit!",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});
```

you have to verify a domain to send mail to other addresses

</details>

## Testing with `bun:test`

Run tests with `bun test`

- Run tests in watch mode `bun test --watch` or you can add a script to `package.json``

```json
{
	...
	  "scripts": {
    "clean": "find . -type d -name 'dist' -exec rm -rf {} + 2>/dev/null || true && echo 'All cleaned!'",
    "clean:full": "rm -rf dist node_modules bun.lockb && find . -type d -name 'dist' -exec rm -rf {} + 2>/dev/null || true && bun install && echo 'Full clean complete!'",
    "dev": "bun --watch src/index.ts",
    "test:watch": "bun test --watch",
    "test": "bun clean && bun test"
  },
	...
}
```

Create `bunfig.toml` file in the root of the `server/` folder

```toml
[test]
coverage = true
coverageSkipTestFiles = true
coverageReporter = ["text", "lcov"]
coverageDir = "src/tests/coverage"
coveragePathIgnorePatterns = [
  "**/node_modules/**",
  "**/dist/**",
  "**/*.spec.{ts,js}",
  "**/*.test.{ts,js}"
]
```

- This shows coverage for the tests

Example text (`tests/example.spec.ts`)

```ts
import { test, expect, describe } from "bun:test";

describe("math", () => {
  test("add", () => {
    expect(2 + 2).toEqual(4);
  });

  test("multiply", () => {
    expect(2 * 2).toEqual(4);
  });
});
```
