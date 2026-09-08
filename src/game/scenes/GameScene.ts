/**
 * One level, playing — the scene every other scene exists to serve.
 *
 * The frame is deliberately boring to read: gather input, ask `core/movement` what
 * the velocity should be, hand it to Arcade, let Arcade resolve collisions, and
 * turn what happened into domain events. No collision callback here touches the
 * HUD, plays a sound, or writes to storage; they emit, and the HUD scene, the
 * audio layer and the save layer listen. That one-way flow is what lets the HUD be
 * a separate scene at a different camera zoom (architecture.md §4).
 *
 * Two rules in here are silent-failure rules, so they are spelled out:
 *   - The clock does NOT reset on respawn (invariants #9). Dying costs time, which
 *     is the only punishment in a game with no lives, and it is what makes the
 *     best-time record mean anything.
 *   - Falling out of the level kills outright, bypassing hearts (invariants #8).
 *     It is the single exception to the damage order, and every platformer has it.
 */

import Phaser from 'phaser'
import { canBreakByRunning, initialMoveState, step, type MoveState } from '../../core/movement'
import { TUNING } from '../../core/tuning'
import type { LevelId } from '../../core/progress'
import { GAME_EVENT } from '../events'
import { InputManager } from '../input'
import { LevelFormatError, parseLevel, prop, type LevelData } from '../levelLoader'
import { TEX, TILE } from '../textures'
import { Player } from '../entities/Player'
import { Flyer, Spiker, Walker, type Enemy, type GroundProbe } from '../entities/enemies'
import { Checkpoint, Coin, CrackedBlock, Goal, MovingPlatform, PowerUp, QuestionBlock, Spikes } from '../entities/props'
import type { Sfx } from '../audio'
import { REGISTRY, SCENE } from './keys'

export type GameSceneData = { levelId: LevelId }

/** Ceiling on one physics step, in ms — see the note in `update`. */
const MAX_STEP_MS = 50

/** Minimum gap between two "too slow" thuds on the same wall. */
const THUD_COOLDOWN_MS = 320

export class GameScene extends Phaser.Scene {
  levelId: LevelId = '1'
  inputs!: InputManager
  level!: LevelData

  private player!: Player
  private moveState: MoveState = initialMoveState()
  private terrain!: Phaser.Tilemaps.TilemapLayer

  private enemies!: Phaser.GameObjects.Group
  private coins!: Phaser.GameObjects.Group
  private powerUps!: Phaser.GameObjects.Group
  private blocks!: Phaser.GameObjects.Group
  private cracked!: Phaser.GameObjects.Group
  private platforms!: Phaser.GameObjects.Group
  private spikes!: Phaser.GameObjects.Group
  private checkpoints!: Phaser.GameObjects.Group

  private goal!: Goal
  private probe: GroundProbe = () => false
  private respawnAt = new Phaser.Math.Vector2()
  private coinsCollected = 0
  private elapsedMs = 0
  private finished = false
  private ridingPlatform: MovingPlatform | null = null
  /** Scene time of the last thud, so leaning on a wall is not a machine gun. */
  private lastThudAt = 0

  constructor() {
    super(SCENE.game)
  }

  private get sfx(): Sfx {
    return this.registry.get(REGISTRY.sfx) as Sfx
  }

