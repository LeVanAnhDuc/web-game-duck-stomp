import { expect as baseExpect, test } from '@playwright/test'

/**
 * Ducker ID sign-in, flag OFF — the shipped-dark build (ADR-0013), on :4173.
 *
 * The deployed site must be indistinguishable from before the feature existed: no
 * button, nothing in the overlay, no storage touched, and no request to anywhere but
 * the page's own origin and the two font hosts it always used.
 */

// Phaser bakes every texture at boot through a software GL stack; on a busy CI box that
// alone can eat the default 5s, and a slow boot is not what these tests are about.
const expect = baseExpect.configure({ timeout: 15_000 })

const OWN_ORIGIN = 'http://127.0.0.1:4173'
const FONT_HOSTS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']

test('renders no sign-in control and makes no outside request', async ({ page }) => {
  const outside: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (url.startsWith(OWN_ORIGIN) || url.startsWith('data:') || url.startsWith('blob:')) return
    if (FONT_HOSTS.some((host) => url.startsWith(host))) return
    outside.push(url)
  })

  await page.goto('/')
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset['scene']), { timeout: 10_000 }).toBe('Title')

  await expect(page.getByRole('button', { name: 'SIGN IN' })).toHaveCount(0)
  await expect(page.locator('#account-overlay')).toBeHidden()
  await expect(page.locator('#account-overlay')).toBeEmpty()
  expect(await page.evaluate(() => sessionStorage.getItem('ducker.pkce'))).toBeNull()
  expect(outside, `requests outside the app origin:\n${outside.join('\n')}`).toEqual([])
})

test('ignores an OAuth-looking query when the feature is off', async ({ page }) => {
  await page.goto('/?code=c1&state=s1')
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset['scene']), { timeout: 10_000 }).toBe('Title')
  // Flag off: the auth module never reads `location.search`, so the URL is untouched.
  expect(new URL(page.url()).search).toBe('?code=c1&state=s1')
  await expect(page.locator('#account-overlay')).toBeEmpty()
})
