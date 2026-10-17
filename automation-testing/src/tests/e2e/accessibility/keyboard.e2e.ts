import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";

// NFR-A11Y-02: every screen outside gameplay works without a mouse or a finger, and focus is always visible.

test.describe("keyboard menus", () => {
  test(
    "mỗi menu mở ra đã có đúng một nút có vòng focus",
    { tag: ["@TC-ACCESSIBILITY-001", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      expect(await gamePage.focusedButtons(SCENE.title)).toEqual([copy.play]);

      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.pause);
      expect(await gamePage.focusedButtons(SCENE.pause)).toEqual([copy.resume]);
      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.game);

      await gamePage.reachGoal();
      expect(await gamePage.focusedButtons(SCENE.levelComplete)).toEqual([copy.nextN(2)]);
    },
  );

  test(
    "mũi tên và Tab chuyển focus theo vòng, Space kích hoạt nút đang focus",
    { tag: ["@TC-ACCESSIBILITY-002", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.pause);

      const steps: Array<[string, string]> = [
        ["ArrowDown", copy.retry],
        ["Tab", copy.map],
        ["Tab", copy.resume],
        ["ArrowUp", copy.map],
        ["ArrowRight", copy.resume],
      ];
      for (const [key, focused] of steps) {
        await gamePage.press(key);
        expect(await gamePage.focusedButtons(SCENE.pause), `after ${key}`).toEqual([focused]);
      }

      await gamePage.press("Space");
      await gamePage.waitForActive(SCENE.game);
      expect(await gamePage.isActive(SCENE.pause)).toBe(false);
    },
  );
});
