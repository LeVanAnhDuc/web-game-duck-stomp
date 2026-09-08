/**
 * The world map — FR-02, and the home of the one signature animation.
 *
 * When a level is cleared, the trail to the next node DRAWS ITSELF, one pixel dash
 * at a time. It is the only motion outside the canvas in the whole game, it runs
 * once, and it answers something the player just did rather than decorating the
 * screen. `prefers-reduced-motion` skips straight to the finished state.
 *
 * Cleared nodes are deliberately NOT gold. Gold is reserved for coins, records,
 * the primary action and focus; a cleared node borrowing it would erode what gold
 * means everywhere else. Cleared is a solid ink disc, and the gold ring means
 * "selected" and nothing else.
 *
 * Selecting takes two taps: one to pick a node, one to enter. On a phone, one tap
 * would mean a mis-touch drops you into the wrong level.
 */

import Phaser from 'phaser'
import { formatTime } from '../../core/scoring'
import { isUnlocked, LEVEL_IDS, nextLevel, totalCoins, type LevelId } from '../../core/progress'
import { t } from '../../core/strings'
import { Button, COLOR, CSS, ensureUiIcons, FONT, IconButton, metrics, panel, UI_ICON } from '../ui'
import { REGISTRY, SCENE } from './keys'
import type { Sfx } from '../audio'
import type { SaveStore } from '../saveStore'

export type WorldMapData = { select?: LevelId; justUnlocked?: LevelId }

type NodeView = { id: LevelId; x: number; y: number; disc: Phaser.GameObjects.Arc; icon: Phaser.GameObjects.Image | null }

export class WorldMapScene extends Phaser.Scene {
  private nodes: NodeView[] = []
  private selected: LevelId = '1'
  private ring!: Phaser.GameObjects.Arc
  private cardTitle!: Phaser.GameObjects.Text
  private cardBest!: Phaser.GameObjects.Text
  private cardCoins!: Phaser.GameObjects.Text
  private trail!: Phaser.GameObjects.Graphics
  private trailProgress = 1
  private animatingTo: LevelId | null = null

  constructor() {
    super(SCENE.worldMap)
  }

