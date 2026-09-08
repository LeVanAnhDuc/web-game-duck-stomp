import { describe, expect, it } from 'vitest'
import { TUNING } from './tuning'

// These tests guard RELATIONSHIPS, never the literal values. The numbers are meant
// to be hand-tuned; a test that pins them would turn every tuning pass into a test
// edit, and tests that get edited to go green stop being tests.
describe('tuning relationships', () => {
  it('turning is at least as sharp as accelerating from rest', () => {
    expect(TUNING.turnAccel).toBeGreaterThanOrEqual(TUNING.accel)
  })

  it('break speed is actually reachable by running', () => {
    expect(TUNING.breakSpeed).toBeLessThan(TUNING.maxRun)
  })

  it('break speed demands a real run-up, not a nudge', () => {
    expect(TUNING.breakSpeed).toBeGreaterThan(TUNING.maxRun * 0.5)
  })

  it('the jump cut shortens the rise, never lengthens it', () => {
    expect(TUNING.cutMultiplier).toBeGreaterThan(0)
    expect(TUNING.cutMultiplier).toBeLessThan(1)
  })

  it('has a terminal fall speed above jump speed, so falling reads as heavier', () => {
    expect(TUNING.maxFallSpeed).toBeGreaterThan(TUNING.jumpVelocity)
  })

  it('a stomp bounce is smaller than a real jump', () => {
    expect(TUNING.stompBounce).toBeLessThan(TUNING.jumpVelocity)
  })

  it('forgiveness windows are short enough not to feel like a double jump', () => {
    expect(TUNING.coyoteTimeMs).toBeGreaterThan(0)
    expect(TUNING.coyoteTimeMs).toBeLessThanOrEqual(150)
    expect(TUNING.jumpBufferMs).toBeGreaterThan(0)
    expect(TUNING.jumpBufferMs).toBeLessThanOrEqual(200)
  })

  it('invulnerability outlasts the knockback, so a hit cannot chain', () => {
    expect(TUNING.invulnMs).toBeGreaterThan(300)
  })

  it('every value is a finite positive number', () => {
    for (const [key, value] of Object.entries(TUNING)) {
      expect(Number.isFinite(value), key).toBe(true)
      expect(value, key).toBeGreaterThan(0)
    }
  })
})
