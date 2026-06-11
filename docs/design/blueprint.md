---
metadata:
  source: "conversation"
  created: "2026-06-05"
  version: "1.0.3"
  status: "draft"

# Region tree — design-blind, content-optional. Surfaces and blocks named by
# context. Leaf text regions carry an abstract slot label only — no copy
# strings, no colors/fonts/tokens, no requirement IDs.
surfaces:
  home:
    - block: "header"
      shape: "split"
      note: "brand on the left; nav and controls on the right. on narrow viewports nav and controls collapse behind a menu toggle that opens an overlay panel holding the same anchors and toggles"
      children:
        - block: "logo"
          shape: "full-width"
        - block: "nav"
          shape: "full-width"
          note: "horizontal anchors to the home sections — about, projects, contact"
        - block: "controls"
          shape: "full-width"
          note: "language and theme toggles"

    - block: "hero"
      shape: "stack"
      children:
        - block: "eyebrow"
          shape: "full-width"
        - block: "display"
          shape: "full-width"
        - block: "tagline"
          shape: "full-width"
        - block: "intro"
          shape: "split"
          note: "description fills one half, actions the other"
          children:
            - block: "description"
              shape: "full-width"
            - block: "actions"
              shape: "full-width"
              note: "a primary action and an outline action"

    - block: "about"
      shape: "stack"
      children:
        - block: "eyebrow"
          shape: "full-width"
        - block: "content"
          shape: "split"
          note: "tagline on one side, bio on the other"
          children:
            - block: "tagline"
              shape: "full-width"
            - block: "bio"
              shape: "full-width"

    - block: "stack"
      shape: "stack"
      children:
        - block: "eyebrow"
          shape: "full-width"
        - block: "tagline"
          shape: "full-width"
        - block: "tools"
          shape: "grid-3"
          note: "lists of tools across three columns"

    - block: "projects"
      shape: "stack"
      children:
        - block: "eyebrow"
          shape: "full-width"
        - block: "tagline"
          shape: "full-width"
        - block: "list"
          shape: "stack"
          note: "a selected subset of projects, stacked full-width; each routes to project detail"
        - block: "see-all"
          shape: "full-width"
          note: "trailing link to the full work index"

    - block: "contact"
      shape: "split"
      children:
        - block: "info"
          shape: "stack"
          children:
            - block: "eyebrow"
              shape: "full-width"
            - block: "title"
              shape: "full-width"
            - block: "text"
              shape: "full-width"
            - block: "social"
              shape: "full-width"
        - block: "form"
          shape: "full-width"

    - block: "footer"
      shape: "split"
      children:
        - block: "brand"
          shape: "stack"
          note: "logo and copyright"
        - block: "tagline"
          shape: "full-width"

  work:
    - block: "header"
      shape: "split"
      note: "persistent — same as home"
    - block: "page-header"
      shape: "stack"
      children:
        - block: "eyebrow"
          shape: "full-width"
        - block: "title"
          shape: "full-width"
        - block: "tagline"
          shape: "full-width"
    - block: "list"
      shape: "stack"
      note: "every project, stacked full-width; each routes to project detail"
    - block: "footer"
      shape: "split"
      note: "persistent — same as home"

  project:
    - block: "header"
      shape: "split"
      note: "persistent — same as home"
    - block: "page-header"
      shape: "stack"
      children:
        - block: "eyebrow"
          shape: "full-width"
        - block: "title"
          shape: "full-width"
        - block: "meta"
          shape: "full-width"
          note: "role, year"
    - block: "overview"
      shape: "stack"
      children:
        - block: "text"
          shape: "full-width"
        - block: "meta"
          shape: "full-width"
          note: "stack, links"
    - block: "gallery"
      shape: "grid-2"
      note: "images across two columns"
    - block: "body"
      shape: "full-width"
      note: "long-form case study, single column"
    - block: "prev-next"
      shape: "split"
      children:
        - block: "prev"
          shape: "full-width"
        - block: "next"
          shape: "full-width"
    - block: "footer"
      shape: "split"
      note: "persistent — same as home"

flow:
  - "home -> work"
  - "home -> project"
  - "work -> project"
  - "project -> work"
  - "project -> project"
---

# adeonir.dev Blueprint

Personal site for a developer, positioned to showcase the work. Hybrid shape:
one scrolling landing page, plus a work index route and a per-project detail
route. header and footer are persistent across all three surfaces.

## Screen Map

```
home ─┬─> work ──> project
      └─> project ──┐
                    │
                    project ─┬─> work     (header nav / back)
                             └─> project  (prev / next)
```

## home

The landing page, top to bottom:

1. **header** — split: brand on the left; horizontal nav (anchors to about,
   projects, contact) and controls (language and theme toggles) on the right.
   On narrow viewports the nav and controls collapse behind a menu toggle that
   opens an overlay panel holding the same anchors and toggles.
2. **hero** — stacked: eyebrow, display, tagline, then a split where a
   description fills one half and the actions (a primary and an outline) fill
   the other.
3. **about** — eyebrow leads, then a split: the tagline on one side, the bio
   on the other.
4. **stack** — eyebrow and tagline lead, then a three-column grid of tool
   lists.
5. **projects** — eyebrow and tagline lead, then a stacked list of a selected
   subset of projects; each card routes to its project detail. A trailing
   see-all link routes to the full work index.
6. **contact** — split: an info column (eyebrow, title, text, social links)
   beside a form.
7. **footer** — split: brand and copyright on one side, a tagline on the
   other.

## work

The full project index:

1. **header** — persistent.
2. **page-header** — stacked eyebrow, title, tagline.
3. **list** — every project stacked full-width; each routes to project detail.
4. **footer** — persistent.

## project

The per-project case study:

1. **header** — persistent.
2. **page-header** — stacked eyebrow, title, and meta (role, year).
3. **overview** — stacked: the text, then meta (stack, links).
4. **gallery** — two-column grid of images.
5. **body** — long-form case study in a single column.
6. **prev-next** — split: previous on the left, next on the right.
7. **footer** — persistent.
