/**
 * The movement state machine — FR-03, and the single most important file here.
 *
 * It is pure TypeScript that knows nothing about Phaser, sprites or collision. It
 * takes a flat snapshot of what the player is pressing plus whether they are
 * standing on something, and answers with a velocity. That is the whole contract.
 *
 * WHY it lives outside the engine: game feel is the thing most likely to regress
 * and the most expensive thing to re-test by hand. Keeping the four forgiveness
 * mechanics here means the entire behaviour table in docs/specs/core-game/design.md
 * is covered by unit tests that run in milliseconds, with no browser.
 *
 * The elapsed time is PASSED IN (invariants #5). A version of this that read the
 * clock itself would keep every test green while behaving differently on a 60Hz
 * and a 144Hz display — the exact shape of a silent failure.
 *
 * `step` MUTATES the state it is given and returns the same object. That is
 * deliberate: it runs every frame, and NFR-PERF-06 forbids allocating in the
 * update loop. Callers keep one long-lived state object for the whole level.
 */

import { TUNING } from './tuning'

export type InputSnapshot = {
  left: boolean
  right: boolean
  /** True only on the frame the jump control went down. */
  jumpPressed: boolean
  /** True for as long as the jump control stays down. */
  jumpHeld: boolean
}

export type MoveState = {
  vx: number
  vy: number
  facing: 1 | -1
  /** Remaining grace to jump after leaving the ground. Counts down. */
  coyoteMs: number
  /** Remaining life of a jump press made too early. Counts down. */
  bufferMs: number
  onGround: boolean
  /** True while a jump is rising and has not yet been cut short. */
  jumping: boolean
}

export function initialMoveState(): MoveState {
  return { vx: 0, vy: 0, facing: 1, coyoteMs: 0, bufferMs: 0, onGround: false, jumping: false }
}

/** A snapshot with nothing pressed. Handy for tests and for a paused frame. */
export function idleInput(): InputSnapshot {
  return { left: false, right: false, jumpPressed: false, jumpHeld: false }
}

export function step(
  state: MoveState,
  input: InputSnapshot,
  dtMs: number,
  onGround: boolean,
): MoveState {
  const dt = dtMs / 1000

  const dir: -1 | 0 | 1 = input.right && !input.left ? 1 : input.left && !input.right ? -1 : 0

  if (dir !== 0) {
    state.facing = dir
    const alreadyMovingThatWay = state.vx === 0 || Math.sign(state.vx) === dir
    const rate = alreadyMovingThatWay ? TUNING.accel : TUNING.turnAccel
    state.vx += dir * rate * dt
    if (Math.abs(state.vx) > TUNING.maxRun) state.vx = dir * TUNING.maxRun
  } else {
    const decay = TUNING.friction * dt
    state.vx = Math.abs(state.vx) <= decay ? 0 : state.vx - Math.sign(state.vx) * decay
  }

  state.coyoteMs = onGround ? TUNING.coyoteTimeMs : Math.max(0, state.coyoteMs - dtMs)
  state.bufferMs = input.jumpPressed ? TUNING.jumpBufferMs : Math.max(0, state.bufferMs - dtMs)

  const mayJump = onGround || state.coyoteMs > 0

  if (state.bufferMs > 0 && mayJump) {
    state.vy = -TUNING.jumpVelocity
    state.jumping = true
    // Both windows are spent by the jump they enabled, so neither can grant a second one.
    state.bufferMs = 0
    state.coyoteMs = 0
  } else {
    state.vy += TUNING.gravity * dt

    if (state.jumping && state.vy < 0 && !input.jumpHeld) {
      state.vy *= TUNING.cutMultiplier
      state.jumping = false
    }

    if (state.vy > TUNING.maxFallSpeed) state.vy = TUNING.maxFallSpeed

    if (onGround && state.vy > 0) {
      state.vy = 0
      state.jumping = false
    }
  }

  state.onGround = onGround
  return state
}

/** True when a powered player moving this fast horizontally may smash a cracked block (FR-07). */
export function canBreakByRunning(state: MoveState): boolean {
  return Math.abs(state.vx) >= TUNING.breakSpeed
}
