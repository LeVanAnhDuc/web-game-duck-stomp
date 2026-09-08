/**
 * Level-clear card — FR-12.
 *
 * This is where a run becomes a record, and where the only reward in the game
 * gets handed out: the NEW BEST badge. It shows only when the time was actually
 * beaten — a slower run keeps the old record and gets no badge, because a badge
 * that always appears is not a reward (US-02).
 *
 * Whether the NEXT node just opened is decided here, from whether the level had
 * ever been cleared BEFORE this run, and passed to the map so it can draw the new
 * stretch of trail.
 */

import Phaser from 'phaser'
import { formatTime } from '../../core/scoring'
import { nextLevel, type LevelId } from '../../core/progress'
import { t } from '../../core/strings'
import { Button, COLOR, CSS, ensureUiIcons, FONT, Menu, metrics, panel } from '../ui'
import { REGISTRY, SCENE } from './keys'
import type { SaveStore } from '../saveStore'

export type LevelCompleteData = {
  levelId: LevelId
  timeMs: number
  coins: number
  totalCoins: number
}

export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super(SCENE.levelComplete)
  }

  create(data: LevelCompleteData): void {
    ensureUiIcons(this)
    const { s, w, h } = metrics(this)
    const store = this.registry.get(REGISTRY.save) as SaveStore

    const wasClearedBefore = store.save.levels[data.levelId]?.cleared === true
    const isNewBest = store.recordResult(data.levelId, { timeMs: data.timeMs, coins: data.coins })
    const opened = wasClearedBefore ? undefined : (nextLevel(data.levelId) ?? undefined)
    const following = nextLevel(data.levelId)

    this.add.rectangle(0, 0, w, h, 0x131735, 0.82).setOrigin(0, 0)

    const panelWidth = Math.min(Math.round(420 * s), w - Math.round(32 * s))
    const panelHeight = Math.round(216 * s)
    const px = (w - panelWidth) / 2
    const py = (h - panelHeight) / 2
    panel(this, px, py, panelWidth, panelHeight)

    this.add
      .text(px + panelWidth / 2, py + Math.round(32 * s), t('clearN', { n: data.levelId }), {
        fontFamily: FONT.display,
        fontSize: `${Math.round(32 * s)}px`,
        color: CSS.ink,
      })
      .setOrigin(0.5, 0.5)

    const rowLeft = px + Math.round(24 * s)
    const rowRight = px + panelWidth - Math.round(24 * s)

    // TIME row
    this.add
      .text(rowLeft, py + Math.round(74 * s), t('time'), {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(16 * s)}px`,
        color: CSS.inkDim,
      })
      .setOrigin(0, 0.5)
    this.add
      .text(rowRight, py + Math.round(74 * s), formatTime(data.timeMs), {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(20 * s)}px`,
        color: CSS.ink,
      })
      .setOrigin(1, 0.5)

    if (isNewBest) {
      const label = this.add
        .text(0, 0, t('newBest'), {
          fontFamily: FONT.ui,
          fontSize: `${Math.round(12 * s)}px`,
          color: CSS.onGold,
        })
        .setOrigin(0.5, 0.5)
      const chipWidth = label.width + Math.round(16 * s)
      const chipHeight = label.height + Math.round(8 * s)
      const chipX = rowRight - Math.round(64 * s) - chipWidth
      const chip = this.add.rectangle(chipX, py + Math.round(74 * s), chipWidth, chipHeight, COLOR.gold)
      chip.setOrigin(0, 0.5)
      chip.setStrokeStyle(2 * s, COLOR.onGold)
      label.setPosition(chipX + chipWidth / 2, py + Math.round(74 * s))
      // The label is measured first but drawn first too, so without this the chip
      // paints over it and the badge ships as an empty gold rectangle.
      label.setDepth(1)
    }

    // COINS row
    this.add
      .text(rowLeft, py + Math.round(106 * s), t('coins'), {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(16 * s)}px`,
        color: CSS.inkDim,
      })
      .setOrigin(0, 0.5)
    this.add
      .text(rowRight, py + Math.round(106 * s), `${data.coins}/${data.totalCoins}`, {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(20 * s)}px`,
        color: CSS.gold,
      })
      .setOrigin(1, 0.5)

    // buttons
    const inner = panelWidth - Math.round(48 * s)
    const gap = Math.round(12 * s)
    const third = (inner - gap * 2) / 3
    const buttonY = py + panelHeight - Math.round(64 * s)

    const retry = new Button(this, rowLeft, buttonY, third, t('retry'), 'quiet', () => {
      this.scene.stop()
      this.scene.stop(SCENE.hud)
      this.scene.start(SCENE.game, { levelId: data.levelId })
    })
    const toMap = new Button(this, rowLeft + third + gap, buttonY, third, t('map'), 'quiet', () =>
      this.goToMap(data.levelId, opened),
    )

    const buttons: Button[] = [retry, toMap]
    if (following !== null) {
      const next = new Button(
        this,
        rowLeft + (third + gap) * 2,
        buttonY,
        third,
        t('nextN', { n: following }),
        'gold',
        () => {
          this.scene.stop()
          this.scene.stop(SCENE.hud)
          this.scene.start(SCENE.game, { levelId: following })
        },
      )
      buttons.push(next)
      new Menu(this, [next, retry, toMap])
    } else {
      new Menu(this, [toMap, retry])
    }
  }

  private goToMap(levelId: LevelId, justUnlocked: LevelId | undefined): void {
    this.scene.stop()
    this.scene.stop(SCENE.hud)
    this.scene.stop(SCENE.game)
    this.scene.start(SCENE.worldMap, {
      select: justUnlocked ?? levelId,
      ...(justUnlocked === undefined ? {} : { justUnlocked }),
    })
  }
}
