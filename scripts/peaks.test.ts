import { describe, expect, it } from 'vitest'

import { summarizePeaks } from './peaks'

describe('summarizePeaks', () => {
  it('scales the loudest bucket to one', () => {
    const left = Float32Array.from([0.1, -0.2, 0.05, 0.1])
    const right = Float32Array.from([0.1, 0.1, -0.4, 0.05])

    expect(summarizePeaks([left, right], 2)).toEqual([0.5, 1])
  })
})
