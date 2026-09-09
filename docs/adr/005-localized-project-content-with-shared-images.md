---
name: 005-localized-project-content-with-shared-images
date: 2026-09-07
updated: 2026-09-08
sources:
  - CONTEXT.md
  - docs/tech/design-doc.md
  - src/content.config.ts
---

# ADR-005: Localized Project Content with Shared Images

## Status

Accepted

## Context

Each project page has separate Portuguese and English content. The content collection must keep each locale explicit and must not fall back from one locale to another. Project images usually do not change between locales, so storing them inside each locale folder would duplicate the same files. Keeping both MDX files in one project folder would avoid image duplication, but would encode the locale in filenames such as `index.mdx` and `index.en.mdx` instead of following the locale-first structure used by the other content collections. With the images out of the entry's folder, that folder holds one file, so it buys nothing.

## Decision

We will store each project MDX entry at `src/content/projects/<locale>/<slug>.mdx` and store images shared by both locales at `src/assets/projects/<slug>/`.

## Consequences

Each locale owns a complete project entry under the same directory structure, while shared images have one source file. Relative image paths cross from the content directory into the shared asset directory. The `projectsContent` glob matches `*/*.mdx`, and the generated IDs remain `<locale>/<slug>`, so the current route and locale filters remain valid.

## References

- `CONTEXT.md`
- `docs/tech/design-doc.md#33-conventions`
- `docs/tech/design-doc.md#34-domain`
- `src/content.config.ts`
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
