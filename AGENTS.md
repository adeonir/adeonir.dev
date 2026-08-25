# AGENTS.md

This file is the canonical guide for coding agents working on `adeonir.dev`. Read it before modifying code, adding features, or running project commands.

It holds what the code cannot answer: the decisions, the prohibitions, the placement rules, and which document is authoritative. Anything the code already states — file listings, dependency versions, config contents, token values — is read from the code, not from here.

## Repository overview

`adeonir.dev` is a personal portfolio for a frontend developer positioned around design and code. The site is in Portuguese. An English locale and the work case studies are planned but not built; `docs/product/prd.md` carries that scope.

The site is an Astro application deployed as an SSR Worker on Cloudflare. Pages are content-driven and prerendered to static HTML. The contact Action is the only on-demand server surface.

## Technology stack

- **Framework:** Astro with `@astrojs/cloudflare`
- **UI islands:** React through `@astrojs/react`, hydrated with `client:*` directives
- **Styling:** Tailwind CSS with CSS-first configuration in `src/styles/global.css`
- **UI primitives:** Ark UI React, using the Ark factory where a primitive must support `asChild`
- **Tests:** Vitest with happy-dom, co-located with source files
- **Email:** React Email templates delivered through Resend
- **Analytics:** PostHog in cookieless mode, gated by `POSTHOG_KEY`
- **Package manager:** pnpm, pinned by `packageManager` in `package.json`

Read `package.json` for versions and for anything not listed here.

## Commands and local workflow

```bash
pnpm dev          # Start the Astro dev server
pnpm build        # Build the production site into dist/
pnpm preview      # Preview the production build locally
pnpm typecheck    # Run astro check
pnpm test         # Run the Vitest unit suite
pnpm lint         # Read-only Biome and Prettier checks
pnpm lint:fix     # Apply Biome and Prettier fixes
pnpm lighthouse   # Build and run the budget gate
pnpm email        # Start the React Email development server
pnpm gates        # Run typecheck and the write-enabled lint task
```

Add `--collect.settings.preset=desktop` to `pnpm lighthouse` for a desktop pass. Install the git hooks with `lefthook install`.

## Source-of-truth documents

Before planning or building a feature, read the documents that apply to the work:

- `CONTEXT.md` — the project's shared memory: what a silent failure costs, the durable conventions and decisions, the domain terms, and the traps this codebase has already hit.
- `docs/tech/design-doc.md` — the technical authority: architecture, runtime boundaries, contact flow, security, testing, and CI/CD.
- `docs/product/prd.md` — scope, FR/NFR identifiers, personas, journeys, business rules, and edge cases.
- `docs/product/brief.md` — one-page product summary.
- `DESIGN.md` — the authority on the visual identity and the design tokens.
- `docs/design/blueprint.md` — layout region trees and screen flows.
- `docs/design/copy.yaml` — canonical site copy. `docs/design/copy.en.yaml` holds the drafted English translation, which no route renders yet.
- `docs/design/wireframe.html` — rendered wireframe. The token styleguide is the live `/styleguide` route, built from `src/pages/styleguide.astro`.
- `docs/adr/` — the accepted architecture decisions: the React island runtime, the theme-switching mechanism, the nanostores island state layer, and SSR-safe island rendering.

When a project document and this file disagree, the dedicated document takes precedence. Change feature specifications with the `spec-driven` skill. The `.artifacts/` directory is scratch space and is not a source of truth.

## Project rules

Read the matching rule before making the change:

| When | Read |
|---|---|
| Creating or renaming source files under `src/` | `.agents/rules/kebab-case-filenames.md` |
| Choosing Tailwind utility classes in source files | `.agents/rules/tailwind-canonical-classes.md` |
| Naming highlight fields or rendering highlighted text | `.agents/rules/text-highlight-segments.md` |
| Importing modules across `src/` directories | `.agents/rules/tilde-alias-imports.md` |

## Agent hooks

