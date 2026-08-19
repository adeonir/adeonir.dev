---
paths:
  - 'src/**/*.ts'
  - 'src/**/*.tsx'
  - 'src/**/*.astro'
---

## Tilde Alias for Cross-Directory Imports

**Impact: MEDIUM**

Imports that reach outside the current file's directory must use the `~/` alias (resolves to `src/`). Relative imports (`./`, `../`) are reserved for files in the same directory. Deep `../../` chains break on file moves and obscure which package each module belongs to.

**Incorrect:**

```tsx
import { cn } from '../../lib/cn'
import { Button } from '../../../components/ui/button'
```

**Correct:**

```tsx
import { cn } from '~/lib/cn'
import { Button } from '~/components/ui/button'
```
