import { expect, test, type CDPSession, type Page } from '@playwright/test'

/**
 * The two defects the 2026-09-12 persona review found, pinned so they cannot come
 * back — see `docs/specs/touch-controls-and-locked-start/design.md`.
 *
 * These run in their OWN context rather than the suite's projects, because both
 * need `hasTouch: true` and the three configured projects are keyboard/mouse
 * desktops. A touch defect is not reproducible on a context that cannot touch.
 *
 * What is asserted here is state while an input is held, never a physics outcome:
 * "the input snapshot says right is down" is deterministic, "the duck cleared the
 * gap" is frame timing. The same line playwright.config.ts draws.
 */

const SIZE = { width: 667, height: 375 } as const

type Snapshot = { left: boolean; right: boolean; jumpHeld: boolean }

type Handle = {
  scene: { isActive(k: string): boolean; getScene(k: string): unknown }
}

/** The dev-only handle, the only way to see inside a canvas (see main.ts). */
async function inputState(page: Page): Promise<{ showTouch: boolean; touchVisible: boolean; snapshot: Snapshot }> {
  return page.evaluate(() => {
    const game = (window as unknown as { duckstomp: Handle }).duckstomp
    const play = game.scene.getScene('Game') as { inputs: { showTouch: boolean; snapshot: Snapshot } }
    const hud = game.scene.getScene('Hud') as { children: { list: { type: string; visible: boolean }[] } }
    const containers = hud.children.list.filter((o) => o.type === 'Container')
    const touchGroup = containers[containers.length - 1]
    return {
      showTouch: play.inputs.showTouch,
      touchVisible: touchGroup?.visible === true,
      snapshot: { ...play.inputs.snapshot },
    }
  })
}