- `.agents/hooks/` is the source of truth for project agent hooks. Edit hook logic only there.
- `.claude/settings.json` registers these hooks for Claude Code; `.codex/hooks.json` registers them for Codex.
- After adding or changing a Codex hook, review and trust it with `/hooks`.

## Agent skills

`.github/skills/code-review/SKILL.md` gives the Copilot cloud reviewer its project context. It is specific to that reviewer; Claude Code and Codex read this file and `.agents/rules/` instead.

## Runtime architecture

- **Astro and Cloudflare:** the site runs on the `workerd` runtime through `@astrojs/cloudflare`. Content pages prerender to static HTML. There is no standalone `/contact` page and no `prerender = false` page route.
- **React islands:** keep hydration limited to the theme toggle, contact form, mobile navigation, and footer tagline. Use deferred `client:*` directives.
- **Content layer:** the collections are `file()`-loaded YAML.
- **External services:** Resend sends outbound email, the hosted `contato@adeonir.dev` mailbox receives owner notifications, and PostHog collects cookieless analytics.
- **Bindings and context:** read Cloudflare bindings through `import { env } from 'cloudflare:workers'`. Use `Astro.locals.cfContext.waitUntil` for non-blocking work and `Astro.clientAddress` for the client IP.

### Contact flow

The contact section is on the home, and its island submits through `actions.contact()` without navigating. The Action validates, discards a honeypot submission silently, checks the rate-limit binding, sends both messages through Resend, and records a non-blocking analytics event. Read `src/actions/index.ts` for the sequence and the typed errors.

No contact data is stored. There is no database, and contact PII is never logged. The rate-limit service fails open if its binding throws, so a broken binding degrades to no limit rather than to a rejected form. The always-visible direct contact list is the fallback channel when delivery fails.

## Content, routes, and page composition

- `src/components/sections/*.astro` contains section markup only. Each section owns its own vertical spacing and wraps its content in the shared content column.
- `src/layouts/base.astro` owns the document shell, the header, and the footer. It does not set page width or inter-section spacing.
- Each section reads its own typed collection with `getEntry`. Collection keys are declared in `src/content.config.ts`.
- `docs/design/copy.yaml` is the canonical prose. Collection files carry rendering markup. Headline emphasis and controlled breaks come from the design frame, not from `copy.yaml` when that file omits them.

## Code conventions

### Naming and imports

- Use `kebab-case` for files, slugs, folders, and routes. Use PascalCase for component names.
- `.astro` components use the implicit default export. React/TSX components use named exports such as `export function Button`.
- Use the `~/` alias for imports across directories. Use `./` and `../` only within the same directory.
- JSX uses React. Use `className` in `.tsx` and `class` in `.astro`.

### Component tiers

- `src/components/` — server-side Astro composition and stateful React pieces reused by islands.
- `src/components/scripts/` — Astro components that emit only inline script side effects.
- `src/components/islands/` — React hydration boundaries mounted with `client:*` directives.
- `src/components/sections/` — Astro files for page sections.
- `src/components/styleguide/` — pieces rendered only by the `/styleguide` route.
- `src/components/ui/` — styled, stateless primitives that use semantic tokens. Prefer the Ark `ark.<element>` factory so primitives remain polymorphic and accept `asChild`; use a bare element only for a trivial primitive that never needs `asChild`.
- `src/scripts/` — client-side vanilla modules, loaded from a `<script>` tag.

Use the repository's component scaffolding workflow when creating a new component. Shared pure helpers belong in `src/helpers/` and must not contain JSX. Shared React hooks belong in `src/hooks/`.

### Styling and design system

