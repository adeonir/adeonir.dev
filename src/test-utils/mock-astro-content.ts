import { vi } from 'vitest'

// Shared across every file that mocks 'astro:content': with vitest.config.ts's
// fsModuleCache, a second independent `vi.mock('astro:content', ...)` in another
// file gets silently ignored, and both files end up bound to whichever one ran
// first. Importing the same fn here keeps both files' mocks pointing at one target.
export const getEntry = vi.fn()
