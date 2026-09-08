import { defineConfig, devices } from '@playwright/test'

/**
 * One smoke test, three viewports. Deliberately small.
 *
 * There is no end-to-end coverage of physics here, and that is a decision rather
 * than an omission: a browser test that jumps a character over a pit is timing
 * dependent, so it goes red for reasons that have nothing to do with the change
 * under test, and a test that goes red for no reason gets disabled. Game feel is
 * covered by unit tests on `core/movement`, which are deterministic because delta
 * time is an argument there.
 *
 * What this suite is for: the app boots, the fonts and textures come up, the first
 * level runs, and nothing shouts in the console.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] === undefined ? 0 : 1,
  reporter: process.env['CI'] === undefined ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    // See the webServer note below: this runs the dev bundle on purpose.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Landscape phone: the tightest layout, and the one the design is built for.
    { name: 'phone-landscape', use: { ...devices['Desktop Chrome'], viewport: { width: 667, height: 375 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  /**
   * The DEV server, not a production preview — a deliberate trade.
   *
   * Everything inside a Phaser game lives in one canvas, so from the outside a
   * scene transition is invisible: there is no DOM to query. The dev build exposes
   * a `window.duckstomp` handle (stripped from production by `import.meta.env.DEV`)
   * and that handle is what lets these tests assert "the map opened", "level 1 is
   * running" rather than only "a canvas exists".
   *
   * The cost is that the production bundle is not what runs here. It is covered
   * separately: `npm run check` type-checks and builds it, and the build failing is
   * a hard stop.
   */
  webServer: {
    // `--host 127.0.0.1` is load-bearing: left to itself Vite binds "localhost",
    // which can resolve to ::1, and Playwright's health check on 127.0.0.1 then
    // waits out its full timeout against a server that is already up.
    command: 'npm run dev -- --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: process.env['CI'] === undefined,
    timeout: 120_000,
  },
})
