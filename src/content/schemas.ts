import { z } from 'astro/zod'

export const settingsSchema = z.object({
  siteName: z.string(),
  description: z.string(),
  ogImage: z.string(),
  locale: z.string(),
})

export const headerSchema = z.object({
  logo: z.string().min(1),
  nav: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      }),
    )
    .min(1),
})

export const mobileMenuSchema = z.object({
  label: z.string().min(1),
  trigger: z.object({
    open: z.string().min(1),
    close: z.string().min(1),
  }),
})

export const themeToggleSchema = z.object({
  dark: z.string().min(1),
  light: z.string().min(1),
})

export const heroSchema = z.object({
  eyebrow: z.string().min(1),
  display: z.object({
    greeting: z.string().min(1),
    name: z.string().min(1),
  }),
  tagline: z
    .array(
      z.object({
        text: z.string().min(1),
        strong: z.boolean().optional(),
        break: z.boolean().optional(),
      }),
    )
    .min(1),
  description: z.array(z.string().min(1)).min(1),
  actions: z.object({
    secondary: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  }),
})

export const aboutSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        strong: z.boolean().optional(),
        break: z.boolean().optional(),
      }),
    )
    .min(1),
  bio: z.array(z.string().min(1)).min(1),
})

export const stackSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        strong: z.boolean().optional(),
        break: z.boolean().optional(),
      }),
    )
    .min(1),
  tools: z
    .array(
      z.object({
        title: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
})

export const footerSchema = z.object({
  brand: z.object({
    text: z.string().min(1),
    copyright: z.string().min(1),
  }),
  tagline: z
    .array(
      z.object({
        text: z.string().min(1),
        emphasis: z.boolean().optional(),
      }),
    )
    .min(1),
})

export const contactSchema = z.object({
  eyebrow: z.string().min(1),
  title: z
    .array(
      z.object({
        text: z.string().min(1),
        strong: z.boolean().optional(),
        break: z.boolean().optional(),
      }),
    )
    .min(1),
  body: z.array(z.string().min(1)).min(1),
  social: z
    .array(
      z.object({
        platform: z.enum(['email', 'github', 'linkedin', 'x']),
        label: z.string().min(1),
        link: z.string().min(1),
      }),
    )
    .min(1),
  form: z.object({
    fields: z
      .array(
        z.object({
          name: z.string().min(1),
          label: z.string().min(1),
          placeholder: z.string().min(1),
        }),
      )
      .min(1),
    submit: z.string().min(1),
    states: z.object({
      success: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
      error: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    }),
    validation: z.object({
      required: z.string().min(1),
      email: z.string().min(1),
      maxLength: z.string().min(1),
    }),
  }),
})

export const notFoundSchema = z.object({
  eyebrow: z.string().min(1),
  display: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        strong: z.boolean().optional(),
        break: z.boolean().optional(),
      }),
    )
    .min(1),
  body: z.array(z.string().min(1)).min(1),
  action: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
})

export const emailsSchema = z.object({
  from: z.string().min(1),
  fields: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    subject: z.string().min(1),
    message: z.string().min(1),
  }),
  confirmation: z.object({
    subject: z.string().min(1),
    preview: z.string().min(1),
    heading: z.string().min(1),
    body: z.string().min(1),
    recapLabel: z.string().min(1),
    footer: z.string().min(1),
  }),
  notification: z.object({
    subject: z.string().min(1),
    preview: z.string().min(1),
    badge: z.string().min(1),
    heading: z.string().min(1),
    received: z.string().min(1),
    footer: z.string().min(1),
  }),
})
