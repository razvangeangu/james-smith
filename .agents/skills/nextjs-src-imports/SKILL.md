---
name: nextjs-src-imports
description: >-
  Use when adding or editing imports, path aliases, or new modules in a Next.js
  app. Ensures app-local imports under src/ use the @/ path alias instead of ./
  or ../. Apply whenever touching any file under src/ (or repo-root config that
  affects resolution), even for a single import change.
---

# Next.js — `@/` imports

The app maps **`@/*`** to **`./src/*`** in the root **`tsconfig.json`** (`compilerOptions.paths`). **ESLint** in **`eslint.config.ts`** enforces **no relative specifiers** for app code with **`no-restricted-imports`** (regexes for `^\./` and `^\.\./`) and **`eslint-plugin-simple-import-sort`** for import/export order.

## Rules

1. **App-local modules** — Any import that resolves to code or assets **inside `src/`** must use **`@/…`** (e.g. `@/components/...`, `@/i18n/...`, `@/app/...`, `@/lib/...`). Do **not** use `./` or `../` for those targets.

2. **Exceptions** — Package imports (`react`, `react-dom`, `next`, `next-intl`, `next-intl/server`, `@radix-ui/*`, `lucide-react`, etc.), `node:` builtins, and paths that **do not** live under `src/` are unchanged.

3. **Messages at repo root** — Locale JSON lives in **`messages/<locale>.json`** (see **`nextjs-web-i18n`**). **`src/i18n/request.ts`** loads them with a **dynamic** `import()`; that pattern is intentional for next-intl. Do not replace that loader with ad-hoc relative imports elsewhere without aligning with the i18n skill.

4. **Import order** — Groups are enforced by **`simple-import-sort/imports`** in **`eslint.config.ts`**:

   - Side effects (`^\u0000`)
   - `node:` builtins
   - **`@/`** and **`@messages/`** (same ESLint group)
   - All other external packages

   Only **`@/*` → `./src/*`** is defined in **`tsconfig.json`** today. If you add static imports from **`messages/`**, define **`@messages/*`** in **`paths`** to match the sort group and keep TypeScript resolving correctly.

5. **Source of truth** — **`tsconfig.json`** `compilerOptions.paths` defines **`@/*` → `./src/*`**; keep imports consistent with that mapping.

## Where to look

- Paths: **`tsconfig.json`**
- Lint: **`eslint.config.ts`** (`simple-import-sort`, `no-restricted-imports`)
- Type-aware resolution: ESLint **`import/resolver`** → **`typescript`** project **`tsconfig.json`**
