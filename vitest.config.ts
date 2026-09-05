/// <reference types="vitest/config" />

import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [icons({ compiler: 'jsx', jsx: 'react' })],
  resolve: { tsconfigPaths: true },
})