- Style against the semantic utilities in `src/styles/global.css`. Never hardcode hex colors in components.
- Dark is the default `mocha` skin; light uses the corresponding `latte` scale. Both skins use position-matched roles.
- `primary` is the `ocean` blue and owns every interactive cue: CTA, links, hover states, and the focus border of a control. It is the only blue that acts, whether it renders as text, as a border, or as a fill. It remaps per skin — `ocean-500` on dark, `ocean-700` on light — so blue text meets AA against either surface. The focus ring itself is the separate `ring` step.
- `secondary` is the `azalea` pink and owns static emphasis only. Pink must never be a button, link, or focus state.
- Keep the palette at two accent hues and the neutrals; do not add a third accent. Separate surfaces with a tone drop before adding a shadow. Never use pure `#000` or `#fff`. `DESIGN.md` is the authority on what the identity allows.
- Use Geist for all type roles. Use Fira Code only for genuinely technical content.
- Ark UI primitives must use the dual-skin tokens and must not retain a default palette. Audit new primitives against `DESIGN.md`. Reference: https://ark-ui.com/llms.txt
- Icons use `unplugin-icons` with Tabler, for example `import IconFolder from '~icons/tabler/folder'`. Render them statically in Astro.
- Biome sorts Tailwind classes in JS/TS helper calls such as `cn`, `clsx`, `cva`, and `tv`; Prettier sorts them in Astro files.

## Configuration and formatting

- Biome owns JS, TS, CSS, and JSON. Prettier owns `.astro` and YAML. Neither reaches the other's files, so a formatting question is answered by knowing which tool owns the extension.
- `wrangler` is a direct dev dependency so its binary is available in the Workers Builds environment. Do not move it.

## Environment and security

Astro's env schema defines `POSTHOG_KEY` (optional public client key), `POSTHOG_HOST` (public client host), and `RESEND_API_KEY` (server secret).

Never put `RESEND_API_KEY` in client code, source files, or logs. Local values belong in the gitignored `.env`; use `.env.example` as the template. Production values belong in the Cloudflare dashboard.

The contact form validates with `src/validations/contact.ts` on the client and the server. The shared client schema imports the canonical `zod` package; server-only content schemas may use `astro/zod`.

PostHog runs cookieless and respects Do Not Track. Server-side contact events never include form PII and use a synthetic `distinct_id`. Analytics is inert when `POSTHOG_KEY` is unset.

The `/styleguide` and `/maintenance` routes are noindex and are excluded from the sitemap and `robots.txt` through the shared `noIndexRoutes` list. Crawl files are generated at build time; never add a static `public/robots.txt`.

## Testing, quality, and delivery

- The default Vitest environment is Node. A DOM-dependent spec opts into happy-dom with a `// @vitest-environment happy-dom` docblock.
- The quality target is mobile Lighthouse Performance ≥ 95, Accessibility, Best Practices and SEO at 100, CLS < 0.1, INP < 200ms, and WCAG AA. LCP under 3s is a nice to have, not a gate. `lighthouserc.json` holds what CI enforces: the category scores fail the build, and the metric budgets only warn.
- Lighthouse audits only the home. The required `main` checks are Build, Lint, Typecheck, Unit Tests, Workers Builds, and Lighthouse.

## Deployment and tracking

Cloudflare Workers Builds deploys the Worker named `adeonir`. A push to `main` builds and deploys, publishes `https://adeonir.dev`, and creates preview deployments for branches and pull requests. GitHub Actions provides quality gates; no Cloudflare credentials are stored in GitHub.

The repository tracks delivery in GitHub Issues for `adeonir/adeonir.dev`, using milestones, sub-issues, and labels. There are no Issue Types. Use the `epic-tracker` skill for epic and story changes, and the `git-helpers` skill for commits, pull requests, and branch cleanup.

## Key files and assets

- `src/layouts/base.astro` is the shared document shell. Every new page uses it, and `title` is its only required prop.
- Do not recreate the content-layer scaffolding in `src/content.config.ts`, `src/content/`, and `src/schemas/`.
- `src/validations/contact.ts` exports `UTM_KEYS`. The contact island and the analytics service read that list; never write a second copy.
- Figma source: https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir
