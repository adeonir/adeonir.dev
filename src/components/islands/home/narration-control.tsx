import { useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import type { Locale } from '~/helpers/content'
import type { NarrationSection } from '~/helpers/narration'
import IconLoader from '~icons/tabler/loader-2'
import IconPlayerPause from '~icons/tabler/player-pause'
import IconPlayerPlay from '~icons/tabler/player-play'

type NarrationControlProps = {
  section: NarrationSection
  locale: Locale
  src: string
  label: string
  name: string
  error: { title: string; description: string }
}

type Status = 'idle' | 'loading' | 'playing' | 'paused'

export function NarrationControl({ src, label, name }: NarrationControlProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const active = status === 'loading' || status === 'playing'

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (active) {
      audio.pause()
      return
    }

    setStatus('loading')
    audio.play().catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      setStatus('idle')
    })
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-label={name}
        onClick={toggle}
      >
        {status === 'loading' ? (
          <IconLoader className="size-4.5 text-primary motion-safe:animate-spin motion-reduce:animate-pulse" />
        ) : status === 'playing' ? (
          <IconPlayerPause className="size-4.5 text-primary" />
        ) : (
          <IconPlayerPlay className="size-4.5" />
        )}
      </Button>
      <span aria-hidden="true" className="text-button text-muted-foreground">
        {label}
      </span>
      {/* biome-ignore lint/a11y/useMediaCaption: narration of on-page text */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlaying={() => setStatus('playing')}
        onWaiting={() => setStatus('loading')}
        onPause={() => setStatus('paused')}
        onEnded={() => setStatus('idle')}
      />
    </div>
  )
}
