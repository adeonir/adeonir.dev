import preact from '@astrojs/preact'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
})
