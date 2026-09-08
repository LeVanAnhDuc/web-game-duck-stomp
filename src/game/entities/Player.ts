/**
 * The player — FR-03, FR-06, FR-07.
 *
 * Two things here are worth knowing before touching anything:
 *
 * 1. Arcade gravity is OFF for this body. `core/movement` owns the whole vertical
 *    story so it stays unit-testable, and this sprite is only ever told what
 *    velocity to have. Turning Arcade gravity back on would double it, silently.
 *
 * 2. The powered form is the SAME sprite with a gold outline instead of a dark
 *    one. That is not a shortcut — it is what makes a power-up read as "same
 *    character, stronger" rather than "you are now somebody else".
 *
 * The body is narrower than the art on purpose. A 16px-wide hitbox in a world of
 * 16px tiles catches on every seam; 10px lets a player thread a one-tile gap that
 * their eyes tell them fits.
 */

import Phaser from 'phaser'
import { TUNING } from '../../core/tuning'
import { TEX } from '../textures'

export class Player extends Phaser.Physics.Arcade.Sprite {
  hearts = 3
  powered = false

  /** Scene time at which invulnerability ends. */
  private invulnerableUntil = 0
  private flickerAt = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.player)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setSize(10, 16)
    body.setOffset(3, 0)
    this.setOrigin(0.5, 0.5)
    this.setDepth(10)
  }

  get arcade(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body
  }

  setPowered(powered: boolean): void {
    this.powered = powered
    this.setTexture(powered ? TEX.playerPowered : TEX.player)
  }

  isInvulnerable(now: number): boolean {
    return now < this.invulnerableUntil
  }

  beginInvulnerability(now: number): void {
    this.invulnerableUntil = now + TUNING.invulnMs
  }

  /**
   * Flicker while invulnerable. Stepped rather than tweened, so it matches the
   * pixel aesthetic and so `prefers-reduced-motion` has nothing to object to.
   */
  updateFlicker(now: number): void {
    if (!this.isInvulnerable(now)) {
      this.setAlpha(1)
      return
    }
    if (now >= this.flickerAt) {
      this.flickerAt = now + 70
      this.setAlpha(this.alpha === 1 ? 0.35 : 1)
    }
  }

  faceDirection(facing: 1 | -1): void {
    this.setFlipX(facing === -1)
  }

  resetTo(x: number, y: number): void {
    this.setPosition(x, y)
    this.arcade.setVelocity(0, 0)
    this.hearts = 3
    this.setPowered(false)
    this.invulnerableUntil = 0
    this.setAlpha(1)
  }
}
