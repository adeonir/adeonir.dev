---
paths:
  - 'src/**/*.astro'
  - 'src/**/*.tsx'
  - 'src/**/*.ts'
---

## Tailwind Canonical Shorthand Over Arbitrary Values

**Impact: LOW**

Prefer Tailwind 4's canonical shorthand utilities over arbitrary bracket notation when both express the same value. `aspect-4/5` resolves to the same CSS as `aspect-[4/5]`, but the bracket form opts the class out of Tailwind's lint-friendly catalog, defeats `useSortedClasses` canonical ordering, and signals to readers that the value falls outside the design scale when it does not. Reach for `aspect-[<value>]`, `grid-cols-[<value>]`, or `text-[<value>]` only when the value cannot be expressed in the built-in scale.

**Incorrect:**

```astro
<img class="aspect-[4/5] lg:aspect-[5/6]" />
<div class="grid-cols-[repeat(3,1fr)]"></div>
```

**Correct:**

```astro
<img class="aspect-4/5 lg:aspect-5/6" />
<div class="grid-cols-3"></div>
```

Reference: [Tailwind CSS — Using arbitrary values](https://tailwindcss.com/docs/styling-with-utility-classes#using-arbitrary-values)
