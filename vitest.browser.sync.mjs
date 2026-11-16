import { sync } from 'astro'

import { astroInlineConfig } from './vitest.browser.astro.mjs'

await sync(astroInlineConfig)
