# adeonir.dev

## Stakes

- A public personal portfolio whose visual identity is the product. It holds no accounts, no payments, and no stored personal data: the contact form sends email and keeps nothing, so a failure costs no data and no money.
- Every page — a broken frame costs the impression the site exists to make, and a reader reads that frame as the work.
- Enter — content that never reaches its settled values leaves an empty page instead of a rough one, with no error to explain it. This is the one failure here that is not cosmetic, and anything that hides content before showing it is weighed against it.

## Conventions

- Do not add a `prepare` script that installs lefthook on `pnpm install` — CI and production installs, which must not need that binary; source: lefthook.yml and package.json
- Import `z` from `astro/zod`, never from `astro:content` — every content schema; source: src/schemas/
- Keep pure helpers importable without runtime-coupled services, framework virtual modules, or email templates — shared helpers, so they stay unit-testable; source: src/helpers/
- Keep an Ark `Field`'s label and control in one component tree — every form field, so Ark context connects the label to the input during SSR; source: src/components/ui/field.tsx
- Gate optional animations with `motion-safe:` — every animated primitive, including the theme toggle's Ark Swap, which animates only after hydration and stays instant when motion is disabled; source: src/components/ui/popover.tsx and src/components/ui/swap.tsx

## Decisions

- The home stays prerendered — the static Lighthouse audit reads `dist/client`, and an on-demand home leaves it nothing to read; source: lighthouserc.json and wrangler.jsonc; scope: the home route
- Contact rate limiting uses the native Workers Rate Limiting binding rather than a KV read-modify-write counter or a global Durable Object — the binding covers the need, and it supports only 10- or 60-second periods; source: wrangler.jsonc and src/services/rate-limit.ts; scope: contact flow
- Server-side PostHog capture sends raw ingest requests through the shared analytics service — the browser snippet is not available inside the Cloudflare Worker; source: src/services/analytics.ts; scope: server-side analytics
- Tailwind conflict merging uses `tailwind-merge` around the project's class concatenation helper, with the custom `text-*` type utilities registered as font-size entries — otherwise they collide with the semantic text-color tokens; source: src/helpers/classnames.ts and src/styles/global.css; scope: type utilities
- A copy collection holds both locales together: one YAML file per locale under `src/content/<surface>/<locale>/<name>.yaml` (`home` for the six home-section types, `shared` for the rest), loaded through `glob()` with an explicit `generateId` returning `${locale}/<collectionKey>`. A new collection needs no separate per-locale registration — its id already carries the locale; source: src/content.config.ts; scope: content layer

## Gotchas

- A `file()` collection entry can come back `undefined`, so a section must guard the entry before reading `.data` — every section that calls `getEntry`; source: src/components/sections/hero.astro
- Editing the content config or a schema needs a dev-server restart before the new shape is picked up — content collections
- Every `allowBuilds` entry must resolve to `true` or `false` for a dependency present in the tree — an unresolved placeholder makes every `pnpm run` command fail during pnpm's dependency check; source: pnpm-workspace.yaml
- The Lighthouse budget runs through the scoped `@lhci/cli`; the unscoped `lhci` package is a different project — pnpm lighthouse; source: package.json
- `Astro.locals.runtime` no longer exists — read Cloudflare bindings through `cloudflare:workers` and reach the execution context through `Astro.locals.cfContext`; source: src/actions/index.ts
- The `website` honeypot is checked inside the Action rather than in the shared validation schema — a bot reaches the silent discard path instead of a validation error, so it looks like a missing rule and is not; source: src/actions/index.ts
- The contact Action reads the UTM values from its validated input, never from `context.url` — the Action endpoint carries no page query; source: src/actions/index.ts
- `unplugin-icons` with the JSX compiler requires both `@svgr/core` and `@svgr/plugin-jsx` — a production build may not catch a missing dependency when the consuming island is excluded from that build; source: astro.config.mjs and package.json
- Zag floating primitives take their inline z-index from the Ark `Content` element, not the positioner — put the z-index utility on `Content`; source: src/components/ui/popover.tsx
- The header's `backdrop-blur` creates a containing block for fixed descendants — full-viewport overlays rendered under the header must be portaled to `body` and layered above the header; source: src/components/sections/header.astro
- `String.prototype.replaceAll` treats `$` sequences in string replacements as substitution patterns — use a function replacement when inserting user-controlled text; source: src/helpers/interpolate.ts
- Astro 6 does not render `.astro` components in `jsdom` or `happy-dom` — those tests must use Node or a browser-backed suite
- `typescript` stays pinned at 6.x — TypeScript 7's native compiler (`tsgo`) does not yet expose the programmatic API `astro check` depends on, so upgrading breaks `pnpm typecheck`; source: package.json
- Vitest's `happy-dom` environment does not expose a working `localStorage` global by default — DOM tests that exercise storage must inject one from a happy-dom `Window`; source: src/stores/theme.test.ts
- The PostHog array stub derives the script host by replacing `.i.posthog.com` — with the project's reverse-proxy host that replacement is a no-op, so the proxy must serve `/static/array.js` as well as ingestion; source: src/components/scripts/analytics.astro
- Astro Actions reject cross-origin form POSTs before the handler runs — direct scripts that exercise an Action endpoint must send a matching `Origin` header
- Resend can throttle concurrent sends independently of the contact rate limiter — a concurrent load test can therefore produce a provider error even when the application limiter admits the request
