# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This is a **documentation-only repository** — no application code is scaffolded yet. The stack, architecture, design system, and product scope are fully locked in `docs/`.

Because there is no `package.json` yet, there are no build/lint/test commands to run. The intended toolchain and pipeline are specified in `docs/tech/design.md` §3.7–§3.8 — follow it when scaffolding; do not invent alternatives.

## Source-of-truth documents

Read these before planning or building any feature. Each is authoritative for its domain:

- `docs/tech/design.md` — architecture, runtime boundaries, conventions, contact flow, security, testing, CI/CD, and the full alternatives-considered table. The technical authority.
- `docs/product/prd.md` — scope (FR/NFR IDs), personas, journeys, business rules (BR-1..3), edge cases (EC-1..3), milestones.
- `docs/product/brief.md` — one-page product summary.
- `docs/design/DESIGN.md` — visual identity and design tokens (frontmatter holds the token values; body holds the rules and do/don'ts). The design authority.
- `docs/design/blueprint.md` — design-blind layout: region tree per surface (home/work/project) and screen flow. The structure authority.
- `docs/design/copy.yaml` — site copy payload.
- `docs/design/wireframe.html`, `docs/design/styleguide.html` — rendered lo-fi wireframe and token styleguide.

When a doc and this file disagree, the doc wins. Change specs via the `spec-driven` skill.

## Planned architecture (per design.md)

- **Astro hybrid app on Cloudflare Pages (workerd runtime).** All content pages prerender to static HTML. The **only** on-demand route is the contact Action (`export const prerender = false`).
- **Preact islands** for the ~4 interactive pieces only: theme toggle, contact form, language switcher, mobile nav. No React on the client; React is server-only via react-email.
- **Content layer** under `src/content/`: a `projects` MDX collection (one case study per folder, colocated images) + per-section YAML copy collections, both validated by a shared `schemas.ts` (Zod).
- **Contact flow:** Zod validate → honeypot + Workers rate-limit binding (5 req / 10 min per IP, keyed on `CF-Connecting-IP`) → send two transactional emails via Resend → discard. No database, nothing persisted or logged. The visitor's email is set as `Reply-To`. The form must work without JS (progressive enhancement); the island only enhances it. On failure, surface a direct fallback channel (EC-2).
- **External services:** Resend (outbound email), Cloudflare Email Routing (`contato@adeonir.dev` → Gmail), Umami Cloud (cookieless analytics — work views + a custom contact-submission event + UTM).
- **Styling:** Tailwind consuming the existing dual-skin design tokens — do not hardcode hex values.
- **UI primitives:** Ark UI (`@ark-ui/preact`), scaffolded via the `ark-ui` MCP server. Wire every component to the dual-skin tokens; never keep a default palette. Audit against the design do/don'ts after scaffolding. Docs: https://ark-ui.com/llms.txt

## Conventions (per design.md §3.3)

- **Files:** `kebab-case`. **Component default export:** `PascalCase` (`project-card.astro` → `ProjectCard`). Slugs, folders, routes lowercase.
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
- `src/pages/index.astro` / `public/logo.svg` — holding page served at `/` until the real landing ships.
- Figma source: https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir
