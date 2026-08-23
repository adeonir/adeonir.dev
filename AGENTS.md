# AGENTS.md

This file is the canonical guide for coding agents working on `adeonir.dev`. Read it before modifying code, adding features, or running project commands.

## Repository overview

`adeonir.dev` is a bilingual personal portfolio for a frontend developer positioned around design and code. Portuguese is the default locale. English is planned under `/en/...` and the routing and content model are i18n-ready.

The site is an Astro application deployed as an SSR Worker on Cloudflare. Pages are content-driven and prerendered to static HTML. The production home (`/`) currently renders the Hero, About, Stack, and Contact sections. The contact form is a React island on the home and submits to the server-side contact Action. The work index and project case-study routes are not implemented yet.

The document shell, metadata and SEO, analytics baseline, design-token layer, generated crawl files, and content-layer scaffolding are implemented. The `/maintenance` and `/404` routes are wired through the base layout. The `/styleguide` route renders the token grid in a separate shell, with a theme toggle to switch skins, and is excluded from indexing.

## Technology stack

- **Framework:** Astro with `@astrojs/cloudflare`
- **UI islands:** React through `@astrojs/react`, hydrated with `client:*` directives
- **Styling:** Tailwind CSS with CSS-first configuration in `src/styles/global.css`
- **UI primitives:** Ark UI React, using the Ark factory where a primitive must support `asChild`
- **Type safety:** TypeScript with Astro's strict configuration
- **Tests:** Vitest, Testing Library, and happy-dom; unit tests are co-located with source files. `vitest.config.ts` uses plain `vitest/config` with `vite-tsconfig-paths`.
- **Icons:** `unplugin-icons` and `@iconify-json/tabler`, compiled to React JSX with `@svgr/core`
- **Fonts:** Geist for the main typeface and Fira Code for technical content, loaded with Astro's `Font` component
- **Email:** `@react-email/components`, `@react-email/render`, and the Resend API
- **Analytics:** PostHog in cookieless mode, gated by `POSTHOG_KEY`
- **Package manager:** pnpm, pinned by `packageManager` in `package.json`

## Project structure

```text
├── .github/workflows/        # CI quality and Lighthouse jobs
├── docs/                     # Product, design, architecture, and ADR documents
├── public/                   # Static icons, manifest, and OG assets
├── src/
│   ├── actions/              # Astro server Actions, including contact handling
│   ├── components/
│   │   ├── islands/          # React hydration boundaries
│   │   ├── scripts/          # Astro components that emit inline side-effect scripts
│   │   ├── sections/         # Page-section Astro components
│   │   ├── styleguide/       # Styleguide-only components
│   │   └── ui/               # Styled, mostly stateless Ark UI primitives
│   ├── content/              # YAML content collections and copy
│   ├── emails/               # React Email templates
│   ├── helpers/              # Shared pure helpers
│   ├── hooks/                # Shared React hooks for islands
│   ├── layouts/              # Shared document shell
│   ├── pages/                # Astro file-based routes
│   ├── schemas/              # Content schemas
│   ├── scripts/              # Client-side scripts such as anchor navigation
│   ├── services/             # Email, rate-limit, and analytics services
│   ├── stores/               # Client state such as the theme store
│   ├── styles/               # Global CSS and design tokens
│   └── validations/          # Schemas shared by server actions and client islands
├── astro.config.mjs          # Astro, adapter, integrations, env, and Vite config
├── biome.json                # Biome formatter and linter configuration
├── lefthook.yml              # Pre-commit and pre-push hooks
├── lighthouserc.json         # Lighthouse CI assertions
├── package.json               # Scripts, dependencies, and pnpm pin
├── pnpm-workspace.yaml       # Workspace and dependency build permissions
├── tsconfig.json             # TypeScript paths and JSX settings
├── worker-configuration.d.ts # Generated Cloudflare binding types
└── wrangler.jsonc            # Cloudflare Worker deployment configuration
```

## Commands and local workflow

All project commands use pnpm:

