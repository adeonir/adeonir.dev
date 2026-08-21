## Stakes

- The site is its own work sample. A visual defect costs credibility with the people evaluating the developer for work.
- A silent regression in the home's visual rhythm or accessibility weakens the first impression and makes the structure harder to understand for people using assistive technology.
- No surface persists data, takes payment, or authenticates a user, so a defect cannot corrupt or expose stored records. Weigh caution accordingly.

## Conventions

- Do not add a `prepare` script that installs lefthook on `pnpm install`, so CI and production installs do not need that binary. Source: `lefthook.yml` and `package.json`.
- Do not use Astro's `getViteConfig` in `vitest.config.ts`; it is incompatible with the Cloudflare Vite plugin. Source: `vitest.config.ts`.
- Do not import `z` from `astro:content` in a content schema; use `astro/zod`. Source: `src/schemas/*.ts`.
- Keep pure helpers in modules that can be imported without runtime-coupled services, framework virtual modules, or email templates so they remain unit-testable. Source: `src/helpers/`.
- When rendering an Ark `Field`, keep the label and control in one component tree so Ark context can connect the label to the input during SSR. Source: `src/components/ui/field.tsx`.
- Gate optional animations with `motion-safe:`. The theme toggle's Ark Swap animates only after hydration and must stay instant when motion is disabled. Source: `src/components/ui/popover.tsx` and `src/components/ui/swap.tsx`.

## Decisions

- React is the island runtime. Ark UI has no supported Preact package, and `preact/compat` fails Ark SSR; use `@astrojs/react` with React 19. Source: `docs/adr/001-react-islands-runtime.md`.
- Skins switch through a `[data-theme]` attribute on the document root, with dark as the `:root` default and light as the `[data-theme=light]` override; an inline render-blocking script sets the value before first paint. Do not use the `.dark` class or Tailwind's `dark:` variant, which assume a light default and duplicate what the semantic tokens already cover. Source: `docs/adr/002-theme-switching-mechanism.md`.
- State shared between islands lives in nanostores atoms under `src/stores/`, read through `@nanostores/react`. React Context cannot cross island boundaries, because each island is a separate React root; Zustand and Jotai are React-coupled and heavier. Island-local UI state stays in `useState`, and static copy stays in content collections. Source: `docs/adr/003-nanostores-island-state.md`.
- An island whose first paint depends on client-resolved state renders behind an Ark `ClientOnly` boundary, with a CSS-only fallback driven by the same before-paint signal and an atom seeded from the DOM at module load. `useEffect` and `useLayoutEffect` run after paint, and `suppressHydrationWarning` hides the warning rather than the flash. Source: `docs/adr/004-ssr-safe-island-rendering.md`.
- The home remains prerendered so the static Lighthouse audit can read `dist/client`. Source: `lighthouserc.json` and `wrangler.jsonc`.
- Contact rate limiting uses the native Workers Rate Limiting binding rather than a KV read-modify-write counter or a global Durable Object. The binding supports only 10- or 60-second periods. Source: `wrangler.jsonc` and `src/services/rate-limit.ts`.
- Server-side PostHog exception capture uses raw ingest requests through the shared analytics service; the browser snippet is not available inside the Cloudflare Worker. Source: `src/services/analytics.ts`.
- Tailwind conflict merging uses `tailwind-merge` around the project's class concatenation helper, with the custom `text-*` type utilities registered as font-size entries so they do not collide with semantic text-color tokens. Source: `src/helpers/classnames.ts` and `src/styles/global.css`.

## Gotchas

- `unplugin-icons` with the JSX compiler requires both `@svgr/core` and `@svgr/plugin-jsx`; a production build may not catch a missing dependency when the consuming island is excluded from that build. Source: `astro.config.mjs` and `package.json`.
- Zag floating primitives take their inline z-index from the Ark `Content` element, not the positioner. Put the z-index utility on `Content`. Source: `src/components/ui/popover.tsx`.
- The header's `backdrop-blur` creates a containing block for fixed descendants. Full-viewport overlays rendered under the header must be portaled to `body` and layered above the header. Source: `src/components/sections/header.astro`.
- `String.prototype.replaceAll` treats `$` sequences in string replacements as substitution patterns. Use a function replacement when inserting user-controlled text. Source: `src/helpers/interpolate.ts`.
- Astro 6 does not render `.astro` components in `jsdom` or `happy-dom`; those tests must use Node or a browser-mode suite.
- Vitest's `happy-dom` environment does not expose a working `localStorage` global by default. DOM tests that exercise storage must inject one from a happy-dom `Window`. Source: `src/stores/theme.test.ts`.
- The PostHog array stub derives the script host by replacing `.i.posthog.com`. With the project's reverse-proxy host, that replacement is a no-op, so the proxy must serve `/static/array.js` as well as ingestion. Source: `src/components/scripts/analytics.astro`.
- Astro Actions reject cross-origin form POSTs before the handler runs. Direct scripts that exercise an Action endpoint must send a matching `Origin` header.
- Resend can throttle concurrent sends independently of the contact rate limiter. A concurrent load test can therefore produce a provider error even when the application limiter admits the request.
