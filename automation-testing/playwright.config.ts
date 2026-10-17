import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
import { resolveEnv } from "@/config/env";
import { buildGrepInvert } from "@/config/env-guard";
import { findUrls } from "@/config/urls";

const env = resolveEnv(process.env.ENV);
const includeFull = process.env.FULL === "1";
const isDev = env === "dev";
const grepInvert = buildGrepInvert(env, includeFull);
// Page objects navigate with "./…": GitHub Pages serves the game under /web-game-duck-stomp/, so the baseURL keeps
// its path and ends with "/" (a leading "/" would drop the path). undefined on an env without a host.
const webUrl = findUrls(env)?.webUrl;
const baseURL = webUrl ? `${webUrl}/` : undefined;

// Dev runs against the Vite DEV server of ../client, as the old suite did, on purpose: everything in a Phaser game is
// one canvas, and only the dev bundle exposes `window.duckstomp` (stripped from production by import.meta.env.DEV),
// which is how a test reads "level 1 is running" or "two hearts left" instead of guessing at pixels. The production
// bundle is covered by `pnpm build` in CI and by the @dev-build-free specs on prd. A second dev server with Ducker ID
// sign-in switched ON against a fake issuer (ADR-0013) serves the ducker-id module only.
const PORT = 4173;
const AUTH_PORT = 4174;
const AUTH_URL = `http://127.0.0.1:${AUTH_PORT}/`;

const TOUCH = /e2e\/touch\/.*\.e2e\.ts$/;
const SIGN_IN = /e2e\/ducker-id\/sign-in\.e2e\.ts$/;

export default defineConfig({
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Phaser bakes every texture at boot through a software GL stack; on a busy machine that alone eats seconds.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // "app" first: the playwright-test MCP server (agents) treats the first project as primary.
  // Variants are extra projects named "app-<variant>"; package.json runs --project="app*".
  projects: [
    {
      name: "app",
      testDir: "./src/tests",
      testMatch: [/e2e\/.*\.e2e\.ts$/, /api\/.*\.api\.ts$/, /seed\.spec\.ts$/],
      testIgnore: [TOUCH, SIGN_IN],
      grepInvert,
      // Landscape phone: the tightest layout, and the one the design is built for (ADR-0004).
      use: { ...devices["Desktop Chrome"], viewport: { width: 667, height: 375 }, baseURL },
    },
    // A touch screen that is not a phone user agent: the on-screen controls must come from touch that actually
    // arrived (invariants #11), never from sniffing the device.
    {
      name: "app-touch",
      testDir: "./src/tests",
      testMatch: TOUCH,
      grepInvert,
      use: { ...devices["Desktop Chrome"], viewport: { width: 667, height: 375 }, hasTouch: true, baseURL },
    },
    // Ducker ID sign-in against the flag-on dev server. Only dev has one: the deployed build ships with the flag off.
    ...(isDev
      ? [
          {
            name: "app-auth",
            testDir: "./src/tests",
            testMatch: SIGN_IN,
            grepInvert,
            use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 }, baseURL: AUTH_URL },
          },
        ]
      : []),
    // One-off data setup (pnpm provision), never part of a normal run.
    {
      name: "provision",
      testDir: "./src/tests/setup",
      testMatch: /.*\.setup\.ts$/,
      workers: 1,
      use: { baseURL },
    },
    { name: "unit", testDir: "./src", testMatch: /.*\.test\.ts$/ },
  ],
  // Boots the game itself on dev. `--host 127.0.0.1` is load-bearing: left to itself Vite binds "localhost", which
  // can resolve to ::1, and the health check on 127.0.0.1 then waits out its whole timeout.
  webServer:
    isDev && !process.argv.includes("--project=unit")
      ? [
          {
            command: `pnpm --dir ../client exec vite --port ${PORT} --strictPort --host 127.0.0.1`,
            url: `http://127.0.0.1:${PORT}/`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            // Flag OFF, explicitly: a real environment variable beats a developer's ../client/.env in Vite.
            env: { VITE_BASE_PATH: "/", VITE_FEATURE_DUCKER_SIGN_IN: "" },
          },
          {
            command: `pnpm --dir ../client exec vite --port ${AUTH_PORT} --strictPort --host 127.0.0.1`,
            url: AUTH_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            // The fake issuer is never resolved: the issuer fixture answers every request to it.
            env: {
              VITE_BASE_PATH: "/",
              VITE_FEATURE_DUCKER_SIGN_IN: "true",
              VITE_DUCKER_ISSUER: "http://ducker.test",
              VITE_DUCKER_CLIENT_ID: "e2e-client",
              VITE_DUCKER_SCOPE: "openid profile email",
              VITE_DUCKER_PROFILE_PATH: "/profile",
            },
          },
        ]
      : undefined,
});
