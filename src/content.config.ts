import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import {
  aboutSchema,
  footerSchema,
  headerSchema,
  heroSchema,
  settingsSchema,
  stackSchema,
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

const about = defineCollection({
  loader: file('src/content/about.yaml'),
  schema: aboutSchema,
})

const footer = defineCollection({
  loader: file('src/content/footer.yaml'),
  schema: footerSchema,
})

const stack = defineCollection({
  loader: file('src/content/stack.yaml'),
  schema: stackSchema,
})

export const collections = { settings, header, footer, hero, about, stack }
