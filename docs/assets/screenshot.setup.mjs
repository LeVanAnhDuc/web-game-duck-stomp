/**
 * Drives the deployed game into a frame worth screenshotting.
 *
 * Used by `web-game/.claude/skills/readme-game/scripts/capture-screenshots.mjs`,
 * which opens the live GitHub Pages URL. Without this file the shot lands on the
 * title screen — a menu, not the game.
 *
 * Two things this deliberately does NOT do:
 *
 * 1. It does not click. Every button here is drawn inside a canvas, so there is
 *    no DOM node for `getByRole('button')` to find. It drives the keyboard
 *    instead, and it sets `keyCode` by hand because Phaser 3 matches on that
 *    legacy field, which a synthetic KeyboardEvent does not carry.
 *
 * 2. It does not sleep and hope. The page publishes the running scene as
 *    `<html data-scene="...">`, so each step waits for the scene it asked for.
 *    The skill's own notes warn about blind timing; in this game a wrong guess
 *    would shoot the loading bar or the world map.
 *
 * Standing still is safe here — nothing kills an idle player — so the function
 * ends on the frame it wants rather than racing a timer.
 */

/** Presses a key the way Phaser hears it. */
async function press(page, keyCode, key) {
  await page.evaluate(
    ([code, name]) => {
      const send = (type) => {
        const event = new KeyboardEvent(type, { key: name, bubbles: true, cancelable: true })
        Object.defineProperty(event, 'keyCode', { get: () => code })
        Object.defineProperty(event, 'which', { get: () => code })
        window.dispatchEvent(event)
      }
      send('keydown')
      setTimeout(() => send('keyup'), 60)
    },
    [keyCode, key],
  )
}

const scene = (page, name, timeout = 15_000) =>
  page.waitForFunction((want) => document.documentElement.dataset.scene === want, name, { timeout })

const ENTER = 13

export default async function setup(page) {
  // Boot bakes textures and waits briefly on Google Fonts; Preload fetches the
  // six level files. Both are quick, but neither is instant.
  await scene(page, 'Title')

  await press(page, ENTER, 'Enter') // PLAY — also the gesture that unlocks audio
  await scene(page, 'WorldMap')

  await press(page, ENTER, 'Enter') // START on the selected level
  await scene(page, 'Game')

  // A beat for the camera to settle on the player and the HUD to draw its first
  // values. The player is idle on solid ground, so this cannot go wrong.
  await page.waitForTimeout(700)
}
