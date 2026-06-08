import { defineMiddleware } from 'astro:middleware'

// In dev, serve the landing surface at the site root so it is built where it will
// live. The guard makes this a no-op in production (the holding page stays at `/`).
export const onRequest = defineMiddleware((context, next) => {
  if (import.meta.env.DEV && context.url.pathname === '/') {
    return next('/_landing')
  }

  return next()
})
