import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { homeAboutSchema } from '~/schemas/home/about'
import { homeContactSchema } from '~/schemas/home/contact'
import { homeExpertiseSchema } from '~/schemas/home/expertise'
import { homeHeroSchema } from '~/schemas/home/hero'
import { homeProjectsSchema } from '~/schemas/home/projects'
import { homeStackSchema } from '~/schemas/home/stack'
import { projectContentSchema } from '~/schemas/project/content'
import { projectHeaderSchema } from '~/schemas/project/header'
import { projectMetaSchema } from '~/schemas/project/meta'
import { projectNavSchema } from '~/schemas/project/nav'
import { projectsHeroSchema } from '~/schemas/projects/hero'
import { projectsListSchema } from '~/schemas/projects/list'
import { sharedConsoleSchema } from '~/schemas/shared/console'
import { sharedEmailsSchema } from '~/schemas/shared/emails'
import { sharedFooterSchema } from '~/schemas/shared/footer'
import { sharedHeaderSchema } from '~/schemas/shared/header'
import { sharedLanguageToggleSchema } from '~/schemas/shared/language-toggle'
import { sharedMobileMenuSchema } from '~/schemas/shared/mobile-menu'
import { sharedNotFoundSchema } from '~/schemas/shared/not-found'
import { sharedSettingsSchema } from '~/schemas/shared/settings'
import { sharedThemeToggleSchema } from '~/schemas/shared/theme-toggle'

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
  schema: homeHeroSchema,
})

const homeProjects = defineCollection({
  loader: glob({
    pattern: '*/projects.yaml',
    base: 'src/content/home',
    generateId: localeId('homeProjects'),
  }),
  schema: homeProjectsSchema,
})

const homeAbout = defineCollection({
  loader: glob({
    pattern: '*/about.yaml',
    base: 'src/content/home',
    generateId: localeId('homeAbout'),
  }),
  schema: homeAboutSchema,
})

const homeExpertise = defineCollection({
  loader: glob({
    pattern: '*/expertise.yaml',
    base: 'src/content/home',
    generateId: localeId('homeExpertise'),
  }),
  schema: homeExpertiseSchema,
})

const homeStack = defineCollection({
  loader: glob({
    pattern: '*/stack.yaml',
    base: 'src/content/home',
    generateId: localeId('homeStack'),
  }),
  schema: homeStackSchema,
})

const homeContact = defineCollection({
  loader: glob({
    pattern: '*/contact.yaml',
    base: 'src/content/home',
    generateId: localeId('homeContact'),
  }),
  schema: homeContactSchema,
})

const sharedSettings = defineCollection({
  loader: glob({
    pattern: '*/settings.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedSettings'),
  }),
  schema: sharedSettingsSchema,
})

const sharedHeader = defineCollection({
  loader: glob({
    pattern: '*/header.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedHeader'),
  }),
  schema: sharedHeaderSchema,
})

const sharedMobileMenu = defineCollection({
  loader: glob({
    pattern: '*/mobile-menu.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedMobileMenu'),
  }),
  schema: sharedMobileMenuSchema,
})

const sharedThemeToggle = defineCollection({
  loader: glob({
    pattern: '*/theme-toggle.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedThemeToggle'),
  }),
  schema: sharedThemeToggleSchema,
})

const sharedLanguageToggle = defineCollection({
  loader: glob({
    pattern: '*/language-toggle.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedLanguageToggle'),
  }),
  schema: sharedLanguageToggleSchema,
})

const sharedFooter = defineCollection({
  loader: glob({
    pattern: '*/footer.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedFooter'),
  }),
  schema: sharedFooterSchema,
})

const sharedNotFound = defineCollection({
  loader: glob({
    pattern: '*/not-found.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedNotFound'),
  }),
  schema: sharedNotFoundSchema,
})

const sharedEmails = defineCollection({
  loader: glob({
    pattern: '*/emails.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedEmails'),
  }),
  schema: sharedEmailsSchema,
})

const sharedConsole = defineCollection({
  loader: glob({
    pattern: '*/console.yaml',
    base: 'src/content/shared',
    generateId: localeId('sharedConsole'),
  }),
  schema: sharedConsoleSchema,
})

const projectContent = defineCollection({
  loader: glob({
    pattern: '*/*.mdx',
    base: 'src/content/project',
  }),
  schema: projectContentSchema,
})

const projectHeader = defineCollection({
  loader: glob({
    pattern: '*/header.yaml',
    base: 'src/content/project',
    generateId: localeId('projectHeader'),
  }),
  schema: projectHeaderSchema,
})

const projectMeta = defineCollection({
  loader: glob({
    pattern: '*/meta.yaml',
    base: 'src/content/project',
    generateId: localeId('projectMeta'),
  }),
  schema: projectMetaSchema,
})

const projectNav = defineCollection({
  loader: glob({
    pattern: '*/nav.yaml',
    base: 'src/content/project',
    generateId: localeId('projectNav'),
  }),
  schema: projectNavSchema,
})

const projectsHero = defineCollection({
  loader: glob({
    pattern: '*/hero.yaml',
    base: 'src/content/projects',
    generateId: localeId('projectsHero'),
  }),
  schema: projectsHeroSchema,
})

const projectsList = defineCollection({
  loader: glob({
    pattern: '*/list.yaml',
    base: 'src/content/projects',
    generateId: localeId('projectsList'),
  }),
  schema: projectsListSchema,
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
  projectContent,
  projectHeader,
  projectMeta,
  projectNav,
  projectsHero,
  projectsList,
}
