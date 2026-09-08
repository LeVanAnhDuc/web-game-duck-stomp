/**
 * The title screen — FR-01, and the one screen that cannot be cut.
 *
 * Browsers block audio until a real gesture, and the PLAY button is the gesture
 * every single player makes. So this screen is also where the audio context is
 * unlocked, which is why the game needs no "tap to enable sound" affordance
 * anywhere else (ADR-0007).
 *
 * The three key glyphs at the bottom are the entire tutorial. No sentence, so
 * nothing to translate (ADR-0005).
 */

import Phaser from 'phaser'
import { currentLevel, hasAnyProgress } from '../../core/progress'
import { t } from '../../core/strings'
import { Button, COLOR, CSS, drawArrow, ensureUiIcons, FONT, IconButton, Menu, metrics, UI_ICON } from '../ui'
import { REGISTRY, SCENE } from './keys'
import type { Sfx } from '../audio'
import type { SaveStore } from '../saveStore'

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENE.title)
  }

  create(): void {
    ensureUiIcons(this)
    const { s, w, h } = metrics(this)
    const sfx = this.registry.get(REGISTRY.sfx) as Sfx
    const store = this.registry.get(REGISTRY.save) as SaveStore

    this.cameras.main.setBackgroundColor(0x1b2148)

    // A strip of ground, so the title sits in the game's world rather than on a menu.
    const groundHeight = Math.round(56 * s)
    this.add.rectangle(0, h - groundHeight, w, groundHeight, 0x3b4581).setOrigin(0, 0)
    this.add.rectangle(0, h - groundHeight, w, 4 * s, 0x4e58a0).setOrigin(0, 0)
    const block = Math.round(32 * s)
    this.add.rectangle(Math.round(64 * s), h - groundHeight - block * 2, block, block, 0x3b4581).setOrigin(0, 0)
    this.add.rectangle(w - Math.round(96 * s), h - groundHeight - block * 3, block, block, 0x3b4581).setOrigin(0, 0)

    const centreY = (h - groundHeight) / 2

    this.add
      .text(w / 2, centreY - Math.round(56 * s), 'DUCKSTOMP', {
        fontFamily: FONT.display,
        fontSize: `${Math.round(48 * s)}px`,
        color: CSS.ink,
      })
      .setOrigin(0.5, 0.5)

    const buttonWidth = Math.round(220 * s)
    const buttons: Button[] = []

    const play = new Button(this, w / 2 - buttonWidth / 2, centreY, buttonWidth, t('play'), 'gold', () => {
      // The gesture that unlocks audio for the rest of the session.
      sfx.unlock()
      sfx.play('unlock')
      this.scene.start(SCENE.worldMap, { select: '1' })
    })
    buttons.push(play)

    if (hasAnyProgress(store.save.levels)) {
      const resume = new Button(
        this,
        w / 2 - buttonWidth / 2,
        centreY + Math.round(64 * s),
        buttonWidth,
        t('continue'),
        'quiet',
        () => {
          sfx.unlock()
          sfx.play('unlock')
          this.scene.start(SCENE.worldMap, { select: currentLevel(store.save.levels) })
        },
      )
      buttons.push(resume)
    }

    new Menu(this, buttons)

    new IconButton(
      this,
      w - Math.round(30 * s),
      Math.round(30 * s),
      store.muted ? UI_ICON.mute : UI_ICON.sound,
      store.muted ? t('soundOff') : t('soundOn'),
      () => {
        const muted = !store.muted
        store.setMuted(muted)
        sfx.setMuted(muted)
        this.scene.restart()
      },
    )

    this.drawControlLegend(w / 2, h - groundHeight - Math.round(28 * s), s)
  }

  /** Three key caps. The whole instruction manual. */
  private drawControlLegend(centreX: number, y: number, s: number): void {
    const size = Math.round(32 * s)
    const gap = Math.round(8 * s)
    const wide = Math.round(52 * s)
    const totalWidth = size * 2 + wide + gap * 2
    let x = centreX - totalWidth / 2

    const cap = (width: number, glyph: 'left' | 'right' | 'up'): void => {
      const box = this.add.rectangle(x, y, width, size, 0x000000, 0).setOrigin(0, 0)
      box.setStrokeStyle(2 * s, COLOR.inkDim)

      const g = this.add.graphics()
      const unit = Math.max(2, Math.round(size / 8))
      drawArrow(g, x + width / 2, y + size / 2, unit, glyph, COLOR.inkDim)
      x += width + gap
    }

    cap(size, 'left')
    cap(size, 'right')
    cap(wide, 'up')
  }
}
