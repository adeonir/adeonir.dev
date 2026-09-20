# adeonir.dev

Personal portfolio of Adeonir Kohl, a frontend developer positioned around design and code. Live at [adeonir.dev](https://adeonir.dev).

The site ships in Portuguese and English. Portuguese is the default locale and serves from the root. English serves under `/en/`.

## Stack

- [Astro](https://astro.build), deployed as a server-rendered Worker on [Cloudflare](https://workers.cloudflare.com)
- [React](https://react.dev) islands for the interactive parts
- [Tailwind CSS](https://tailwindcss.com) with CSS-first configuration
- [Ark UI](https://ark-ui.com) React for accessible primitives
- [React Email](https://react.email) and [Resend](https://resend.com) for the contact flow
- [PostHog](https://posthog.com) in cookieless mode for analytics
- [Vitest](https://vitest.dev) with happy-dom for unit tests
- [Claude Code](https://claude.com/claude-code) and [Codex](https://openai.com/codex) as coding agents across the development cycle

## Project layout

- `src/pages/` holds the routes. Portuguese pages sit at the root and English pages under `en/`.
- `src/components/` holds Astro sections, React islands, and UI primitives.
- `src/content/` holds the YAML and MDX collections, split by locale directory.
- `src/styles/` holds the design tokens and semantic utilities.
- `docs/` holds the product, design, and technical documents, plus the architecture decision records.

`AGENTS.md` is the guide for coding agents working on this repository.

## Deployment

Cloudflare Workers Builds deploys every push to `main` and creates a preview for each pull request.

## License

The source code is licensed under the MIT License. The site copy, the illustrations, the visual identity, and the product documents are not. See [LICENSE.md](LICENSE.md).
