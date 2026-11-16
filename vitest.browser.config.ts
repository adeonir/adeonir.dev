import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'
import { getViteConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'

import { astroInlineConfig } from './vitest.browser.astro.mjs'

// Vitest inlines every SSR dependency, which breaks React's CommonJS entry.
// Keep Astro inline and let everything else load through Node.
const externalizeDependencies = {
  name: 'externalize-dependencies',
  configResolved(config: any) {
    config.environments.ssr.resolve.noExternal = [
      'astro',
      /^@astrojs\//,
      'astro-seo',
    ]
  },
}

export default getViteConfig(
  {
    plugins: [
      tailwindcss(),
      icons({ compiler: 'jsx', jsx: 'react' }),
      externalizeDependencies,
    ],
    test: {
      include: ['src/**/*.browser.ts'],
      globalSetup: ['./vitest.browser.setup.ts'],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
        commands: {
          async emulateReducedMotion(ctx, reduce: boolean) {
            await ctx.page.emulateMedia({
              reducedMotion: reduce ? 'reduce' : 'no-preference',
            })
          },
          async renderHeader(ctx, pathname: string) {
            const { experimental_AstroContainer: AstroContainer } =
              await import('astro/container')
            const { default: reactRenderer } =
              await import('@astrojs/react/server.js')
            const { default: Header } = await ctx.project.vite.ssrLoadModule(
              '/src/components/sections/header.astro',
            )
            const container = await AstroContainer.create({
              manifest: {
                // Islands stay unhydrated; the directives only need to exist.
                clientDirectives: new Map([
                  ['visible', '(load) => load()'],
                  ['after-load', '(load) => load()'],
                ]),
                i18n: {
                  fallback: undefined,
                  fallbackType: 'redirect',
                  strategy: 'pathname-prefix-other-locales',
                  locales: ['pt', 'en'],
                  defaultLocale: 'pt',
                  domainLookupTable: {},
                  domains: undefined,
                },
              } as never, // the container fills every other manifest field
            })

            container.addServerRenderer({ renderer: reactRenderer })
            container.addClientRenderer({
              name: '@astrojs/react',
              entrypoint: '@astrojs/react/client.js',
            })

            return container.renderToString(Header, {
              request: new Request(`https://adeonir.dev${pathname}`),
            })
          },
        },
      },
    },
  },
  { ...astroInlineConfig, integrations: [react()] },
)
