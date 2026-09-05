import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { aboutSchema } from '~/schemas/home/about'
import { contactSchema } from '~/schemas/home/contact'
import { expertiseSchema } from '~/schemas/home/expertise'
import { heroSchema } from '~/schemas/home/hero'
import { projectsSchema } from '~/schemas/home/projects'
import { stackSchema } from '~/schemas/home/stack'
import { consoleSchema } from '~/schemas/shared/console'
import { emailsSchema } from '~/schemas/shared/emails'
import { footerSchema } from '~/schemas/shared/footer'
import { headerSchema } from '~/schemas/shared/header'
import { languageToggleSchema } from '~/schemas/shared/language-toggle'
import { mobileMenuSchema } from '~/schemas/shared/mobile-menu'
import { notFoundSchema } from '~/schemas/shared/not-found'
import { settingsSchema } from '~/schemas/shared/settings'
import { themeToggleSchema } from '~/schemas/shared/theme-toggle'

function localeId(collection: string) {
  return ({ entry }: { entry: string }) =>
    `${entry.split('/')[0]}/${collection}`
}

const homeHero = defineCollection({
  loader: glob({
    pattern: '*/hero.yaml',
    base: 'src/content/home',
    generateId: localeId('homeHero'),
  }),
  schema: heroSchema,
})

const homeProjects = defineCollection({
  loader: glob({
    pattern: '*/projects.yaml',
    base: 'src/content/home',
    generateId: localeId('homeProjects'),
  }),
  schema: projectsSchema,
})

const homeAbout = defineCollection({
  loader: glob({
    pattern: '*/about.yaml',
    base: 'src/content/home',
    generateId: localeId('homeAbout'),
  }),
  schema: aboutSchema,
})

const homeExpertise = defineCollection({
  loader: glob({
    pattern: '*/expertise.yaml',
    base: 'src/content/home',
    generateId: localeId('homeExpertise'),
  }),
  schema: expertiseSchema,
})

const homeStack = defineCollection({
  loader: glob({
    pattern: '*/stack.yaml',
    base: 'src/content/home',
    generateId: localeId('homeStack'),
  }),
  schema: stackSchema,
})

const homeContact = defineCollection({
  loader: glob({
    pattern: '*/contact.yaml',
    base: 'src/content/home',
    generateId: localeId('homeContact'),
  }),
  schema: contactSchema,
})

const sharedSettings = defineCollection({
  loader: glob({
    pattern: '*/settings.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedSettings'),
  }),
  schema: settingsSchema,
})

const sharedHeader = defineCollection({
  loader: glob({
    pattern: '*/header.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedHeader'),
  }),
  schema: headerSchema,
})

const sharedMobileMenu = defineCollection({
  loader: glob({
    pattern: '*/mobile-menu.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedMobileMenu'),
  }),
  schema: mobileMenuSchema,
})

const sharedThemeToggle = defineCollection({
  loader: glob({
    pattern: '*/theme-toggle.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedThemeToggle'),
  }),
  schema: themeToggleSchema,
})

const sharedLanguageToggle = defineCollection({
  loader: glob({
    pattern: '*/language-toggle.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedLanguageToggle'),
  }),
  schema: languageToggleSchema,
})

const sharedFooter = defineCollection({
  loader: glob({
    pattern: '*/footer.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedFooter'),
  }),
  schema: footerSchema,
})

const sharedNotFound = defineCollection({
  loader: glob({
    pattern: '*/not-found.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedNotFound'),
  }),
  schema: notFoundSchema,
})

const sharedEmails = defineCollection({
  loader: glob({
    pattern: '*/emails.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedEmails'),
  }),
  schema: emailsSchema,
})

const sharedConsole = defineCollection({
  loader: glob({
    pattern: '*/console.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedConsole'),
  }),
  schema: consoleSchema,
})

export const collections = {
  sharedSettings,
  sharedHeader,
  sharedMobileMenu,
  sharedThemeToggle,
  sharedLanguageToggle,
  sharedFooter,
  homeHero,
  homeProjects,
  homeAbout,
  homeExpertise,
  homeStack,
  homeContact,
  sharedNotFound,
  sharedEmails,
  sharedConsole,
}
