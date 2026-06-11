---
paths:
  - "src/**/*.ts"
  - "src/**/*.astro"
---

## Highlight Segment Field Naming

**Impact: MEDIUM**

Inline highlight segments in content collections name their boolean field by the text's meaning, never by a color token. Use `strong` for strong importance and `emphasis` for stress emphasis (the HTML `<strong>`/`<em>` split); the section renderer maps meaning to token — `strong` to `text-secondary`, `emphasis` to `text-emphasis`. Never name the field `secondary`, which leaks the color token into content data. The split is also a WCAG floor: `strong` is for large text (>=24px, or >=18.66px bold) that clears 3:1 with the vivid `text-secondary`, while `emphasis` is for small text that needs the darker `text-emphasis` to clear 4.5:1. Beware the trap — in the dark skin both tokens resolve to the same azalea-500, so a wrong pick is invisible in dark and only surfaces in the light skin (secondary=azalea-600, emphasis=azalea-750); verify highlighted text in the light skin.

**Incorrect:**

```astro
<!-- large tagline: meaning mislabeled as `emphasis`, rendered with the small-text token -->
<p class="text-3xl font-semibold">
  {tagline.map((s) => (s.emphasis ? <span class="text-emphasis">{s.text}</span> : s.text))}
</p>
```

**Correct:**

```astro
<!-- large tagline: meaning is `strong`, rendered with the large-text token -->
<p class="text-3xl font-semibold">
  {tagline.map((s) => (s.strong ? <span class="text-secondary">{s.text}</span> : s.text))}
</p>

<!-- small tagline keeps `emphasis` -> text-emphasis -->
<p class="text-code">
  {tagline.map((s) => (s.emphasis ? <span class="text-emphasis">{s.text}</span> : s.text))}
</p>
```

Reference: [WCAG 2.1 — Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
