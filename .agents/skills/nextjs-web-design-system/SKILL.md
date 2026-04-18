---
name: nextjs-web-design-system
description: >-
  Use when building or styling UI in a Next.js app: new components, layouts,
  Tailwind classes, shadcn/ui primitives, theme tokens, motion, or visual
  polish. Prefers shadcn registry components over bespoke controls when
  available. Covers shadcn + Tailwind + Motion + tw-animate-css, theme colors
  and typography configured in globals.css and layout.tsx, and adding missing
  shadcn blocks via the CLI. Apply alongside nextjs-web-i18n for copy and
  nextjs-src-imports for @/ imports.
---

# Next.js web — UI & design system

## Stack

- **Components**: [shadcn/ui](https://ui.shadcn.com/) (**`radix-lyra`** style, RSC on) — config in repo-root **`components.json`**.
- **Styling**: **Tailwind CSS** v4 pipeline with **`src/app/globals.css`** (`@import 'tailwindcss'`, **`shadcn/tailwind.css`**, **`tw-animate-css`**).
- **Motion**: **`motion`** (Motion for React; same lineage as Framer Motion) — see **Motion & animation** below.
- **Icons**: **lucide-react** (shadcn default).

## Motion & animation

Use motion where it **meaningfully improves** feedback, hierarchy, or delight — without slowing tasks or fighting existing primitives.

1. **Two layers (use both, pick the right one)**
   - **CSS / `tw-animate-css`** — Already wired for **shadcn** overlays and primitives (`animate-in`, `fade-in`, `zoom-in-95`, `slide-in-from-*`, `duration-*` on **`data-open` / `data-closed`**). **Keep these** for dialogs, popovers, selects, tooltips, hover-cards, and comboboxes unless a product spec requires replacing them.
   - **`motion` (React)** — Use for **feature and marketing UI** when CSS alone is awkward: staggered children, layout / shared-layout transitions, scroll- or view-based reveals, draggable or gesture-driven UI, spring-based micro-interactions, and coordinated sequences. Import from **`motion/react`** (e.g. **`motion`**, **`AnimatePresence`**, **`useReducedMotion`**).

2. **When to reach for Motion** — Prefer Motion for: hero or section **entrance** (opacity, y, subtle scale), **list stagger** (cards, service tiles, blog teasers), **tab or step** transitions, **empty → content** state changes, and **interactive** elements that need physics-like easing. Prefer **CSS-only** for: simple hovers (`transition-colors`, `duration-150`), skeleton **`animate-pulse`**, and anything already covered by shadcn's **`data-state`** animations.

3. **Client boundary** — **`motion`** components run only in **client components** (`'use client'`). Keep animated islands small; pass data from Server Components as props. For **App Router** pages that are otherwise server-only, extract a **`(components)/…-motion.tsx`** (or similar) client leaf per **`nextjs-web-screen-composition`**.

4. **Accessibility** — Honor **`prefers-reduced-motion`**: use **`useReducedMotion()`** from **`motion/react`** to shorten, skip, or replace motion with instant state changes; never gate critical information behind animation-only cues.

5. **Taste & performance** — Favor **short** durations (roughly **150–350 ms**) for UI chrome, **ease-out** or **spring** configs that feel calm (not bouncy unless intentional). Avoid animating **layout-affecting** properties on large trees every frame; prefer **`transform`** and **`opacity`**. Do not stack redundant Motion + Tailwind enter animations on the same node.

6. **Consistency** — Reuse a small set of **variants** or shared **transition** objects (e.g. in a colocated **`(constants)/motion.ts`** or next to the feature) instead of one-off magic numbers across files.

## Theme & tokens

1. **Source of truth** — Semantic colors and radius live as CSS variables on **`:root`** and **`.dark`** in **`src/app/globals.css`**. Prefer Tailwind semantic tokens: **`bg-background`**, **`text-foreground`**, **`bg-primary`**, **`text-primary-foreground`**, **`border-border`**, **`ring-ring`**, **`text-muted-foreground`**, etc.

2. **Primary color** — The project's brand emphasis is defined via the **`primary`** / **`primary-foreground`** CSS variables in **`globals.css`**. Use **`bg-primary`** / **`text-primary-foreground`** in code rather than ad-hoc hex values. If the palette changes, update **`globals.css`** once — not individual components.

3. **Radius** — Use **`rounded-sm`**, **`rounded-md`**, **`rounded-lg`**, etc., derived from **`--radius`** in **`globals.css`**; avoid magic pixel radii unless matching a specific asset.

## Typography

1. **Body / UI text** — **`font-sans`** maps to the project's body font loaded via **`next/font`** in **`src/app/layout.tsx`**. Default copy should inherit this.

2. **Headings** — **`font-heading`** (wired to **`--font-heading`** in **`globals.css`** `@theme inline`) maps to the project's heading font loaded in **`layout.tsx`**. Apply **`font-heading`** to **`h1`–`h6`**, hero titles, and major section headers unless a design explicitly calls for sans. Check **`layout.tsx`** for the current font choice.

3. **Code / technical mono** — **`font-mono`** / **`--font-mono`** is available for code snippets and monospace data; do not use it as the default for long-form body text.

## shadcn components

1. **Prefer shadcn over bespoke UI** — Before building buttons, dialogs, dropdowns, sheets, tabs, forms, tables, or other patterns from raw HTML + Tailwind, check whether [shadcn/ui](https://ui.shadcn.com/) already ships a component for it. Use an existing **`@/components/ui/*`** primitive or run **`npx shadcn@latest add …`** to add one; only implement from scratch when no registry component fits (or after composing shadcn pieces).

2. **Location** — Primitives live under **`src/components/ui/`** (alias **`@/components/ui`** per **`components.json`**). Compose feature UI from these; avoid duplicating Radix + variant logic in route files when a primitive fits.

3. **Missing primitive** — If the needed block is not in **`src/components/ui`**, add it from the registry (run from **repo root**):

   ```bash
   npx shadcn@latest add <component>
   ```

   Use the CLI rather than pasting snippets from random docs versions so **`components.json`** (style, aliases, CSS path) stays authoritative.

4. **Customization** — After `add`, adjust the generated file to match project patterns (**`cn()`** from **`@/lib/utils`**, `cva` variants, forward refs) and keep behavior accessible (labels, focus rings, disabled states).

5. **New custom components** — Prefer colocating feature-specific pieces under the route per **`nextjs-web-screen-composition`**; keep shared primitives in **`@/components/ui`** or **`@/components`** only when reused.

## Tailwind usage

- Prefer **utility-first** composition on top of shadcn primitives; keep spacing and type scales consistent with existing screens.
- Use **dark mode** via the **`.dark`** class on **`html`** (variables already defined in **`globals.css`**); avoid hard-coded light-only grays for elements that should adapt.

## Cross-skills

- **Copy** — All user-visible strings → **`messages/*.json`** and **next-intl** (**`nextjs-web-i18n`**): **`useTranslations()`** with no args and full dotted keys in each client component that renders copy; do not thread **`t`** through props unless the i18n skill says otherwise.
- **Imports** — **`@/…`** only for **`src/`** code (**`nextjs-src-imports`**).

## Where to look

- Global styles & tokens: **`src/app/globals.css`**
- Fonts on document: **`src/app/layout.tsx`**
- shadcn config: **`components.json`**
- UI primitives: **`src/components/ui/`**
- **`cn`**: **`src/lib/utils.ts`**
- Motion dependency: **`package.json`** (`motion`); [Motion — React](https://motion.dev/docs/react) for APIs and examples.
