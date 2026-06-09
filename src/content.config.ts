import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { settingsSchema } from '~/content/schemas'

const settings = defineCollection({
  loader: file('src/content/settings.yaml'),
  schema: settingsSchema,
})

export const collections = { settings }
