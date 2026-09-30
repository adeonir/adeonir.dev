// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NarrationControl } from '~/components/islands/home/narration-control'
import { NARRATION_BARS } from '~/helpers/narration'

afterEach(cleanup)

const peaks = Array.from({ length: NARRATION_BARS }, (_, index) =>
  index % 2 === 0 ? 0.5 : 1,
)

function renderControl() {
  return render(
    <NarrationControl
      section="about"
      locale="en"
      src="/narration/en/about.test.mp3"
      label="Listen to my story"
      peaks={peaks}
      error={{ title: 'Failed', description: 'Try again' }}
    />,
  )
}

function audioOf(container: HTMLElement) {
  return container.querySelector('audio') as HTMLAudioElement
}

function fillOf(container: HTMLElement) {
  return (container.querySelector('[data-fill]') as HTMLElement).style.clipPath
}

function setTimes(
  audio: HTMLAudioElement,
  currentTime: number,
  duration: number,
) {
  Object.defineProperty(audio, 'duration', {
    configurable: true,
    value: duration,
  })
  Object.defineProperty(audio, 'currentTime', {
    configurable: true,
    writable: true,
    value: currentTime,
  })
}

function waveformOf(container: HTMLElement) {
  const waveform = container.querySelector('[data-waveform]') as HTMLElement
  waveform.getBoundingClientRect = () =>
    ({ left: 0, width: 100 }) as unknown as DOMRect
  waveform.setPointerCapture = vi.fn()
  return waveform
}

function stubPlayback(audio: HTMLAudioElement) {
  const play = vi.fn(() => Promise.resolve())
  audio.play = play
  return play
}

describe('NarrationControl', () => {
  it('names the play button by its visible label', () => {
    renderControl()

    const button = screen.getByRole('button', { name: 'Listen to my story' })
    const labelId = button.getAttribute('aria-labelledby')

    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId as string)?.textContent).toBe(
      'Listen to my story',
    )
  })

  it('draws one bar per peak at its height', () => {
    const { container } = renderControl()
    const bars = container.querySelectorAll<HTMLElement>(
      '[data-waveform] > div:first-child > [data-bar]',
    )

    expect(bars).toHaveLength(peaks.length)
    expect(bars[0]?.style.height).toBe('50%')
    expect(bars[1]?.style.height).toBe('100%')
  })

  it('fills the waveform to the played fraction', () => {
    const { container } = renderControl()
    const audio = audioOf(container)

    setTimes(audio, 25, 100)
    fireEvent.timeUpdate(audio)

    expect(fillOf(container)).toBe('inset(0 75% 0 0)')
  })

  it('empties the waveform when the narration ends', () => {
    const { container } = renderControl()
    const audio = audioOf(container)

    setTimes(audio, 100, 100)
    fireEvent.timeUpdate(audio)
    expect(fillOf(container)).toBe('inset(0 0% 0 0)')

    fireEvent.ended(audio)

    expect(fillOf(container)).toBe('inset(0 100% 0 0)')
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe(
      'false',
    )
  })

  it('keeps the waveform out of the tab order and the accessibility tree', () => {
    const { container } = renderControl()
    const waveform = container.querySelector('[data-waveform]') as HTMLElement

    expect(waveform.getAttribute('aria-hidden')).toBe('true')
    expect(
      waveform.querySelectorAll('button, a, input, [tabindex]'),
    ).toHaveLength(0)
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('moves the position without playing when the waveform is clicked while silent', () => {
    const { container } = renderControl()
    const audio = audioOf(container)
    const waveform = waveformOf(container)
    const playSpy = stubPlayback(audio)
    setTimes(audio, 0, 100)

    fireEvent.pointerDown(waveform, { clientX: 40, pointerId: 1 })
    fireEvent.pointerUp(waveform, { clientX: 40, pointerId: 1 })

    expect(fillOf(container)).toBe('inset(0 60% 0 0)')
    expect(audio.currentTime).toBe(40)
    expect(playSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe(
      'false',
    )
  })

  it('plays from the picked point', () => {
    const { container } = renderControl()
    const audio = audioOf(container)
    const waveform = waveformOf(container)
    const playSpy = stubPlayback(audio)
    Object.defineProperty(audio, 'duration', {
      configurable: true,
      value: Number.NaN,
    })
    audio.currentTime = 0

    fireEvent.pointerDown(waveform, { clientX: 25, pointerId: 1 })
    fireEvent.pointerUp(waveform, { clientX: 25, pointerId: 1 })
    expect(fillOf(container)).toBe('inset(0 75% 0 0)')
    expect(audio.currentTime).toBe(0)

    fireEvent.click(screen.getByRole('button'))
    expect(playSpy).toHaveBeenCalledTimes(1)

    setTimes(audio, 0, 200)
    fireEvent.loadedMetadata(audio)

    expect(audio.currentTime).toBe(50)
    expect(fillOf(container)).toBe('inset(0 75% 0 0)')
  })

  it('continues from the clicked point during playback', () => {
    const { container } = renderControl()
    const audio = audioOf(container)
    const waveform = waveformOf(container)
    stubPlayback(audio)
    setTimes(audio, 10, 100)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.playing(audio)
    fireEvent.pointerDown(waveform, { clientX: 80, pointerId: 1 })
    fireEvent.pointerUp(waveform, { clientX: 80, pointerId: 1 })

    expect(audio.currentTime).toBe(80)
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true')
  })

  it('keeps playing during a drag and continues from the release point', () => {
    const { container } = renderControl()
    const audio = audioOf(container)
    const waveform = waveformOf(container)
    stubPlayback(audio)
    setTimes(audio, 10, 100)
    const pause = vi.fn()
    audio.pause = pause

    fireEvent.click(screen.getByRole('button'))
    fireEvent.playing(audio)
    fireEvent.pointerDown(waveform, { clientX: 20, pointerId: 1 })
    fireEvent.pointerMove(waveform, { clientX: 60, pointerId: 1 })

    expect(audio.currentTime).toBe(10)
    expect(pause).not.toHaveBeenCalled()
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true')

    fireEvent.pointerUp(waveform, { clientX: 70, pointerId: 1 })

    expect(audio.currentTime).toBe(70)
    expect(pause).not.toHaveBeenCalled()
  })

  it('fills the waveform to the pointer during a drag', () => {
    const { container } = renderControl()
    const audio = audioOf(container)
    const waveform = waveformOf(container)
    stubPlayback(audio)
    setTimes(audio, 10, 100)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.playing(audio)
    fireEvent.pointerDown(waveform, { clientX: 20, pointerId: 1 })
    expect(fillOf(container)).toBe('inset(0 80% 0 0)')

    fireEvent.pointerMove(waveform, { clientX: 50, pointerId: 1 })
    expect(fillOf(container)).toBe('inset(0 50% 0 0)')
  })
})
