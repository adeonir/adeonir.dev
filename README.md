# adeonir.dev

Personal portfolio of Adeonir Kohl, a frontend developer positioned around design and code. Live at [adeonir.dev](https://adeonir.dev).

The site ships in Portuguese and English. Portuguese is the default locale and serves from the root. English serves under `/en/`.

## Stack

- [Astro](https://astro.build) with `@astrojs/cloudflare`, deployed as a server-rendered Worker on Cloudflare
- React islands hydrated with `client:*` directives
- Tailwind CSS with CSS-first configuration
- Ark UI React for accessible primitives
- React Email and Resend for the contact flow
- PostHog in cookieless mode for analytics
- Vitest with happy-dom for unit tests

Read `package.json` for versions.

## Project layout

- `src/pages/` holds the routes. Portuguese pages sit at the root and English pages under `en/`.
- `src/components/` holds Astro sections, React islands, and UI primitives.
- `src/content/` holds the YAML and MDX collections, split by locale directory.
- `src/styles/global.css` holds the design tokens and semantic utilities.
- `docs/` holds the product, design, and technical documents, plus the architecture decision records.

`AGENTS.md` is the guide for coding agents working on this repository. It describes the conventions, the placement rules, and which document is authoritative for each concern.

## Running locally

Requires Node.js and pnpm. The pnpm version is pinned in `package.json`.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The site runs without any environment variable. Analytics stays inert while `POSTHOG_KEY` is empty. The contact form needs `RESEND_API_KEY` to send email.

Install the git hooks with `lefthook install`.

## Commands

```bash
pnpm dev          # Start the Astro dev server
pnpm build        # Build the production site into dist/
pnpm preview      # Preview the production build locally
pnpm typecheck    # Run astro check
pnpm test         # Run the Vitest unit suite
pnpm lint         # Read-only Biome and Prettier checks
pnpm lint:fix     # Apply Biome and Prettier fixes
pnpm lighthouse   # Build and run the Lighthouse budget gate
pnpm email        # Start the React Email development server
```

## Deployment

Cloudflare Workers Builds deploys the Worker on every push to `main` and creates preview deployments for branches and pull requests. GitHub Actions runs the quality gates: build, lint, typecheck, unit tests, and Lighthouse.

## License

The source code is licensed under the MIT License. The site copy, the illustrations, the visual identity, and the product documents are not. See [LICENSE.md](LICENSE.md).
