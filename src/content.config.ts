import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { aboutSchema } from '~/schemas/about'
import { contactSchema } from '~/schemas/contact'
import { emailsSchema } from '~/schemas/emails'
import { footerSchema } from '~/schemas/footer'
import { headerSchema } from '~/schemas/header'
import { heroSchema } from '~/schemas/hero'
import { mobileMenuSchema } from '~/schemas/mobile-menu'
import { notFoundSchema } from '~/schemas/not-found'
import { settingsSchema } from '~/schemas/settings'
import { stackSchema } from '~/schemas/stack'
import { themeToggleSchema } from '~/schemas/theme-toggle'

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

const themeToggle = defineCollection({
  loader: file('src/content/theme-toggle.yaml'),
  schema: themeToggleSchema,
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
  themeToggle,
  footer,
  hero,
  about,
  stack,
  contact,
  notFound,
  emails,
}
