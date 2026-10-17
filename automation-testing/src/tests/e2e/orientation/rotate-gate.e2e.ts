import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { VIEWPORT } from "@/data/test-data";

// FR-16 / ADR-0004: portrait is refused, not served badly. The gate is plain DOM above the canvas, with no text.

test.describe("rotate gate", () => {
  test("cầm dọc: màn chặn phủ cả trang và không có chữ", { tag: ["@TC-ORIENTATION-001", "@smoke"] }, async ({ gamePage, page }) => {
    await page.setViewportSize(VIEWPORT.phonePortrait);
    await gamePage.goto();
    await expect(gamePage.rotateGate).toBeVisible();
    const box = (await gamePage.rotateGate.boundingBox())!;
    expect(box).toEqual({ x: 0, y: 0, ...VIEWPORT.phonePortrait });
    expect((await gamePage.rotateGate.innerText()).trim()).toBe("");
  });

  test("cầm ngang: không có màn chặn", { tag: ["@TC-ORIENTATION-002"] }, async ({ gamePage, page }) => {
    await page.setViewportSize(VIEWPORT.phoneLandscape);
    await gamePage.goto();
    await expect(gamePage.rotateGate).toBeHidden();
  });

  test("mở khi cầm dọc, xoay ngang thì vào được game", { tag: ["@TC-ORIENTATION-003"] }, async ({ gamePage, page }) => {
    await page.setViewportSize(VIEWPORT.phonePortrait);
    await gamePage.goto();
    await expect(gamePage.rotateGate).toBeVisible();

    await page.setViewportSize(VIEWPORT.phoneLandscape);
    await expect(gamePage.rotateGate).toBeHidden();
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
  });

  test(
    "đang chơi xoay dọc thì tạm dừng, xoay lại ngang thì chơi tiếp",
    { tag: ["@TC-ORIENTATION-004", "@smoke", "@dev-build"] },
    async ({ gamePage, page }) => {
      // BUG: defects/orientation.md#bug-orientation-01
      test.fail();
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.takeCoin();

      await page.setViewportSize(VIEWPORT.phonePortrait);
      await expect(gamePage.rotateGate).toBeVisible();
      await expect.poll(() => gamePage.isPaused(SCENE.game), { timeout: 5_000 }).toBe(true);
      const frozen = (await gamePage.state()).elapsedMs;
      await gamePage.frames(30);
      expect((await gamePage.state()).elapsedMs).toBe(frozen);
      expect(await gamePage.isActive(SCENE.pause)).toBe(false);

      await page.setViewportSize(VIEWPORT.phoneLandscape);
      await expect(gamePage.rotateGate).toBeHidden();
      await expect.poll(() => gamePage.isActive(SCENE.game)).toBe(true);
      await expect.poll(async () => (await gamePage.state()).elapsedMs).toBeGreaterThan(frozen);
      expect((await gamePage.state()).coins, "the coin taken before rotating").toBe(1);
    },
  );

  test(
    "màn tạm dừng của người chơi vẫn còn sau khi xoay dọc rồi ngang",
    { tag: ["@TC-ORIENTATION-005", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.pause);

      await page.setViewportSize(VIEWPORT.phonePortrait);
      await expect(gamePage.rotateGate).toBeVisible();
      await page.setViewportSize(VIEWPORT.phoneLandscape);
      await expect(gamePage.rotateGate).toBeHidden();
      await gamePage.frames(20);

      expect(await gamePage.isActive(SCENE.pause)).toBe(true);
      expect(await gamePage.isPaused(SCENE.game)).toBe(true);
    },
  );
});
