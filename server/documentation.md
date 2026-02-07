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
<summary><strong>PostgreSQL Client (pg)</strong></summary>

PostgreSQL database client

```bash
npm install pg
npm install -D @types/pg
```

```typescript
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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

TypeScript-first schema validation

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
