/**
 * Everything in a level that is not the player or an enemy — FR-05, FR-07,
 * FR-09, FR-10, FR-11.
 *
 * The interesting one is `CrackedBlock`. It has three outcomes, not two, and the
 * third is the reason it works: break, ignore, or THUD. A block that refuses to
 * break must say "you were too slow" rather than "this is a wall", otherwise the
 * hidden room behind it is never found and the mechanic teaches nothing (US-05).
 */

import Phaser from 'phaser'
import { TEX } from '../textures'

/** A coin. `hidden` ones are identical to the player — the reward is finding them. */
export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.coin)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setSize(10, 10)
    body.setOffset(3, 3)
    this.setDepth(4)
  }

  collect(): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setEnable(false)
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      alpha: 0,
      duration: 160,
      onComplete: () => this.destroy(),
    })
  }
}

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.powerUp)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setSize(12, 12)
    body.setOffset(2, 3)
    this.setDepth(4)
  }

  take(): void {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setEnable(false)
    this.destroy()
  }
}

export type QuestionGives = 'coin' | 'powerUp'

/** Hit from underneath, Mario-style. No new control needed — you jump into it. */
export class QuestionBlock extends Phaser.Physics.Arcade.Image {
  spent = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    readonly gives: QuestionGives,
  ) {
    super(scene, x, y, TEX.questionBlock)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    this.setDepth(3)
  }

  /** Bumps up a couple of pixels and goes dull. Returns false if already spent. */
  bump(): boolean {
    if (this.spent) return false
    this.spent = true
    this.setTexture(TEX.questionBlockSpent)
    const restY = this.y
    this.scene.tweens.add({
      targets: this,
      y: restY - 3,
      duration: 70,
      yoyo: true,
      onComplete: () => this.setY(restY),
    })
    return true
  }
}

export type CrackOutcome = 'broken' | 'thud'

export class CrackedBlock extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.crackedBlock)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    this.setDepth(3)
  }

  break(): void {
    const body = this.body as Phaser.Physics.Arcade.StaticBody
    body.enable = false
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 130,
      onComplete: () => this.destroy(),
    })
  }

  /**
   * The "not fast enough" answer. A short shudder, deliberately different from
   * breaking, so the player reads it as a speed problem rather than a solid wall.
   */
  thud(): void {
    const restX = this.x
    this.scene.tweens.add({
      targets: this,
      x: restX + 1.5,
      duration: 45,
      yoyo: true,
      repeat: 1,
      onComplete: () => this.setX(restX),
    })
  }
}

export class Spikes extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.spikes)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    const body = this.body as Phaser.Physics.Arcade.StaticBody
    // Only the spikes hurt, not the block they sit on.
    body.setSize(16, 6)
    body.setOffset(0, 6)
    this.setDepth(2)
  }
}

/**
 * Immovable and gravity-free, moved by velocity so Arcade still resolves
 * collisions against it. Arcade does not carry riders, so the scene adds this
 * body's per-frame delta to a player standing on it.
 */
export class MovingPlatform extends Phaser.Physics.Arcade.Image {
  private readonly homeX: number
  private readonly homeY: number
  private readonly rangeX: number
  private readonly rangeY: number
  private readonly speed: number
  private direction = 1

  constructor(scene: Phaser.Scene, x: number, y: number, tilesX: number, tilesY: number, speed: number) {
    super(scene, x, y, TEX.platform)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.homeX = x
    this.homeY = y
    this.rangeX = tilesX * 16
    this.rangeY = tilesY * 16
    this.speed = speed

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setImmovable(true)
    body.setSize(16, 4)
    body.setOffset(0, 0)
    this.setDepth(3)
    this.applyVelocity()
  }

  get arcade(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body
  }

  private applyVelocity(): void {
    const length = Math.hypot(this.rangeX, this.rangeY) || 1
    this.arcade.setVelocity(
      (this.rangeX / length) * this.speed * this.direction,
      (this.rangeY / length) * this.speed * this.direction,
    )
  }

  tick(): void {
    const pastX = this.rangeX !== 0 && Math.abs(this.x - this.homeX) >= Math.abs(this.rangeX)
    const pastY = this.rangeY !== 0 && Math.abs(this.y - this.homeY) >= Math.abs(this.rangeY)
    if (pastX || pastY) {
      this.direction = this.direction === 1 ? -1 : 1
      this.applyVelocity()
    }
  }
}

export class Checkpoint extends Phaser.Physics.Arcade.Image {
  lit = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.checkpointOff)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    this.setDepth(2)
  }

  light(): boolean {
    if (this.lit) return false
    this.lit = true
    this.setTexture(TEX.checkpointOn)
    return true
  }
}

export class Goal extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEX.goal)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    const body = this.body as Phaser.Physics.Arcade.StaticBody
    body.setSize(10, 32)
    this.setDepth(2)
  }
}
