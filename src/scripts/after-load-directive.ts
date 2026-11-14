import type { ClientDirective } from 'astro'

const afterLoad: ClientDirective = (load) => {
  const hydrate = async () => {
    const run = await load()
    await run()
  }
  const idle = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(hydrate, { timeout: 4000 })
    } else {
      setTimeout(hydrate, 200)
    }
  }

  if (document.readyState === 'complete') idle()
  else addEventListener('load', idle, { once: true })
}

export default afterLoad
