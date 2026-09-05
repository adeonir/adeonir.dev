---
name: 003-nanostores-island-state
created: 2026-06-16
updated: 2026-06-16
status: accepted
supersedes: []
superseded-by: []
sources:
  - docs/adr/001-react-islands-runtime.md
  - docs/adr/002-theme-switching-mechanism.md
  - https://docs.astro.build/en/recipes/sharing-state-islands/
---

# ADR-003: Nano Stores for Shared State Between Islands

## Status

accepted

## Context

The UI is built from a handful of React islands (ADR-001), each its own independent hydration root. Building the theme toggle (feature 026) surfaced the first case of one logical control existing as **two island instances**: the toggle renders in the header on desktop and inside the mobile menu on small screens — two separate `ThemeToggle` instances living in two separate React trees.

Each instance currently keeps its own `useState` for the active skin and reads `document.documentElement.dataset.theme` on mount. There is no shared source of truth, so toggling one instance does not update the other — they can diverge. The same shape is coming with the planned i18n language switcher (multiple islands needing a shared locale).

Astro islands cannot share React Context: context providers do not cross partially-hydrated island boundaries, because each island is a distinct React root with no common parent. A mechanism for sharing **runtime state** across islands has to be chosen before more than one consumer of the same state exists.

This is about runtime **state** (the active skin, later the locale), not static **content** (labels, copy), which stays in content collections.

## Decision

We will adopt **Nano Stores** as the client-side state layer shared between islands. Cross-island runtime state lives in nanostores atoms in `src/stores/`, read and mutated by any island via `@nanostores/react`'s `useStore` and the store's `.set`. The active skin is the first store (`$theme`). Static content stays in content collections passed as props — stores hold state, never copy.

## Consequences

### Positive

- One source of truth for shared state: both theme toggles (and any future island) reflect and mutate the same `$theme`, removing the desync between the header and mobile-menu instances.
- Islands decouple from one another: a consumer reads the store directly instead of receiving state threaded through intermediate components or sibling islands (which is impossible across islands anyway — no common React parent).
- ~1kb, framework-agnostic runtime — works the same if an island is ever Preact/Solid/vanilla, and stays within the mobile performance budget.
- Establishes the pattern for the upcoming i18n locale switcher and any later shared client state.

### Negative

- Adds a dependency and a new place state can live; contributors must know that shared client state belongs in stores — not in component `useState` or in props drilled across the tree.
- A store seeded from server data needs a client-side bridge, so the boundary "state in stores, content in collections" must be held deliberately to avoid misusing a store as a carrier for static config.
- Store state is client-only; `$theme` must initialise from the `[data-theme]` the no-flash inline resolver already sets (ADR-002) so hydration stays consistent and no flash is introduced.

### Neutral

- `useStore` replaces per-island `useState` for shared state; island-local UI state (e.g. a popover's open flag) stays in `useState`.
- The toggle's mount-time DOM read is replaced by reading `$theme`, which itself initialises from the DOM/storage.
- A new `src/stores/` directory joins the source tiers.

## Alternatives Considered

| Option | Reason Rejected | Record |
| --- | --- | --- |
| React Context | Does not cross island boundaries — each Astro island is a separate React root with no shared provider; the documented Astro constraint | — |
| Prop drilling through components/islands | Couples intermediate components to state they don't use, and cannot reach a sibling island at all (no common React parent) | — |
| Custom events / the `data-theme` attribute as the bus | Works for a single attribute but offers no typed API, no subscription ergonomics, and does not scale to richer shared state (locale and beyond) | — |
| Zustand / Jotai / Redux | React-coupled and heavier; nanostores is ~1kb and framework-agnostic, matching the islands model and the perf budget | — |

## References

- `docs/adr/001-react-islands-runtime.md` — islands are separate React roots, which is why context cannot span them
- `docs/adr/002-theme-switching-mechanism.md` — `$theme` initialises from the `[data-theme]` the inline resolver sets
- Astro — Share state between islands (recommends Nano Stores): https://docs.astro.build/en/recipes/sharing-state-islands/
- Feature 026 (theme toggle) — first consumer: the header + mobile-menu toggles sharing `$theme`
