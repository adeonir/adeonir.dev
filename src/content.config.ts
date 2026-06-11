import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import {
  footerSchema,
  headerSchema,
  heroSchema,
  settingsSchema,
} from '~/content/schemas'

const settings = defineCollection({
  loader: file('src/content/settings.yaml'),
  schema: settingsSchema,
})

const header = defineCollection({
  loader: file('src/content/header.yaml'),
  schema: headerSchema,
})

const hero = defineCollection({
  loader: file('src/content/hero.yaml'),
  schema: heroSchema,
})

const footer = defineCollection({
  loader: file('src/content/footer.yaml'),
  schema: footerSchema,
})

export const collections = { settings, header, footer, hero }
