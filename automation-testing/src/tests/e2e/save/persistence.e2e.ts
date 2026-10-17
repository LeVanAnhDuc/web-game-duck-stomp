import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";

// FR-14: progress survives a reload, written by the game itself (no seeded save here).

test.describe("persistence", () => {
  test(
    "xong màn 1 rồi tải lại: CONTINUE, màn 2 mở, kỷ lục còn",
    { tag: ["@TC-SAVE-001", "@smoke", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.reachGoal();

      await page.reload();
      await gamePage.waitForScene(SCENE.title);
      expect(await gamePage.texts(SCENE.title)).toContain(copy.continue);

      await gamePage.clickText(SCENE.title, copy.continue);
      await gamePage.waitForScene(SCENE.worldMap);
      expect(await gamePage.selectedNode()).toBe("2");
      expect(await gamePage.startEnabled()).toBe(true);

      await gamePage.press("ArrowLeft");
      const card = await gamePage.mapCard();
      expect(card.title).toBe(copy.levelN(1));
      expect(card.best).toMatch(new RegExp(`^${copy.best} \\d+:\\d{2}$`));
    },
  );
});
