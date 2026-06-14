import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  pixelBasedPreset,
  Row,
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
  ink: 'oklch(18.3% 0.02 284.2)', // dark on bright
  secondary: 'oklch(61.4% 0.24 11.26)', // azalea-600
  border: 'oklch(85.75% 0.0145 268.48)', // latte-200
  'header-bg': 'oklch(24.29% 0.0304 283.91)', // mocha-850
  'header-fg': 'oklch(87.87% 0.0426 272.28)', // mocha-50
  'header-accent': 'oklch(67.2% 0.233 2.27)', // azalea-500
  'header-surface': 'oklch(32.4% 0.0319 281.98)', // mocha-800
  'header-dot': 'oklch(67.7% 0.148 238.14)', // ocean-500
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

export type NotificationProps = {
  name: string
  email: string
  subject: string
  message: string
  replyTo: string
  copy: {
    preview: string
    badge: string
    heading: string
    received: string
    button: string
    footer: string
    fields: {
      name: string
      email: string
      subject: string
      message: string
    }
  }
}

export function Notification({
  name,
  email,
  subject,
  message,
  replyTo,
  copy,
}: NotificationProps) {
  return (
    <Html lang="pt-BR">
      <Head>
        <style>{`* { font-family: ${fontFamily.sans.join(', ')} }`}</style>
      </Head>
      <Preview>{copy.preview}</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="m-0 bg-background py-8 font-sans">
          <Container className="mx-auto max-w-120 overflow-hidden rounded-2xl border border-border border-solid bg-card">
            <Section className="bg-header-bg px-10 py-7">
              <Row>
                <Column>
                  <Text className="m-0 font-mono font-semibold text-base text-header-fg leading-none tracking-tight">
                    <span className="text-header-accent">~/</span>
                    adeonir
                    <span className="text-header-accent">.</span>
                    dev
                  </Text>
                </Column>
                <Column align="right">
                  <span className="inline-block rounded-full bg-header-surface px-3 py-1.5 align-middle font-semibold text-header-fg text-xs leading-none">
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-header-dot align-middle" />
                    {copy.badge}
                  </span>
                </Column>
              </Row>
            </Section>

            <Section className="px-10 py-9">
              <Heading
                as="h1"
                className="m-0 mb-1 font-bold text-2xl text-foreground leading-[1.2]"
              >
                {copy.heading}
              </Heading>
              <Text className="m-0 mb-6 text-muted/50 text-sm leading-normal">
                {copy.received}
              </Text>

              <Row className="border-0 border-border border-b border-solid">
                <Column className="w-20 py-3.5 align-baseline">
                  <Text className="m-0 font-mono text-muted/50 text-xs leading-normal">
                    {copy.fields.name}
                  </Text>
                </Column>
                <Column className="py-3.5 pl-4 align-baseline">
                  <Text className="m-0 text-base text-foreground leading-normal">
                    {name}
                  </Text>
                </Column>
              </Row>

              <Row className="border-0 border-border border-b border-solid">
                <Column className="w-20 py-3.5 align-baseline">
                  <Text className="m-0 font-mono text-muted/50 text-xs leading-normal">
                    {copy.fields.email}
                  </Text>
                </Column>
                <Column className="py-3.5 pl-4 align-baseline">
                  <Text className="m-0 text-base text-foreground leading-normal">
                    {email}
                  </Text>
                </Column>
              </Row>

              <Row className="border-0 border-border border-b border-solid">
                <Column className="w-20 py-3.5 align-baseline">
                  <Text className="m-0 font-mono text-muted/50 text-xs leading-normal">
                    {copy.fields.subject}
                  </Text>
                </Column>
                <Column className="py-3.5 pl-4 align-baseline">
                  <Text className="m-0 text-base text-foreground leading-normal">
                    {subject}
                  </Text>
                </Column>
              </Row>

              <Row>
                <Column className="w-20 py-3.5 align-baseline">
                  <Text className="m-0 font-mono text-muted/50 text-xs leading-normal">
                    {copy.fields.message}
                  </Text>
                </Column>
                <Column className="py-3.5 pl-4 align-baseline">
                  <Text className="m-0 whitespace-pre-wrap text-base text-foreground leading-[1.6]">
                    {message}
                  </Text>
                </Column>
              </Row>

              <Section className="mt-5 mb-6 text-center">
                <Link
                  href={`mailto:${replyTo}`}
                  className="inline-block rounded-lg border border-muted/50 border-solid bg-sunken px-5 py-3 text-center font-semibold text-muted text-sm no-underline"
                >
                  {copy.button}
                </Link>
              </Section>

              <Text className="m-0 text-muted/50 text-xs leading-[1.6]">
                {copy.footer}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

Notification.PreviewProps = {
  name: 'Marina Souza',
  email: 'marina.souza@email.com',
  subject: 'Landing page para lançamento',
  message:
    'Oi! Vou lançar um produto e preciso de uma landing page performática. Já tenho o design no Figma e quero implementar em Astro/React. Qual o prazo e orçamento?',
  replyTo: 'marina.souza@email.com',
  copy: {
    preview: 'Nova mensagem de Marina pelo formulário de contato.',
    badge: 'Novo contato',
    heading: 'Nova mensagem de contato',
    received: 'Recebido em 14 jun 2026, 14:32',
    button: 'Responder a Marina',
    footer:
      'Notificação automática enviada pelo formulário de contato do site. Responda a este e-mail para falar diretamente com Marina.',
    fields: {
      name: 'nome',
      email: 'email',
      subject: 'assunto',
      message: 'mensagem',
    },
  },
} satisfies NotificationProps

export default Notification
