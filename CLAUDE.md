# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

The Astro app has its **document-shell, metadata/SEO, and analytics baseline wired, but the content pages are not built out**: tooling, runtime integrations, the routing skeleton, the full design-token + font layer (`src/styles/global.css`), and a shared base layout (`src/layouts/base.astro`) — which emits the per-page head (page-first title template, Open Graph, X card, canonical, icons) and mounts config-gated cookieless analytics — are in place, plus the crawl files (generated sitemap + `robots.txt`) and the content-layer scaffolding (a `settings` metadata collection). The real site pages (home/work/project) do not exist yet. A holding page (`/`) and a dev-only landing stub ship today, both rendered through the base layout. The stack, architecture, design system, and product scope remain fully locked in `docs/` — `docs/tech/design.md` §3.7–§3.8 is authoritative for the toolchain; do not invent alternatives.

Package manager is **pnpm** (`pnpm-lock.yaml`). No test runner is configured yet — there are no test commands.

## Commands

- `pnpm dev` — Astro dev server. Middleware rewrites `/` to the dev-only landing surface (see below).
- `pnpm build` — production build. Holding page stays at `/`; the `_landing` route 404s (excluded from prod).
- `pnpm preview` — serve the production build locally.
- `pnpm typecheck` — `astro check` (TS + `.astro` diagnostics).
- `pnpm lint` — CI-style, no writes: `biome check` (JS/TS/CSS/JSON) + `prettier --check` (`.astro`/`.yaml`). Run before committing.
- `pnpm lint:fix` — autofix: `biome check --write` (JS/TS/CSS/JSON) + `prettier --write` (`.astro`/`.yaml`).

There are **no deploy commands** — deploys run through the Cloudflare Pages **git integration** on the project `adeonir`: a push to `main` builds and publishes production (`adeonir.dev`), and every branch/PR gets an automatic preview deployment on `*.adeonir.pages.dev`. Build settings (command `pnpm build`, output `dist`) and per-environment variables live in the Pages dashboard, not in the repo: `PREVIEW=true` is set on the **preview** environment only, so preview builds serve the landing surface while production serves the holding page. `pnpm-workspace.yaml` `allowBuilds` must hold only resolved `true`/`false` values for deps present in the tree — an unresolved placeholder there hard-crashes **every** `pnpm run` via the pre-run deps check.

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
- **React islands** (`@astrojs/react`) for the ~4 interactive pieces only: theme toggle, contact form, language switcher, mobile nav — hydration deferred via `client:*` directives. Runtime decision recorded in `docs/adr/001-react-islands-runtime.md`.
- **Content layer** under `src/content/`: the scaffolding is wired (`src/content.config.ts` + `src/content/schemas.ts`) with a `settings` collection (site metadata via the `file()` loader). Still planned on the same scaffolding: a `projects` MDX collection (one case study per folder, colocated images) + per-section YAML copy collections, validated by the same shared `schemas.ts` (Zod).
- **Contact flow:** Zod validate → honeypot + Workers rate-limit binding (5 req / 10 min per IP, keyed on `CF-Connecting-IP`) → send two transactional emails via Resend → discard. No database, nothing persisted or logged. The visitor's email is set as `Reply-To`. The form must work without JS (progressive enhancement); the island only enhances it. On failure, surface a direct fallback channel (EC-2).
- **External services:** Resend (outbound email), a hosted mailbox on `adeonir.dev` (inbound `contato@adeonir.dev`), PostHog (cookieless, privacy-first analytics — pageviews + UTM, no device storage).
- **Styling (wired):** Tailwind v4 CSS-first in `src/styles/global.css` — raw Catppuccin scales as plain `:root` vars in **oklch**, semantic roles aliased per skin (dark on `:root`, latte under `[data-theme=light]`) and exposed via `@theme inline` so a runtime skin flip re-resolves with no rebuild, a skin-neutral `--ink` for text on accent fills, plus nine `@utility text-*` type-role composites. Style against the semantic utilities (`bg-background`, `text-foreground`, `text-display`) — never hardcode hex.
- **UI primitives:** Ark UI (`@ark-ui/react`), scaffolded via the `ark-ui` MCP server. Wire every component to the dual-skin tokens; never keep a default palette. Audit against the design do/don'ts after scaffolding. Docs: https://ark-ui.com/llms.txt

## Conventions (per design.md §3.3)

