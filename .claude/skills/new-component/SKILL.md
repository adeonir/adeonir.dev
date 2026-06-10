---
name: new-component
description: Scaffold a new component following project conventions — kebab filename, PascalCase export, ~/  imports, semantic tokens, no hex. Tiers: ui (components/ui/), island (components/islands/), section (components/sections/), tsx/astro (components/). Use this skill whenever creating any new component file in this project, even if the user just says "create a button component" or "add a hero section".
---

# new-component

Scaffold a component file from the correct tier, applying all project conventions.

## Args

```
/new-component <tier> <name> [primitive]
```

- `tier` — one of: `ui`, `island`, `section`, `tsx`, `astro`
- `name` — kebab-case component name (e.g. `theme-toggle`, `hero`)
- `primitive` — (ui tier only, optional) Ark UI primitive slug (e.g. `switch`, `dialog`)

## Conventions (apply to every tier)

- **Filename**: kebab-case (e.g. `theme-toggle.tsx`)
- **Default export**: PascalCase matching the filename (e.g. `ThemeToggle`)
- **Imports**: `~/` alias for any cross-directory import; `./`/`../` only for same-directory
- **Styling**: semantic token classes only — `bg-background`, `text-foreground`, `bg-surface`,
  `bg-primary`, `text-on-primary`, `border-border`, etc. Never hardcode hex or oklch values.
  Never use `dark:` variants — skins are handled by `[data-theme]` on `:root` in global.css.
- **JSX runtime**: React (`@astrojs/react`) — hooks come from `react`.
  `tsconfig.json` sets `jsxImportSource: react` globally. In `.tsx` use `className`
  (never `class` — that's `.astro` only).

## Tier inference (when not specified)

Infer from context:

- Styled HTML element or reusable visual primitive (badge, divider, avatar, label…) → `ui`
- Wraps an Ark UI primitive with project tokens → `ui` (pass the primitive slug as third arg)
- Needs `useState`/`useEffect`, interactive, client-only → `island`
- Page section, layout region, content block → `section`
- Composition of other components, server-rendered, no state → `astro`
- Stateful but reused inside an island (not a hydration boundary itself) → `tsx`

If still ambiguous, ask.

## Steps

### 1. Derive names and path

From `<tier>` and `<name>`:

| Tier | Path | Extension |
|------|------|-----------|
| `ui` | `src/components/ui/<name>.tsx` | `.tsx` |
| `island` | `src/components/islands/<name>.tsx` | `.tsx` |
| `section` | `src/components/sections/<name>.astro` | `.astro` |
| `tsx` | `src/components/<name>.tsx` | `.tsx` |
| `astro` | `src/components/<name>.astro` | `.astro` |

PascalCase the name: `theme-toggle` → `ThemeToggle`.

### 2. For `ui` tier with a primitive arg

Call the `ark-ui` MCP before writing the file:

1. `get_component_props` for the primitive — understand root props and anatomy parts
2. `get_example` for the primitive — see the canonical usage pattern
3. `styling_guide` — confirm how to apply classes to each part

Use the anatomy to scaffold the correct sub-component structure. Alias the Ark import
to avoid name collisions with the export — replace `Switch` with the actual primitive name:

```tsx
// Replace "Switch" with the actual primitive (e.g. Dialog, Tooltip, Select…)
import { Switch as ArkSwitch } from '@ark-ui/react/switch'
import type { SwitchRootProps } from '@ark-ui/react/switch'
```

### 3. Write the file

Use the matching template below. Fill in the real component name and structure.
After writing, the auto-format hook will handle formatting — no need to run manually.

---

## Templates

### `ui` — default (factory)

Built on the Ark UI factory (`ark.<element>`) so every `ui` primitive is polymorphic and accepts
`asChild` — same signature as the Ark-wrapped template. Pass `asChild` with a **single** child to
swap the rendered element without rewriting (e.g. render a badge as `<a>` instead of `<span>`).

```tsx
// src/components/ui/[name].tsx
// Pick the element this primitive renders (div, span, button…) — keep the generic in sync
import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

type Props = HTMLArkProps<'div'>

export default function Name(props: Props) {
  return <ark.div className="bg-surface text-foreground" {...props} />
}
```

### `ui` — with Ark UI (fill anatomy from MCP output)

Replace all occurrences of `Primitive`/`primitive` with the real primitive name (e.g. `Switch`/`switch`).

```tsx
// src/components/ui/[name].tsx
// Replace "Primitive" → actual primitive name from MCP (e.g. Switch, Dialog, Select)
import { Primitive as ArkPrimitive } from '@ark-ui/react/primitive'
import type { PrimitiveRootProps } from '@ark-ui/react/primitive'

type Props = PrimitiveRootProps

export default function Name(props: Props) {
  return (
    <ArkPrimitive.Root className="bg-surface text-foreground border-border" {...props}>
      {/* anatomy parts — add sub-components with semantic token classes per MCP output */}
    </ArkPrimitive.Root>
  )
}
```

### `ui` — plain HTML (fallback)

For a trivial primitive that never needs polymorphism or `asChild` (divider, static label), skip
the factory and render the element directly:

```tsx
// src/components/ui/[name].tsx
import type { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export default function Name({ children }: Props) {
  return (
    <div className="bg-surface text-foreground">
      {children}
    </div>
  )
}
```

### `island`

```tsx
// src/components/islands/[name].tsx
// import { useState, useEffect } from 'react' — add as needed

export default function Name() {
  return (
    <div className="bg-surface text-foreground">
    </div>
  )
}
```

### `tsx` (stateful, not a hydration boundary)

```tsx
// src/components/[name].tsx
// import { useState, useEffect } from 'react' — add as needed

export default function Name() {
  return (
    <div className="bg-surface text-foreground">
    </div>
  )
}
```

### `section`

```astro
---
// src/components/sections/[name].astro
interface Props {
  // define section props here
}
const {} = Astro.props
---

<section class="bg-background text-foreground">
</section>
```

### `astro` (composition)

```astro
---
// src/components/[name].astro
interface Props {
  // define component props here
}
const {} = Astro.props
---

<div class="bg-surface text-foreground">
  <slot />
</div>
```
