/**
 * Entry point. Deliberately thin — it computes the integer zoom, builds the game,
 * and puts the two shared services in the registry. Everything worth reading is in
 * a named module.
 *
 * `Phaser.Scale.NONE` is not laziness: FIT and RESIZE both produce fractional
 * scaling, which is the one silent failure this project cares most about
 * (invariants #1). The canvas is sized to an exact whole multiple of 320x180 and
 * the leftover is letterbox, painted by the page.
 */

import Phaser from 'phaser'
import { computeScale } from './core/scale'
import { Sfx } from './game/audio'
import { SaveStore } from './game/saveStore'
import { mountRotateGate } from './game/rotateGate'
import { BootScene } from './game/scenes/BootScene'
import { PreloadScene } from './game/scenes/PreloadScene'
import { TitleScene } from './game/scenes/TitleScene'
import { WorldMapScene } from './game/scenes/WorldMapScene'
import { GameScene } from './game/scenes/GameScene'
import { HudScene } from './game/scenes/HudScene'
import { PauseScene } from './game/scenes/PauseScene'
import { LevelCompleteScene } from './game/scenes/LevelCompleteScene'
import { REGISTRY } from './game/scenes/keys'

const parent = document.getElementById('app')
if (parent === null) throw new Error('index.html is missing #app')

const initial = computeScale(window.innerWidth, window.innerHeight)

const store = new SaveStore()
const sfx = new Sfx(store.muted)

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent,
  width: initial.canvasW,
  height: initial.canvasH,
  backgroundColor: '#131735',
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: {
    default: 'arcade',
    arcade: {
      // Zero on purpose: core/movement owns the player's gravity so it stays
      // testable, and enemies set their own. See entities/Player.ts.
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, TitleScene, WorldMapScene, GameScene, HudScene, PauseScene, LevelCompleteScene],
})

game.registry.set(REGISTRY.zoom, initial.zoom)
game.registry.set(REGISTRY.sfx, sfx)
game.registry.set(REGISTRY.save, store)

/**
 * Re-derive the whole size on resize. The zoom can change (rotating a tablet
 * crosses a whole-number boundary), and when it does every UI scene has to be
 * rebuilt because its type scale is baked in screen pixels.
 */
let lastZoom = initial.zoom
window.addEventListener('resize', () => {
  const next = computeScale(window.innerWidth, window.innerHeight)
  game.scale.resize(next.canvasW, next.canvasH)
  if (next.zoom === lastZoom) return

  lastZoom = next.zoom
  game.registry.set(REGISTRY.zoom, next.zoom)
  for (const scene of game.scene.getScenes(true)) {
    scene.scene.restart()
  }
})

mountRotateGate(game)

/**
 * Publish which scene is on screen as `<html data-scene="...">`.
 *
 * Everything in a Phaser game lives inside one canvas, so from the outside a
 * scene change is invisible — there is no DOM to wait for. Anything driving this
 * page from a script is then reduced to guessing at timings, which is exactly how
 * a screenshot ends up catching a loading bar or a menu.
 *
 * This ships in production, unlike the dev-only handle below, because the thing
 * that needs it most runs against the deployed site: the README screenshot tool
 * (`docs/assets/screenshot.setup.mjs`) has to know when the level is actually up.
 * It is one attribute and it reveals nothing a player cannot already see.
 */
const publishScene = (): void => {
  const active = game.scene.getScenes(true)
  // HUD and overlays run on top of Game; the first entry is the one underneath.
  const key = active[0]?.scene.key
  if (key !== undefined) document.documentElement.dataset['scene'] = key
}
game.events.on(Phaser.Core.Events.POST_STEP, publishScene)

/**
 * Dev-only handle on the running game.
 *
 * Stripped from production builds by the `import.meta.env.DEV` guard. It exists
 * because driving a platformer from a script is otherwise blind: without a way to
 * read where the player actually is, checking a flow like "reach the goal, see the
 * card, watch the node open" turns into guessing at jump timings.
 */
if (import.meta.env.DEV) {
  ;(window as unknown as { duckstomp?: Phaser.Game }).duckstomp = game
}
