/// <reference types="vitest/config" />

import react from '@astrojs/react'
import { getViteConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default getViteConfig(
  {
    plugins: [tsconfigPaths(), icons({ compiler: 'jsx', jsx: 'react' })],
  },
  {
    configFile: false,
    site: 'https://adeonir.dev',
    integrations: [react()],
    i18n: {
      locales: ['pt', 'en'],
      defaultLocale: 'pt',
      routing: { prefixDefaultLocale: false },
    },
  },
)
