# adeonir.dev

Personal portfolio for a design engineer. The visual identity is the product. It is person-first and freelance-friendly: the site introduces the person and the work in a plain voice, never a marketing pitch, while staying open to freelance projects.

## Language

**Design engineer**:
A frontend professional who turns design decisions into working interfaces, preserving the visual intent through implementation and resolving technical constraints without degrading the experience. Their scope is the interface itself: layout, typography, interaction, and composition, worked out in code and browser prototypes and delivered as responsive, accessible, performant, and reusable patterns. Sometimes, in their own projects, they can own design and frontend end to end. They are not a Product Designer: the role carries no user research, no product strategy, and no ownership of discovery.
_Avoid_: Designer and developer in equal parts, full Product Designer, product engineer

**Entrance**:
Content coming to rest as the reader scrolls it into view.
_Avoid_: Reveal, scroll reveal

**Rest**:
The final visual state of content, with no entrance running.
_Avoid_: Hidden, pending

**Visit**:
One full page load or one client navigation that replaces the page content. An entrance runs at most once per visit.
_Avoid_: Session, view

## Stakes

The site holds no accounts, no payments, and no stored personal data: the contact form sends email and keeps nothing. The whole surface is public reading. A failure here costs no data and no money, so the stake is the impression the page leaves — the visual identity is the product, and a reader who meets a broken frame reads it as the work.

The one failure that is not cosmetic is content that never reaches its resting position. A reader then sees an empty page instead of a rough one, and no error tells them why. Anything that hides content before showing it carries that risk and is weighed against it.

## Gotchas

- A `file()` collection entry can come back `undefined`, so a section must guard the entry before reading `.data` — source: src/components/sections/hero.astro; scope: every section that calls `getEntry`
- Editing the content config or a schema needs a dev-server restart before the new shape is picked up; scope: content collections
- Every `allowBuilds` entry must resolve to `true` or `false` for a dependency present in the tree. An unresolved placeholder makes every `pnpm run` command fail during pnpm's dependency check — source: pnpm-workspace.yaml; scope: dependency changes
- The Lighthouse budget runs through the scoped `@lhci/cli`; the unscoped `lhci` package is a different project — source: package.json; scope: pnpm lighthouse
- `Astro.locals.runtime` no longer exists. Read Cloudflare bindings through `cloudflare:workers` and reach the execution context through `Astro.locals.cfContext` — source: src/actions/index.ts; scope: anything touching Cloudflare bindings
- The `website` honeypot is checked inside the Action rather than in the shared validation schema, so a bot reaches the silent discard path instead of a validation error. It looks like a missing rule and is not — source: src/actions/index.ts; scope: contact flow
- The contact Action reads the UTM values from its validated input, never from `context.url`, because the Action endpoint carries no page query — source: src/actions/index.ts; scope: contact flow
