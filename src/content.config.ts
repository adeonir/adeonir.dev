import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
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

function localeId(collection: string) {
  return ({ entry }: { entry: string }) =>
    `${entry.split('/')[0]}/${collection}`
}

const hero = defineCollection({
  loader: glob({
    pattern: '*/hero.yaml',
    base: 'src/content/home',
    generateId: localeId('hero'),
  }),
  schema: heroSchema,
})

const projects = defineCollection({
  loader: glob({
    pattern: '*/projects.yaml',
    base: 'src/content/home',
    generateId: localeId('projects'),
  }),
  schema: projectsSchema,
})

const about = defineCollection({
  loader: glob({
    pattern: '*/about.yaml',
    base: 'src/content/home',
    generateId: localeId('about'),
  }),
  schema: aboutSchema,
})

const expertise = defineCollection({
  loader: glob({
    pattern: '*/expertise.yaml',
    base: 'src/content/home',
    generateId: localeId('expertise'),
  }),
  schema: expertiseSchema,
})

const stack = defineCollection({
  loader: glob({
    pattern: '*/stack.yaml',
    base: 'src/content/home',
    generateId: localeId('stack'),
  }),
  schema: stackSchema,
})

const contact = defineCollection({
  loader: glob({
    pattern: '*/contact.yaml',
    base: 'src/content/home',
    generateId: localeId('contact'),
  }),
  schema: contactSchema,
})

const settings = defineCollection({
  loader: glob({
    pattern: '*/settings.yaml',
    base: 'src/content/shared',
    generateId: localeId('settings'),
  }),
  schema: settingsSchema,
})

const header = defineCollection({
  loader: glob({
    pattern: '*/header.yaml',
    base: 'src/content/shared',
    generateId: localeId('header'),
  }),
  schema: headerSchema,
})

const mobileMenu = defineCollection({
  loader: glob({
    pattern: '*/mobile-menu.yaml',
    base: 'src/content/shared',
    generateId: localeId('mobileMenu'),
  }),
  schema: mobileMenuSchema,
})

const themeToggle = defineCollection({
  loader: glob({
    pattern: '*/theme-toggle.yaml',
    base: 'src/content/shared',
    generateId: localeId('themeToggle'),
  }),
  schema: themeToggleSchema,
})

const languageToggle = defineCollection({
  loader: glob({
    pattern: '*/language-toggle.yaml',
    base: 'src/content/shared',
    generateId: localeId('languageToggle'),
  }),
  schema: languageToggleSchema,
})

const footer = defineCollection({
  loader: glob({
    pattern: '*/footer.yaml',
    base: 'src/content/shared',
    generateId: localeId('footer'),
  }),
  schema: footerSchema,
})

const notFound = defineCollection({
  loader: glob({
    pattern: '*/not-found.yaml',
    base: 'src/content/shared',
    generateId: localeId('notFound'),
  }),
  schema: notFoundSchema,
})

const emails = defineCollection({
  loader: glob({
    pattern: '*/emails.yaml',
    base: 'src/content/shared',
    generateId: localeId('emails'),
  }),
  schema: emailsSchema,
})

const console = defineCollection({
  loader: glob({
    pattern: '*/console.yaml',
    base: 'src/content/shared',
    generateId: localeId('console'),
  }),
  schema: consoleSchema,
})

export const collections = {
  settings,
  header,
  mobileMenu,
  themeToggle,
  languageToggle,
  footer,
  hero,
  projects,
  about,
  expertise,
  stack,
  contact,
  notFound,
  emails,
  console,
}
