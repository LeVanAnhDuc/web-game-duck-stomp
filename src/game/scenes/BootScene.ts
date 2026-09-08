/**
 * Bakes every texture and waits — briefly — for the web fonts.
 *
 * The font wait is capped on purpose. Google Fonts is the only external request
 * this game makes and it is allowed to fail (NFR-REL-01): a blocked or slow font
 * host must cost a moment and a less pretty typeface, never the game.
 */

import Phaser from 'phaser'
import { generateTextures } from '../textures'
import { ensureUiIcons } from '../ui'
import { SCENE } from './keys'

const FONT_TIMEOUT_MS = 1200

async function waitForFonts(): Promise<void> {
  try {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts === undefined) return
    await Promise.race([
      Promise.all([fonts.load('16px "Pixelify Sans"'), fonts.load('48px "Jersey 15"')]),
      new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS)),
    ])
  } catch {
    // Fallback stack it is.
  }
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE.boot)
  }

  create(): void {
    generateTextures(this)
    ensureUiIcons(this)
    void waitForFonts().then(() => this.scene.start(SCENE.preload))
  }
}
