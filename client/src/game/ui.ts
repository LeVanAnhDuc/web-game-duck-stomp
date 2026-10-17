/**
 * The UI kit — every menu, panel, button and icon, built from MASTER.md tokens.
 *
 * Two deliberate rules from the design system, both easy to break by accident:
 * corners are square everywhere, and shadows are SOLID offset blocks with no blur.
 * A rounded corner or a soft shadow next to a pixel sprite reads as two different
 * systems glued together.
 *
 * State changes are INSTANT. The generated design system contradicted itself here
 * (pixel art wants no easing, its own anti-pattern list wanted 200ms transitions);
 * ADR-0002 resolved it in favour of instant, which is also the friendlier answer
 * for `prefers-reduced-motion`.
 *
 * UI lives in its own scenes at camera zoom 1 and is sized in SCREEN pixels, while
 * the game world runs at an integer camera zoom in 320x180 units. That split is
 * why menu text is crisp instead of a 8px font blown up four times. The type scale
 * in MASTER.md is the scale at zoom 2, so everything here multiplies by
 * `zoom / 2`.
 */

import Phaser from 'phaser'
import { ART, bakeArt, type Art } from './textures'

export const COLOR = {
  nightDeep: 0x131735,
  night: 0x262e5e,
  panel: 0x2e376b,
  ink: 0xf2ecdf,
  inkDim: 0xaeb4da,
  gold: 0xf2b33d,
  goldHover: 0xffc85a,
  heart: 0xf4666b,
  locked: 0x7b84ba,
  onGold: 0x131735,
} as const

export const CSS = {
  ink: '#F2ECDF',
  inkDim: '#AEB4DA',
  gold: '#F2B33D',
  onGold: '#131735',
  heart: '#F4666B',
  locked: '#7B84BA',
} as const

export const FONT = {
  display: "'Jersey 15', 'Pixelify Sans', ui-monospace, monospace",
  ui: "'Pixelify Sans', ui-monospace, monospace",
} as const

export const UI_ICON = {
  heart: 'ui-heart',
  heartEmpty: 'ui-heart-empty',
  coin: 'ui-coin',
  sound: 'ui-sound',
  mute: 'ui-mute',
  pause: 'ui-pause',
  check: 'ui-check',
  lock: 'ui-lock',
} as const

const ICONS: Record<string, Art> = {
  [UI_ICON.heart]: ['.RR.RR.', 'RRRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...'],
  [UI_ICON.heartEmpty]: ['.VV.VV.', 'V.....V', 'V.....V', '.V...V.', '..V.V..', '...V...'],
  [UI_ICON.coin]: ['..GGG..', '.GGGGG.', 'GGIGGGG', 'GIGGGGG', 'GGIGGGG', '.GGGGG.', '..GGG..'],
  [UI_ICON.sound]: ['....I.....', '...II.....', '..III..I..', '.IIII...I.', '.IIII.I.I.', '.IIII.I.I.', '.IIII...I.', '..III..I..', '...II.....', '....I.....'],
  [UI_ICON.mute]: ['....I.....', '...II.....', '..III.....', '.IIII.I.I.', '.IIII..I..', '.IIII.I.I.', '.IIII.....', '..III.....', '...II.....', '....I.....'],
  [UI_ICON.pause]: ['.II..II..', '.II..II..', '.II..II..', '.II..II..', '.II..II..', '.II..II..', '.II..II..', '.II..II..', '.II..II..'],
  [UI_ICON.check]: ['......D', '.....DD', 'D...DD.', 'DD.DD..', '.DDD...', '..D....', '.......'],
  [UI_ICON.lock]: ['..VVV..', '.V...V.', '.V...V.', 'VVVVVVV', 'VVVVVVV', 'VVVDVVV', 'VVVDVVV', 'VVVVVVV'],
}

export function ensureUiIcons(scene: Phaser.Scene): void {
  for (const [key, art] of Object.entries(ICONS)) bakeArt(scene, key, art, ART)
}

export type ArrowDirection = 'left' | 'right' | 'up'

/**
 * A solid arrow built from three stacked bars — the pixel way to draw a triangle,
 * and the same glyph in the key legend and on the touch buttons so the two read as
 * the same control rather than two conventions.
 */
export function drawArrow(
  graphics: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  unit: number,
  direction: ArrowDirection,
  colour: number,
): void {
  const steps = 3
  const extent = (steps * unit) / 2
  graphics.fillStyle(colour, 1)

  for (let i = 0; i < steps; i += 1) {
    const span = (i * 2 + 1) * unit
    if (direction === 'up') {
      graphics.fillRect(cx - span / 2, cy - extent + i * unit, span, unit)
    } else if (direction === 'left') {
      graphics.fillRect(cx - extent + i * unit, cy - span / 2, unit, span)
    } else {
      graphics.fillRect(cx + extent - (i + 1) * unit, cy - span / 2, unit, span)
    }
  }
}

/** Screen-space metrics for the current canvas. `s` is the MASTER.md scale factor. */
export type Metrics = { s: number; w: number; h: number }

