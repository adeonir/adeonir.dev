import { loadRenderers } from 'astro:container'
import { getContainerRenderer } from '@astrojs/react/container-renderer'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

import type { Locale } from '~/helpers/content'
import { supportedLocales } from '~/helpers/content'

type ContainerOptions = NonNullable<Parameters<typeof AstroContainer.create>[0]>

export async function renderAstroComponent(
  component: AstroComponentFactory,
  locale: Locale,
): Promise<string> {
  const renderers = await loadRenderers([getContainerRenderer()])
  const manifest: ContainerOptions['manifest'] = {
    i18n: {
      locales: [...supportedLocales],
      defaultLocale: 'pt',
      routing: { prefixDefaultLocale: false },
    },
  } as unknown as ContainerOptions['manifest']

  const container = await AstroContainer.create({ renderers, manifest })

  const path = locale === 'pt' ? '/' : `/${locale}/`

  return container.renderToString(component, {
    request: new Request(`https://example.com${path}`),
  })
}
