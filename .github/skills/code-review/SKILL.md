---
name: code-review
description: Review context for pull requests in adeonir.dev, an Astro site deployed as a Cloudflare Worker. Covers the conventions this repository enforces, the patterns that look like defects but are deliberate, and the checks other tools already own. Use when reviewing any pull request in this repository.
---

# Reviewing adeonir.dev

## Read first

`AGENTS.md` in the repository root is the canonical guide. When a dedicated document disagrees with it, the dedicated document wins:

- `docs/tech/design-doc.md` — architecture, runtime boundaries, and the contact flow. Technical authority.
- `docs/design/DESIGN.md` — visual identity and design tokens.
- `.agents/rules/*.md` — four enforced conventions, each with correct and incorrect examples.

## Conventions to enforce

Flag a change that breaks one of these:

- **Filenames.** Every source file under `src/` uses lowercase kebab-case. Exports stay PascalCase for components and camelCase for functions.
- **Imports.** An import that leaves the current directory uses the `~/` alias, which resolves to `src/`. Reserve `./` and `../` for files in the same directory.
- **Colors.** Never a hardcoded hex value in a component. Style against the semantic utilities in `src/styles/global.css`, such as `bg-background` and `text-foreground`.
- **Accent roles.** `primary` (blue) owns every interactive cue: buttons, links, focus rings, hover states. `secondary` (pink) owns static emphasis only. Pink as a button, link, or focus state is a defect.
- **Tailwind values.** Prefer the canonical shorthand over bracket notation when both express the same value: `aspect-4/5`, not `aspect-[4/5]`. Brackets are correct only for a value outside the built-in scale.
- **Highlight fields.** Content collections name a highlight segment by meaning, never by color token: `highlight` for large text, `emphasis` for small text. A field named `secondary` leaks the token into content data.
- **Content entries.** The `file()` loader can return `undefined`, so a `getEntry()` result needs a guard before the code reads `.data`.
- **Secrets.** `RESEND_API_KEY` is server-only. Flag any path that could reach client code or a log line.

## Deliberate patterns — do not flag

These read as defects but are the intended design:

- **No versions in the documentation.** `AGENTS.md` names libraries without version numbers on purpose. Pinned versions drifted from `package.json` on every dependency bump, so they were removed. Do not ask for them back.
- **The honeypot returns a success shape.** A submission with a non-empty `website` field is discarded silently and never sends email. Returning success is what keeps a bot from learning it was caught.
- **Rate limiting fails open.** When the `CONTACT_LIMIT` binding throws, the request proceeds. Availability of the contact form outranks strict enforcement here.
- **Nothing is stored.** There is no database and contact data is never persisted or logged. A missing write is not a missing feature.
- **Bindings come from `cloudflare:workers`.** The code reads `import { env } from 'cloudflare:workers'`. `Astro.locals.runtime` is a removed API — do not suggest it.
- **Hydration is deliberately narrow.** Only the theme toggle, contact form, language switcher, mobile navigation, and footer tagline reveal are React islands, each with a deferred `client:*` directive. A section built in plain Astro is the correct default, not a missed opportunity.
- **Sections own no layout.** Files in `src/components/sections/` carry markup only. Page width, gutters, and vertical rhythm live in `src/layouts/base.astro`.
- **Portuguese is the default locale.** Portuguese copy in content collections and bare routes without a locale prefix are correct. English ships later under `/en/...`.
- **Glob patterns in `.agents/hooks/*.sh`.** These scripts match paths with a bash `case` statement, where `*` matches `/` like any other character. `src/*.tsx` does match `src/components/button.tsx`. Verify a pattern in bash before reporting it as too narrow.

## Owned by other tools

Skip these — a separate gate already covers them, so a comment about them only adds noise:

- Formatting and class ordering. Biome owns JS, TS, CSS, and JSON; Prettier owns Astro and YAML. Astro is excluded from Biome on purpose.
- Type errors, unit tests, and the production build. The CI quality matrix runs all three.
- Performance and accessibility budgets. Lighthouse CI asserts them against the home page.