export function metrics(scene: Phaser.Scene): Metrics {
  const zoom = Number(scene.game.registry.get('zoom') ?? 2)
  return {
    // MASTER.md's type and spacing scale is the scale at zoom 2.
    s: zoom / 2,
    w: scene.scale.gameSize.width,
    h: scene.scale.gameSize.height,
  }
}

export type TextRole = 'displayLg' | 'display' | 'hud' | 'body' | 'label'

const ROLE_PX: Record<TextRole, number> = { displayLg: 48, display: 32, hud: 20, body: 16, label: 12 }

export function text(
  scene: Phaser.Scene,
  x: number,
  y: number,
  content: string,
  role: TextRole,
  colour: string = CSS.ink,
): Phaser.GameObjects.Text {
  const { s } = metrics(scene)
  const isDisplay = role === 'displayLg' || role === 'display'
  const object = scene.add.text(x, y, content, {
    fontFamily: isDisplay ? FONT.display : FONT.ui,
    fontSize: `${Math.round(ROLE_PX[role] * s)}px`,
    color: colour,
  })
  object.setOrigin(0, 0.5)
  // Without tabular figures the clock jitters sideways every second, because the
  // digits are not the same width. Nobody reports it; everybody feels it.
  object.setStyle({ fontStyle: 'normal' })
  return object
}

/** A panel: solid fill, square corners, hard offset shadow, 2px border. */
export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number): Phaser.GameObjects.Container {
  const { s } = metrics(scene)
  const shadow = scene.add.rectangle(4 * s, 4 * s, w, h, COLOR.nightDeep).setOrigin(0, 0)
  const face = scene.add.rectangle(0, 0, w, h, COLOR.panel).setOrigin(0, 0)
  face.setStrokeStyle(2 * s, COLOR.nightDeep)
  return scene.add.container(x, y, [shadow, face])
}

export type ButtonStyle = 'gold' | 'quiet'

/**
 * A button that works by pointer AND by keyboard. The focus ring is gold because
 * gold measured >= 6:1 against both backgrounds it can sit on (NFR-A11Y-01), and
 * because focus is one of the four things gold is allowed to mean.
 */
export class Button extends Phaser.GameObjects.Container {
  private readonly face: Phaser.GameObjects.Rectangle
  private readonly shadow: Phaser.GameObjects.Rectangle
  private readonly ring: Phaser.GameObjects.Rectangle
  private readonly caption: Phaser.GameObjects.Text
  private readonly style: ButtonStyle
  private readonly onActivate: () => void
  private readonly s: number
  private focused = false
  private pressed = false
  private enabled = true

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    label: string,
    style: ButtonStyle,
    onActivate: () => void,
  ) {
    super(scene, x, y)
    const { s } = metrics(scene)
    const height = Math.round(48 * s)
    this.style = style
    this.onActivate = onActivate
    this.s = s

    this.shadow = scene.add.rectangle(4 * s, 4 * s, width, height, COLOR.nightDeep).setOrigin(0, 0)
    // Only the gold button carries the hard shadow. On a quiet button the face is
    // transparent, so a solid block behind it shows through and reads as a fill.
    this.shadow.setVisible(style === 'gold')
    this.face = scene.add
      .rectangle(0, 0, width, height, style === 'gold' ? COLOR.gold : COLOR.night, style === 'gold' ? 1 : 0)
      .setOrigin(0, 0)
    this.face.setStrokeStyle(2 * s, style === 'gold' ? COLOR.onGold : COLOR.inkDim)

    this.ring = scene.add.rectangle(-4 * s, -4 * s, width + 8 * s, height + 8 * s, 0x000000, 0).setOrigin(0, 0)
    this.ring.setStrokeStyle(2 * s, COLOR.gold)
    this.ring.setVisible(false)

    this.caption = scene.add.text(width / 2, height / 2, label, {
      fontFamily: FONT.ui,
      fontSize: `${Math.round(16 * s)}px`,
      color: style === 'gold' ? CSS.onGold : CSS.ink,
    })
    this.caption.setOrigin(0.5, 0.5)

    this.add([this.ring, this.shadow, this.face, this.caption])
    this.setSize(width, height)

    this.face.setInteractive({ useHandCursor: true })
    this.face.on('pointerover', () => this.repaint(true))
    this.face.on('pointerout', () => {
      this.pressed = false
      this.repaint(false)
    })
    this.face.on('pointerdown', () => {
      this.pressed = true
      this.repaint(true)
    })
    this.face.on('pointerup', () => {
      const wasPressed = this.pressed
      this.pressed = false
      this.repaint(true)
      if (wasPressed) this.onActivate()
    })

    scene.add.existing(this)
  }

  activate(): void {
    if (!this.enabled) return
    this.onActivate()
  }

  setFocused(on: boolean): void {
    this.focused = on
    this.ring.setVisible(on)
    this.repaint(on)
  }

  /**
   * A refused action has to LOOK refused before it is pressed.
   *
   * The world map used to leave START gold and shadowed while pointing at a locked
   * level, and `enter()` answered the press with a silent early return — one
   * persona pressed it, saw nothing at all, and quit the game there. "Instant" is
   * not the same as "no visible change" (MASTER.md §Component).
   *
   * Colours are the design system's, not a taste call: `--locked` is defined for
   * "node chưa mở, thứ bị vô hiệu" but only measures 3.58:1 on night, which is
   * enough for a border and not for text — so the caption drops to `--ink-dim`
   * (5.52:1 on panel, NFR-A11Y-01). Gold is never reused here: invariants #7 keeps
   * it for coins, records, the primary CTA and focus.
   */
  setEnabled(on: boolean): void {
    if (this.enabled === on) return
    this.enabled = on
    this.pressed = false

    if (on) {
      this.face.setInteractive({ useHandCursor: true })
    } else {
      this.face.disableInteractive()
      this.ring.setVisible(false)
      this.focused = false
    }
    this.repaint(false)
  }

  /**
   * No transitions anywhere — pixel buttons do not ease (ADR-0002). "Instant"
   * still has to be VISIBLE though, so a press drops the shadow and shifts the
   * face by exactly the shadow offset, which reads as the button sinking in.
   */
  private repaint(hover: boolean): void {
    const hot = hover || this.focused
    const sink = this.pressed ? 4 * this.s : 0

    this.shadow.setVisible(this.style === 'gold' && !this.pressed && this.enabled)
    this.face.setPosition(sink, sink)
    this.caption.setPosition(this.face.width / 2 + sink, this.face.height / 2 + sink)

    if (!this.enabled) {
      this.face.setFillStyle(COLOR.panel, 0)
      this.face.setStrokeStyle(2 * this.s, COLOR.locked)
      this.caption.setColor(CSS.inkDim)
      return
    }

    this.caption.setColor(this.style === 'gold' ? CSS.onGold : CSS.ink)

    if (this.style === 'gold') {
      this.face.setFillStyle(hot ? COLOR.goldHover : COLOR.gold, 1)
    } else {
      this.face.setFillStyle(COLOR.panel, hot ? 1 : 0)
      this.face.setStrokeStyle(2 * this.s, hot ? COLOR.ink : COLOR.inkDim)
    }
  }
}

