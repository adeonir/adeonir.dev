import { Portal } from '@ark-ui/react/portal'

import { Popover } from '~/components/ui/popover'

type TaglineSegment = {
  text: string
  emphasis?: boolean
  reveal?: string
}

type FooterTaglineProps = {
  segments: TaglineSegment[]
}

function RevealString({ text, phrase }: { text: string; phrase: string }) {
  return (
    <Popover.Root
      lazyMount
      unmountOnExit
      autoFocus={false}
      positioning={{ placement: 'top', gutter: 8 }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-sm text-emphasis transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {text}
        </button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content className="font-mono text-sm">
            {phrase}
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

export function FooterTagline({ segments }: FooterTaglineProps) {
  return (
    <p className="font-mono text-muted-foreground text-sm">
      {segments.map((segment) => {
        if (segment.reveal) {
          return (
            <RevealString
              key={segment.text}
              text={segment.text}
              phrase={segment.reveal}
            />
          )
        }

        return (
          <span
            key={segment.text}
            className={segment.emphasis ? 'text-emphasis' : undefined}
          >
            {segment.text}
          </span>
        )
      })}
    </p>
  )
}
