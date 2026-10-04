import { expect as baseExpect, test, type ConsoleMessage, type Page } from '@playwright/test'

/**
 * Ducker ID sign-in, flag ON — against the :4174 dev server (see playwright.config.ts).
 *
 * The issuer is the fake origin `http://ducker.test`, which never resolves: every
 * request to it is answered by `page.route`. Nothing here touches a real Ducker ID;
 * that is exercised by hand against the local one (ADR-0013).
 *
 * The flag-OFF half (no button, no outside request) lives in
 * `ducker-id-sign-in-off.spec.ts` and runs against :4173.
 */

// Phaser bakes every texture at boot through a software GL stack; on a busy CI box that
// alone can eat the default 5s, and a slow boot is not what these tests are about.
const expect = baseExpect.configure({ timeout: 15_000 })

const ISSUER = 'http://ducker.test'
const ON = 'http://127.0.0.1:4174'

test.use({ baseURL: ON })
test.setTimeout(60_000)

const CORS = { 'access-control-allow-origin': '*' }
const DRIVER_NOISE = /GL Driver Message|\.WebGL-0x/

let tokenCalls = 0

test.beforeEach(async ({ page }) => {
  tokenCalls = 0
  await page.route(`${ISSUER}/oauth/authorize**`, async (route) => {
    const url = new URL(route.request().url())
    const back = new URL(url.searchParams.get('redirect_uri')!)
    back.searchParams.set('code', 'code-1')
    back.searchParams.set('state', url.searchParams.get('state')!)
    await route.fulfill({ status: 302, headers: { location: back.toString() } })
  })
  await page.route(`${ISSUER}/oauth/token`, (route) => {
    tokenCalls += 1
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: CORS,
      body: JSON.stringify({ access_token: 'at-1', token_type: 'Bearer', expires_in: 900 }),
    })
  })
  await page.route(`${ISSUER}/oauth/userinfo`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: CORS,
      body: JSON.stringify({ sub: 'u1', name: 'Lê Văn Anh Đức', email: 'duc@ducker.id' }),
    }),
  )
})

async function onTitle(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset['scene']), { timeout: 15_000 }).toBe('Title')
}

const signInButton = (page: Page) => page.getByRole('button', { name: 'SIGN IN' })
const accountButton = (page: Page) => page.getByRole('button', { name: 'Ducker ID account' })

test('signs in, shows the name, keeps the URL clean, signs out', async ({ page }) => {
  const noise: string[] = []
  page.on('console', (m: ConsoleMessage) => {
    if ((m.type() === 'error' || m.type() === 'warning') && !DRIVER_NOISE.test(m.text())) noise.push(m.text())
  })
  page.on('pageerror', (e) => noise.push(`pageerror: ${e.message}`))

  await page.goto('/')
  await onTitle(page)
  await signInButton(page).click()

  await expect(accountButton(page)).toBeVisible()
  expect(new URL(page.url()).search).toBe('')
  expect(tokenCalls).toBe(1)

  await accountButton(page).click()
  await expect(page.getByText('Lê Văn Anh Đức')).toBeVisible()
  await expect(page.getByText('duc@ducker.id')).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'DUCKER ID PROFILE' })).toHaveAttribute('href', `${ISSUER}/profile`)

  await page.getByRole('menuitem', { name: 'SIGN OUT' }).click()
  await expect(signInButton(page)).toBeVisible()
  expect(noise, `console was not quiet:\n${noise.join('\n')}`).toEqual([])
})

test('keeps the game query params across the round trip', async ({ page }) => {
  await page.goto('/?seed=7')
  await onTitle(page)
  await signInButton(page).click()
  await expect(accountButton(page)).toBeVisible()
  expect(new URL(page.url()).search).toBe('?seed=7')
})

test('Escape closes the menu and returns focus to the avatar', async ({ page }) => {
  await page.goto('/')
  await onTitle(page)
  await signInButton(page).click()
  await accountButton(page).click()
  await expect(accountButton(page)).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(accountButton(page)).toHaveAttribute('aria-expanded', 'false')
  await expect(accountButton(page)).toBeFocused()
})

test('a reload is signed out again (nothing is persisted)', async ({ page }) => {
  await page.goto('/')
  await onTitle(page)
  await signInButton(page).click()
  await expect(accountButton(page)).toBeVisible()
  await page.reload()
  await onTitle(page)
  await expect(signInButton(page)).toBeVisible()
})

test('an IdP error leaves the player signed out with a clean URL', async ({ page }) => {
  await page.goto('/?error=access_denied&error_description=nope&state=whatever&level=2')
  await onTitle(page)
  await expect(signInButton(page)).toBeVisible()
  expect(new URL(page.url()).search).toBe('?level=2')
  expect(tokenCalls).toBe(0)
})

test('a tampered state is refused without calling the token endpoint', async ({ page }) => {
  await page.goto('/?code=stolen&state=evil')
  await onTitle(page)
  await expect(signInButton(page)).toBeVisible()
  expect(new URL(page.url()).search).toBe('')
  expect(tokenCalls).toBe(0)
})

test('the signed-out control is at least 44px and clear of the sound button', async ({ page }) => {
  await page.goto('/')
  await onTitle(page)
  const box = (await signInButton(page).boundingBox())!
  expect(box.width).toBeGreaterThanOrEqual(44)
  expect(box.height).toBeGreaterThanOrEqual(44)

  // The sound button is drawn inside the canvas: 44s square, centred 30s from its
  // top-right corner (src/game/ui.ts, s = zoom / 2).
  const sound = await page.evaluate(() => {
    const game = (window as unknown as { duckstomp: { registry: { get(k: string): unknown } } }).duckstomp
    const zoom = Number(game.registry.get('zoom'))
    const rect = document.querySelector('#app canvas')!.getBoundingClientRect()
    const s = zoom / 2
    return { left: rect.right - 52 * s, top: rect.top + 8 * s, bottom: rect.top + 52 * s }
  })
  expect(box.x + box.width).toBeLessThanOrEqual(sound.left)
  // and it stays inside the viewport
  const viewport = page.viewportSize()!
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
  expect(box.y).toBeLessThan(sound.bottom)
})

test('the overlay is gone once the game starts', async ({ page }) => {
  await page.goto('/')
  await onTitle(page)
  await expect(signInButton(page)).toBeVisible()
  await page.evaluate(() => {
    const game = (window as unknown as { duckstomp: { scene: { start(k: string, d?: object): void; getScene(k: string): { scene: { start(k: string, d?: object): void } } } } }).duckstomp
    game.scene.getScene('Title').scene.start('WorldMap', { select: '1' })
  })
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset['scene'])).toBe('WorldMap')
  await expect(page.locator('#account-overlay')).toBeHidden()
})
