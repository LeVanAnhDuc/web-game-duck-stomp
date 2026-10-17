import { test as core } from "./core.fixture";
import { DUCKER } from "@/data/test-data";

export type IssuerMode = "ok" | "deny";

export interface FakeIssuer {
  /** How many times the token endpoint was called. */
  tokenCalls(): number;
  /** "deny": /oauth/authorize answers error=access_denied instead of a code. */
  setMode(mode: IssuerMode): void;
}

const CORS = { "access-control-allow-origin": "*" };

// A stand-in Ducker ID for the flag-on dev server (:4174, issuer http://ducker.test). Every request to the issuer is
// answered here; nothing reaches a real Ducker ID (ADR-0013). Installed per test, before the first navigation.
export const test = core.extend<{ fakeIssuer: FakeIssuer }>({
  fakeIssuer: async ({ page }, use) => {
    let calls = 0;
    let mode: IssuerMode = "ok";

    await page.route(`${DUCKER.issuer}/oauth/authorize**`, async (route) => {
      const url = new URL(route.request().url());
      const back = new URL(url.searchParams.get("redirect_uri")!);
      if (mode === "deny") {
        back.searchParams.set("error", "access_denied");
      } else {
        back.searchParams.set("code", "code-1");
      }
      back.searchParams.set("state", url.searchParams.get("state")!);
      await route.fulfill({ status: 302, headers: { location: back.toString() } });
    });
    await page.route(`${DUCKER.issuer}/oauth/token`, (route) => {
      calls += 1;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify({ access_token: "at-1", token_type: "Bearer", expires_in: 900 }),
      });
    });
    await page.route(`${DUCKER.issuer}/oauth/userinfo`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS,
        body: JSON.stringify(DUCKER.user),
      }),
    );

    await use({ tokenCalls: () => calls, setMode: (m) => (mode = m) });
  },
});
