import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { DRIVER_NOISE } from "@/data/test-data";

// NFR-REL-05: with storage refused the game is fully playable, it just forgets between visits.

test.describe("storage refused", () => {
  test(
    "localStorage bị chặn: chơi hết một màn và đi tiếp màn kế",
    { tag: ["@TC-SAVE-005", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      const problems = gamePage.collectProblems(DRIVER_NOISE);
      await gamePage.blockLocalStorage();
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.reachGoal();
      expect(await gamePage.texts(SCENE.levelComplete)).toEqual(expect.arrayContaining([copy.clearN(1), copy.newBest]));

      await gamePage.press("Enter");
      await expect.poll(async () => (await gamePage.isActive(SCENE.game)) && (await gamePage.state()).levelId).toBe("2");
      expect(problems, problems.join("\n")).toEqual([]);
    },
  );
});
