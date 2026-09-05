/// <reference types="vitest/config" />

import react from '@astrojs/react'
import { getViteConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'

export default getViteConfig(
  {
    plugins: [icons({ compiler: 'jsx', jsx: 'react' })],
    resolve: { tsconfigPaths: true },
    test: { fsModuleCache: true, isolate: false },
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
