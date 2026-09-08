import { describe, expect, it } from 'vitest'
import { BASE_H, BASE_W, computeScale, isPortrait } from './scale'

describe('computeScale', () => {
  it('never returns a fractional zoom, across a wide sweep of viewports', () => {
    for (let vw = 200; vw <= 2600; vw += 7) {
      for (let vh = 150; vh <= 1600; vh += 11) {
        const { zoom } = computeScale(vw, vh)
        expect(Number.isInteger(zoom), `zoom ${zoom} at ${vw}x${vh}`).toBe(true)
      }
    }
  })

  it('never returns zoom below 1, even on a viewport smaller than the base', () => {
    expect(computeScale(100, 80).zoom).toBe(1)
    expect(computeScale(1, 1).zoom).toBe(1)
  })

  it('picks the limiting axis, not the wider one', () => {
    // 667/320 = 2.08, 375/180 = 2.08 -> 2
    expect(computeScale(667, 375).zoom).toBe(2)
    // 1024/320 = 3.2 is the limit, 768/180 = 4.27 -> 3
    expect(computeScale(1024, 768).zoom).toBe(3)
    // 1440/320 = 4.5 is the limit, 900/180 = 5 -> 4
    expect(computeScale(1440, 900).zoom).toBe(4)
  })

  it('is limited by height when the viewport is wide and short', () => {
    // 1920/320 = 6, 360/180 = 2 -> 2
    expect(computeScale(1920, 360).zoom).toBe(2)
  })

  it('canvas is always exactly base times zoom', () => {
    for (const [vw, vh] of [
      [667, 375],
      [1024, 768],
      [1440, 900],
      [2560, 1440],
    ] as const) {
      const r = computeScale(vw, vh)
      expect(r.canvasW).toBe(BASE_W * r.zoom)
      expect(r.canvasH).toBe(BASE_H * r.zoom)
    }
  })

  it('never produces a canvas larger than the viewport once zoom is above 1', () => {
    for (let vw = 320; vw <= 2600; vw += 13) {
      for (let vh = 180; vh <= 1600; vh += 17) {
        const { canvasW, canvasH } = computeScale(vw, vh)
        expect(canvasW, `${vw}x${vh}`).toBeLessThanOrEqual(vw)
        expect(canvasH, `${vw}x${vh}`).toBeLessThanOrEqual(vh)
      }
    }
  })
})

describe('isPortrait', () => {
  it('is true only when taller than wide', () => {
    expect(isPortrait(375, 667)).toBe(true)
    expect(isPortrait(667, 375)).toBe(false)
  })

  it('treats an exact square as landscape, so the gate does not flicker at the boundary', () => {
    expect(isPortrait(500, 500)).toBe(false)
  })
})
