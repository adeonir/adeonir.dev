---
paths:
  - 'src/**/*.astro'
  - 'src/**/*.ts'
  - 'src/**/*.tsx'
  - 'src/**/*.css'
---

## Kebab-Case Source Filenames

**Impact: MEDIUM**

All source filenames under `src/` use lowercase kebab-case (`gallery.tsx`, `featured.astro`, `base-layout.astro`, `global.css`). Exports inside those files stay PascalCase for components and camelCase for functions/values. Mixing casing styles across the file tree forces consumers to remember the spelling of each path and breaks case-sensitive deploy targets (e.g., Linux CI from a macOS dev box).

**Incorrect:**

```text
src/components/ui/Button.tsx
src/components/islands/NavMenu.tsx
src/lib/Cn.ts
```

**Correct:**

```text
src/components/ui/button.tsx          // exports: export function Button() {}
src/components/islands/nav-menu.tsx   // exports: export function NavMenu() {}
src/lib/cn.ts                         // exports: export function cn() {}
```
