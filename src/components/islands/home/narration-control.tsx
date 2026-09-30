import { Progress } from '@ark-ui/react/progress'
import { useStore } from '@nanostores/react'
import { type SyntheticEvent, useEffect, useId, useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import type { Locale } from '~/helpers/locale'
import type { NarrationSection } from '~/helpers/narration'
import { $narration } from '~/stores/narration'
import { toaster } from '~/stores/toaster'
import IconLoader from '~icons/tabler/loader-2'
import IconPlayerPause from '~icons/tabler/player-pause'
import IconPlayerPlay from '~icons/tabler/player-play'

type NarrationControlProps = {
  section: NarrationSection
  locale: Locale
  src: string
  label: string
  error: { title: string; description: string }
}

type Status = 'idle' | 'loading' | 'playing' | 'paused'

type NarrationEvent =
  | 'narration-started'
  | 'narration-completed'
  | 'narration-failed'

function percentPlayed(audio: HTMLAudioElement) {
  const { currentTime, duration } = audio
  if (!Number.isFinite(duration) || duration <= 0) return 0
  return Math.min(100, (currentTime / duration) * 100)
}

export function NarrationControl({
  section,
  locale,
  src,
  label,
  error,
}: NarrationControlProps) {
  const labelId = useId()
  const audioRef = useRef<HTMLAudioElement>(null)
  // a missing file fires the audio error event and also rejects play(); report it once
  const failedRef = useRef(false)
  // a play from idle records a start once playback begins; a resume records nothing
  const startingRef = useRef(false)
  const current = useStore($narration)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const active = status === 'loading' || status === 'playing'

  useEffect(() => {
    if (active && current !== section) audioRef.current?.pause()
  }, [active, current, section])

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

  function record(event: NarrationEvent) {
    window.posthog?.capture(event, { section, locale })
  }

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (active) {
      audio.pause()
      return
    }

    failedRef.current = false
    startingRef.current = status === 'idle'
    $narration.set(section)
    setStatus('loading')
    audio.play().catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      fail()
    })
  }

  function fail() {
    if (failedRef.current) return
    failedRef.current = true
    startingRef.current = false
    setStatus('idle')
    setProgress(0)
    if ($narration.get() === section) $narration.set(null)
    toaster.error(error)
    record('narration-failed')
  }

  function begin() {
    setStatus('playing')
    if (!startingRef.current) return
    startingRef.current = false
    record('narration-started')
  }

  function pause() {
    if (!failedRef.current) setStatus('paused')
  }

  function track(event: SyntheticEvent<HTMLAudioElement>) {
    setProgress(percentPlayed(event.currentTarget))
  }

  function finish(event: SyntheticEvent<HTMLAudioElement>) {
    event.currentTarget.currentTime = 0
    setProgress(0)
    setStatus('idle')
    if ($narration.get() === section) $narration.set(null)
    record('narration-completed')
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-labelledby={labelId}
          aria-pressed={status === 'playing'}
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
      <span id={labelId} className="text-button text-muted-foreground">
        {label}
      </span>
      {/* biome-ignore lint/a11y/useMediaCaption: narration of on-page text */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlaying={begin}
        onWaiting={() => setStatus('loading')}
        onPause={pause}
        onError={fail}
        onTimeUpdate={track}
        onDurationChange={track}
        onEnded={finish}
      />
    </div>
  )
}
