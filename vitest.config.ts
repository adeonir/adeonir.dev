/// <reference types="vitest/config" />

import { defineConfig } from 'vitest/config'
import icons from 'unplugin-icons/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), icons({ compiler: 'jsx', jsx: 'react' })],
})
