import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { DRIVER_NOISE, DUCKER, VIEWPORT } from "@/data/test-data";

// Ducker ID sign-in, flag ON — project app-auth, the second dev server (:4174) built against the fake issuer
// http://ducker.test, which the fakeIssuer fixture answers (ADR-0013). Nothing here touches a real Ducker ID.

test.describe("sign-in flag on", () => {
  test(
    "đăng nhập: thấy tài khoản, URL sạch, menu đủ, đăng xuất trả lại nút",
    { tag: ["@TC-DUCKERID-003", "@smoke"] },
    async ({ gamePage, page, fakeIssuer }) => {
      const problems = gamePage.collectProblems(DRIVER_NOISE);
      await gamePage.goto();
      await gamePage.signInButton().click();

      await expect(gamePage.accountButton()).toBeVisible();
      expect(new URL(page.url()).search).toBe("");
      expect(fakeIssuer.tokenCalls()).toBe(1);

      await gamePage.accountButton().click();
      await expect(page.getByText(DUCKER.user.name)).toBeVisible();
      await expect(page.getByText(DUCKER.user.email)).toBeVisible();
      await expect(gamePage.accountMenuItem(copy.account.profile)).toHaveAttribute(
        "href",
        `${DUCKER.issuer}${DUCKER.profilePath}`,
      );

      await gamePage.accountMenuItem(copy.account.signOut).click();
      await expect(gamePage.signInButton()).toBeVisible();
      expect(problems, problems.join("\n")).toEqual([]);
    },
  );

  test("tham số game trên URL còn nguyên sau vòng đăng nhập", { tag: ["@TC-DUCKERID-004"] }, async ({ gamePage, page, fakeIssuer }) => {
    void fakeIssuer;
    await gamePage.goto("?seed=7");
    await gamePage.signInButton().click();
    await expect(gamePage.accountButton()).toBeVisible();
    expect(new URL(page.url()).search).toBe("?seed=7");
  });

  test("Esc đóng menu tài khoản và trả focus về avatar", { tag: ["@TC-DUCKERID-005"] }, async ({ gamePage, page, fakeIssuer }) => {
    void fakeIssuer;
    await gamePage.goto();
    await gamePage.signInButton().click();
    await gamePage.accountButton().click();
    await expect(gamePage.accountButton()).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(gamePage.accountButton()).toHaveAttribute("aria-expanded", "false");
    await expect(gamePage.accountButton()).toBeFocused();
  });

  test(
    "hồ sơ chỉ trong bộ nhớ: tải lại là chưa đăng nhập, storage không giữ gì",
    { tag: ["@TC-DUCKERID-006", "@smoke"] },
    async ({ gamePage, page, fakeIssuer }) => {
      void fakeIssuer;
      await gamePage.goto();
      await gamePage.signInButton().click();
      await expect(gamePage.accountButton()).toBeVisible();

      const stored = await page.evaluate(() => {
        const dump = (s: Storage) => Object.fromEntries(Object.keys(s).map((k) => [k, s.getItem(k)]));
        return { local: dump(localStorage), session: dump(sessionStorage) };
      });
      expect(JSON.stringify(stored)).not.toContain(DUCKER.user.email);
      expect(Object.keys(stored.session)).not.toContain(DUCKER.pkceKey);

      await page.reload();
      await gamePage.waitForScene(SCENE.title);
      await expect(gamePage.signInButton()).toBeVisible();
    },
  );

  test(
    "từ chối ở Ducker ID: về chưa đăng nhập, URL sạch, không gọi token",
    { tag: ["@TC-DUCKERID-007"] },
    async ({ gamePage, page, fakeIssuer }) => {
      fakeIssuer.setMode("deny");
      await gamePage.goto("?level=2");
      await gamePage.signInButton().click();
      await expect.poll(() => new URL(page.url()).search).toBe("?level=2");
      await gamePage.waitForScene(SCENE.title);
      await expect(gamePage.signInButton()).toBeVisible();
      expect(fakeIssuer.tokenCalls()).toBe(0);
    },
  );

  test(
    "state bị sửa thì bị từ chối mà không gọi token",
    { tag: ["@TC-DUCKERID-008", "@smoke"] },
    async ({ gamePage, page, fakeIssuer }) => {
      await gamePage.goto("?code=stolen&state=evil");
      await expect(gamePage.signInButton()).toBeVisible();
      expect(new URL(page.url()).search).toBe("");
      expect(fakeIssuer.tokenCalls()).toBe(0);
    },
  );

  test("sessionStorage bị chặn thì SIGN IN không đưa đi đâu", { tag: ["@TC-DUCKERID-009"] }, async ({ gamePage, page, fakeIssuer }) => {
    void fakeIssuer;
    const authorize: string[] = [];
    page.on("request", (r) => {
      if (r.url().startsWith(`${DUCKER.issuer}/oauth/authorize`)) authorize.push(r.url());
    });
    await page.addInitScript(() => {
      Object.defineProperty(window, "sessionStorage", {
        configurable: true,
        get() {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
    await gamePage.goto();
    await gamePage.signInButton().click();
    await gamePage.frames(30);
    expect(authorize).toEqual([]);
    expect(await gamePage.scene()).toBe(SCENE.title);
    expect(new URL(page.url()).origin).not.toBe(DUCKER.issuer);
  });

  test(
    "nút SIGN IN ≥ 44 px, trong màn hình, không đè nút tiếng",
    { tag: ["@TC-DUCKERID-010", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      const box = (await gamePage.signInButton().boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);

      const sound = (await gamePage.iconButtons(SCENE.title)).find((b) => b.name === copy.icon.soundOn)!;
      expect(box.x + box.width).toBeLessThanOrEqual(sound.x);
      const viewport = page.viewportSize()!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    },
  );

  for (const viewport of [VIEWPORT.phoneLandscape, VIEWPORT.smallLandscape]) {
    test(
      `menu tài khoản nằm trọn ở 667×375 và 568×320, không làm overlay xê dịch (${viewport.width}×${viewport.height})`,
      { tag: ["@TC-DUCKERID-011"] },
      async ({ gamePage, page, fakeIssuer }) => {
        void fakeIssuer;
        await page.setViewportSize(viewport);
        await gamePage.goto();
        await gamePage.signInButton().click();
        await expect(gamePage.accountButton()).toBeVisible();
        const before = await gamePage.accountOverlay.boundingBox();

        await gamePage.accountButton().click();
        const menu = (await gamePage.accountMenu().boundingBox())!;
        expect(menu.x).toBeGreaterThanOrEqual(0);
        expect(menu.y).toBeGreaterThanOrEqual(0);
        expect(menu.x + menu.width).toBeLessThanOrEqual(viewport.width);
        expect(menu.y + menu.height).toBeLessThanOrEqual(viewport.height);
        expect(await gamePage.accountMenu().evaluate((el) => getComputedStyle(el).position)).toBe("absolute");
        expect(await gamePage.accountOverlay.boundingBox()).toEqual(before);
      },
    );
  }

  test("rời Title thì overlay tài khoản biến mất", { tag: ["@TC-DUCKERID-012"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await expect(gamePage.signInButton()).toBeVisible();
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
    await expect(gamePage.accountOverlay).toBeHidden();
  });
});