/**
 * Keyboard-and-pointer menu. Holds the focus index, draws the ring, and answers
 * arrows plus Enter/Space — NFR-A11Y-02 and NFR-A11Y-06 both require that every
 * screen outside gameplay is reachable without a mouse or a finger.
 */
export class Menu {
  private index = 0

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly buttons: readonly Button[],
  ) {
    this.focus(0)
    const keyboard = scene.input.keyboard
    if (keyboard === null) return

    keyboard.on('keydown-LEFT', () => this.move(-1))
    keyboard.on('keydown-UP', () => this.move(-1))
    keyboard.on('keydown-A', () => this.move(-1))
    keyboard.on('keydown-RIGHT', () => this.move(1))
    keyboard.on('keydown-DOWN', () => this.move(1))
    keyboard.on('keydown-D', () => this.move(1))
    keyboard.on('keydown-TAB', () => this.move(1))
    keyboard.on('keydown-ENTER', () => this.current?.activate())
    keyboard.on('keydown-SPACE', () => this.current?.activate())
  }

  private get current(): Button | undefined {
    return this.buttons[this.index]
  }

  private move(delta: number): void {
    if (this.buttons.length === 0) return
    const next = (this.index + delta + this.buttons.length) % this.buttons.length
    this.focus(next)
  }

  focus(index: number): void {
    this.index = index
    this.buttons.forEach((b, i) => b.setFocused(i === index))
  }

  destroy(): void {
    const keyboard = this.scene.input.keyboard
    if (keyboard !== null) keyboard.removeAllListeners()
  }
}

/** A square icon-only button. Always gets an aria-equivalent label via `name`. */
export class IconButton extends Phaser.GameObjects.Container {
  private readonly box: Phaser.GameObjects.Rectangle
  private readonly icon: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number, iconKey: string, label: string, onActivate: () => void) {
    super(scene, x, y)
    const { s } = metrics(scene)
    const size = Math.round(44 * s)

    this.box = scene.add.rectangle(0, 0, size, size, 0x000000, 0).setOrigin(0.5, 0.5)
    this.box.setStrokeStyle(2 * s, COLOR.inkDim, 0)

    this.icon = scene.add.image(0, 0, iconKey).setOrigin(0.5, 0.5)
    this.icon.setScale(Math.max(1, Math.round(2 * s)))

    this.add([this.box, this.icon])
    this.setSize(size, size)
    this.setName(label)

    this.box.setInteractive({ useHandCursor: true })
    this.box.on('pointerover', () => this.box.setStrokeStyle(2 * s, COLOR.inkDim, 1))
    this.box.on('pointerout', () => this.box.setStrokeStyle(2 * s, COLOR.inkDim, 0))
    this.box.on('pointerup', onActivate)

    scene.add.existing(this)
  }

  setIcon(key: string): void {
    this.icon.setTexture(key)
  }
}
