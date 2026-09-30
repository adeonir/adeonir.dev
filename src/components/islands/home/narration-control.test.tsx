// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { NarrationControl } from '~/components/islands/home/narration-control'

afterEach(cleanup)

describe('NarrationControl', () => {
  it('names the play button by its visible label', () => {
    render(
      <NarrationControl
        section="about"
        locale="en"
        src="/narration/en/about.test.mp3"
        label="Listen to my story"
        error={{ title: 'Failed', description: 'Try again' }}
      />,
    )

    const button = screen.getByRole('button', { name: 'Listen to my story' })
    const labelId = button.getAttribute('aria-labelledby')

    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId as string)?.textContent).toBe(
      'Listen to my story',
    )
  })
})
