import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

// Injects the dev-only landing surface; `_`-prefixed entrypoint keeps it out of
// production builds, and the route is only added under `astro dev` (404 in prod).
function landing() {
  return {
    name: 'landing',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command === 'dev') {
          injectRoute({
            pattern: '/_landing',
            entrypoint: './src/pages/_landing.astro',
          })
        }
      },
    },
  }
}

export default defineConfig({
  site: 'https://adeonir.dev',
  integrations: [
    preact(),
    landing(),
    sitemap({ filter: (page) => !page.includes('/styleguide') }),
  ],
  env: {
    schema: {
      UMAMI_WEBSITE_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      UMAMI_HOST: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://cloud.umami.is',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
