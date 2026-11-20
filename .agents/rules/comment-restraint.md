---
paths:
  - 'src/**/*.{astro,ts,tsx,css}'
---

## Comments Only When the Code Cannot Say It

**Impact: MEDIUM**

A comment earns its place only when a reader of the code alone cannot recover it: the constraint that forces a choice, the non-obvious source of a value, or the reason a workaround exists. If reading the code already explains the line, the comment is noise — delete it, because a comment that restates the code rots with the next edit and raises the cost of every read. Never restate the code in words, narrate the step the next lines perform, or keep a comment that describes a previous version of the code.

**Incorrect:**

```typescript
// The enter order runs from the badges nearest the hero's vertical middle to the ones nearest its edges.
const enterOrder = (key: BreakpointKey) =>
  badges
    .map((badge) => ({ id: badge.id, at: badge[key] }))
    .sort((a, b) => Math.abs(a.at.y) - Math.abs(b.at.y))
```

**Correct:**

```typescript
const enterOrder = (key: BreakpointKey) =>
  badges
    .map((badge) => ({ id: badge.id, at: badge[key] }))
    .sort((a, b) => Math.abs(a.at.y) - Math.abs(b.at.y))
```
