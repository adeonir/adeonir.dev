# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

The Astro app is **scaffolded with the design system wired in, but the pages are not built out**: tooling, runtime integrations, the routing skeleton, and the full design-token + font layer (`src/styles/global.css`) are in place; the real site pages (home/work/project) do not exist yet. Only a holding page (`/`) and a dev-only landing stub ship today. The stack, architecture, design system, and product scope remain fully locked in `docs/` — `docs/tech/design.md` §3.7–§3.8 is authoritative for the toolchain; do not invent alternatives.

Package manager is **pnpm** (`pnpm-lock.yaml`). No test runner is configured yet — there are no test commands.

## Commands

- `pnpm dev` — Astro dev server. Middleware rewrites `/` to the dev-only landing surface (see below).
- `pnpm build` — production build. Holding page stays at `/`; the `_landing` route 404s (excluded from prod).
- `pnpm preview` — serve the production build locally.
- `pnpm typecheck` — `astro check` (TS + `.astro` diagnostics).
- `pnpm lint` — autofix: `biome check --write` (JS/TS/CSS/JSON) + `prettier --write` (`.astro`/`.yaml`).
- `pnpm check` — CI-style, no writes: `biome check` + `prettier --check`. Run before committing.

Formatting is split by file type: **Biome** owns JS/TS/CSS/JSON (`.astro` is excluded in `biome.json`; CSS is double-quoted via `css.formatter` with `css.parser.tailwindDirectives` enabled for the Tailwind v4 at-rules, and `**/*.css` is in `.prettierignore` so Prettier never touches it); **Prettier** owns `.astro`/`.yaml`. Tailwind class sorting follows the same split — Biome `useSortedClasses` (functions `cn`/`clsx`/`cva`/`tv`) for code, `prettier-plugin-tailwindcss` for `.astro`. Lefthook runs both on staged files pre-commit.

## Source-of-truth documents

Read these before planning or building any feature. Each is authoritative for its domain:

