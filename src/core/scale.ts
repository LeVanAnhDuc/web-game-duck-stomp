/**
 * Integer-only canvas scaling — invariants #1, NFR-GAME-01.
 *
 * The whole game is authored at 320x180 and blown up by a whole number. A
 * fractional zoom is the one failure mode in this project that leaves every test
 * green, produces a screenshot that looks fine at a glance, and still ships pixels
 * that blur and shimmer as the camera scrolls. So the rounding lives here, in one
 * pure function, with a test that sweeps thousands of viewport sizes.
 *
 * Whatever is left over after `320*zoom x 180*zoom` is letterbox, painted
 * `--night-deep` by the page itself. We never stretch to fill.
 */

export const BASE_W = 320
export const BASE_H = 180

export type ScaleResult = {
  /** Whole-number multiplier. Never 0, never fractional. */
  zoom: number
  canvasW: number
  canvasH: number
}

/**
 * Largest whole multiplier that still fits inside the viewport, floored at 1.
 *
 * Flooring at 1 matters: on a viewport smaller than 320x180 the honest answer is
 * "does not fit", and clipping a little is far better than a 0.8x zoom, which
 * would make every pixel a different size.
 */
export function computeScale(viewportW: number, viewportH: number): ScaleResult {
  const fit = Math.min(viewportW / BASE_W, viewportH / BASE_H)
  const zoom = Math.max(1, Math.floor(fit))
  return { zoom, canvasW: BASE_W * zoom, canvasH: BASE_H * zoom }
}

/** True when the device is held in portrait and the rotate gate should show (FR-16). */
export function isPortrait(viewportW: number, viewportH: number): boolean {
  return viewportH > viewportW
}
