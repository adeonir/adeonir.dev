---
name: 002-theme-switching-mechanism
created: 2026-06-16
updated: 2026-06-16
status: accepted
supersedes: []
superseded-by: []
sources:
  - docs/design/DESIGN.md
  - docs/tech/design-doc.md
  - https://github.com/adeonir/adeonir.dev/issues/79
---

# ADR-002: Theme Switching via `data-theme` Attribute

## Status

accepted

## Context

The site carries a dual-skin identity tokenized in `src/styles/global.css`:
the raw Catppuccin scales live as `:root` custom properties in oklch, the
semantic roles for the dark skin (mocha) resolve on `:root`, and the light
skin (latte) overrides them under a `[data-theme=light]` selector. Both are
exposed through `@theme inline`, so flipping the attribute at runtime
re-resolves every semantic token with no rebuild. Dark is the brand's
default identity, not light (`DESIGN.md`).

The styling layer is built on semantic token utilities (`bg-background`,
`text-foreground`, `text-display`) that read those custom properties; it
does not use Tailwind's `dark:` variant utilities anywhere.

Building the theme toggle island (issue #79) forces a decision on how the
skin selection is expressed in the DOM. Today `base.astro` hard-codes
`data-theme="dark"` on `<html>` purely as a devtools convenience, not as a
switching mechanism. The widely-used convention — shadcn/ui and Tailwind
dark mode — is instead a `.dark` class on the root that drives the `dark:`
variant, and it assumes light as the default with dark as the opt-in
override.

## Decision

We will switch skins via a `[data-theme]` attribute on the document root —
dark as the `:root` default and light as the `[data-theme=light]` override,
re-resolving the semantic CSS custom properties through `@theme inline`. We
will not adopt the `.dark` class convention or Tailwind's `dark:` variant;
a render-blocking inline script sets the explicit attribute value before
first paint.

## Consequences

### Positive

- The mechanism is already wired — the toggle only drives the attribute
  value, with no rewrite of `global.css` or the token layer.
- The dark-first identity is expressed natively (`:root` is mocha); light
  is the explicit override, matching the brand rather than fighting it.
- Styling stays on semantic token utilities — no `dark:`-prefixed
  duplication of utilities spread across the codebase.
- Attribute-based theming matches the model used by design systems such as
  Radix Themes and extends to further named skins via attribute values if
  ever needed.

### Negative

- Declines the ecosystem-standard `.dark` / `dark:` convention; a
  contributor arriving from shadcn/Tailwind dark mode must learn that this
  project themes through semantic tokens and `[data-theme]` instead.
- Tailwind's `dark:` variant is unavailable for ad-hoc per-utility
  theming — any future skin-specific style must go through a token or a
  `[data-theme=...]` selector, never a `dark:` prefix.

### Neutral

- The hard-coded `data-theme="dark"` in `base.astro` becomes script-driven
  (inline no-flash resolution before paint).
- The control is binary (dark/light): the OS `prefers-color-scheme` is
  honoured as the first-load default rather than exposed as a third
  selectable state. That scope choice is recorded in the story (#79), not
  this ADR.

## Alternatives Considered

| Option | Reason Rejected | Record |
|--------|-----------------|--------|
| `.dark` class + Tailwind `dark:` variant (shadcn convention) | Assumes a light default with dark as the override, inverting the brand's dark-first identity and forcing a `global.css` rewrite; the project styles through semantic tokens, not `dark:`, so the variant adds no value | — |
| `@media (prefers-color-scheme)` only, no DOM attribute | Cannot express an explicit user override or persist a choice — a toggle is impossible without a DOM signal the user controls | — |

## References

- `docs/tech/design-doc.md#4-alternatives-considered` — Styling row (Tailwind)
- `docs/design/DESIGN.md` — two skins of one identity; dark default, latte light
- `src/styles/global.css` — `@theme inline` semantic roles, `[data-theme=light]`
- Theme toggle epic and story: https://github.com/adeonir/adeonir.dev/issues/78, https://github.com/adeonir/adeonir.dev/issues/79
- ADR-001 (React islands runtime) — the island this control runs on
