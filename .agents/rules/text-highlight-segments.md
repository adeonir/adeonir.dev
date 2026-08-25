---
paths:
  - "src/**/*.ts"
  - "src/**/*.astro"
---

## Highlight Segment Field Naming

**Impact: MEDIUM**

Inline highlight segments in section content name their boolean field by the text's meaning, never by a color token. Use `highlight`, which the section renderer maps to `text-secondary`. Never name the field `secondary`: that leaks the color token into content data, and the content then has to change whenever the token does.

**Incorrect:**

```astro
<!-- the field carries the color token instead of the meaning -->
<h2 class="text-display">
  {headline.map((s) => (s.secondary ? <span class="text-secondary">{s.text}</span> : s.text))}
</h2>
```

**Correct:**

```astro
<!-- the field carries the meaning; the renderer picks the token -->
<h2 class="text-display">
  {headline.map((s) => (s.highlight ? <span class="text-secondary">{s.text}</span> : s.text))}
</h2>
```
