import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { headerSchema, settingsSchema } from '~/content/schemas'

const settings = defineCollection({
  loader: file('src/content/settings.yaml'),
  schema: settingsSchema,
})

const header = defineCollection({
  loader: file('src/content/header.yaml'),
  schema: headerSchema,
})

export const collections = { settings, header }
