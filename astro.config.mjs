import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import robotsTxt from 'astro-robots-txt'
import { defineConfig, envField, fontProviders } from 'astro/config'
import icons from 'unplugin-icons/vite'

const noIndexRoutes = ['/styleguide', '/maintenance']

export default defineConfig({
  site: 'https://adeonir.dev',
  adapter: cloudflare(),
  fonts: [
    {
      name: 'Geist',
      cssVariable: '--font-geist',
      provider: fontProviders.fontsource(),
      weights: ['100 900'],
      styles: ['normal'],
      fallbacks: ['Arial', 'sans-serif'],
    },
    {
      name: 'Fira Code',
      cssVariable: '--font-fira-code',
      provider: fontProviders.fontsource(),
      weights: ['300 700'],
      styles: ['normal'],
      fallbacks: ['monospace'],
    },
  ],
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
