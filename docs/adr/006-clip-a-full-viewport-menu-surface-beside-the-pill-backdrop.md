# ADR-006: Clip a full-viewport menu surface beside the pill backdrop

Status: proposed. Date: 2026-11-16. Updated: 2026-11-16.

## Context

Below 48rem, opening the menu must grow one surface from the rectangle and corner radius of the header pill until it covers the viewport. The logo, the toggles, and the menu button must keep their positions, and the page below the header must not shift.

The element that draws the pill today carries `backdrop-filter`. A `backdrop-filter` makes its element the containing block for `absolute` and `fixed` descendants, so a full-viewport layer inside the pill is confined to the pill's box.

`clip-path` cuts both what an element paints and where it receives pointer input. A border or a shadow that the clipped element draws at its own edge is cut with it.

The header is `sticky` at `top: 0`, so it is the containing block for its `absolute` descendants. It persists across page swaps through `transition:persist`. If the box of the expanding element changes size or switches to `fixed` during the transition, the row inside it moves at the moment the menu opens.

## Decision

We will render the menu surface as a sibling of the pill backdrop inside the header. The surface holds the pill row and the navigation. It is positioned `absolute` across the full viewport width and the dynamic viewport height in both states, and we will animate only its `clip-path`.

When the menu is closed, `inset()` reproduces the pill: the header's top padding, the wrapper gutter, a height of 3.5rem, and a radius of half that height. When the menu is open, the value is `inset(0 round 0)`.

The pill backdrop stays in the document flow and keeps the header at its height. It draws the closed pill: the translucent background, the blur, the border, and the shadow. The surface has no background while the menu is closed, and it takes the opaque `popover` background only while the menu is open.

## Alternatives Considered

- **Portal the menu to `body`:** this would separate the menu from the pill row. The menu could not grow out of the header as one surface that holds the row in place.
- **Switch the surface to `fixed` only while the menu is open:** this changes the surface's box at the moment of opening, so the row moves.
- **Keep the surface inside the pill and move the blur to a pseudo-element:** this removes the containing block. But the clip would still cut the border and the shadow the pill draws at its edge, so a separate element would still have to draw the closed pill.

## Consequences

The surface's box never changes, so no layout runs during the transition, and the row and the page keep their positions. While the menu is closed, the clipped surface takes input only inside the pill's area, so page links next to the pill still respond to a tap.

The closed pill is drawn by two aligned layers: the backdrop draws the shape and the surface draws the row. The `inset()` values repeat the header's top padding, the wrapper gutter, and the pill height, so a change to any of those values also requires a change to `inset()`.

The closed geometry assumes the header is visible. This holds because the menu button lives in the header, so the menu can open only while the header is visible.

For this header, the decision replaces the `PROJECT.md` guidance to portal full-viewport overlays to `body`.

## References

- `PROJECT.md` (Gotchas: header `backdrop-blur` containing block)
- `src/components/sections/header.astro`

## Sources

- None
