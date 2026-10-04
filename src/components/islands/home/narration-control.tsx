import { useStore } from '@nanostores/react'
import {
  type PointerEvent,
  type SyntheticEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { Button } from '~/components/ui/button'
import { cn } from '~/helpers/classnames'
import type { Locale } from '~/helpers/locale'
import type { NarrationSection } from '~/helpers/narration'
import { $narration } from '~/stores/narration'
import { toaster } from '~/stores/toaster'
import IconLoader from '~icons/tabler/loader-2'
import IconPlayerPause from '~icons/tabler/player-pause-filled'
import IconPlayerPlay from '~icons/tabler/player-play-filled'

type NarrationControlProps = {
  section: NarrationSection
  locale: Locale
  src: string
  label: string
  peaks: number[]
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

function pointerFraction(event: PointerEvent<HTMLElement>) {
  const { left, width } = event.currentTarget.getBoundingClientRect()
  if (width <= 0) return 0
  return Math.min(1, Math.max(0, (event.clientX - left) / width))
}

function Bars({
  peaks,
  className,
  fill,
  ...props
}: {
  peaks: number[]
  className: string
  fill?: number
  'data-fill'?: boolean
}) {
  return (
    <div
      className={cn(
        'flex h-full items-center gap-0.5',
        fill !== undefined && 'absolute inset-0',
      )}
      style={
        fill === undefined
          ? undefined
          : { clipPath: `inset(0 ${100 - fill}% 0 0)` }
      }
      {...props}
    >
      {peaks.map((peak, index) => (
        <span
          // the bars never reorder, so the index is a stable key
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length list
          key={index}
          data-bar
          className={cn('block w-0.75 rounded-full', className)}
          style={{ height: `${peak * 100}%` }}
        />
      ))}
    </div>
  )
}

export function NarrationControl({
  section,
  locale,
  src,
  label,
  peaks,
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
  // a position picked before the audio knows its duration, as a fraction
  const pendingRef = useRef<number | null>(null)
  // the fraction under the pointer while a drag is in progress
  const [drag, setDrag] = useState<number | null>(null)
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
    pendingRef.current = null
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
    if (pendingRef.current !== null) return
    setProgress(percentPlayed(event.currentTarget))
  }

  function applyPending(audio: HTMLAudioElement) {
    const fraction = pendingRef.current
    if (fraction === null || !Number.isFinite(audio.duration)) return
    pendingRef.current = null
    audio.currentTime = fraction * audio.duration
    setProgress(fraction * 100)
  }

  function startDrag(event: PointerEvent<HTMLElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag(pointerFraction(event))
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    if (drag === null) return
    setDrag(pointerFraction(event))
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    const audio = audioRef.current
    if (drag === null || !audio) return
    const fraction = pointerFraction(event)
    setDrag(null)
    setProgress(fraction * 100)
    pendingRef.current = fraction
    applyPending(audio)
  }

  function finish(event: SyntheticEvent<HTMLAudioElement>) {
    event.currentTarget.currentTime = 0
    pendingRef.current = null
    setProgress(0)
    setStatus('idle')
    if ($narration.get() === section) $narration.set(null)
    record('narration-completed')
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={cn(
          'inline-flex h-9 items-center gap-2.5 rounded-full border border-border ps-0.75 pe-3.5',
          'has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            'size-7 rounded-full bg-muted/60 hover:bg-primary/15 hover:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
            active && 'bg-primary/15',
          )}
          aria-labelledby={labelId}
          aria-pressed={status === 'playing'}
          onClick={toggle}
        >
          {status === 'loading' ? (
            <IconLoader className="size-3.5 text-primary motion-safe:animate-spin motion-reduce:animate-pulse" />
          ) : status === 'playing' ? (
            <IconPlayerPause className="size-3.5 text-primary" />
          ) : (
            <IconPlayerPlay className="ms-0.5 size-3.5" />
          )}
        </Button>
        <div
          aria-hidden="true"
          data-waveform
          className="relative h-5.5 cursor-pointer touch-none"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={() => setDrag(null)}
        >
          <Bars peaks={peaks} className="bg-neutral" />
          <Bars
            peaks={peaks}
            className="bg-primary"
            fill={drag === null ? progress : drag * 100}
            data-fill
          />
        </div>
      </div>
      <span id={labelId} className="text-neutral-foreground/80 text-sm">
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
        onLoadedMetadata={(event) => applyPending(event.currentTarget)}
        onTimeUpdate={track}
        onDurationChange={track}
        onEnded={finish}
      />
    </div>
  )
}
