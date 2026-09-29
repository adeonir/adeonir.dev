import { Progress } from '@ark-ui/react/progress'
import { type SyntheticEvent, useEffect, useRef, useState } from 'react'

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

function percentPlayed(audio: HTMLAudioElement) {
  const { currentTime, duration } = audio
  if (!Number.isFinite(duration) || duration <= 0) return 0
  return Math.min(100, (currentTime / duration) * 100)
}

export function NarrationControl({ src, label, name }: NarrationControlProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const active = status === 'loading' || status === 'playing'

  useEffect(() => {
    const audio = audioRef.current
    if (status !== 'playing' || !audio) return

    // timeupdate fires about four times a second; follow every frame while playing
    let frame = requestAnimationFrame(function follow() {
      setProgress(percentPlayed(audio))
      frame = requestAnimationFrame(follow)
    })

    return () => cancelAnimationFrame(frame)
  }, [status])

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

  function track(event: SyntheticEvent<HTMLAudioElement>) {
    setProgress(percentPlayed(event.currentTarget))
  }

  function finish(event: SyntheticEvent<HTMLAudioElement>) {
    event.currentTarget.currentTime = 0
    setProgress(0)
    setStatus('idle')
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
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
        <Progress.Root
          value={progress}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <Progress.Circle className="[--size:--spacing(9)] [--thickness:2px]">
            <Progress.CircleTrack />
            <Progress.CircleRange className="stroke-primary" />
          </Progress.Circle>
        </Progress.Root>
      </div>
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
        onTimeUpdate={track}
        onDurationChange={track}
        onEnded={finish}
      />
    </div>
  )
}
