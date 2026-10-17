import { beforeEach, describe, expect, it } from 'vitest'
import { canBreakByRunning, idleInput, initialMoveState, step, type InputSnapshot, type MoveState } from './movement'
import { TUNING } from './tuning'

const FRAME = 16

const none = (): InputSnapshot => idleInput()
const right = (): InputSnapshot => ({ ...idleInput(), right: true })
const left = (): InputSnapshot => ({ ...idleInput(), left: true })
const jump = (): InputSnapshot => ({ ...idleInput(), jumpPressed: true, jumpHeld: true })

let s: MoveState
beforeEach(() => {
  s = initialMoveState()
})

const hold = (input: InputSnapshot, frames: number, onGround: boolean) => {
  for (let i = 0; i < frames; i++) step(s, input, FRAME, onGround)
}

describe('runRamp — the replacement for a run button (ADR-0004)', () => {
  it('accelerates toward maxRun while held, and never past it', () => {
    hold(right(), 200, true)
    expect(s.vx).toBeCloseTo(TUNING.maxRun, 1)
  })

  it('takes several frames to reach top speed, so a run-up is a real thing', () => {
    step(s, right(), FRAME, true)
    expect(s.vx).toBeGreaterThan(0)
    expect(s.vx).toBeLessThan(TUNING.maxRun * 0.5)
  })

  it('decays toward zero when released, without overshooting past zero', () => {
    hold(right(), 200, true)
    const top = s.vx
    hold(none(), 10, true)
    expect(s.vx).toBeLessThan(top)
    expect(s.vx).toBeGreaterThanOrEqual(0)
  })

  it('settles at exactly zero rather than drifting forever', () => {
    hold(right(), 200, true)
    hold(none(), 200, true)
    expect(s.vx).toBe(0)
  })

  it('turns around harder than it accelerates from rest', () => {
    hold(right(), 200, true)
    const before = s.vx
    step(s, left(), FRAME, true)
    expect(before - s.vx).toBeGreaterThan(TUNING.accel * (FRAME / 1000))
  })

  it('resolves both directions held at once without sticking', () => {
    step(s, { ...idleInput(), left: true, right: true }, FRAME, true)
    expect(s.vx).toBe(0)
  })

  it('tracks facing, and keeps the last facing when idle', () => {
    step(s, right(), FRAME, true)
    expect(s.facing).toBe(1)
    step(s, left(), FRAME, true)
    expect(s.facing).toBe(-1)
    step(s, none(), FRAME, true)
    expect(s.facing).toBe(-1)
  })
})

describe('variableJump', () => {
  it('launches upward on press while grounded', () => {
    step(s, jump(), FRAME, true)
    expect(s.vy).toBeCloseTo(-TUNING.jumpVelocity, 1)
  })

  it('cuts the rise when the button is released early', () => {
    step(s, jump(), FRAME, true)
    const full = s.vy
    step(s, none(), FRAME, false)
    expect(s.vy).toBeGreaterThan(full)
    expect(s.vy).toBeGreaterThan(full * TUNING.cutMultiplier - 1)
  })

  it('keeps the full rise while the button stays held', () => {
    step(s, jump(), FRAME, true)
    step(s, { ...idleInput(), jumpHeld: true }, FRAME, false)
    expect(s.vy).toBeLessThan(-TUNING.jumpVelocity * 0.9)
  })

  it('does not cut again once already falling', () => {
    step(s, jump(), FRAME, true)
    hold(none(), 60, false)
    const v = s.vy
    step(s, none(), FRAME, false)
    expect(s.vy).toBeGreaterThanOrEqual(v)
  })

  it('clamps fall speed', () => {
    hold(none(), 600, false)
    expect(s.vy).toBeLessThanOrEqual(TUNING.maxFallSpeed)
  })

  it('ignores a press in mid-air once the buffer has run out', () => {
    hold(none(), 61, false)
    const before = s.vy
    step(s, jump(), FRAME, false)
    expect(s.vy).toBeGreaterThan(before - 1)
  })

  it('zeroes downward velocity on landing', () => {
    hold(none(), 20, false)
    expect(s.vy).toBeGreaterThan(0)
    step(s, none(), FRAME, true)
    expect(s.vy).toBe(0)
  })
})

describe('coyoteTime', () => {
  it('allows a jump shortly after walking off a ledge', () => {
    step(s, none(), FRAME, true)
    step(s, none(), FRAME, false)
    step(s, jump(), FRAME, false)
    expect(s.vy).toBeCloseTo(-TUNING.jumpVelocity, 1)
  })

  it('expires after coyoteTimeMs', () => {
    step(s, none(), FRAME, true)
    step(s, none(), TUNING.coyoteTimeMs + FRAME, false)
    const before = s.vy
    step(s, jump(), FRAME, false)
    expect(s.vy).toBeGreaterThan(before - 1)
  })

  it('is spent by the jump it enabled, so it cannot double jump', () => {
    step(s, none(), FRAME, true)
    step(s, jump(), FRAME, false)
    step(s, jump(), FRAME, false)
    expect(s.vy).toBeGreaterThan(-TUNING.jumpVelocity * 1.1)
  })
})

describe('jumpBuffer', () => {
  it('fires on the landing frame when pressed slightly early', () => {
    step(s, jump(), FRAME, false)
    step(s, none(), FRAME, true)
    expect(s.vy).toBeCloseTo(-TUNING.jumpVelocity, 1)
  })

  it('expires after jumpBufferMs', () => {
    step(s, jump(), FRAME, false)
    step(s, none(), TUNING.jumpBufferMs + FRAME, false)
    step(s, none(), FRAME, true)
    expect(s.vy).toBeGreaterThan(-TUNING.jumpVelocity * 0.5)
  })
})

describe('canBreakByRunning (FR-07)', () => {
  it('is false at rest and true at top speed', () => {
    expect(canBreakByRunning(s)).toBe(false)
    hold(right(), 200, true)
    expect(canBreakByRunning(s)).toBe(true)
  })

  it('is true running either direction', () => {
    hold(left(), 200, true)
    expect(canBreakByRunning(s)).toBe(true)
  })

  it('is false after only a nudge', () => {
    step(s, right(), FRAME, true)
    expect(canBreakByRunning(s)).toBe(false)
  })
})

describe('determinism (NFR-GAME-02, invariants #5)', () => {
  it('yields an identical state for an identical input sequence', () => {
    const run = () => {
      const st = initialMoveState()
      const seq: [InputSnapshot, boolean][] = [
        [right(), true],
        [right(), true],
        [jump(), true],
        [right(), false],
        [none(), false],
        [none(), false],
        [right(), true],
      ]
      for (const [input, ground] of seq) step(st, input, FRAME, ground)
      return st
    }
    expect(run()).toEqual(run())
  })

  it('produces the same result from two equal-length time slices as one big one', () => {
    const a = initialMoveState()
    step(a, none(), 32, false)
    const b = initialMoveState()
    step(b, none(), 16, false)
    step(b, none(), 16, false)
    // Not bit-identical (gravity integration is per-step), but close enough that a
    // frame-rate change cannot alter what the player can and cannot reach.
    expect(Math.abs(a.vy - b.vy)).toBeLessThan(1)
  })

  it('never reads the wall clock', () => {
    const source = String(step)
    expect(source.includes('Date' + '.now')).toBe(false)
    expect(source.includes('performance' + '.now')).toBe(false)
  })
})
