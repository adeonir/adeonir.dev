// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

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

function play(audio: HTMLAudioElement, currentTime: number, duration: number) {
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

    play(audio, 25, 100)
    fireEvent.timeUpdate(audio)

    expect(fillOf(container)).toBe('inset(0 75% 0 0)')
  })

  it('empties the waveform when the narration ends', () => {
    const { container } = renderControl()
    const audio = audioOf(container)

    play(audio, 100, 100)
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
})