/** Centre of a rectangle inside the canvas, in PAGE coordinates. */
async function canvasOrigin(page: Page): Promise<{ x: number; y: number; w: number; h: number }> {
  return page.evaluate(() => {
    const rect = document.querySelector('canvas')!.getBoundingClientRect()
    return { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
  })
}

/**
 * Playwright's touchscreen can only tap — it cannot hold — and a held thumb is the
 * whole point of these controls. CDP can, so the hold goes through CDP.
 */
async function touchDown(cdp: CDPSession, x: number, y: number): Promise<void> {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
}

async function touchUp(cdp: CDPSession): Promise<void> {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}

/** Taps every gold button on the way in: PLAY on the title, then START on the map. */
async function tapIntoLevelOne(page: Page): Promise<void> {
  await page.waitForFunction(() => document.documentElement.dataset['scene'] === 'Title')
  const canvas = await canvasOrigin(page)
  // PLAY sits at the vertical middle of the title screen.
  await page.touchscreen.tap(canvas.x + canvas.w / 2, canvas.y + canvas.h * 0.45)
  await page.waitForFunction(() => document.documentElement.dataset['scene'] === 'WorldMap')

  const start = await buttonCentre(page, 'WorldMap')
  await page.touchscreen.tap(canvas.x + start.x, canvas.y + start.y)
  await page.waitForFunction(() => document.documentElement.dataset['scene'] === 'Game')
}

/**
 * Centre of the LAST interactive rectangle in a scene, in CANVAS coordinates.
 * On the world map that is the START button; asking the running game beats
 * hard-coding a pixel that moves with the integer zoom.
 */
async function buttonCentre(page: Page, sceneKey: string): Promise<{ x: number; y: number }> {
  return page.evaluate((key) => {
    const game = (window as unknown as { duckstomp: Handle }).duckstomp
    const scene = game.scene.getScene(key) as {
      children: { list: unknown[] }
    }
    const found: { x: number; y: number }[] = []
    const walk = (object: unknown): void => {
      const node = object as { list?: unknown[]; input?: unknown; type?: string; getBounds?: () => DOMRect }
      if (Array.isArray(node.list)) {
        node.list.forEach(walk)
        return
      }
      if (node.input !== undefined && node.input !== null && node.type === 'Rectangle' && node.getBounds) {
        const bounds = node.getBounds()
        found.push({ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 })
      }
    }
    scene.children.list.forEach(walk)
    const last = found[found.length - 1]
    if (last === undefined) throw new Error(`no interactive rectangle in ${key}`)
    return last
  }, sceneKey)
}

test.describe('cụm nút cảm ứng', () => {
  test('hiện sau cú chạm đầu tiên trong màn chơi, và giữ được hướng', async ({ browser }) => {
    const context = await browser.newContext({ viewport: SIZE, hasTouch: true })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await page.goto('/')
    await tapIntoLevelOne(page)

    // FR-15: hidden until a touch arrives. Nothing has touched the play area yet.
    const before = await inputState(page)
    expect(before.showTouch).toBe(false)
    expect(before.touchVisible).toBe(false)

    // One tap anywhere in the play area is what a phone player actually does.
    const canvas = await canvasOrigin(page)
    await page.touchscreen.tap(canvas.x + canvas.w / 2, canvas.y + canvas.h * 0.5)
    await expect.poll(async () => (await inputState(page)).showTouch).toBe(true)
    expect((await inputState(page)).touchVisible).toBe(true)

    // NFR-A11Y-06: the controls have to WORK by touch, not merely appear. Hold the
    // right-hand direction pad and the input snapshot must say so.
    const dirSize = 72
    const margin = 16
    const right = {
      x: canvas.x + margin + dirSize + 12 + dirSize / 2,
      y: canvas.y + canvas.h - margin - dirSize / 2,
    }
    await touchDown(cdp, right.x, right.y)
    await expect.poll(async () => (await inputState(page)).snapshot.right).toBe(true)
    await touchUp(cdp)
    await expect.poll(async () => (await inputState(page)).snapshot.right).toBe(false)

    await context.close()
  })

  test('ẩn lại sau khi người chơi bấm phím', async ({ browser }) => {
    const context = await browser.newContext({ viewport: SIZE, hasTouch: true })
    const page = await context.newPage()
    await page.goto('/')
    await tapIntoLevelOne(page)

    const canvas = await canvasOrigin(page)
    await page.touchscreen.tap(canvas.x + canvas.w / 2, canvas.y + canvas.h * 0.5)
    await expect.poll(async () => (await inputState(page)).showTouch).toBe(true)

    // A keyboard player must not be left with buttons painted over the level.
    await page.keyboard.down('ArrowRight')
    await page.waitForTimeout(120)
    await page.keyboard.up('ArrowRight')
    await expect.poll(async () => (await inputState(page)).showTouch).toBe(false)
    await expect.poll(async () => (await inputState(page)).touchVisible).toBe(false)

    await context.close()
  })
})

test.describe('node bị khoá trên bản đồ', () => {
  test('chọn được để xem trước, nhưng START vô hiệu và không đưa đi đâu', async ({ browser }) => {
    const context = await browser.newContext({ viewport: SIZE, hasTouch: true })
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForFunction(() => document.documentElement.dataset['scene'] === 'Title')
    const canvas = await canvasOrigin(page)
    await page.touchscreen.tap(canvas.x + canvas.w / 2, canvas.y + canvas.h * 0.45)
    await page.waitForFunction(() => document.documentElement.dataset['scene'] === 'WorldMap')

    // Node 2 is locked on a fresh save. Selecting it is allowed — previewing the
    // next level is the point — so the card has to say the level is locked.
    const nodes = await page.evaluate(() => {
      const game = (window as unknown as { duckstomp: Handle }).duckstomp
      const scene = game.scene.getScene('WorldMap') as { children: { list: { type: string; x: number; y: number; input?: unknown }[] } }
      return scene.children.list
        .filter((o) => o.type === 'Arc' && o.input !== undefined && o.input !== null)
        .map((o) => ({ x: o.x, y: o.y }))
    })
    const second = nodes[1]
    expect(second).toBeDefined()
    await page.touchscreen.tap(canvas.x + second!.x, canvas.y + second!.y)

    await expect
      .poll(async () =>
        page.evaluate(() => {
          const game = (window as unknown as { duckstomp: Handle }).duckstomp
          const scene = game.scene.getScene('WorldMap') as { children: { list: { type: string; text?: string }[] } }
          return scene.children.list.filter((o) => o.type === 'Text').map((o) => o.text ?? '')
        }),
      )
      .toContain('LOCKED')

    // Tapping START must stay put rather than doing nothing in silence.
    const start = await buttonCentre(page, 'WorldMap')
    await page.touchscreen.tap(canvas.x + start.x, canvas.y + start.y)
    await page.waitForTimeout(600)
    expect(await page.evaluate(() => document.documentElement.dataset['scene'])).toBe('WorldMap')

    await context.close()
  })
})
