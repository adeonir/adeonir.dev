import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

const colors = {
  background: 'oklch(95.78% 0.0058 264.53)', // latte-50
  card: 'oklch(93.35% 0.0087 264.52)', // latte-100
  sunken: 'oklch(90.6% 0.0117 264.51)', // latte-150
  foreground: 'oklch(43.55% 0.043 279.33)', // latte-950
  muted: 'oklch(46.4% 0.0408 279.3)', // latte-925
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
  subject: string
  message: string
}

export function Confirmation({
  name,
  email,
  subject,
  message,
}: ConfirmationProps) {
  const firstName = name.split(' ')[0]

  return (
    <Html lang="pt-BR">
      <Head>
        <style>{`* { font-family: ${fontFamily.sans.join(', ')} }`}</style>
      </Head>
      <Preview>Recebi sua mensagem, respondo assim que possível.</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="m-0 bg-background py-8 font-sans">
          <Container className="mx-auto max-w-120 overflow-hidden rounded-2xl border border-border border-solid bg-card">
            <Section className="bg-header-bg px-10 py-11 text-center">
              <Text className="m-0 font-mono font-semibold text-header-fg text-lg leading-none tracking-tight">
                <span className="text-header-accent">~/</span>
                adeonir
                <span className="text-header-accent">.</span>
                dev
              </Text>
            </Section>

            <Section className="px-10 py-9">
              <Heading
                as="h1"
                className="m-0 mb-5 font-bold text-2xl text-foreground leading-[1.2]"
              >
                Sua mensagem foi enviada
              </Heading>
              <Text className="m-0 mb-5 text-base text-foreground leading-[1.6]">
                Olá, {firstName}! Obrigado por entrar em contato. Recebi sua
                mensagem e respondo em até 48 horas.
              </Text>

              <Section className="mb-5 rounded-xl border border-primary/50 border-solid bg-primary/8 p-5">
                <Text className="m-0 mb-4 font-semibold text-foreground text-sm uppercase tracking-wider">
                  Resumo do envio
                </Text>
                <Text className="m-0 mb-1 font-mono text-muted/50 text-xs">
                  nome
                </Text>
                <Text className="m-0 mb-4 text-foreground text-sm leading-normal">
                  {name}
                </Text>
                <Text className="m-0 mb-1 font-mono text-muted/50 text-xs">
                  email
                </Text>
                <Text className="m-0 mb-4 text-foreground text-sm leading-normal">
                  {email}
                </Text>
                <Text className="m-0 mb-1 font-mono text-muted/50 text-xs">
                  assunto
                </Text>
                <Text className="m-0 mb-4 text-foreground text-sm leading-normal">
                  {subject}
                </Text>
                <Text className="m-0 mb-1 font-mono text-muted/50 text-xs">
                  mensagem
                </Text>
                <Text className="m-0 whitespace-pre-wrap text-foreground text-sm leading-normal">
                  {message}
                </Text>
              </Section>

              <Text className="m-0 text-foreground text-sm leading-[1.6]">
                Precisa acrescentar alguma informação? É só responder a este
                e-mail, sua resposta chega direto para mim.
              </Text>

              <Section className="mt-6 text-center">
                <Link
                  href="mailto:contato@adeonir.dev"
                  className="inline-block rounded-lg border border-muted/50 border-solid bg-sunken px-5 py-3 text-center font-semibold text-muted text-sm no-underline"
                >
                  Responder
                </Link>
              </Section>
            </Section>

            <Section className="border-border border-t border-solid bg-sunken px-10 py-6">
              <Text className="m-0 font-mono font-semibold text-base text-muted leading-none tracking-tight">
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
} satisfies ConfirmationProps

export default Confirmation