```bash
pnpm dev          # Start the Astro dev server; / serves the landing home
pnpm build        # Build the production site into dist/
pnpm preview      # Preview the production build locally
pnpm typecheck    # Run astro check
pnpm test         # Run the Vitest unit suite
pnpm lint         # Read-only Biome and Prettier checks
pnpm lint:fix     # Apply Biome and Prettier fixes
pnpm lighthouse   # Build and run the scoped @lhci/cli budget gate
pnpm email        # Start the React Email development server
pnpm gates        # Run typecheck and the write-enabled lint task
```

Use `npx -y @lhci/cli autorun` through `pnpm lighthouse`; never use the unscoped `npx lhci` package. Add `--collect.settings.preset=desktop` for a desktop Lighthouse pass.

Install the hooks with `lefthook install`. Pre-commit formats staged JS/TS/CSS/JSON with Biome and staged Astro/YAML with Prettier. Pre-push runs typecheck and unit tests.

`pnpm-workspace.yaml` controls `allowBuilds` for native dependencies. Every entry must resolve to `true` or `false` for a dependency present in the tree. An unresolved placeholder can make every `pnpm run` command fail during pnpm's dependency check.

## Source-of-truth documents

Before planning or building a feature, read the documents that apply to the work:

- `docs/tech/design-doc.md` — architecture, runtime boundaries, conventions, contact flow, security, testing, CI/CD, and alternatives. It is the technical authority.
- `docs/product/prd.md` — scope, FR/NFR identifiers, personas, journeys, business rules, edge cases, and milestones.
- `docs/product/brief.md` — one-page product summary.
- `DESIGN.md` — visual identity and design tokens. Frontmatter contains token values, with colors as flat OKLCH strings; the body contains design rules and do/don'ts.
- `docs/design/blueprint.md` — layout region trees and screen flows.
- `docs/design/copy.yaml` — canonical site copy.
- `docs/design/wireframe.html` and `docs/design/styleguide.html` — rendered low-fidelity wireframe and token styleguide.
- `docs/adr/001-react-islands-runtime.md` — runtime decision for React islands.

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

- `.agents/hooks/` is the source of truth for project agent hooks.
- `.claude/settings.json` registers these hooks for Claude Code.
- `.codex/hooks.json` registers these hooks for Codex.
- Edit hook logic only in `.agents/hooks/`.
- After adding or changing a Codex hook, review and trust it with `/hooks`.

## Agent skills

- `.github/skills/code-review/SKILL.md` gives Copilot code review the project context it needs on a pull request: the conventions this repository enforces, the patterns that look like defects but are deliberate, and the checks Biome, Prettier, CI, and Lighthouse already own.
- The skill is specific to the GitHub cloud reviewer. Claude Code and Codex read `AGENTS.md` and `.agents/rules/` instead.

## Runtime architecture

- **Astro and Cloudflare:** The site runs on the Cloudflare Workers `workerd` runtime through `@astrojs/cloudflare`. Content pages prerender to static HTML. The contact Action is the only on-demand server surface; there is no standalone `/contact` page and no `prerender = false` page route.
- **Worker assets:** `wrangler.jsonc` uses the adapter server entry, `nodejs_compat`, `assets.directory: ./dist/client`, and `not_found_handling: "404-page"`.
- **React islands:** Keep hydration limited to the theme toggle, contact form, language switcher, mobile navigation, and footer tagline reveal. Use deferred `client:*` directives.
- **Content layer:** `src/content.config.ts` and the schemas define the `file()`-loaded YAML collections. A `projects` MDX collection remains planned; each future case study will live in its own folder with colocated images.
- **External services:** Resend sends outbound email, the hosted `contato@adeonir.dev` mailbox receives owner notifications, and PostHog collects cookieless privacy-safe analytics.
- **Bindings and context:** Read Cloudflare bindings through `import { env } from 'cloudflare:workers'`. Use `Astro.locals.cfContext.waitUntil` for non-blocking work and `Astro.clientAddress` for the client IP. Do not use the removed `Astro.locals.runtime` API.

### Contact flow

The contact section is on the home. `src/components/islands/contact-form.tsx` owns the client flow and submits with `actions.contact()` without navigation.

The Action in `src/actions/index.ts` runs this sequence:

