/**
 * The portrait gate — FR-16, ADR-0004.
 *
 * A side-scroller needs to see what is coming. At 375px of width in portrait you
 * cannot see the enemy you are already running into, so portrait is refused rather
 * than served badly.
 *
 * It is plain DOM, above the canvas, and contains NO TEXT — a dim phone, an arrow,
 * a lit phone. Nothing to translate (ADR-0005).
 *
 * The order matters: PAUSE FIRST, then show. The gate appearing while the player
 * is mid-jump must not leave them falling behind it (US-03).
 */

import type Phaser from 'phaser'
import { isPortrait } from '../core/scale'
import { SCENE } from './scenes/keys'

export function mountRotateGate(game: Phaser.Game): () => void {
  const gate = document.getElementById('rotate-gate')
  if (gate === null) return () => {}

  let pausedByGate = false

  const apply = (): void => {
    const portrait = isPortrait(window.innerWidth, window.innerHeight)
    gate.hidden = !portrait

    const gameScene = game.scene.getScene(SCENE.game)
    if (gameScene === null) return

    if (portrait && game.scene.isActive(SCENE.game)) {
      game.scene.pause(SCENE.game)
      pausedByGate = true
      return
    }

    // Only undo a pause this gate caused. The player's own pause menu stays put.
    if (!portrait && pausedByGate) {
      game.scene.resume(SCENE.game)
      pausedByGate = false
    }
  }

  apply()
  window.addEventListener('resize', apply)
  window.addEventListener('orientationchange', apply)

  return () => {
    window.removeEventListener('resize', apply)
    window.removeEventListener('orientationchange', apply)
  }
}
