import { test, expect } from "@/fixtures";
import { DUCKER, FONT_HOSTS } from "@/data/test-data";

// Ducker ID sign-in, flag OFF — the shipped-dark build (ADR-0013): project `app`, so the dev server on :4173 and the
// deployed site on prd. It must be indistinguishable from before the feature existed.

test.describe("sign-in flag off", () => {
  test(
    "cờ tắt: không nút đăng nhập, không chạm storage, không request ra ngoài",
    { tag: ["@TC-DUCKERID-001", "@smoke"] },
    async ({ gamePage, page, urls }) => {
      const own = new URL(urls.webUrl).origin;
      const outside: string[] = [];
      page.on("request", (request) => {
        const url = request.url();
        if (url.startsWith(own) || url.startsWith("data:") || url.startsWith("blob:")) return;
        if (FONT_HOSTS.some((host) => url.startsWith(host))) return;
        outside.push(url);
      });

      await gamePage.goto();
      await expect(gamePage.signInButton()).toHaveCount(0);
      await expect(gamePage.accountOverlay).toBeHidden();
      await expect(gamePage.accountOverlay).toBeEmpty();
      expect(await page.evaluate((key) => sessionStorage.getItem(key), DUCKER.pkceKey)).toBeNull();
      expect(outside, `requests outside the site:\n${outside.join("\n")}`).toEqual([]);
    },
  );

  test("cờ tắt: query giống OAuth bị để nguyên", { tag: ["@TC-DUCKERID-002"] }, async ({ gamePage, page }) => {
    await gamePage.goto("?code=c1&state=s1");
    // Flag off: the auth module never reads `location.search`, so the URL is untouched.
    expect(new URL(page.url()).search).toBe("?code=c1&state=s1");
    await expect(gamePage.accountOverlay).toBeEmpty();
  });
});
