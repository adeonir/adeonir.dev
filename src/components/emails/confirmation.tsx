import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from 'react-email'

const colors = {
  background: 'oklch(95.78% 0.0058 264.53)', // latte-50
  card: 'oklch(93.35% 0.0087 264.52)', // latte-100
  sunken: 'oklch(90.6% 0.0117 264.51)', // latte-150
  foreground: 'oklch(43.55% 0.043 279.33)', // latte-950
  muted: 'oklch(49.20% 0.0385 279.3)', // latte-900
  primary: 'oklch(67.7% 0.148 238.14)', // ocean-500
  secondary: 'oklch(61.4% 0.24 11.26)', // azalea-600
  border: 'oklch(85.75% 0.0145 268.48)', // latte-200
  'header-bg': 'oklch(24.29% 0.0304 283.91)', // mocha-850
  'header-fg': 'oklch(87.87% 0.0426 272.28)', // mocha-50
  'header-accent': 'oklch(67.2% 0.233 2.27)', // azalea-500
} as const

const fontFamily = {
  sans: ['-apple-system', 'Arial', 'sans-serif'],
  mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
}

const tailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
}

export type ConfirmationProps = {
  name: string
  email: string
  subject?: string
  message: string
  copy: {
    preview: string
    heading: string
    body: string
    recapLabel: string
    footer: string
    fields: {
      name: string
      email: string
      subject: string
      message: string
    }
  }
}

export function Confirmation({
  name,
  email,
  subject,
  message,
  copy,
}: ConfirmationProps) {
  return (
    <Html lang="pt-BR">
      <Head>
        <style>{`* { font-family: ${fontFamily.sans.join(', ')} }`}</style>
      </Head>
      <Preview>{copy.preview}</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="bg-background m-0 py-8 font-sans">
          <Container className="border-border bg-card mx-auto max-w-120 overflow-hidden rounded-2xl border border-solid">
            <Section className="bg-header-bg px-10 py-11 text-center">
              <Text className="text-header-fg m-0 font-mono text-lg leading-none font-semibold">
                <span className="text-header-accent">~/</span>
                adeonir
                <span className="text-header-accent">.</span>
                dev
              </Text>
            </Section>

            <Section className="px-10 py-9">
              <Heading
                as="h1"
                className="text-foreground m-0 mb-5 text-2xl leading-[1.2] font-bold"
              >
                {copy.heading}
              </Heading>
              <Text className="text-foreground m-0 mb-5 text-base leading-[1.6]">
                {copy.body}
              </Text>

              <Section className="border-primary/50 bg-primary/8 mb-5 rounded-xl border border-solid p-5">
                <Text className="text-foreground m-0 mb-4 text-sm font-semibold tracking-wider uppercase">
                  {copy.recapLabel}
                </Text>
                <Text className="text-muted m-0 mb-1 font-mono text-xs">
                  {copy.fields.name}
                </Text>
                <Text className="text-foreground m-0 mb-4 text-sm leading-normal">
                  {name}
                </Text>
                <Text className="text-muted m-0 mb-1 font-mono text-xs">
                  {copy.fields.email}
                </Text>
                <Text className="text-foreground m-0 mb-4 text-sm leading-normal">
                  {email}
                </Text>
                {subject && (
                  <>
                    <Text className="text-muted m-0 mb-1 font-mono text-xs">
                      {copy.fields.subject}
                    </Text>
                    <Text className="text-foreground m-0 mb-4 text-sm leading-normal">
                      {subject}
                    </Text>
                  </>
                )}
                <Text className="text-muted m-0 mb-1 font-mono text-xs">
                  {copy.fields.message}
                </Text>
                <Text className="text-foreground m-0 text-sm leading-normal whitespace-pre-wrap">
                  {message}
                </Text>
              </Section>

              <Text className="text-foreground m-0 text-sm leading-[1.6]">
                {copy.footer}
              </Text>
            </Section>

            <Section className="border-border bg-sunken border-t border-solid px-10 py-6">
              <Text className="text-muted m-0 font-mono text-base leading-none font-semibold">
                <span className="text-secondary">~/</span>
                adeonir
                <span className="text-secondary">.</span>
                dev
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

Confirmation.PreviewProps = {
  name: 'Marina Souza',
  email: 'marina.souza@email.com',
  subject: 'Landing page para lançamento',
  message:
    'Oi! Vou lançar um produto e preciso de uma landing page performática. Já tenho o design no Figma e quero implementar em Astro/React. Qual o prazo e orçamento?',
  copy: {
    preview: 'Recebi sua mensagem, respondo assim que possível.',
    heading: 'Sua mensagem foi enviada',
    body: 'Olá, Marina! Obrigado por entrar em contato. Recebi sua mensagem e respondo assim que possível.',
    recapLabel: 'Resumo do envio',
    footer:
      'Precisa acrescentar alguma informação? É só responder a este e-mail, sua resposta chega direto para mim.',
    fields: {
      name: 'nome',
      email: 'email',
      subject: 'assunto',
      message: 'mensagem',
    },
  },
} satisfies ConfirmationProps

export default Confirmation