1. Validate input with the shared Zod schema.
2. Discard a submission with a non-empty `website` honeypot field silently. It returns a success-shaped result and never sends email.
3. Check the native Workers Rate Limiting binding `CONTACT_LIMIT` at 5 requests per 60 seconds per IP. The rate-limit service fails open if the binding throws.
4. Send the owner notification and visitor confirmation through Resend. The visitor address is the owner notification's `replyTo` value.
5. Record a non-blocking PostHog event with present UTM tags through `waitUntil`.

No contact data is stored. Typed Action errors use `TOO_MANY_REQUESTS` and `INTERNAL_SERVER_ERROR`. The Action accepts form input at `/_actions/contact`; non-2xx Resend responses become `INTERNAL_SERVER_ERROR`. The form island uses `client:visible`, validates fields in the browser, focuses the first invalid field, forwards `utm_source`, `utm_medium`, and `utm_campaign` from the page URL, and shows inline success and error panels. The Action reads UTM values from its validated input, not from `context.url`, because the Action endpoint has no page query. The always-visible direct contact list is the fallback channel for delivery errors. There is no database, and contact PII is not stored or logged.

## Content, routes, and page composition

- The home at `src/pages/index.astro` composes `<Hero />`, `<Divider />`, `<About />`, `<Divider />`, `<Stack />`, `<Divider />`, and `<Contact />` through `Layout` with the `shell` prop.
- `src/components/sections/*.astro` contains section markup only. Sections do not own page width, gutters, or vertical rhythm.
- `src/layouts/base.astro` owns the document shell, header, footer, content column, and inter-section spacing. Its `wrapper` utility is `mx-auto w-full max-w-6xl px-6`; the shell uses `section-rhythm`, which reads the `--section-gap` variable (6rem, 8rem from `md`). Sections that must break out of that rhythm use `section-escape`, `section-escape-bottom`, `section-inset`, and `section-anchor`, so the value lives in one place.
- Each section reads its own typed collection with `getEntry`. The `file()` loader can return `undefined`, so guard entries before reading `.data`. Editing `content.config.ts` or schemas usually requires a dev-server restart.
- Current collections include `settings`, `header`, `hero`, `about`, `stack`, `footer`, `contact`, `not-found`, `console`, `mobile-menu`, `theme-toggle`, and `emails`.
- `docs/design/copy.yaml` is the canonical prose. Collection files carry rendering markup. Headline emphasis and controlled breaks come from the design frame, not from `copy.yaml` when that file omits them.
- Portuguese routes are bare: `/`, `/work`, `/work/[slug]`, and `/404`. English mirrors them under `/en/...` when English content ships. `i18n.routing.prefixDefaultLocale` is `false`.
- Locale keys are `pt` and `en`, while emitted `lang` and `hreflang` values are `pt-BR` and `en`. Build localized links with `getRelativeLocaleUrl()`. Do not add client-side language switching or browser-language auto-detection.
- Default-locale files use names such as `*.yaml` and `index.mdx`; English files use `*.en.yaml` and `index.en.mdx`. Cover and gallery images are shared between locales.

## Code conventions

### Naming and imports

- Use `kebab-case` for files, slugs, folders, and routes. Use PascalCase for component names.
- `.astro` components use the implicit default export. React/TSX components use named exports such as `export function Button`.
- Use the `~/` alias for imports across directories. Use `./` and `../` only within the same directory.
- JSX uses React. Use `className` in `.tsx` and `class` in `.astro`.

### Component tiers

- `src/components/` — server-side Astro composition and stateful React pieces reused by islands.
- `src/components/scripts/` — Astro components that emit only inline script side effects, such as analytics, theme setup, and the console greeting.
- `src/components/islands/` — React hydration boundaries mounted with `client:*` directives.
- `src/components/sections/` — Astro files for page sections such as Hero, About, Stack, Contact, Header, Footer, and Styleguide.
- `src/components/ui/` — styled, stateless primitives that use semantic tokens. Prefer the Ark `ark.<element>` factory so primitives remain polymorphic and accept `asChild`; use a bare element only for a trivial primitive that never needs `asChild`.

