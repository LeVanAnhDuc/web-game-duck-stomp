/**
 * The three enemies — FR-08.
 *
 * `stompable` is the whole taxonomy. A walker and a spiker are the same body with
 * the same patrol; the only difference is what happens when you land on one, and
 * that single boolean is what teaches "not everything can be jumped on" in level 4.
 *
 * `turnAtEdge` is a Tiled PROPERTY, not a subclass. Both behaviours — turning at a
 * ledge and walking straight off it — are useful level-design cards, and making
 * them one class with a flag means the level author picks per instance while the
 * code stays one thing (design.md §4).
 *
 * These bodies DO use Arcade gravity, unlike the player. Nothing about an enemy's
 * fall needs to be unit-testable, and letting Arcade do it keeps them cheap.
 */

import Phaser from 'phaser'
import { TUNING } from '../../core/tuning'
import { TEX } from '../textures'

/** True when there is solid ground at this world point. Supplied by the scene. */
export type GroundProbe = (worldX: number, worldY: number) => boolean

export abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  abstract readonly stompable: boolean

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setOrigin(0.5, 0.5)
    this.setDepth(5)
  }

  get arcade(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body
  }

  /** Called once per frame by the scene. `dtMs` is there for subclasses that need it. */
  abstract tick(dtMs: number, probe: GroundProbe): void

  /** Squash and remove. Kept here so both the stomp path and a break path share it. */
  defeat(): void {
    this.arcade.setVelocity(0, 0)
    this.arcade.setEnable(false)
    this.setScale(1, 0.4)
    this.setAlpha(0.85)
    this.scene.time.delayedCall(140, () => this.destroy())
  }
}

class Patroller extends Enemy {
  readonly stompable: boolean

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    private readonly speed: number,
    private readonly turnAtEdge: boolean,
    stompable: boolean,
  ) {
    super(scene, x, y, texture)
    this.stompable = stompable

    const body = this.arcade
    body.setSize(14, 12)
    body.setOffset(1, 4)
    body.setGravityY(TUNING.gravity)
    body.setVelocityX(-speed)
  }

  override tick(_dtMs: number, probe: GroundProbe): void {
    const body = this.arcade
    if (!body.enable) return

    if (body.blocked.left) body.setVelocityX(this.speed)
    else if (body.blocked.right) body.setVelocityX(-this.speed)

    if (body.velocity.x === 0) body.setVelocityX(-this.speed)
    this.setFlipX(body.velocity.x > 0)

    if (!this.turnAtEdge || !body.blocked.down) return

    // Look one body-width ahead and one pixel below the feet. Nothing there means
    // the next step is into thin air, so turn instead.
    const ahead = this.x + Math.sign(body.velocity.x) * (body.width / 2 + 2)
    const underfoot = this.y + body.height / 2 + 2
    if (!probe(ahead, underfoot)) body.setVelocityX(-body.velocity.x)
  }
}

export class Walker extends Patroller {
  constructor(scene: Phaser.Scene, x: number, y: number, turnAtEdge: boolean) {
    super(scene, x, y, TEX.walker, 34, turnAtEdge, true)
  }
}

/** Spikes on top: cannot be stomped, and that is the entire point of it. */
export class Spiker extends Patroller {
  constructor(scene: Phaser.Scene, x: number, y: number, turnAtEdge: boolean) {
    super(scene, x, y, TEX.spiker, 26, turnAtEdge, false)
  }
}

/**
 * Flies a fixed there-and-back path. Adds the vertical threat a two-button
 * platformer otherwise forgets, since every other hazard sits on the floor.
 */
export class Flyer extends Enemy {
  readonly stompable = true

  private readonly homeX: number
  private readonly homeY: number
  private readonly rangeX: number
  private readonly rangeY: number
  private readonly speed: number
  private direction = 1

  constructor(scene: Phaser.Scene, x: number, y: number, tilesX: number, tilesY: number, speed: number) {
    super(scene, x, y, TEX.flyer)
    this.homeX = x
    this.homeY = y
    this.rangeX = tilesX * 16
    this.rangeY = tilesY * 16
    this.speed = speed

    const body = this.arcade
    body.setAllowGravity(false)
    body.setSize(12, 8)
    body.setOffset(2, 4)
    this.setVelocityFromDirection()
  }

  private setVelocityFromDirection(): void {
    const length = Math.hypot(this.rangeX, this.rangeY) || 1
    this.arcade.setVelocity(
      (this.rangeX / length) * this.speed * this.direction,
      (this.rangeY / length) * this.speed * this.direction,
    )
  }

  override tick(_dtMs: number, _probe: GroundProbe): void {
    const body = this.arcade
    if (!body.enable) return

    const pastX = this.rangeX !== 0 && Math.abs(this.x - this.homeX) >= Math.abs(this.rangeX)
    const pastY = this.rangeY !== 0 && Math.abs(this.y - this.homeY) >= Math.abs(this.rangeY)
    if (pastX || pastY) {
      this.direction = this.direction === 1 ? -1 : 1
      this.setVelocityFromDirection()
    }
    this.setFlipX(body.velocity.x > 0)
  }
}
