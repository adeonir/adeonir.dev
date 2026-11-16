import { execFileSync } from 'node:child_process'

// The dev content store lives in .astro/, and only `astro dev` fills it.
// A child process loads Astro natively; Vitest cannot import it.
export default function setup() {
  execFileSync(process.execPath, ['vitest.browser.sync.mjs'], {
    stdio: 'inherit',
  })
}