Use the repository's component scaffolding workflow when creating a new component. Shared pure helpers belong in `src/helpers/` or `src/lib/` and must not contain JSX. Shared React hooks belong in `src/hooks/`.

### Styling and design system

- Style against semantic utilities such as `bg-background`, `text-foreground`, and `text-display` from `src/styles/global.css`.
- Never hardcode hex colors in components.
- Biome sorts Tailwind classes in JS/TS helper calls such as `cn`, `clsx`, `cva`, and `tv`. Prettier sorts classes in Astro files.
- Dark is the default `mocha`/Catppuccin skin. Light uses the corresponding `latte` scale. Both skins use position-matched roles.
- `primary` is blue (`stream` dark, `ocean` light) and owns interactive cues: CTA, links, focus rings, and hover states.
- `secondary` is pink (`azalea` dark, `hibiscus` light) and owns static emphasis only. Pink must never be a button, link, or focus state.
- Do not add gradients, glows, or a third accent. Separate surfaces with a tone drop and hairline border before adding a shadow. Never use pure `#000` or `#fff`.
- Use Geist for all type roles. Use Fira Code only for genuinely technical content.
- `global.css` defines self-hosted fonts, raw oklch scales, dual-skin semantic roles, the skin-neutral `--ink` text color for accent fills, `destructive`, nine `text-*` type-role utilities, the `wrapper` utility, and the Tailwind v4 `@theme` configuration.
- Ark UI primitives must use the dual-skin tokens and must not retain a default palette. Audit new primitives against `DESIGN.md`.
- Ark UI reference: https://ark-ui.com/llms.txt
- Icons use `unplugin-icons` with Tabler, for example `import IconFolder from '~icons/tabler/folder'`. Render them statically in Astro; the JSX compiler requires `@svgr/core` and `@svgr/plugin-jsx`.

## Configuration and formatting

- `package.json` pins the pnpm version with the `packageManager` field. `wrangler` is a direct dev dependency so its binary is available in the Workers Builds environment.
- `astro.config.mjs` sets `site` to `https://adeonir.dev`, configures Cloudflare, React, sitemap, robots, fonts, the env schema, Tailwind, icons, and optimized server dependencies.
- `tsconfig.json` uses Astro's strict base settings, React JSX, and the `~/*` alias to `src/*`.
- `biome.json` owns JS/TS/CSS/JSON. Astro is excluded. CSS uses the Tailwind directives parser and double-quoted formatting.
- `.prettierrc` and `prettier-plugin-astro`/`prettier-plugin-tailwindcss` own `.astro` and YAML. `**/*.css` is ignored by Prettier.
- `.mcp.json` declares the `ark-ui` and `posthog` MCP servers.

## Environment and security

Astro's env schema defines:

- `POSTHOG_KEY` — optional public client key; no analytics script is emitted when it is empty.
- `POSTHOG_HOST` — public client host, defaulting to `https://t.adeonir.dev`.
- `RESEND_API_KEY` — server secret used only for outbound email.

Local values belong in the gitignored `.env`; use `.env.example` as the template. Production values belong in the Cloudflare dashboard. Never put `RESEND_API_KEY` in client code, source files, or logs.

The contact form validates with `src/validations/contact.ts` on the client and the server. The shared client schema imports the canonical `zod` package; server-only content schemas may use `astro/zod`. The `website` honeypot is checked in the Action, not in validation, so bots reach the silent discard path.

PostHog runs cookieless with memory persistence, disabled persistence, no autocapture, no session recording or surveys, and `respect_dnt`. Client pageviews and UTM data are manual. Server-side contact events never include form PII, use a synthetic `distinct_id`, and run without blocking email delivery. Analytics is inert when `POSTHOG_KEY` is unset.

The `/styleguide` and `/maintenance` routes are noindex and are excluded from the sitemap and `robots.txt` through the shared `noIndexRoutes` list. Generated crawl files are produced at build time; there is no static `public/robots.txt`.

## Testing, quality, and delivery

