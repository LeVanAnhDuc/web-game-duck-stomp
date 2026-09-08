/**
 * Pause overlay — FR-13.
 *
 * Same frame as the level-clear card: same panel, same hard shadow, same button
 * row. One primary action (RESUME) and two quiet ones, so the eye is never asked
 * to choose between three equals.
 */

import Phaser from 'phaser'
import { t } from '../../core/strings'
import type { LevelId } from '../../core/progress'
import { Button, CSS, ensureUiIcons, FONT, IconButton, Menu, metrics, panel, UI_ICON } from '../ui'
import { REGISTRY, SCENE } from './keys'
import type { Sfx } from '../audio'
import type { SaveStore } from '../saveStore'

export type PauseData = { levelId: LevelId }

export class PauseScene extends Phaser.Scene {
  constructor() {
    super(SCENE.pause)
  }

  create(data: PauseData): void {
    ensureUiIcons(this)
    const { s, w, h } = metrics(this)
    const sfx = this.registry.get(REGISTRY.sfx) as Sfx
    const store = this.registry.get(REGISTRY.save) as SaveStore

    this.add.rectangle(0, 0, w, h, 0x131735, 0.82).setOrigin(0, 0)

    const panelWidth = Math.min(Math.round(320 * s), w - Math.round(32 * s))
    const panelHeight = Math.round(232 * s)
    const px = (w - panelWidth) / 2
    const py = (h - panelHeight) / 2
    panel(this, px, py, panelWidth, panelHeight)

    this.add
      .text(px + panelWidth / 2, py + Math.round(34 * s), t('paused'), {
        fontFamily: FONT.display,
        fontSize: `${Math.round(32 * s)}px`,
        color: CSS.ink,
      })
      .setOrigin(0.5, 0.5)

    const inner = panelWidth - Math.round(48 * s)
    const left = px + Math.round(24 * s)
    const half = (inner - Math.round(16 * s)) / 2

    const resume = new Button(this, left, py + Math.round(60 * s), inner, t('resume'), 'gold', () => this.resume())
    const retry = new Button(this, left, py + Math.round(120 * s), half, t('retry'), 'quiet', () => {
      this.scene.stop()
      this.scene.stop(SCENE.hud)
      this.scene.start(SCENE.game, { levelId: data.levelId })
    })
    const toMap = new Button(
      this,
      left + half + Math.round(16 * s),
      py + Math.round(120 * s),
      half,
      t('map'),
      'quiet',
      () => {
        this.scene.stop()
        this.scene.stop(SCENE.hud)
        this.scene.stop(SCENE.game)
        this.scene.start(SCENE.worldMap, { select: data.levelId })
      },
    )

    new Menu(this, [resume, retry, toMap])

    new IconButton(
      this,
      px + panelWidth / 2,
      py + panelHeight - Math.round(32 * s),
      store.muted ? UI_ICON.mute : UI_ICON.sound,
      store.muted ? t('soundOff') : t('soundOn'),
      () => {
        const muted = !store.muted
        store.setMuted(muted)
        sfx.setMuted(muted)
        this.scene.restart(data)
      },
    )

    const keyboard = this.input.keyboard
    if (keyboard !== null) keyboard.on('keydown-ESC', () => this.resume())
  }

  private resume(): void {
    this.scene.stop()
    this.scene.resume(SCENE.game)
  }
}
