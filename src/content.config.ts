import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { aboutSchema } from '~/schemas/about'
import { consoleSchema } from '~/schemas/console'
import { contactSchema } from '~/schemas/contact'
import { emailsSchema } from '~/schemas/emails'
import { expertiseSchema } from '~/schemas/expertise'
import { footerSchema } from '~/schemas/footer'
import { headerSchema } from '~/schemas/header'
import { heroSchema } from '~/schemas/hero'
import { languageToggleSchema } from '~/schemas/language-toggle'
import { mobileMenuSchema } from '~/schemas/mobile-menu'
import { notFoundSchema } from '~/schemas/not-found'
import { projectsSchema } from '~/schemas/projects'
import { settingsSchema } from '~/schemas/settings'
import { stackSchema } from '~/schemas/stack'
import { themeToggleSchema } from '~/schemas/theme-toggle'

const settings = defineCollection({
  loader: file('src/content/settings.yaml'),
  schema: settingsSchema,
})

const settingsEn = defineCollection({
  loader: file('src/content/settings.en.yaml'),
  schema: settingsSchema,
})

const header = defineCollection({
  loader: file('src/content/header.yaml'),
  schema: headerSchema,
})

const headerEn = defineCollection({
  loader: file('src/content/header.en.yaml'),
  schema: headerSchema,
})

const mobileMenu = defineCollection({
  loader: file('src/content/mobile-menu.yaml'),
  schema: mobileMenuSchema,
})

const mobileMenuEn = defineCollection({
  loader: file('src/content/mobile-menu.en.yaml'),
  schema: mobileMenuSchema,
})

const themeToggle = defineCollection({
  loader: file('src/content/theme-toggle.yaml'),
  schema: themeToggleSchema,
})

const themeToggleEn = defineCollection({
  loader: file('src/content/theme-toggle.en.yaml'),
  schema: themeToggleSchema,
})

const languageToggle = defineCollection({
  loader: file('src/content/language-toggle.yaml'),
  schema: languageToggleSchema,
})

const languageToggleEn = defineCollection({
  loader: file('src/content/language-toggle.en.yaml'),
  schema: languageToggleSchema,
})

const hero = defineCollection({
  loader: file('src/content/hero.yaml'),
  schema: heroSchema,
})

const heroEn = defineCollection({
  loader: file('src/content/hero.en.yaml'),
  schema: heroSchema,
})

const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: projectsSchema,
})

const projectsEn = defineCollection({
  loader: file('src/content/projects.en.yaml'),
  schema: projectsSchema,
})

const about = defineCollection({
  loader: file('src/content/about.yaml'),
  schema: aboutSchema,
})

const aboutEn = defineCollection({
  loader: file('src/content/about.en.yaml'),
  schema: aboutSchema,
})

const expertise = defineCollection({
  loader: file('src/content/expertise.yaml'),
  schema: expertiseSchema,
})

const expertiseEn = defineCollection({
  loader: file('src/content/expertise.en.yaml'),
  schema: expertiseSchema,
})

const footer = defineCollection({
  loader: file('src/content/footer.yaml'),
  schema: footerSchema,
})

const footerEn = defineCollection({
  loader: file('src/content/footer.en.yaml'),
  schema: footerSchema,
})

const stack = defineCollection({
  loader: file('src/content/stack.yaml'),
  schema: stackSchema,
})

const stackEn = defineCollection({
  loader: file('src/content/stack.en.yaml'),
  schema: stackSchema,
})

const contact = defineCollection({
  loader: file('src/content/contact.yaml'),
  schema: contactSchema,
})

const contactEn = defineCollection({
  loader: file('src/content/contact.en.yaml'),
  schema: contactSchema,
})

const notFound = defineCollection({
  loader: file('src/content/not-found.yaml'),
  schema: notFoundSchema,
})

const notFoundEn = defineCollection({
  loader: file('src/content/not-found.en.yaml'),
  schema: notFoundSchema,
})

const emails = defineCollection({
  loader: file('src/content/emails.yaml'),
  schema: emailsSchema,
})

const emailsEn = defineCollection({
  loader: file('src/content/emails.en.yaml'),
  schema: emailsSchema,
})

const console = defineCollection({
  loader: file('src/content/console.yaml'),
  schema: consoleSchema,
})

const consoleEn = defineCollection({
  loader: file('src/content/console.en.yaml'),
  schema: consoleSchema,
})

export const collections = {
  settings,
  settingsEn,
  header,
  headerEn,
  mobileMenu,
  mobileMenuEn,
  themeToggle,
  themeToggleEn,
  languageToggle,
  languageToggleEn,
  footer,
  footerEn,
  hero,
  heroEn,
  projects,
  projectsEn,
  about,
  aboutEn,
  expertise,
  expertiseEn,
  stack,
  stackEn,
  contact,
  contactEn,
  notFound,
  notFoundEn,
  emails,
  emailsEn,
  console,
  consoleEn,
}