- Unit tests cover validation, helpers, form hooks, rate limiting, and the theme store. The default environment is Node; DOM-dependent specs opt into happy-dom with a `// @vitest-environment happy-dom` docblock.
- Browser component tests, E2E tests, and axe-based accessibility tests are planned but are not configured yet.
- The target quality budget is mobile Lighthouse Performance ≥ 95, Accessibility/Best Practices/SEO = 100, LCP < 2.0s, CLS < 0.1, INP < 200ms, and WCAG AA. The current CI Lighthouse config hard-fails category scores and warns on LCP, CLS, and TBT (the lab proxy for INP).
- `.github/workflows/ci.yml` runs Lint, Typecheck, Unit Tests, and Build in a quality matrix, plus a Lighthouse job. Lighthouse audits only the home, runs three times with median aggregation, and uses `dist/client`.
- The required `main` checks are Build, Lint, Typecheck, Workers Builds, and Lighthouse. The unit, E2E, browser, and accessibility checks grow as their suites are added.
- Run `pnpm build` to verify the production landing at `dist/client/index.html`, or use `pnpm dev` for interactive verification.

## Deployment and tracking

Cloudflare Workers Builds deploys the Worker named `adeonir`. A push to `main` runs `pnpm build` and `npx wrangler deploy`, publishes `https://adeonir.dev`, and creates preview deployments for branches/PRs. GitHub Actions provides quality gates; no Cloudflare credentials are stored in GitHub.

The repository tracks delivery in GitHub Issues for `adeonir/adeonir.dev`, using milestones, sub-issues, and labels. There are no Issue Types. Use the `epic-tracker` skill for epic and story changes. Use the `git-helpers` skill for commits, pull requests, and branch cleanup.

## Key files and assets

- `src/layouts/base.astro` — shared shell with `lang`, theme class, SEO, canonical URL, Open Graph, X card, icons, manifest, analytics, console greeting, header, footer, and optional page shell. `title` is required; `description`, `image`, `noindex`, and `shell` are optional. The title template is `{title} | {siteName}` and the X card is `summary_large_image`. New pages should use it.
- `src/pages/index.astro` — production home with `title="Portfólio"` and the `shell` prop.
- `src/pages/maintenance.astro` — centered noindex holding page using semantic tokens and `public/logo.svg`.
- `src/pages/404.astro` — global noindex not-found page with the `not-found` collection, an oversized `404` mark, highlighted headline, body, and back-home action. The static-assets Worker serves it with a 404 status for unmatched routes.
- `src/pages/styleguide.astro` — noindex token styleguide that renders one token grid without the base layout; a theme toggle switches between the dark and light skins.
- `src/content.config.ts`, `src/content/`, and `src/schemas/` — content loaders, YAML entries, and Zod schemas. Do not recreate the content-layer scaffolding.
- `src/components/scripts/analytics.astro` — config-gated PostHog array stub and async client loader.
- `src/actions/index.ts` — contact Action and typed error paths.
- `src/services/email.ts`, `src/services/rate-limit.ts`, and `src/services/analytics.ts` — Resend delivery, atomic rate limiting, and privacy-safe analytics capture.
- `src/emails/confirmation.tsx` and `src/emails/notification.tsx` — render-only React Email templates fed by the `emails` collection.
- `src/validations/contact.ts`, `src/components/islands/contact-form.tsx`, and `src/hooks/use-form.ts` — shared validation and the client contact flow.
- `src/validations/contact.ts` also exports `UTM_KEYS`; the client island and analytics service use the same key list.
- `vitest.config.ts` — plain unit-test configuration with the TypeScript path alias.
- `src/components/ui/field.tsx` — Ark Field primitive with `invalid` and `error` props and the destructive-token error state.
- `wrangler.jsonc` and `worker-configuration.d.ts` — Worker bindings, static asset behavior, rate limit settings, and generated binding types.
- `.github/workflows/ci.yml` and `lighthouserc.json` — pull-request quality gates and the home Lighthouse budget.
- `public/` contains `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png`, `og-image.png`, and `site.webmanifest`.
- Figma source: https://www.figma.com/design/T4wd9lMdUUdpfpmbT3C0bN/Adeonir
