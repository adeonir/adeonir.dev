---
name: 004-ssr-safe-island-rendering
created: 2026-06-17
updated: 2026-06-17
status: accepted
supersedes: []
superseded-by: []
sources: []
---

# ADR-004: SSR-safe rendering of client-resolved island state

## Status

accepted

## Context

Content pages prerender to static HTML, and the resolved skin (`[data-theme]`) is applied before first paint by an `is:inline` head script (ADR-002), so the document never flashes. A React island, however, renders its prerendered HTML before that signal exists for it: state that is only resolvable on the client — the saved or OS-resolved skin — is unknown at build time, so the island's server HTML reflects the SSR default (`dark`). The theme-toggle icon is the first such surface: its server HTML shows the moon, and after hydration the store resolves the real skin and flips to the sun — a visible icon flash on a page that otherwise does not flash. `suppressHydrationWarning` only silences React's mismatch warning, and `useEffect`/`useLayoutEffect` run after paint, so neither prevents the wrong first paint. The planned locale toggle and any future island whose first paint depends on client-resolved state share this constraint.

## Decision

We will render any island whose first paint depends on client-resolved state behind an Ark UI `ClientOnly` boundary: the interactive, state-driven primitive renders only on the client, and its pre-hydration `fallback` is a CSS-only rendering driven by the same before-paint signal (`[data-theme]`). The island's cross-root state lives in a nanostore atom seeded from the DOM at module load, so the client's first render already holds the resolved value, and the SSR-rendered control element carries `suppressHydrationWarning` to absorb the unavoidable attribute mismatch (e.g. `aria-pressed`).

## Consequences

### Positive

- The fallback paints the correct UI from the before-paint signal, so the island matches the page's no-flash guarantee.
- The interactive primitive (Ark Swap + its rotate) stays on the client unchanged — no need to drop the animation or reimplement it in CSS.
- Reusable shape: the locale toggle and future client-resolved islands follow the same boundary.
- Works with ADR-003 — the atom stays the single state source shared across hydration roots.

### Negative

- The visual is authored twice — the CSS fallback restates what the client primitive renders — and the two must be kept in visual sync or the handoff jumps.
- `suppressHydrationWarning` suppresses every attribute/text mismatch on that element, not only the intended one; a later state-dependent attribute on the same element could mismatch silently.
- The interactive control is client-only: with JavaScript disabled only the static fallback renders. Acceptable, since the control requires JavaScript to function.

### Neutral

- Establishes a project pattern (ClientOnly + CSS fallback + DOM-seeded atom) the locale toggle is expected to reuse.
- Depends on Ark `ClientOnly` rendering the fallback during SSR/first paint and on the ADR-002 resolver running before island hydration.

## Alternatives Considered

| Option | Reason Rejected | Record |
| --- | --- | --- |
| Pure-CSS icon driven by `[data-theme]` (no Ark Swap) | Resolves before paint with no JS, but drops the Ark Swap and its rotate — the toggle would swap instantly with no motion, losing the designed interaction | — |
| `useEffect`/`useLayoutEffect` sync after hydration | Runs after the first paint, so the wrong SSR icon is already on screen; `suppressHydrationWarning` hides the warning, not the flash | — |
| SSR the correct icon from a theme cookie | Reading the skin server-side needs a cookie and forces per-request rendering, breaking the page's full prerender — a request-state dependency added for one icon | — |

## References

- `docs/tech/design-doc.md#4-alternatives-considered`
- ADR-002
- ADR-003
- Ark UI `ClientOnly`: https://ark-ui.com/react/docs/components/client-only
