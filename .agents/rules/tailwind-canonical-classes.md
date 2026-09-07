---
paths:
  - 'src/**/*.astro'
  - 'src/**/*.tsx'
  - 'src/**/*.ts'
---

## Class Composition With cn

**Impact: MEDIUM**

Compose every class list with `cn` from `~/helpers/classnames`, in `.astro` files as much as in React ones. Astro's `class:list` only concatenates, so two utilities of the same family on one element leave the winner to whichever Tailwind emits later in the stylesheet — an order that shifts when a token is renamed, with no error to show for it. `cn` runs `tailwind-merge`, which resolves the pair by the order written. A single literal string with nothing to compose stays a plain `class`.

**Incorrect:**

```astro
<a
  class:list={[
    'group gap-2',
    buttonVariants({ variant: 'link', size: 'inline' }),
  ]}
>
```

**Correct:**

```astro
<a
  class={cn('group gap-2', buttonVariants({ variant: 'link', size: 'inline' }))}
>
```

Reference: [tailwind-merge — What is it for](https://github.com/dcastil/tailwind-merge/blob/main/docs/what-is-it-for.md)

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