  create(data: WorldMapData): void {
    ensureUiIcons(this)
    // Same reuse hazard as HudScene: a restart must not inherit a half-finished
    // trail animation, or one segment stays clipped for good.
    this.nodes = []
    this.trailProgress = 1
    this.animatingTo = null
    const { s, w, h } = metrics(this)
    const store = this.registry.get(REGISTRY.save) as SaveStore
    const sfx = this.registry.get(REGISTRY.sfx) as Sfx
    const levels = store.save.levels

    this.cameras.main.setBackgroundColor(0x1b2148)

    // --- top bar
    const barHeight = Math.round(44 * s)
    const coinIcon = this.add.image(Math.round(16 * s), barHeight / 2, UI_ICON.coin)
    coinIcon.setOrigin(0, 0.5).setScale(Math.max(1, Math.round(2 * s)))
    this.add
      .text(Math.round(40 * s), barHeight / 2, `${totalCoins(levels)}`, {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(20 * s)}px`,
        color: CSS.gold,
      })
      .setOrigin(0, 0.5)

    new IconButton(
      this,
      w - Math.round(30 * s),
      barHeight / 2,
      store.muted ? UI_ICON.mute : UI_ICON.sound,
      store.muted ? t('soundOff') : t('soundOn'),
      () => {
        const muted = !store.muted
        store.setMuted(muted)
        sfx.setMuted(muted)
        this.scene.restart({ select: this.selected })
      },
    )

    // --- node layout: an S, three across and two down
    const cardHeight = Math.round(88 * s)
    const usableTop = barHeight + Math.round(24 * s)
    const usableBottom = h - cardHeight - Math.round(40 * s)
    const rowY = [usableTop + (usableBottom - usableTop) * 0.28, usableTop + (usableBottom - usableTop) * 0.78]
    const colX = [w * 0.2, w * 0.5, w * 0.8]
    const layout: [number, number][] = [
      [colX[0] ?? 0, rowY[0] ?? 0],
      [colX[1] ?? 0, rowY[0] ?? 0],
      [colX[2] ?? 0, rowY[0] ?? 0],
      [colX[2] ?? 0, rowY[1] ?? 0],
      [colX[1] ?? 0, rowY[1] ?? 0],
      [colX[0] ?? 0, rowY[1] ?? 0],
    ]

    this.trail = this.add.graphics()

    const radius = Math.round(24 * s)
    this.ring = this.add.circle(0, 0, radius + Math.round(6 * s))
    this.ring.setStrokeStyle(2 * s, COLOR.gold)
    this.ring.setFillStyle(0x000000, 0)

    LEVEL_IDS.forEach((id, index) => {
      const spot = layout[index]
      if (spot === undefined) return
      const [x, y] = spot
      const record = levels[id]
      const unlocked = isUnlocked(levels, id)
      const done = record?.cleared === true

      const disc = this.add.circle(x, y, radius, done ? COLOR.ink : unlocked ? COLOR.panel : 0x262e5e)
      disc.setStrokeStyle(2 * s, done ? COLOR.nightDeep : unlocked ? COLOR.ink : COLOR.locked)
      disc.setInteractive({ useHandCursor: true })
      disc.on('pointerup', () => this.select(id))

      let icon: Phaser.GameObjects.Image | null = null
      if (done) {
        icon = this.add.image(x, y, UI_ICON.check).setScale(Math.max(1, Math.round(2.5 * s)))
        icon.setTintFill(COLOR.nightDeep)
      } else if (!unlocked) {
        icon = this.add.image(x, y, UI_ICON.lock).setScale(Math.max(1, Math.round(2.5 * s)))
      } else {
        this.add
          .text(x, y, id, {
            fontFamily: FONT.display,
            fontSize: `${Math.round(28 * s)}px`,
            color: CSS.ink,
          })
          .setOrigin(0.5, 0.5)
      }

      this.nodes.push({ id, x, y, disc, icon })
    })

    // --- card + start
    const cardX = Math.round(16 * s)
    const cardWidth = w - cardX * 2
    const cardY = h - cardHeight - Math.round(16 * s)
    panel(this, cardX, cardY, cardWidth, cardHeight)

    this.cardTitle = this.add
      .text(cardX + Math.round(16 * s), cardY + Math.round(26 * s), '', {
        fontFamily: FONT.display,
        fontSize: `${Math.round(32 * s)}px`,
        color: CSS.ink,
      })
      .setOrigin(0, 0.5)

    this.cardBest = this.add
      .text(cardX + Math.round(16 * s), cardY + Math.round(60 * s), '', {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(16 * s)}px`,
        color: CSS.inkDim,
      })
      .setOrigin(0, 0.5)

    // A bare number next to BEST reads as a stray value; the icon is what says
    // "coins" without a second label.
    const cardCoinIcon = this.add.image(
      cardX + Math.round(150 * s),
      cardY + Math.round(60 * s),
      UI_ICON.coin,
    )
    cardCoinIcon.setOrigin(0, 0.5).setScale(Math.max(1, Math.round(2 * s)))

