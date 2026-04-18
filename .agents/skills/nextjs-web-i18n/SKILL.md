---
name: nextjs-web-i18n
description: >-
  Use when adding or editing user-visible copy, labels, placeholders, toasts,
  accessibility strings, metadata, or navigation titles in a Next.js web app.
  Ensures strings live in messages/*.json and are read via next-intl
  (useTranslations / getTranslations) instead of inline literals. Prefer t.rich
  when copy combines multiple styled segments or needs locale-safe reordering
  with interpolation.
---

# Next.js web — internationalization (next-intl)

The app resolves the active locale from the **`NEXT_LOCALE`** cookie (see **`src/i18n/request.ts`**) and loads messages from **`messages/<locale>.json`**. **`next-intl`** is wired through **`createNextIntlPlugin()`** in **`next.config.ts`** (default request config path: **`src/i18n/request.ts`**). Supported locales and the default are defined in **`src/i18n/config.ts`** (`locales`, `defaultLocale`).

The root layout passes **`locale`** and **`messages`** into **`NextIntlClientProvider`** via **`src/app/providers.tsx`**.

## Rules

1. **No user-facing string literals in UI code** — Any copy shown to users (including buttons, headings, form labels, placeholders, validation messages, toast text, `aria-label` / `aria-description`, and document titles) belongs in **`messages/<locale>.json`** for each supported locale, not hard-coded in TSX/TS.

2. **Client components: `useTranslations()`** — In client components, always call **`useTranslations()`** with **no namespace argument**. Use **dotted keys** that mirror the JSON hierarchy (e.g. **`home.title`**, **`legal.terms`**).

   ```tsx
   import { useTranslations } from 'next-intl';

   const t = useTranslations();

   return <h1>{t('home.title')}</h1>;
   ```

   Use **`t('key', { var: value })`** for interpolation.

   **Per component:** Any **Client Component** that needs copy should call **`useTranslations()`** inside that component (including small helpers in the same file that are still React function components). **Do not** pass **`t`** through props just to reuse the hook from a parent — call **`useTranslations()`** again in the child. Multiple **`useTranslations()`** calls in one file (parent + local subcomponents) are expected and fine.

   **Threading `t` only when needed:** Pass a translator as an argument only for a concrete reason (e.g. a non-component module, tests with an injected mock, or a callback factory that cannot call hooks). Prefer colocating **`useTranslations()`** with the JSX that consumes **`t`**.

3. **Server components & metadata: `getTranslations()`** — In async Server Components, `generateMetadata`, and route handlers that need copy, use **`await getTranslations({ locale })`** without a **`namespace`** option; use **dotted keys** on **`t`** the same way as on the client.

   ```tsx
   import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

   const locale = await getLocale();
   setRequestLocale(locale);
   const t = await getTranslations({ locale });
   ```

   Follow the same **`setRequestLocale(locale)`** pattern as in **`src/app/layout.tsx`** and **`src/app/page.tsx`** when you rely on locale-aware static rendering.

4. **Rich copy: prefer `t.rich()` over stitching multiple `t()` calls** — When a single sentence mixes **different styles**, **links**, or might need **word order to change per locale**, use **one message** with **XML-like tags** and render with **`t.rich()`** (see [next-intl rich text](https://next-intl.dev/docs/usage/translations#rich-text)).

   - **Messages** — e.g. `"terms": "Please read our <link>terms of service</link>."` or combine tags with ICU placeholders when needed.

   - **React / DOM** — Map each tag name to a function that receives `chunks` and returns an element. Interpolation values are passed in the same object as the tag renderers:

   ```tsx
   const t = useTranslations();

   t.rich('legal.terms', {
     link: chunks => <Link href="/terms">{chunks}</Link>,
   });
   ```

   Do **not** concatenate several `t()` results or interleave raw string literals for these cases.

5. **Add keys to message files first** — When introducing new UI text, add a nested key under a logical namespace (e.g. **`auth.signIn.*`**, **`home.*`**, **`meta.*`**) and reference that key from code. Keep JSON valid; prefer clear hierarchy over flat mega-keys.

6. **What stays out of `messages/`** — Non-display constants are fine as code: URLs, enum/internal identifiers, route paths, design tokens, technical config. If a string is ever shown to the user, move it to messages.

7. **Metadata and titles** — Use **`getTranslations`** in **`generateMetadata`** (as in **`src/app/layout.tsx`**) so titles and descriptions stay translatable. Avoid static string literals in metadata objects.

8. **Adding locales** — Supported locales are listed in **`src/i18n/config.ts`**. Adding a new language means:

   - New file **`messages/<locale>.json`** with the same key structure as the default locale file.
   - Update **`i18nConfig.locales`** (and any narrowing types such as the cast in **`src/i18n/request.ts`**) if you add or remove locale codes.
   - Ensure **`NEXT_LOCALE`** cookie values align with **`i18nConfig.locales`**.

## Where to look

- Messages: **`messages/`** (one JSON file per locale)
- Request / load messages: **`src/i18n/request.ts`**
- Locales: **`src/i18n/config.ts`**, **`src/i18n/constants.ts`**
- Provider: **`src/app/providers.tsx`**
- Root layout + metadata: **`src/app/layout.tsx`**
- Editor hints: **`.vscode/settings.json`** (`i18n-ally.localesPaths`: **`messages`**)
