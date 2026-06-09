import preact from '@astrojs/preact'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Injects the dev-only landing surface; `_`-prefixed entrypoint keeps it out of
// production builds, and the route is only added under `astro dev` (404 in prod).
function landing() {
  return {
    name: 'landing',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command === 'dev') {
          injectRoute({ pattern: '/_landing', entrypoint: './src/pages/_landing.astro' })
        }
      },
    },
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://adeonir.dev',
  integrations: [preact(), landing()],
  vite: {
    plugins: [tailwindcss()],
  },
})
