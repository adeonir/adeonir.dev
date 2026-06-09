import { PREVIEW } from 'astro:env/server'
import { defineMiddleware } from 'astro:middleware'

// In dev and preview builds, serve the landing surface at the site root; the
// guard keeps the holding page at `/` in production.
export const onRequest = defineMiddleware((context, next) => {
  if ((import.meta.env.DEV || PREVIEW) && context.url.pathname === '/') {
    return next('/_landing')
  }

  return next()
})
