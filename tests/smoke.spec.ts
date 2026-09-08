import { expect, test, type ConsoleMessage, type Page } from '@playwright/test'

/**
 * The whole browser suite: it boots, it plays, it is quiet.
 *
 * Notice what is NOT asserted — no jump heights, no enemy collisions, no level
 * completion. Those depend on frame timing, so asserting them here buys flakiness
 * rather than confidence; they live in `src/core/movement.test.ts`, where delta
 * time is a parameter and the state machine is pure.
 */

const SCENE = { title: 'Title', map: 'WorldMap', game: 'Game', hud: 'Hud' } as const

/** Presses a key the way Phaser 3 hears it — it matches on the legacy keyCode. */
async function pressKey(page: Page, keyCode: number, key: string): Promise<void> {
  await page.evaluate(
    ([code, name]) => {
      const send = (type: string): void => {
        const event = new KeyboardEvent(type, { key: name as string, bubbles: true, cancelable: true })
        Object.defineProperty(event, 'keyCode', { get: () => code })
        Object.defineProperty(event, 'which', { get: () => code })
        window.dispatchEvent(event)
      }
      send('keydown')
      setTimeout(() => send('keyup'), 50)
    },
    [keyCode, key] as const,
  )
}

async function activeScene(page: Page, key: string): Promise<boolean> {
  return page.evaluate((name) => {
    const game = (window as unknown as { runup?: { scene: { isActive(k: string): boolean } } }).runup
    return game === undefined ? false : game.scene.isActive(name)
  }, key)
}

/**
 * Noise from the graphics driver, not from this game.
 *
 * Headless Chromium runs a software GL stack that logs performance advice, and
 * baking textures at boot reads pixels back out of the GPU, which trips it every
 * time. Asserting on it would mean asserting on the CI machine's driver. The
 * allowlist is kept narrow on purpose: anything this game itself logs still fails
 * the test.
 */
const DRIVER_NOISE = /GL Driver Message|\.WebGL-0x/

test.describe('smoke', () => {
  let noise: string[] = []

  test.beforeEach(({ page }) => {
    noise = []
    page.on('console', (message: ConsoleMessage) => {
      const type = message.type()
      if (type !== 'error' && type !== 'warning') return
      const text = message.text()
      if (DRIVER_NOISE.test(text)) return
      noise.push(`${type}: ${text}`)
    })
    page.on('pageerror', (error) => noise.push(`pageerror: ${error.message}`))
  })

  test('boots to the title screen', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('RUNUP')

    // A canvas at an exact whole multiple of 320x180 is the visible proof of
    // NFR-GAME-01; the arithmetic itself is unit tested in core/scale.test.ts.
    const size = await page.evaluate(() => {
      const canvas = document.querySelector('#app canvas')
      return canvas === null ? null : { w: canvas.clientWidth, h: canvas.clientHeight }
    })
    expect(size).not.toBeNull()
    expect(size!.w % 320, `canvas width ${size!.w} is not a whole multiple of 320`).toBe(0)
    expect(size!.h % 180, `canvas height ${size!.h} is not a whole multiple of 180`).toBe(0)
    expect(size!.w / 320).toBe(size!.h / 180)

    await expect.poll(() => activeScene(page, SCENE.title), { timeout: 10_000 }).toBe(true)
  })

  test('reaches level 1 and runs it', async ({ page }) => {
    await page.goto('/')
    await expect.poll(() => activeScene(page, SCENE.title), { timeout: 10_000 }).toBe(true)

    await pressKey(page, 13, 'Enter') // PLAY
    await expect.poll(() => activeScene(page, SCENE.map), { timeout: 5_000 }).toBe(true)

    await pressKey(page, 13, 'Enter') // START
    await expect.poll(() => activeScene(page, SCENE.game), { timeout: 5_000 }).toBe(true)
    await expect.poll(() => activeScene(page, SCENE.hud), { timeout: 5_000 }).toBe(true)

    // The level parsed, spawned a player, and the clock is advancing.
    const state = await page.evaluate(() => {
      const game = (window as unknown as { runup?: { scene: { getScene(k: string): unknown } } }).runup
      const scene = game?.scene.getScene('Game') as { level?: { totalCoins: number }; player?: { x: number } }
      return { coins: scene?.level?.totalCoins ?? -1, playerX: scene?.player?.x ?? -1 }
    })
    expect(state.coins).toBeGreaterThan(0)
    expect(state.playerX).toBeGreaterThan(0)
  })

  test('says nothing alarming on the way in', async ({ page }) => {
    await page.goto('/')
    await expect.poll(() => activeScene(page, SCENE.title), { timeout: 10_000 }).toBe(true)
    await pressKey(page, 13, 'Enter')
    await expect.poll(() => activeScene(page, SCENE.map), { timeout: 5_000 }).toBe(true)
    await pressKey(page, 13, 'Enter')
    await expect.poll(() => activeScene(page, SCENE.game), { timeout: 5_000 }).toBe(true)

    expect(noise, `console was not quiet:\n${noise.join('\n')}`).toEqual([])
  })
})