  create(data: GameSceneData): void {
    this.levelId = data.levelId
    this.coinsCollected = 0
    this.elapsedMs = 0
    this.finished = false
    this.ridingPlatform = null
    this.moveState = initialMoveState()

    const raw: unknown = this.cache.json.get(`level-${this.levelId}`)
    try {
      this.level = parseLevel(raw)
    } catch (error) {
      // NFR-REL-03: a broken level must never be a dead end.
      const why = error instanceof LevelFormatError ? error.message : 'level could not be read'
      console.error(`[game] level ${this.levelId}: ${why}`)
      this.scene.start(SCENE.worldMap)
      return
    }

    this.buildTerrain()
    this.buildObjects()
    this.wireCollisions()
    this.configureCamera()

    this.inputs = new InputManager(this)
    this.scene.launch(SCENE.hud, { levelId: this.levelId })

    const keyboard = this.input.keyboard
    if (keyboard !== null) {
      keyboard.on('keydown-ESC', () => this.requestPause())
      keyboard.on('keydown-P', () => this.requestPause())
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.stop(SCENE.hud)
    })
  }

  private buildTerrain(): void {
    const map = this.make.tilemap({
      data: this.level.tiles,
      tileWidth: this.level.tileSize,
      tileHeight: this.level.tileSize,
    })
    const tileset = map.addTilesetImage('tiles', TEX.tileset, TILE, TILE, 0, 0)
    if (tileset === null) throw new Error('tileset image missing — generateTextures did not run')
    const layer = map.createLayer(0, tileset, 0, 0)
    if (layer === null) throw new Error('terrain layer could not be created')
    this.terrain = layer
    this.terrain.setCollisionBetween(0, 1)
    this.terrain.setDepth(1)
  }

  private buildObjects(): void {
    this.enemies = this.add.group()
    this.coins = this.add.group()
    this.powerUps = this.add.group()
    this.blocks = this.add.group()
    this.cracked = this.add.group()
    this.platforms = this.add.group()
    this.spikes = this.add.group()
    this.checkpoints = this.add.group()

    // The player must exist before anything that collides with it, and object
    // order in the file is an accident of level layout rather than a guarantee.
    const spawn = this.level.objects.find((o) => o.type === 'spawn')
    if (spawn === undefined) throw new LevelFormatError('level has no spawn')
    this.respawnAt.set(spawn.x, spawn.y)
    this.player = new Player(this, spawn.x, spawn.y)

    for (const object of this.level.objects) {
      const { x, y } = object
      switch (object.type) {
        case 'spawn':
          break
        case 'goal':
          // The flag is 16x32 and stands on the row below its cell centre.
          this.goal = new Goal(this, x, y - TILE / 2)
          break
        case 'checkpoint':
          this.checkpoints.add(new Checkpoint(this, x, y))
          break
        case 'coin':
        case 'coinHidden':
          this.coins.add(new Coin(this, x, y))
          break
        case 'powerUp':
          this.powerUps.add(new PowerUp(this, x, y))
          break
        case 'questionBlock':
          this.blocks.add(new QuestionBlock(this, x, y, prop<string>(object, 'gives', 'coin') === 'powerUp' ? 'powerUp' : 'coin'))
          break
        case 'crackedBlock':
          this.cracked.add(new CrackedBlock(this, x, y))
          break
        case 'walker':
          this.enemies.add(new Walker(this, x, y, prop(object, 'turnAtEdge', false)))
          break
        case 'spiker':
          this.enemies.add(new Spiker(this, x, y, prop(object, 'turnAtEdge', true)))
          break
        case 'flyer':
          this.enemies.add(
            new Flyer(this, x, y, prop(object, 'dx', 3), prop(object, 'dy', 0), prop(object, 'speed', 40)),
          )
          break
        case 'spikes':
          this.spikes.add(new Spikes(this, x, y))
          break
        case 'movingPlatform':
          this.platforms.add(
            new MovingPlatform(this, x, y, prop(object, 'dx', 4), prop(object, 'dy', 0), prop(object, 'speed', 32)),
          )
          break
        default:
          console.warn(`[game] level ${this.levelId}: ignoring unknown object type "${object.type}"`)
      }
    }
  }

  private wireCollisions(): void {
    this.probe = (worldX, worldY) => this.terrain.getTileAtWorldXY(worldX, worldY) !== null

    this.physics.add.collider(this.player, this.terrain)
    this.physics.add.overlap(this.player, this.goal, () => this.complete())
    this.physics.add.collider(this.enemies, this.terrain)
    this.physics.add.collider(this.enemies, this.platforms)

    this.physics.add.collider(this.player, this.platforms, (_p, platformObject) => {
      const platform = platformObject as MovingPlatform
      if (this.player.arcade.touching.down) this.ridingPlatform = platform
    })

    this.physics.add.collider(this.player, this.blocks, (_p, blockObject) => {
      this.onQuestionBlock(blockObject as QuestionBlock)
    })

    this.physics.add.collider(this.player, this.cracked, (_p, blockObject) => {
      this.onCrackedBlock(blockObject as CrackedBlock)
    })

    this.physics.add.overlap(this.player, this.coins, (_p, coinObject) => {
      const coin = coinObject as Coin
      if (!(coin.body as Phaser.Physics.Arcade.Body).enable) return
      coin.collect()
      this.coinsCollected += 1
      this.events.emit(GAME_EVENT.coinCollected, { collected: this.coinsCollected, total: this.level.totalCoins })
      this.sfx.play('coin')
    })

    this.physics.add.overlap(this.player, this.powerUps, (_p, powerUpObject) => {
      const powerUp = powerUpObject as PowerUp
      powerUp.take()
      this.player.setPowered(true)
      this.events.emit(GAME_EVENT.powerUpTaken, {})
      this.sfx.play('unlock')
    })

    this.physics.add.overlap(this.player, this.spikes, () => this.damage())

    this.physics.add.overlap(this.player, this.enemies, (_p, enemyObject) => {
      this.onEnemyTouch(enemyObject as Enemy)
    })

    this.physics.add.overlap(this.player, this.checkpoints, (_p, checkpointObject) => {
      const checkpoint = checkpointObject as Checkpoint
      if (!checkpoint.light()) return
      this.respawnAt.set(checkpoint.x, checkpoint.y)
      this.events.emit(GAME_EVENT.checkpointReached, {})
      this.sfx.play('unlock')
    })
  }

  private configureCamera(): void {
    const zoom = Number(this.registry.get(REGISTRY.zoom) ?? 2)
    const camera = this.cameras.main
    camera.setZoom(zoom)
    camera.setRoundPixels(true)
    camera.setBounds(0, 0, this.level.widthPx, this.level.heightPx)
    camera.setBackgroundColor(0x262e5e)
    camera.startFollow(this.player, true, 0.16, 0.16)
    this.physics.world.setBounds(0, 0, this.level.widthPx, this.level.heightPx + 200)
  }

  override update(_time: number, delta: number): void {
    if (this.finished) return
    const now = this.time.now

    // Clamp the step. A backgrounded tab throttles requestAnimationFrame, and the
    // frame after it regains focus arrives with a delta measured in seconds. Fed
    // straight through, gravity for a whole second lands in one step and the
    // player tunnels clean through the floor — no error, no log, just a fall out
    // of a level that was solid a moment ago. Three frames' worth is the ceiling.
    const dt = Math.min(delta, MAX_STEP_MS)

    this.inputs.update()
    const body = this.player.arcade
    const onGround = body.blocked.down || body.touching.down

    step(this.moveState, this.inputs.snapshot, dt, onGround)
    body.setVelocity(this.moveState.vx, this.moveState.vy)
    this.player.faceDirection(this.moveState.facing)
    this.player.updateFlicker(now)

    if (this.moveState.jumping && this.inputs.snapshot.jumpPressed) this.sfx.play('jump')

    // Arcade does not carry riders, so a player standing on a moving platform is
    // moved by hand, by exactly the platform's own step.
    const riding = this.ridingPlatform
    if (riding !== null) {
      if (onGround) this.player.x += riding.arcade.deltaX()
      this.ridingPlatform = null
    }

    for (const child of this.enemies.getChildren()) {
      const enemy = child as Enemy
      enemy.tick(dt, this.probe)
    }
    for (const child of this.platforms.getChildren()) (child as MovingPlatform).tick()

    this.elapsedMs += dt
    this.events.emit(GAME_EVENT.timeTick, { elapsedMs: this.elapsedMs })

    // A `turnAtEdge: false` walker is MEANT to walk off a ledge, and without this
    // it then falls for ever, carrying a live body with it.
    const floor = this.level.heightPx + 64
    for (const child of this.enemies.getChildren()) {
      const enemy = child as Enemy
      if (enemy.y > floor) enemy.destroy()
    }

    // invariants #8 — out of the level is death, hearts do not apply.
    if (this.player.y > this.level.heightPx + 24) this.die()
  }

  private onQuestionBlock(block: QuestionBlock): void {
    if (!this.player.arcade.blocked.up && !this.player.arcade.touching.up) return
    if (!block.bump()) return

    this.events.emit(GAME_EVENT.blockBumped, {})
    if (block.gives === 'powerUp') {
      const powerUp = new PowerUp(this, block.x, block.y - TILE)
      this.powerUps.add(powerUp)
      this.sfx.play('unlock')
    } else {
      this.coinsCollected += 1
      this.events.emit(GAME_EVENT.coinCollected, { collected: this.coinsCollected, total: this.level.totalCoins })
      this.sfx.play('coin')
    }
  }

  private onCrackedBlock(block: CrackedBlock): void {
    // Unpowered, it is simply a wall. The powered form is what makes it a puzzle.
    if (!this.player.powered) return

    const body = this.player.arcade
    const sideways = body.touching.left || body.touching.right || body.blocked.left || body.blocked.right
    const fromAbove = body.touching.down && this.moveState.vy >= 0

    if (fromAbove || (sideways && canBreakByRunning(this.moveState))) {
      block.break()
      this.events.emit(GAME_EVENT.blockBroken, {})
      this.sfx.play('break')
      return
    }

    if (sideways) {
      // "Too slow", not "solid" — the distinction the whole hidden room rests on.
      //
      // Contact persists for as long as the player leans on the wall, so this
      // fires every frame unless it is held off. Unthrottled it was six thuds in
      // six frames, which reads as a machine gun rather than a hint.
      const now = this.time.now
      if (now - this.lastThudAt < THUD_COOLDOWN_MS) return
      this.lastThudAt = now
      block.thud()
      this.events.emit(GAME_EVENT.blockThudded, {})
      this.sfx.play('thud')
    }
  }

  private onEnemyTouch(enemy: Enemy): void {
    if (!enemy.arcade.enable) return

    const playerBottom = this.player.arcade.bottom
    const enemyTop = enemy.arcade.top
    const landingOnTop = this.moveState.vy > 0 && playerBottom <= enemyTop + 8

    if (landingOnTop && enemy.stompable) {
      enemy.defeat()
      this.moveState.vy = -TUNING.stompBounce
      this.moveState.jumping = false
      this.events.emit(GAME_EVENT.enemyStomped, {})
      this.sfx.play('stomp')
      return
    }

    this.damage()
  }

  /**
   * The damage order from design.md §2, in one place so it cannot drift between
   * a spike, an enemy flank and a spiker's head.
   */
  private damage(): void {
    const now = this.time.now
    if (this.player.isInvulnerable(now) || this.finished) return
    this.player.beginInvulnerability(now)

    const away = this.moveState.facing === 1 ? -1 : 1
    this.moveState.vx = away * TUNING.knockbackX
    this.moveState.vy = -TUNING.knockbackY

    if (this.player.powered) {
      this.player.setPowered(false)
      this.events.emit(GAME_EVENT.powerUpLost, {})
      this.sfx.play('hurt')
      return
    }

    this.player.hearts -= 1
    this.events.emit(GAME_EVENT.playerHit, { hearts: this.player.hearts })
    this.sfx.play('hurt')
    if (this.player.hearts <= 0) this.die()
  }

  private die(): void {
    if (this.finished) return
    this.events.emit(GAME_EVENT.playerDied, {})
    this.sfx.play('hurt')

    // Under a second, and no screen in the way (ADR-0003). The clock keeps running.
    this.cameras.main.flash(90, 19, 23, 53)
    this.player.resetTo(this.respawnAt.x, this.respawnAt.y)
    this.moveState = initialMoveState()
    this.inputs.releaseAll()
    this.events.emit(GAME_EVENT.playerRespawned, { hearts: this.player.hearts })
  }

  private complete(): void {
    if (this.finished) return
    this.finished = true
    this.inputs.releaseAll()
    this.player.arcade.setVelocity(0, 0)
    this.sfx.play('clear')

    this.events.emit(GAME_EVENT.levelCompleted, {
      levelId: this.levelId,
      timeMs: this.elapsedMs,
      coins: this.coinsCollected,
      totalCoins: this.level.totalCoins,
    })

    this.scene.pause()
    this.scene.launch(SCENE.levelComplete, {
      levelId: this.levelId,
      timeMs: this.elapsedMs,
      coins: this.coinsCollected,
      totalCoins: this.level.totalCoins,
    })
  }

  requestPause(): void {
    if (this.finished || this.scene.isPaused()) return
    this.inputs.releaseAll()
    this.scene.pause()
    this.scene.launch(SCENE.pause, { levelId: this.levelId })
  }
}
