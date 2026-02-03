# 📖 Frontend Documentation

---

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
