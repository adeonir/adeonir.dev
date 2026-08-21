## Stakes

- adeonir.dev is a personal portfolio for a frontend developer. Pages prerender to static HTML on a Cloudflare Worker; the site's visual quality represents the product's work.
- Home visual rhythm and accessibility — a silent regression can weaken the first impression and make the structure harder to understand for people using assistive technology, but the surface does not involve persisted data, payments, or authentication.

## Conventions

- Use pnpm for all project commands. pnpm 11 workspace settings, including native build approvals and exact-version saving, belong in `pnpm-workspace.yaml`.
- Install git hooks with `lefthook install`. Do not add a `prepare` script that installs lefthook on `pnpm install`, so CI and production installs do not need that binary.
- Use Vitest with a plain `vitest/config` configuration and `vite-tsconfig-paths`; do not use Astro's `getViteConfig`, which is incompatible with the Cloudflare Vite plugin. Keep the default test environment as Node and opt into `happy-dom` per spec with a docblock. Source: `vitest.config.ts`.
- Import content-schema `z` from `astro/zod`, not from `astro:content`; Astro 6 deprecates the latter. Source: `src/schemas/*.ts`.
- Keep Tailwind CSS configuration CSS-first and use semantic design tokens. Do not introduce hardcoded palette values in components. Source: `src/styles/global.css` and `DESIGN.md`.
- Biome owns JS, TS, CSS, and JSON; Prettier owns Astro and YAML. Tailwind class sorting follows the same split: Biome sorts JS/TS calls, and the Prettier Tailwind plugin sorts Astro markup.
- Keep pure helpers in modules that can be imported without runtime-coupled services, framework virtual modules, or email templates so they remain unit-testable.
- When rendering an Ark `Field`, keep the label and control in one component tree so Ark context can connect the label to the input during SSR.
- Gate optional animations with `motion-safe:`. The theme toggle keeps a flash-free SSR fallback through Ark `ClientOnly` (CSS icons before hydration). Swap only animates after that handoff and must stay instant when motion is disabled.

## Decisions

- React is the island runtime. Ark UI has no supported Preact package, and `preact/compat` fails Ark SSR; use `@astrojs/react` with React 19. Source: `docs/adr/001-react-islands-runtime.md`.
- The home remains prerendered so the static Lighthouse audit can read `dist/client`. Per-request work belongs on the contact Action (`/_actions/contact`), not on a `prerender = false` page. Source: `lighthouserc.json`, `wrangler.jsonc`, and `src/actions/index.ts`.
- Cloudflare bindings and secrets are read from `cloudflare:workers`; execution context comes from `Astro.locals.cfContext`, and the client IP comes from `Astro.clientAddress`. `Astro.locals.runtime` is not supported by the current adapter. Source: `AGENTS.md#Runtime architecture`.
- Contact rate limiting uses the native Workers Rate Limiting binding rather than a KV read-modify-write counter or a global Durable Object. The binding supports only 10- or 60-second periods. Source: `wrangler.jsonc` and `src/services/rate-limit.ts`.
- Page-level UTM values are forwarded in the contact Action input. An Astro Action's `context.url` is the `/_actions/...` endpoint and does not contain the originating page query string. Source: `src/actions/index.ts` and `src/validations/contact.ts`.
- Server-side PostHog exception capture uses raw ingest requests through the shared analytics service; the browser snippet is not available inside the Cloudflare Worker. Source: `src/services/analytics.ts`.
- Tailwind conflict merging uses `tailwind-merge` around the project's class concatenation helper, with the custom `text-*` type utilities registered as font-size entries so they do not collide with semantic text-color tokens. Source: `src/helpers/classnames.ts` and `src/styles/global.css`.

## Gotchas

- `getEntry()` from a `file()` content loader is typed as possibly `undefined`; every section must guard the entry before reading `.data`.
- `unplugin-icons` with the JSX compiler requires both `@svgr/core` and `@svgr/plugin-jsx`; a production build may not catch a missing dependency when the consuming island is excluded from that build.
- Zag floating primitives take their inline z-index from the Ark `Content` element, not the positioner. Put the z-index utility on `Content`.
- The header's `backdrop-blur` creates a containing block for fixed descendants. Full-viewport overlays rendered under the header must be portaled to `body` and layered above the header.
- `String.prototype.replaceAll` treats `$` sequences in string replacements as substitution patterns. Use a function replacement when inserting user-controlled text.
- Astro 6 does not render `.astro` components in `jsdom` or `happy-dom`; those tests must use Node or a browser-mode suite.
- Vitest's `happy-dom` environment does not expose a working `localStorage` global by default. DOM tests that exercise storage must inject one from a happy-dom `Window`.
- The PostHog array stub derives the script host by replacing `.i.posthog.com`. With the project's reverse-proxy host, that replacement is a no-op, so the proxy must serve `/static/array.js` as well as ingestion.
- Astro Actions reject cross-origin form POSTs before the handler runs. Direct scripts that exercise an Action endpoint must send a matching `Origin` header.
- Resend can throttle concurrent sends independently of the contact rate limiter. A concurrent load test can therefore produce a provider error even when the application limiter admits the request.
- `lefthook`'s default `gobwas` glob does not make `**` span zero directories. Use the configured `doublestar` matcher when a hook must include top-level files.
- Biome warning-level findings do not fail by default; quality gates that must reject warnings need `--error-on-warnings`.
