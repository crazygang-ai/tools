# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Constraints

- 使用中文回复；技术术语、专有名词、缩写、代码标识符等保留英文原文。

## Commands

Package manager is **pnpm** (lockfile is `pnpm-lock.yaml`).

```bash
pnpm dev            # Vite dev server at http://localhost:5173
pnpm build          # tsc -b (project references) + vite build — both must pass
pnpm preview        # serve dist/, exercises real Service Worker
pnpm test           # vitest run (CI-style, exits)
pnpm test:watch     # vitest watch mode
pnpm lint           # eslint . (flat config in eslint.config.js)
pnpm format         # prettier -w on src/**/*.{ts,tsx,css,json}
```

Run a single test file or a single case:

```bash
pnpm test tests/tools/base64.test.ts
pnpm test -t "roundtrips UTF-8"
```

Vitest config lives inside `vite.config.ts` (jsdom environment, globals enabled, setup file `src/test-setup.ts`). The `@/` alias resolves to `src/`.

## Architecture

This is a **client-only PWA** of in-browser developer tools. There is no backend — everything (hashing, encryption, formatting, image conversion, code rendering) runs in the user's browser. Keep it that way: no telemetry, no remote calls.

### Single source of truth: the tool registry

`src/tools/registry.ts` is the central data structure. Every tool is one entry in the `TOOLS: ToolMeta[]` array with:

- `slug` — URL segment under `/tools/:slug` and i18n key under `tools.<slug>`
- `category` — one of the 5 ids in `src/tools/categories.ts` (`security` | `image` | `format` | `text` | `cheatsheet`)
- `icon` — a `lucide-react` icon
- `component` — `lazy(() => import('@/tools/<cat>/<Name>'))`. **Always lazy.** Each tool is its own route-level chunk; the home page only loads metadata.
- `keywords` — used by the ⌘K command palette (`src/components/CommandPalette.tsx`) for fuzzy search beyond title/desc.

`getToolBySlug` / `getToolsByCategory` are the read helpers consumed by pages.

### Routing & page shell

`src/App.tsx` defines four routes inside a single `<Layout>`: `/`, `/category/:id`, `/tools/:slug`, `*`. `ToolDetailPage` looks up the slug in the registry, then renders `<ToolPage>` (header + breadcrumb + i18n title/desc) wrapping a `<Suspense>` boundary around the lazy component. If a registry entry has no `component` field, the page renders a "coming soon" placeholder — that's the intended behavior, not a bug.

### Pure-function libs split out for testing

Tools that contain non-trivial logic split it into a sibling `*.lib.ts` file (examples: `security/base64.lib.ts`, `security/password.lib.ts`, `format/jsonDiff.lib.ts`, `format/jsonToGo.lib.ts`, `text/case.lib.ts`, `text/color.lib.ts`, `text/cron.lib.ts`, `text/asciiArt.lib.ts`, `image/codeSnapshot.lib.ts`). The React component imports from the lib; tests in `tests/tools/*.test.ts` import the lib directly. **When adding non-trivial logic to a new tool, follow this split** — the tests must not need to render React.

### Shared components for repeated patterns

- `src/components/FormatTool.tsx` — generic format/minify two-pane UI; pass `format(input, indent)` and `minify(input)` callbacks. Used by `JsonFormat`.
- `src/components/BiConvert.tsx` — generic bidirectional converter (left ↔ right textareas with a swap button). Used by `JsonConvert` (target format selectable from YAML / XML / TOML / CSV).
- `src/components/ToolPage.tsx` — every tool detail page is wrapped in this; sets the document title via `useDocumentTitle`.
- `src/components/ui/*` — primitives (`Button`, `Input`, `Tabs`, `CopyButton`, `Dropzone`, `FieldHeader`, `Card`).

### Cross-cutting concerns

