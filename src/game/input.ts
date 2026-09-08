/**
 * One input snapshot, two input devices — FR-15, ADR-0004.
 *
 * Keyboard and touch write into the SAME flat snapshot, and `core/movement` never
 * learns which one produced it. That is how "touch is not a second-class port"
 * stops being a promise and becomes a structural fact: there is no per-platform
 * branch in the gameplay path to drift.
 *
 * Whether to show the on-screen buttons is decided by input that has ACTUALLY
 * ARRIVED, never by sniffing the user agent (invariants #11). A touchscreen laptop
 * is a real device, and guessing wrong either hides the controls from someone who
 * needs them or paints them over the level for someone who does not.
 *
 * The snapshot object is allocated once and rewritten in place, because this is
 * read every frame and NFR-PERF-06 forbids per-frame allocation.
 */

import Phaser from 'phaser'
import type { InputSnapshot } from '../core/movement'

export type TouchControl = 'left' | 'right' | 'jump'

export class InputManager {
  /** Rewritten in place every `update()`. Never hold a copy across frames. */
  readonly snapshot: InputSnapshot = { left: false, right: false, jumpPressed: false, jumpHeld: false }

  private readonly keys: Record<'left' | 'right' | 'altLeft' | 'altRight' | 'jump' | 'altJump' | 'altJump2', Phaser.Input.Keyboard.Key> | null
  private readonly touch: Record<TouchControl, boolean> = { left: false, right: false, jump: false }

  private sawTouch = false
  private sawKey = false
  private jumpWasHeld = false

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard
    if (keyboard === null) {
      this.keys = null
    } else {
      this.keys = keyboard.addKeys(
        {
          left: Phaser.Input.Keyboard.KeyCodes.LEFT,
          right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
          altLeft: Phaser.Input.Keyboard.KeyCodes.A,
          altRight: Phaser.Input.Keyboard.KeyCodes.D,
          jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
          altJump: Phaser.Input.Keyboard.KeyCodes.UP,
          altJump2: Phaser.Input.Keyboard.KeyCodes.W,
        },
        false,
        false,
      ) as Record<'left' | 'right' | 'altLeft' | 'altRight' | 'jump' | 'altJump' | 'altJump2', Phaser.Input.Keyboard.Key>
    }

    // Three simultaneous contacts: two thumbs plus a stray palm touch.
    scene.input.addPointer(2)
  }

  /** Called by the HUD when an on-screen button goes down or up. */
  setTouch(control: TouchControl, down: boolean): void {
    if (down) this.sawTouch = true
    this.touch[control] = down
  }

  /** True once any on-screen control has been used and no key has been since. */
  get showTouch(): boolean {
    return this.sawTouch && !this.sawKey
  }

  /** True before either device has been used — the moment to show a hint, if ever. */
  get isUndecided(): boolean {
    return !this.sawTouch && !this.sawKey
  }

  update(): void {
    const k = this.keys
    const keyLeft = k !== null && (k.left.isDown || k.altLeft.isDown)
    const keyRight = k !== null && (k.right.isDown || k.altRight.isDown)
    const keyJump = k !== null && (k.jump.isDown || k.altJump.isDown || k.altJump2.isDown)

    if (keyLeft || keyRight || keyJump) this.sawKey = true

    this.snapshot.left = keyLeft || this.touch.left
    this.snapshot.right = keyRight || this.touch.right

    const jumpHeld = keyJump || this.touch.jump
    // The edge is computed here rather than trusted from either device, so a held
    // button cannot re-trigger a jump and both devices behave identically.
    this.snapshot.jumpPressed = jumpHeld && !this.jumpWasHeld
    this.snapshot.jumpHeld = jumpHeld
    this.jumpWasHeld = jumpHeld
  }

  /** Drops every held control. Used when a level ends or the rotate gate opens. */
  releaseAll(): void {
    this.touch.left = false
    this.touch.right = false
    this.touch.jump = false
    this.snapshot.left = false
    this.snapshot.right = false
    this.snapshot.jumpPressed = false
    this.snapshot.jumpHeld = false
    this.jumpWasHeld = false
  }
}
