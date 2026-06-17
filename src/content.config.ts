import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import {
  aboutSchema,
  contactSchema,
  emailsSchema,
  footerSchema,
  headerSchema,
  heroSchema,
  mobileMenuSchema,
  notFoundSchema,
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

const mobileMenu = defineCollection({
  loader: file('src/content/mobile-menu.yaml'),
  schema: mobileMenuSchema,
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

const contact = defineCollection({
  loader: file('src/content/contact.yaml'),
  schema: contactSchema,
})

const notFound = defineCollection({
  loader: file('src/content/not-found.yaml'),
  schema: notFoundSchema,
})

const emails = defineCollection({
  loader: file('src/content/emails.yaml'),
  schema: emailsSchema,
})

export const collections = {
  settings,
  header,
  mobileMenu,
  footer,
  hero,
  about,
  stack,
  contact,
  notFound,
  emails,
}