- **Files:** `kebab-case`. **Component export:** `PascalCase` — `.tsx` components use a named export (`export function Button`); `.astro` components are the file's implicit default (`project-card.astro` → `ProjectCard`). Slugs, folders, routes lowercase.
- **Component tiers** — four directories, each with a distinct role:
  - `src/components/` — `.astro` for server-side composition; `.tsx` for stateful React reused inside islands
  - `src/components/islands/` — React hydration boundaries; used with `client:*` in templates
  - `src/components/sections/` — `.astro` files for each page section
  - `src/components/ui/` — styled primitives, no state, semantic tokens only; built on the Ark UI factory (`ark.<element>`) by default so each is polymorphic and accepts `asChild` — whether it wraps an Ark primitive or a plain element. Drop to a bare HTML element only for a trivial primitive that never needs `asChild`
  Use `/new-component` skill to scaffold any tier.
- **`src/lib/`** — shared pure helpers, no JSX (e.g. `cn` class composer).
- **Imports:** `~/` alias (resolves to `src/`, per `tsconfig.json`) for any cross-directory import; reserve `./`/`../` for same-directory files. JSX is React (`jsxImportSource: react`); use `className` in `.tsx`, `class` in `.astro`.
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
- `src/pages/index.astro` / `public/logo.svg` — holding page served at `/` until the real landing ships; now rendered through the base `Layout` (passes `title="Portfólio"`), centered logo, semantic tokens only.
- `src/layouts/base.astro` (default import `Layout`) — the shared document shell: `<html lang>` + `<body>` token classes, head built with `astro-seo`'s `<SEO>` (page-first title template `{title} | {siteName}`, Open Graph, `twitter:card=summary_large_image`, absolute canonical/og:image from `Astro.site`), hand-rolled favicon/apple-touch/manifest links, and `<Analytics />`. Props: required `title`, optional `description`/`image`/`noindex`. Adopt this for every new page.
- `src/content.config.ts` + `src/content/schemas.ts` + `src/content/settings.yaml` — content-layer scaffolding; the `settings` collection (`file()` loader) holds site metadata (`siteName`, `description`, `ogImage`, `locale`), read via `getEntry('settings', 'metadata')`. The per-section copy work extends these files — do not recreate them.
- `src/components/analytics.astro` — config-gated cookieless PostHog `<script is:inline>`, emitted only when `POSTHOG_KEY` is set (`astro:env/client`; `POSTHOG_HOST` defaults to the first-party reverse proxy `https://t.adeonir.dev`, see PR #19). The official array-stub snippet async-loads the client (`/static/array.js` from the derived assets host) and calls `posthog.init` hardened cookieless (`cookieless_mode: 'always'`, memory persistence + `disable_persistence`, autocapture/session-recording/surveys off, `respect_dnt`, `advanced_disable_flags`); pageview-on-load stays on (one UTM-attributed `$pageview` per load). Inert (no script, no request) when the key is unset. The key lives in env (gitignored `.env` locally + Cloudflare Pages env in prod), never in source.
- `astro.config.mjs` — sets `site` (`https://adeonir.dev`), the `@astrojs/sitemap` integration (`filter` drops `/styleguide`), and the `env.schema` for the two public client PostHog vars (`POSTHOG_KEY` optional — gates emission; `POSTHOG_HOST` defaults to `https://t.adeonir.dev`, the first-party reverse proxy) plus a server `PREVIEW` boolean (gates the preview-build landing), alongside the `landing()` integration (injects `/_landing` under `astro dev` or a preview build).
- `public/robots.txt` + generated sitemap — robots (`Allow: /`, `Disallow: /styleguide`) points at `sitemap-index.xml`. Owner icon/OG assets (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192/512/maskable-512.png`, `og-image.png`, `site.webmanifest`) live in `public/`.
- `src/styles/global.css` — the wired design layer: `@import "tailwindcss"` + self-hosted Geist/Fira Code variable fonts (`@fontsource-variable/*`, same-origin), raw oklch scales, dual-skin semantic roles via `@theme inline`, `@theme` fonts + `--breakpoint-xs`, and the `text-*` type utilities. Import it wherever styles are needed.
- **Landing surface (dev + preview)** — three files cooperate so the landing renders at `/` in dev and in preview builds without shipping to production: `src/pages/_landing.astro` (the stub; `_`-prefix keeps it out of the prod build), the `landing()` integration in `astro.config.mjs` (injects the `/_landing` route under `astro dev` or when `PREVIEW=true`), and `src/middleware.ts` (rewrites `/` → `/_landing` when `import.meta.env.DEV` or the `PREVIEW` flag is set). All no-op in a normal build, where `/` stays the holding page. `PREVIEW=true` is set per-environment in the Pages dashboard (preview only), so preview deployments serve the landing while production builds — same repo, no flag — keep the holding page. Preview deployments are kept out of search indexes by Cloudflare's default `X-Robots-Tag: noindex`. Throwaway — retire when the landing becomes the prod home.
- Figma source: https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir
