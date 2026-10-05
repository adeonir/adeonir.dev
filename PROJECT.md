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

## Decisions

- Home narration uses ElevenLabs audio that a local repository script generates before publication from an authored spoken text per section and locale, and names each file after the hash of its spoken text. Visits and builds do not call ElevenLabs; a unit test checks that the file for each current spoken text exists, so changing a spoken text requires regenerating and publishing the matching audio. Whether a spoken text matches the page text is checked by listening, not by a test; source: docs/tech/design-doc.md §3.9; scope: home narration
- The home stays prerendered — the static Lighthouse audit reads `dist/client`, and an on-demand home leaves it nothing to read; source: lighthouserc.json and wrangler.jsonc; scope: the home route
- Contact rate limiting uses the native Workers Rate Limiting binding rather than a KV read-modify-write counter or a global Durable Object — the binding covers the need, and it supports only 10- or 60-second periods; source: wrangler.jsonc and src/services/rate-limit.ts; scope: contact flow
- Server-side PostHog capture sends raw ingest requests through the shared analytics service — the browser snippet is not available inside the Cloudflare Worker; source: src/services/analytics.ts; scope: server-side analytics
- Tailwind conflict merging uses `tailwind-merge` around the project's class concatenation helper, with the custom `text-*` type utilities registered as font-size entries — otherwise they collide with the semantic text-color tokens; source: src/helpers/classnames.ts and src/styles/global.css; scope: type utilities
- A copy collection holds both locales together: one YAML file per locale under `src/content/<surface>/<locale>/<name>.yaml` (`home` for the six home-section types, `shared` for the rest), loaded through `glob()` with an explicit `generateId` returning `${locale}/<collectionKey>`. A new collection needs no separate per-locale registration — its id already carries the locale; source: src/content.config.ts; scope: content layer
- The narration control does not show the audio duration — the control stays minimal, and a missing duration is not a gap to fix; source: src/components/islands/home/narration-control.tsx; scope: home narration
- The narration waveform seeks by pointer only and stays `aria-hidden` — play and pause work from the keyboard, and the narration reads text already on the page, so nothing becomes unreachable; source: src/components/islands/home/narration-control.tsx; scope: home narration
- The hero eyebrow reads "Frontend Engineer" while the description says "Sou design engineer e trabalho no frontend" — the eyebrow is the title held at companies and the description is the positioning, so the two are not a conflict to resolve; source: src/content/home/pt/hero.yaml; scope: home hero
- The site has no skip link — the first Tab stop is the logo and the second is the first section link, so the content is already reached without one; source: src/layouts/base.astro; scope: every page
- Every icon is decorative by default — the icon plugin's `iconCustomizer` writes `aria-hidden="true"` on each generated `<svg>`, so a usage site never adds it, and an icon that carries meaning alone passes `aria-hidden={false}` with a `title` or `aria-label`; source: astro.config.mjs; scope: every icon

## Gotchas

- `getImage` with both `width` and `height` must keep the source ratio — the build-time service crops to the box while the dev service fits inside it, so a mismatch shows up only in production; source: src/components/sections/home/expertise.astro
- A `file()` collection entry can come back `undefined`, so a section must guard the entry before reading `.data` — every section that calls `getEntry`; source: src/components/sections/hero.astro
- Adding a field to a content schema needs `pnpm dev --force`: a plain restart leaves the stored entries at their old shape, and the new field reads as undefined while the build renders it correctly — content collections
- Removing a content entry leaves it in the content layer store, so the next build fails on the asset it referenced — run `pnpm build --force`; source: node_modules/.astro/data-store.json
- Every `allowBuilds` entry must resolve to `true` or `false` for a dependency present in the tree — an unresolved placeholder makes every `pnpm run` command fail during pnpm's dependency check; source: pnpm-workspace.yaml
- The Lighthouse budget runs through the scoped `@lhci/cli`; the unscoped `lhci` package is a different project — pnpm lighthouse; source: package.json
- `Astro.locals.runtime` no longer exists — read Cloudflare bindings through `cloudflare:workers` and reach the execution context through `Astro.locals.cfContext`; source: src/actions/index.ts
- The `website` honeypot is checked inside the Action rather than in the shared validation schema — a bot reaches the silent discard path instead of a validation error, so it looks like a missing rule and is not; source: src/actions/index.ts
- The contact Action reads the UTM values from its validated input, never from `context.url` — the Action endpoint carries no page query; source: src/actions/index.ts
- An Action with `accept: 'form'` turns an empty form value into `undefined` only when the field's outer validator is `.optional()`, and into `null` otherwise — an optional text field must keep `.optional()` as its outer layer, or an empty value fails `z.string()` on the server while the client schema accepts `""`; source: node_modules/astro/dist/actions/runtime/server.js
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