    this.cardCoins = this.add
      .text(cardX + Math.round(174 * s), cardY + Math.round(60 * s), '', {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(16 * s)}px`,
        color: CSS.gold,
      })
      .setOrigin(0, 0.5)

    const startWidth = Math.round(150 * s)
    new Button(
      this,
      cardX + cardWidth - startWidth - Math.round(16 * s),
      cardY + (cardHeight - Math.round(48 * s)) / 2,
      startWidth,
      t('start'),
      'gold',
      () => this.enter(),
    )

    // --- selection + keyboard
    this.select(data.select ?? '1', true)

    const keyboard = this.input.keyboard
    if (keyboard !== null) {
      keyboard.on('keydown-LEFT', () => this.step(-1))
      keyboard.on('keydown-A', () => this.step(-1))
      keyboard.on('keydown-RIGHT', () => this.step(1))
      keyboard.on('keydown-D', () => this.step(1))
      keyboard.on('keydown-ENTER', () => this.enter())
      keyboard.on('keydown-SPACE', () => this.enter())
    }

    // --- the signature moment
    const unlockedNow = data.justUnlocked
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
    if (unlockedNow !== undefined && !reduced) {
      this.animatingTo = unlockedNow
      this.trailProgress = 0
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 400,
        onUpdate: (tween) => {
          this.trailProgress = tween.getValue() ?? 1
          this.drawTrail(levels)
        },
        onComplete: () => {
          this.animatingTo = null
          this.trailProgress = 1
          this.drawTrail(levels)
        },
      })
      sfx.play('unlock')
    }
    this.drawTrail(levels)
  }

  /**
   * Dashes, stepped rather than smooth, so the trail sits on the pixel grid.
   *
   * Two details that the first version got wrong and that a screenshot caught:
   * a dash is oriented ALONG its segment (the vertical link between nodes 3 and 4
   * was drawing horizontal ticks), and the run is inset past both node discs so
   * the dashes are not hidden underneath them.
   *
   * `trailProgress` clips the run leading to a freshly opened node — that clip is
   * the signature animation.
   */
  private drawTrail(levels: Readonly<Record<string, { cleared: boolean }>>): void {
    const { s } = metrics(this)
    this.trail.clear()

    const dash = Math.round(8 * s)
    const gap = Math.round(7 * s)
    const thickness = Math.round(4 * s)
    const radius = Math.round(24 * s) + Math.round(5 * s)

    for (let i = 0; i < this.nodes.length - 1; i += 1) {
      const from = this.nodes[i]
      const to = this.nodes[i + 1]
      if (from === undefined || to === undefined) continue

      const dx = to.x - from.x
      const dy = to.y - from.y
      const span = Math.hypot(dx, dy)
      const usable = span - radius * 2
      if (usable <= 0) continue

      const ux = dx / span
      const uy = dy / span
      const vertical = Math.abs(dy) > Math.abs(dx)

      const reached = isUnlocked(levels as never, to.id)
      this.trail.fillStyle(reached ? COLOR.inkDim : COLOR.locked, 1)

      const clip = this.animatingTo === to.id ? this.trailProgress : 1
      const drawn = usable * clip

      for (let along = 0; along + dash <= drawn; along += dash + gap) {
        const cx = from.x + ux * (radius + along + dash / 2)
        const cy = from.y + uy * (radius + along + dash / 2)
        const w = vertical ? thickness : dash
        const h = vertical ? dash : thickness
        this.trail.fillRect(Math.round(cx - w / 2), Math.round(cy - h / 2), w, h)
      }
    }
  }

  private step(delta: number): void {
    const index = LEVEL_IDS.indexOf(this.selected)
    const next = LEVEL_IDS[(index + delta + LEVEL_IDS.length) % LEVEL_IDS.length]
    if (next !== undefined) this.select(next)
  }

  private select(id: LevelId, silent = false): void {
    const store = this.registry.get(REGISTRY.save) as SaveStore
    const record = store.save.levels[id]
    this.selected = id

    const node = this.nodes.find((n) => n.id === id)
    if (node !== undefined) this.ring.setPosition(node.x, node.y)

    this.cardTitle.setText(t('levelN', { n: id }))
    this.cardBest.setText(
      record?.bestTimeMs != null ? `${t('best')} ${formatTime(record.bestTimeMs)}` : `${t('best')} --`,
    )
    this.cardCoins.setText(`${record?.coins ?? 0}`)

    if (!silent) {
      const locked = !isUnlocked(store.save.levels, id)
      this.ring.setStrokeStyle(metrics(this).s * 2, locked ? COLOR.locked : COLOR.gold)
    }
  }

  private enter(): void {
    const store = this.registry.get(REGISTRY.save) as SaveStore
    if (!isUnlocked(store.save.levels, this.selected)) return
    this.scene.start(SCENE.game, { levelId: this.selected })
  }

  /** Exposed so LevelCompleteScene can hand back "which node just opened". */
  static nextAfter(id: LevelId): LevelId | null {
    return nextLevel(id)
  }
}
