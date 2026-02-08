# 📖 Frontend Documentation

### Frontend

## 📁 Project Structure

```
src/
├── app/ # Routes & pages
├── components/ # Reusable UI
├── lib/ # Route logic
└── utils/ # Helpers & types
```

---

## 🖼️ `public/`

Static assets directory for images, fonts, and other media files.

---

## 🎯 `src/app/`

### Files

| File            | Purpose                    |
| --------------- | -------------------------- |
| `error.tsx`     | Error boundary fallback    |
| `layout.tsx`    | Root app layout            |
| `not-found.tsx` | 404 handler                |
| `page.tsx`      | Home/landing page          |
| `globals.css`   | App-wide styles & CSS vars |

<details>
<summary><strong>🛣️ (app) - Application Routes</strong></summary>

- **bets/** - Bet tracking interface
- **dash/** - Dashboard & analytics

</details>

<details>
<summary><strong>🔐 (auth) - Authentication Routes</strong></summary>

- **login/** - User authentication
- **register/** - New user signup

</details>

---

## 🧩 `src/components/`

Shared, reusable components organized by purpose.

### `ui/`

Primitive components: `Button`, `Input`

### `layout/`

App structure: `Navbar`, `Footer`, `Sidebar`

---

## 📚 `src/lib/`

Route-specific components and functions that contain business logic.

---

## 🔧 `src/utils/`

### `types.ts`

TypeScript definitions:

- `Bet` - Bet record interface
- `User` - User profile types

---

## Installed packages

<details>
<summary><strong>Lucide Icons</strong></summary>

Icons for the project <https://lucide.dev/>

- `bun add lucide-react`
- Usage:

```tsx
import { Landmark } from "lucide-react";

function App() {
  return (
    <div className="app">
      <Landmark />
    </div>
  );
}
```

</details>

---

### Testing

<details>
<summary><strong>Vitest & testing-library</strong></summary>

For unit tests <https://vitest.dev/>

- `bun add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react`

Create `vitest.config.ts` file in the root of the `client/` folder

```ts
import react from "@vitejs/plugin-react";
import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/app/**/error.tsx",
      ],
    },
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Create `vitest.setup.ts` file in the root of the `client/` folder

```ts
import "@testing-library/jest-dom";
```

Create a testfile for example for footer: `Footer.spec.ts`:

```ts
import Footer from "./Footer";
import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";

describe("FOOTER", () => {
  it("renders the footer component", () => {
    render(<Footer />);

    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
  });
});

```

Add script to `package.json`

```json
{
  ...
  "scripts": {
    "dev": "bun --bun next dev",
    "build": "bun --bun next build",
    "start": "bun --bun next start",
    "lint": "eslint",
    "test": "vitest",
    "test:cover": "vitest run --coverage"
  },
  ...
}

```

Usage:

```bash
bun run test
```

- The test should work now.

```bash
bun run test:cover
```

- Shows the coverage of tests

</details>

<details>
<summary><strong>Playwright</strong></summary>

For end-to-end tests <https://playwright.dev/>

- `bun add -D @playwright/test`
- `bunx playwright install --with-deps`

Check that install was ok `bunx playwright --version`

Create `playwright.config.ts` file in the root of the `client/` folder:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "bun dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

Add the scripts to the `package.json` file:

```json
{
  ...
  "scripts": {
    "dev": "bun --bun next dev",
    "build": "bun --bun next build",
    "start": "bun --bun next start",
    "lint": "eslint",
    "test": "vitest",
    "test:cover": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  },
  ...
}
```

Create and example test `example.spec.ts` in the `client/e2e` folder:

```ts
import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  // Expect page to have a heading
  await expect(page.locator("h1")).toBeVisible();
});
```

And run the test with one of the e2e scripts

</details>
