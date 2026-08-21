---
name: 001-react-islands-runtime
created: 2026-06-10
updated: 2026-08-21
status: accepted
supersedes: []
superseded-by: []
sources:
  - docs/tech/design.md
  - https://github.com/adeonir/adeonir.dev/issues/26
---

# ADR-001: React as the Islands Runtime

## Status

accepted

## Context

The design doc selected Preact as the UI runtime for the ~4 client islands
(theme toggle, contact form, language switcher, mobile nav), valuing its
smaller payload (~4.5kb gzip vs ~50kb for react + react-dom) under the
mobile Lighthouse Performance ≥ 95 budget. Independently, the project
adopted Ark UI as the accessibility-primitives layer for ui-tier
components (focus trap, dismissable layers, ARIA wiring).

These two choices collided when the first island was built (mobile nav
menu, issue #26):

- Ark UI publishes `react`, `vue`, `svelte`, and `solid` flavors only.
  `@ark-ui/preact` does not exist on npm; references to it in project
  guidance were never installable.
- The `@ark-ui/react` + `preact/compat` route was wired and smoke-tested:
  Ark's environment context dereferences `document` during server-side
  rendering under `preact-render-to-string`
  (`ReferenceError: document is not defined`), a path `react-dom/server`
  does not take. Astro prerenders every island, so SSR cannot be skipped
  without giving up server-rendered markup or the `client:media` deferral.
- Aliasing also proved fragile: pnpm `overrides` do not apply to
  auto-installed peer dependencies, so the compat alias only resolved as a
  direct `react`/`react-dom` dependency.

A runtime had to be chosen before any island, ui primitive, or future
interactive work could proceed.

## Decision

We will run the client islands on React 19 via `@astrojs/react`, with
`@ark-ui/react` as the primitives layer. Preact and `@astrojs/preact` are
removed; `jsxImportSource` is `react`.

## Consequences

### Positive

- Ark UI runs first-class, with no compat shim between its state machines
  and the renderer — focus trap, escape handling, scroll lock, and focus
  return come from the maintained machines instead of hand-rolled code.
- Every planned primitive (dialog, theme toggle, language switcher,
  contact-form enhancements) is unblocked by one decision instead of
  renegotiating the runtime per component.
- One JSX runtime across server and client; react-email no longer needs a
  "server-only React" carve-out.

### Negative

- Hydrating viewports pay ~50kb gzip of runtime instead of ~4.5kb. The
  cost is deferred by `client:*` directives (the mobile nav hydrates only
  below the collapse breakpoint) and regressions are caught by the
  Lighthouse CI gate (Performance ≥ 95, mobile).
- The design doc's original byte-size rationale for the islands layer is
  inverted; sections referencing Preact are superseded by this record.

### Neutral

- `tsconfig.json` moves to `jsxImportSource: react`; `.tsx` files use
  `className` while `.astro` templates keep `class`.
- Component-test tooling for islands (Vitest browser mode) targets React
  rendering instead of Preact.
- Project guidance (CLAUDE.md, scaffolding skill templates) now emits
  `@ark-ui/react` and `react` imports.

## Alternatives Considered

| Option | Reason Rejected | Record |
|--------|-----------------|--------|
| Preact + `@ark-ui/react` over `preact/compat` | Failed the smoke test: Ark's SSR path reads `document` under `preact-render-to-string`; compat behavior is outside Ark's support surface, so each upgrade would re-roll the dice | — |
| Preact + hand-rolled primitives | Reimplements focus trap, dismissable-layer, and ARIA machinery per island; high accessibility-regression risk against WCAG AA for code Ark already maintains | — |
| Preact + another primitives library with a Preact flavor | No equivalent maintained option verified; Zag.js (Ark's machine layer) ships no Preact adapter either | — |

## References

- `docs/tech/design.md#4-alternatives-considered` — UI runtime row
- Mobile nav story that surfaced the conflict: https://github.com/adeonir/adeonir.dev/issues/26
- Ark UI framework list: https://ark-ui.com/llms.txt
- Astro React integration: https://docs.astro.build/en/guides/integrations-guide/react/
