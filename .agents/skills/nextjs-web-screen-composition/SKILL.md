---
name: nextjs-web-screen-composition
description: >-
  Use when building or refactoring Next.js App Router screens under src/app:
  extracting UI, hooks, constants, and other feature-local modules into
  colocated route groups — (components), (hooks), (constants), etc. — at the
  same route segment as page.tsx / layout.tsx. Apply alongside nextjs-web-i18n
  for copy and src/components/ui for primitives.
---

# Next.js web — screen composition and colocated route groups

## When to extract

If a route file is no longer a **thin composition layer** — multiple logical sections, repeated layout, or logic you would reasonably test or reuse in isolation — move code into **sibling route groups** next to that route's **`page.tsx`** or **`layout.tsx`**:

- **UI** → **`(components)/`**
- **Route-scoped hooks** → **`(hooks)/`**
- **Route-scoped constants** (and similar static config) → **`(constants)/`**
- Add **`(types)/`**, **`(lib)/`**, etc. the same way when a segment needs a dedicated bucket — always as **parenthesized folders** at that segment so they stay out of the URL.

Route files should primarily handle: **data loading** (when using Server Components), **metadata** (`generateMetadata`), **locale** (`setRequestLocale` / `getTranslations` where applicable), and **wiring** imports from those colocated groups.

## Path rule: same segment, parenthesized folders

Next.js **route groups** use parentheses in **`src/app/`** only. They **do not** appear in the URL.

At a given URL segment, colocated feature code lives in **parallel** folders such as **`(components)`**, **`(hooks)`**, **`(constants)`** — same depth as **`page.tsx`**, not under a separate repo-root tree for that feature.

**Examples**

- Home route: `src/app/page.tsx`
  Colocated modules: `src/app/(components)/…`, `src/app/(hooks)/…`, `src/app/(constants)/…`

- Future segment: `src/app/settings/page.tsx`
  Colocated modules: `src/app/settings/(components)/…`, `src/app/settings/(hooks)/…`, etc.

**Nested routes:** each segment that owns a `page.tsx` can have its own `(components)/`, `(hooks)/`, `(constants)/`, … Do not flatten unrelated features into a single global `app/(components)/` (or siblings) unless they truly belong to one segment.

## Imports

- **From `page.tsx` / `layout.tsx` (or between colocated files)** — prefer **short relative** paths into sibling route groups:

  ```tsx
  import { HomeScreen } from './(components)/home-screen';
  import { useHomeFilters } from './(hooks)/use-home-filters';
  import { PAGE_SIZE } from './(constants)/home';
  ```

- **`@/*` alias** (`tsconfig` maps `@/*` → `./src/*`) — use for **shared** code under `src/` (e.g. `src/components/ui`, `src/lib`). Avoid importing another route's `(hooks)` / `(components)` across unrelated segments; extract to `src/lib` or `src/components` when truly shared.

- **URL paths** (`href`, `redirect`, `router.push`) stay normal App Router paths — none of `(components)`, `(hooks)`, `(constants)`, … appear in URLs.

## What lives where

| Location | Holds |
|----------|--------|
| `src/app/(…)/` | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, route handlers — minimal composition and wiring. |
| `src/app/(…)/(components)/` | Screen layout, sections, presentational pieces tied to that route. |
| `src/app/(…)/(hooks)/` | Custom hooks used only (or primarily) by that segment's UI. |
| `src/app/(…)/(constants)/` | Magic numbers, static maps, config literals scoped to that route (not user-facing copy). |
| `src/components/ui/` | Shared primitives (shadcn/Radix wrappers, etc.). |
| `src/lib/` (or similar) | Cross-cutting helpers used from many features. |

**Cross-cutting code** — only promote to `src/components/`, `src/lib/`, etc. when used by **multiple unrelated** routes. Prefer segment-local `(components)` / `(hooks)` / `(constants)` first.

**User-facing copy** stays in **`messages/*.json`** (not in `(constants)/` as string literals).

## Conventions

- **Copy:** see **`nextjs-web-i18n`**. In **`(components)/`**, each client component that shows user-facing strings should call **`useTranslations()`** locally (no namespace); avoid passing **`t`** through props unless the i18n skill's exceptions apply.

- **Primitives:** compose from **`src/components/ui`** where a primitive exists; match existing Tailwind and component patterns.

- **Server vs client:** keep **`page.tsx`** as a Server Component when possible. Put **`'use client'`** on **`(components)/`** files (or subtrees) that need hooks, browser APIs, or event handlers. **`(hooks)/`** modules that use React hooks must be imported from Client Components (or be in `'use client'` files). **`(constants)/`** can be consumed from Server or Client Components if they stay free of client-only imports.

- **Naming:** clear file names (`*-screen.tsx`, `*-section.tsx`, `use-*.ts`, or domain names like `hero.tsx`) consistent with the route's purpose.

## Where to look

- Routes: **`src/app/`**
- Example layout and providers: **`src/app/layout.tsx`**, **`src/app/providers.tsx`**
- i18n wiring: **`src/i18n/request.ts`**, **`messages/`**
- Shared UI: **`src/components/ui/`**
