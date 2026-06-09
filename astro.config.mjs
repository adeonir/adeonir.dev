import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

// astro.config can't import `astro:env`, so read the preview flag from process.env.
const isPreviewBuild = process.env.PREVIEW === 'true'

function landing() {
  return {
    name: 'landing',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command === 'dev' || isPreviewBuild) {
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
      PREVIEW: envField.boolean({
        context: 'server',
        access: 'public',
        default: false,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
