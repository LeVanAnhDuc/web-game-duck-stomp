/**
 * The HUD and the on-screen controls — FR-06, FR-15, FR-17.
 *
 * This is a SEPARATE scene, at camera zoom 1, for two reasons. The camera in the
 * game scene follows the player, and anything drawn there would be dragged along
 * with it. And UI text sized in screen pixels stays crisp, where an 8px font blown
 * up four times by a camera zoom would not.
 *
 * It only ever LISTENS. Every number here arrives as a domain event from the game
 * scene; nothing in here reaches into gameplay to read state.
 */

import Phaser from 'phaser'
import { formatTime } from '../../core/scoring'
import { t } from '../../core/strings'
import { GAME_EVENT, type CoinCollectedPayload, type HeartsPayload, type TimeTickPayload } from '../events'
import { COLOR, CSS, drawArrow, ensureUiIcons, FONT, IconButton, metrics, UI_ICON } from '../ui'
import type { GameScene } from './GameScene'
import { REGISTRY, SCENE } from './keys'
import type { Sfx } from '../audio'
import type { SaveStore } from '../saveStore'
import type { TouchControl } from '../input'

export class HudScene extends Phaser.Scene {
  private hearts: Phaser.GameObjects.Image[] = []
  private coinLabel!: Phaser.GameObjects.Text
  private clock!: Phaser.GameObjects.Text
  private soundButton!: IconButton
  private touchGroup!: Phaser.GameObjects.Container

  constructor() {
    super(SCENE.hud)
  }

  private get sfx(): Sfx {
    return this.registry.get(REGISTRY.sfx) as Sfx
  }

  private get store(): SaveStore {
    return this.registry.get(REGISTRY.save) as SaveStore
  }

  create(): void {
    // Phaser REUSES a scene instance, so create() can run a second time — a zoom
    // change on resize restarts every UI scene. Field initialisers only ran once,
    // at construction, so anything holding game objects has to be cleared here or
    // the next pass writes to destroyed sprites.
    this.hearts = []
    ensureUiIcons(this)
    const { s, w, h } = metrics(this)
    const barHeight = Math.round(44 * s)
    const game = this.scene.get(SCENE.game) as GameScene

    this.add.rectangle(0, 0, w, barHeight, COLOR.panel, 0.85).setOrigin(0, 0)
    this.add.rectangle(0, barHeight - 2 * s, w, 2 * s, COLOR.nightDeep).setOrigin(0, 0)

    // hearts
    const heartScale = Math.max(1, Math.round(2.5 * s))
    for (let i = 0; i < 3; i += 1) {
      const icon = this.add.image(Math.round(16 * s) + i * Math.round(22 * s), barHeight / 2, UI_ICON.heart)
      icon.setOrigin(0, 0.5).setScale(heartScale)
      this.hearts.push(icon)
    }

    // coins
    const coinX = Math.round(16 * s) + 3 * Math.round(22 * s) + Math.round(16 * s)
    const coinIcon = this.add.image(coinX, barHeight / 2, UI_ICON.coin)
    coinIcon.setOrigin(0, 0.5).setScale(Math.max(1, Math.round(2 * s)))
    this.coinLabel = this.add
      .text(coinX + Math.round(20 * s), barHeight / 2, '0/0', {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(20 * s)}px`,
        color: CSS.gold,
      })
      .setOrigin(0, 0.5)

    // clock
    this.clock = this.add
      .text(w / 2, barHeight / 2, formatTime(0), {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(20 * s)}px`,
        color: CSS.ink,
      })
      .setOrigin(0.5, 0.5)

    // sound + pause
    const iconSize = Math.round(44 * s)
    this.soundButton = new IconButton(
      this,
      w - iconSize * 1.5,
      barHeight / 2,
      this.store.muted ? UI_ICON.mute : UI_ICON.sound,
      this.store.muted ? t('soundOff') : t('soundOn'),
      () => this.toggleSound(),
    )
    new IconButton(this, w - iconSize * 0.5, barHeight / 2, UI_ICON.pause, t('pause'), () => game.requestPause())

    this.buildTouchControls(game, s, w, h)
    this.subscribe(game)
  }

  private toggleSound(): void {
    const muted = !this.store.muted
    this.store.setMuted(muted)
    this.sfx.setMuted(muted)
    this.soundButton.setIcon(muted ? UI_ICON.mute : UI_ICON.sound)
    this.soundButton.setName(muted ? t('soundOff') : t('soundOn'))
    if (!muted) this.sfx.play('coin')
  }

  /**
   * Directions on the left, jump on the right and bigger — it is pressed most
   * often and most urgently. Translucent because they sit ON the level, and the
   * level is the thing that must stay readable.
   */
  private buildTouchControls(game: GameScene, s: number, w: number, h: number): void {
    this.touchGroup = this.add.container(0, 0)

    const dirSize = Math.round(72 * s)
    const jumpSize = Math.round(88 * s)
    const margin = Math.round(16 * s)

    const make = (x: number, y: number, size: number, control: TouchControl, glyph: 'left' | 'right' | 'up'): void => {
      const face = this.add.rectangle(x, y, size, size, COLOR.ink, 0.35).setOrigin(0, 0)
      face.setStrokeStyle(2 * s, COLOR.nightDeep, 0.5)
      face.setInteractive({ useHandCursor: false })

      const press = (down: boolean): void => {
        game.inputs.setTouch(control, down)
        face.setFillStyle(COLOR.ink, down ? 0.7 : 0.35)
      }
      face.on('pointerdown', () => press(true))
      face.on('pointerup', () => press(false))
      face.on('pointerout', () => press(false))

      const arrow = this.add.graphics()
      const unit = Math.max(2, Math.round(size / 10))
      drawArrow(arrow, x + size / 2, y + size / 2, unit, glyph, COLOR.nightDeep)

      this.touchGroup.add([face, arrow])
    }

    make(margin, h - margin - dirSize, dirSize, 'left', 'left')
    make(margin + dirSize + Math.round(12 * s), h - margin - dirSize, dirSize, 'right', 'right')
    make(w - margin - jumpSize, h - margin - jumpSize, jumpSize, 'jump', 'up')

    this.touchGroup.setVisible(false)
    void w
  }

  private subscribe(game: GameScene): void {
    const bus = game.events

    const setHearts = (count: number): void => {
      this.hearts.forEach((icon, i) => icon.setTexture(i < count ? UI_ICON.heart : UI_ICON.heartEmpty))
    }
    setHearts(3)
    this.coinLabel.setText(`0/${game.level.totalCoins}`)

    bus.on(GAME_EVENT.coinCollected, (p: CoinCollectedPayload) => {
      this.coinLabel.setText(`${p.collected}/${p.total}`)
    })
    bus.on(GAME_EVENT.playerHit, (p: HeartsPayload) => setHearts(Math.max(0, p.hearts)))
    bus.on(GAME_EVENT.playerRespawned, (p: HeartsPayload) => setHearts(p.hearts))
    bus.on(GAME_EVENT.timeTick, (p: TimeTickPayload) => this.clock.setText(formatTime(p.elapsedMs)))

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => bus.removeAllListeners())
  }

  override update(): void {
    const game = this.scene.get(SCENE.game) as GameScene
    // invariants #11 — driven by input that actually arrived, never by user agent.
    const shouldShow = game.inputs !== undefined && game.inputs.showTouch
    if (this.touchGroup.visible !== shouldShow) this.touchGroup.setVisible(shouldShow)
  }
}