- **i18n** — `react-i18next` with two namespaces: `common` and `tools`. Locales live in `src/i18n/locales/{zh,en}/{common,tools}.json`. Detection is `localStorage` (key `tools.lang`) → browser. Tool strings are `tools.<slug>.title / desc / ...`.
- **Theme** — `src/lib/theme.tsx` (`ThemeProvider` wrapping the whole app in `main.tsx`). Three modes: `light` / `dark` / `system`. The `system` choice removes the localStorage key (`tools.theme`) and listens to `prefers-color-scheme` changes; explicit choices write the key. Tailwind `darkMode: 'class'` is toggled on `<html>`.
- **Local state** — `src/lib/useLocalState.ts` is a tiny `useState` wrapper that persists each value to `localStorage` under the key `tools.state.<key>`. Use it for any tool input the user might want preserved across reloads (regex pattern, color input, cron expression, etc.). API: `const [v, setV] = useLocalState('regex.pattern', '')`. There's no codec / debounce / size cap — `JSON.stringify` + localStorage handle everything, and writes silently degrade to in-memory if storage is unavailable or quota is hit. The project is local-only, so we deliberately do **not** expose tool state via URL.
- **Clipboard helpers** — `src/lib/copy.ts` exports `copyText(string)` (text via `navigator.clipboard.writeText` with a legacy `execCommand` fallback), `downloadBlob(blob, filename)`, and `copyBlob(blob)` (image / arbitrary MIME via `ClipboardItem`). `copyBlob` returns `false` when the browser refuses (older Safari, insecure context, Firefox without the pref) so callers can fall back to `downloadBlob` + a toast — never silently fail.
- **PWA** — `vite-plugin-pwa` with `registerType: 'autoUpdate'` (configured in `vite.config.ts`). Service Worker only runs in production builds; verify with `pnpm preview`, not `pnpm dev`. Heavy lazy-loaded chunks (shiki WASM, language grammars, themes, figlet fonts, etc.) are kept **out of the precache** via `workbox.globIgnores` and served by `workbox.runtimeCaching` (`CacheFirst`) — first-install size stays under ~1 MB while still caching them once visited. When you add a new big lazy dependency, update `globIgnores` so it doesn't bloat the precache.
- **Image export** — when a tool needs to rasterize DOM to PNG, use `html-to-image`'s `toPng(node, { pixelRatio })` plus `getFontEmbedCSS(node)` to inline any web fonts. Bundled web fonts come from `@fontsource/<family>/latin-400.css?inline` (CSS as a string injected into a `<style>` we own); after attaching, `await document.fonts.ready` before the first capture or the PNG falls back to the system stack. See `src/tools/image/CodeSnapshot.tsx` for the canonical pattern.

## Adding a new tool

1. Create `src/tools/<category>/<Name>.tsx`. If it has non-trivial logic, also create `<name>.lib.ts` exporting pure functions.
2. In `src/tools/registry.ts`: add `const X = lazy(() => import('@/tools/<category>/<Name>'))` near the other lazy imports, then either set `component: X` on the existing slug entry or push a new `ToolMeta` object.
3. Add `<slug>.title` / `<slug>.desc` (and any tool-specific keys) to **both** `src/i18n/locales/zh/tools.json` and `src/i18n/locales/en/tools.json`.
4. If there's a lib, add `tests/tools/<name>.test.ts` importing from `@/tools/<category>/<name>.lib`.
5. Visit `/tools/<slug>` in `pnpm dev` and confirm `pnpm test` + `pnpm build` are clean.

## Conventions

- TypeScript is strict with `noUnusedLocals` / `noUnusedParameters` / `verbatimModuleSyntax` / `erasableSyntaxOnly`. Use `import type` for type-only imports.
- Path alias: import via `@/...` (configured in both `tsconfig.app.json` and `vite.config.ts`).
- Prettier: single quotes, semicolons, trailing commas, 100-char width, 2-space tabs.
- `cn()` from `@/lib/cn` is the standard `clsx` + `tailwind-merge` helper for conditional class composition.