- `docs/tech/design.md` — architecture, runtime boundaries, conventions, contact flow, security, testing, CI/CD, and the full alternatives-considered table. The technical authority.
- `docs/product/prd.md` — scope (FR/NFR IDs), personas, journeys, business rules (BR-1..3), edge cases (EC-1..3), milestones.
- `docs/product/brief.md` — one-page product summary.
- `docs/design/DESIGN.md` — visual identity and design tokens (frontmatter holds the token values — colors as dual `{ hex, oklch }`; body holds the rules and do/don'ts). The design authority.
- `docs/design/blueprint.md` — design-blind layout: region tree per surface (home/work/project) and screen flow. The structure authority.
- `docs/design/copy.yaml` — site copy payload.
- `docs/design/wireframe.html`, `docs/design/styleguide.html` — rendered lo-fi wireframe and token styleguide.

When a doc and this file disagree, the doc wins. Change specs via the `spec-driven` skill.

## Planned architecture (per design.md)

- **Astro hybrid app on Cloudflare Pages (workerd runtime).** All content pages prerender to static HTML. The **only** on-demand route is the contact Action (`export const prerender = false`).
- **Preact islands** for the ~4 interactive pieces only: theme toggle, contact form, language switcher, mobile nav. No React on the client; React is server-only via react-email.
- **Content layer** under `src/content/`: a `projects` MDX collection (one case study per folder, colocated images) + per-section YAML copy collections, both validated by a shared `schemas.ts` (Zod).
- **Contact flow:** Zod validate → honeypot + Workers rate-limit binding (5 req / 10 min per IP, keyed on `CF-Connecting-IP`) → send two transactional emails via Resend → discard. No database, nothing persisted or logged. The visitor's email is set as `Reply-To`. The form must work without JS (progressive enhancement); the island only enhances it. On failure, surface a direct fallback channel (EC-2).
- **External services:** Resend (outbound email), a hosted mailbox on `adeonir.dev` (inbound `contato@adeonir.dev`), Umami Cloud (cookieless analytics — work views + a custom contact-submission event + UTM).
- **Styling (wired):** Tailwind v4 CSS-first in `src/styles/global.css` — raw Catppuccin scales as plain `:root` vars in **oklch**, semantic roles aliased per skin (dark on `:root`, latte under `[data-theme=light]`) and exposed via `@theme inline` so a runtime skin flip re-resolves with no rebuild, a skin-neutral `--ink` for text on accent fills, plus nine `@utility text-*` type-role composites. Style against the semantic utilities (`bg-background`, `text-foreground`, `text-display`) — never hardcode hex.
- **UI primitives:** Ark UI (`@ark-ui/preact`), scaffolded via the `ark-ui` MCP server. Wire every component to the dual-skin tokens; never keep a default palette. Audit against the design do/don'ts after scaffolding. Docs: https://ark-ui.com/llms.txt

## Conventions (per design.md §3.3)

- **Files:** `kebab-case`. **Component default export:** `PascalCase` (`project-card.astro` → `ProjectCard`). Slugs, folders, routes lowercase.
- **Imports:** `~/` alias (resolves to `src/`, per `tsconfig.json`) for any cross-directory import; reserve `./`/`../` for same-directory files. JSX is Preact (`jsxImportSource: preact`) — no React on the client.
- **Local conventions in `.claude/rules/`** are auto-loaded and enforced: kebab-case filenames, `~/` alias imports, Tailwind canonical shorthand over arbitrary values, and commit/PR-merge format. Read them before large edits.
- **Routing / i18n:** routing-based, `i18n.routing.prefixDefaultLocale = false`. Portuguese is the default and ships bare at `/`, `/work`, `/work/[slug]`, `/404`; English mirrors under `/en/...`. Locale keys are `pt`/`en` but emitted `lang`/`hreflang` are `pt-BR`/`en` (decoupled). Build localized links with `getRelativeLocaleUrl()`. No client-side language switching, no browser auto-detect.
- **Localized content:** default locale is bare (`*.yaml`, `index.mdx`); English carries an `.en` suffix (`*.en.yaml`, `index.en.mdx`). Cover/gallery images are shared across locales.
- **Quality budget (CI-enforced gate):** mobile Lighthouse Performance ≥ 95, Accessibility/Best-Practices/SEO 100; LCP < 2.0s, CLS < 0.1, INP < 200ms; WCAG 2.1 AA. Builds fail on regression.

## Design system essentials (per DESIGN.md)

- **Two skins of one identity:** dark is default (`mocha`/Catppuccin scale), light is the counterpart (`latte` scale). Steps are position-numbered so the same step is the same role in both skins.
- **Two accents, two jobs:** `primary` (blue — `stream` dark / `ocean` light) **acts** — it owns every interactive cue (CTA, link, focus ring, hover). `secondary` (pink — `azalea` dark / `hibiscus` light) only **points** — static emphasis on text, never interactive.
- **Hard don'ts:** no gradients, glows, or a third accent; pink never acts (no pink buttons/links/focus); separate surfaces with a tone drop + hairline `border` before any shadow; never pure `#000`/`#fff`.
- **Type:** Geist for everything (display→caption), Fira Code only for genuinely technical content.

## Delivery & tracking

- Work is tracked on GitHub Issues (repo `adeonir/adeonir.dev`), milestones + sub-issues, labels-only (no Issue Types). Use the `epic-tracker` skill for epic/story changes.

## Notable repo files

- `.mcp.json` — declares the `ark-ui` MCP server (`@ark-ui/mcp`), used to scaffold UI primitives. See UI primitives below.
- `.artifacts/` — scratch space (design variant HTML, epic/story drafts, a Pencil `.pen` file). Not shipped; not authoritative — `docs/` is.
- `src/pages/index.astro` / `public/logo.svg` — holding page served at `/` until the real landing ships (styled with the `bg-background` token, no hardcoded hex).
- `src/styles/global.css` — the wired design layer: `@import "tailwindcss"` + self-hosted Geist/Fira Code variable fonts (`@fontsource-variable/*`, same-origin), raw oklch scales, dual-skin semantic roles via `@theme inline`, `@theme` fonts + `--breakpoint-xs`, and the `text-*` type utilities. Import it wherever styles are needed.
- **Dev-only landing surface** — three files cooperate so the landing can be assembled at `/` in dev without shipping in prod: `src/pages/_landing.astro` (the stub; `_`-prefix keeps it out of the prod build), the `landing()` integration in `astro.config.mjs` (injects the `/_landing` route only under `astro dev`), and `src/middleware.ts` (rewrites `/` → `/_landing` guarded by `import.meta.env.DEV`). All three no-op in production.
- Figma source: https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir
