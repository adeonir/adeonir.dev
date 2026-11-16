// Astro settings shared by the browser test config and its content sync.
// The site config is not reused: its Cloudflare adapter starts workerd.
/** @type {import('astro').AstroInlineConfig} */
export const astroInlineConfig = {
  configFile: false,
  site: 'https://adeonir.dev',
  cacheDir: './.astro/',
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: false },
  },
}
