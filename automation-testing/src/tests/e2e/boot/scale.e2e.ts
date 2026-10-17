import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { VIEWPORT } from "@/data/test-data";

// FR-18 / NFR-GAME-01: the canvas is a whole multiple of 320×180, the leftover is letterbox (invariants #1). The
// arithmetic is unit tested in client/src/core/scale.test.ts; here it is the size the browser actually lays out.

const CASES = [
  { viewport: VIEWPORT.phoneLandscape, canvas: { width: 640, height: 360 } },
  { viewport: VIEWPORT.tablet, canvas: { width: 960, height: 540 } },
  { viewport: VIEWPORT.desktop, canvas: { width: 1280, height: 720 } },
] as const;

test.describe("integer scale", () => {
  for (const { viewport, canvas } of CASES) {
    test(
      `canvas là bội số nguyên của 320×180 ở ba khổ đã kiểm (${viewport.width}×${viewport.height})`,
      { tag: ["@TC-BOOT-005", "@smoke"] },
      async ({ gamePage, page }) => {
        await page.setViewportSize(viewport);
        await gamePage.goto();
        const size = await gamePage.canvasSize();
        expect(size).toEqual(canvas);
        expect(size.width % 320).toBe(0);
        expect(size.height % 180).toBe(0);
        expect(size.width / 320).toBe(size.height / 180);
      },
    );
  }

  test(
    "đổi cỡ cửa sổ qua một bậc zoom thì canvas tính lại, game không khởi động lại",
    { tag: ["@TC-BOOT-006"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.worldMap);
      expect(await gamePage.canvasSize()).toEqual({ width: 640, height: 360 });

      await page.setViewportSize(VIEWPORT.desktop);
      await expect.poll(() => gamePage.canvasSize()).toEqual({ width: 1280, height: 720 });
      expect(await gamePage.scene()).toBe(SCENE.worldMap);
    },
  );
});
