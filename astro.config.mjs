import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import robotsTxt from 'astro-robots-txt'
import { defineConfig, envField } from 'astro/config'
import icons from 'unplugin-icons/vite'

const noIndexRoutes = ['/styleguide', '/maintenance']

export default defineConfig({
  site: 'https://adeonir.dev',
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !noIndexRoutes.includes(new URL(page).pathname.replace(/\/+$/, '')),
    }),
    robotsTxt({
      policy: [{ userAgent: '*', allow: '/', disallow: noIndexRoutes }],
    }),
  ],
  env: {
    schema: {
      POSTHOG_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      POSTHOG_HOST: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://t.adeonir.dev',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss(), icons({ compiler: 'jsx', jsx: 'react' })],
  },
})
