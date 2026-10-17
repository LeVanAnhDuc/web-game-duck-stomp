import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";

// NFR-A11Y-05: the one signature animation (the trail drawing itself to a newly opened node) is skipped under
// prefers-reduced-motion and drawn in its final state at once.

test.describe("reduced motion", () => {
  test(
    "bật giảm chuyển động thì đường đi tới màn mới vẽ xong ngay",
    { tag: ["@TC-ACCESSIBILITY-003", "@dev-build"] },
    async ({ gamePage, page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.reachGoal();
      await gamePage.sampleTrail();
      await gamePage.clickText(SCENE.levelComplete, copy.map);
      await gamePage.waitForScene(SCENE.worldMap);
      await gamePage.frames(30);
      expect(await gamePage.trailMin()).toBe(1);
    },
  );

  test(
    "không bật giảm chuyển động thì đường đi tự vẽ dần",
    { tag: ["@TC-ACCESSIBILITY-004", "@dev-build"] },
    async ({ gamePage, page }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.reachGoal();
      await gamePage.sampleTrail();
      await gamePage.clickText(SCENE.levelComplete, copy.map);
      await gamePage.waitForScene(SCENE.worldMap);
      await expect.poll(() => gamePage.trailProgress()).toBe(1);
      expect(await gamePage.trailMin()).toBeLessThan(1);
    },
  );
});
