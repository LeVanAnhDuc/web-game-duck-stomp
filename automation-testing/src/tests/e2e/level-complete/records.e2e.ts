import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { saveWith } from "@/data/test-data";

// US-02: a replay can only improve a record — best time keeps the minimum, coins keep the maximum, and NEW BEST shows
// only when the time was actually beaten. Prior records are planted in the game's own save (decisions Q2).

test.describe("records", () => {
  test(
    "về đích nhanh hơn kỷ lục: NEW BEST và kỷ lục ghi đè",
    { tag: ["@TC-LEVELCOMPLETE-002", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.seedSave(saveWith({ "1": { bestTimeMs: 999_000, coins: 0 } }));
      await gamePage.goto();
      await gamePage.startLevel("1");
      await gamePage.reachGoal();
      expect(await gamePage.texts(SCENE.levelComplete)).toContain(copy.newBest);
      const best = (await gamePage.readSave())?.levels["1"]?.bestTimeMs;
      expect(best).toBeLessThan(999_000);
    },
  );

  test(
    "về đích chậm hơn kỷ lục: không NEW BEST, kỷ lục cũ giữ nguyên",
    { tag: ["@TC-LEVELCOMPLETE-003", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.seedSave(saveWith({ "1": { bestTimeMs: 1, coins: 0 } }));
      await gamePage.goto();
      await gamePage.startLevel("1");
      await gamePage.reachGoal();
      const texts = await gamePage.texts(SCENE.levelComplete);
      expect(texts).toContain(copy.clearN(1));
      expect(texts).not.toContain(copy.newBest);
      expect((await gamePage.readSave())?.levels["1"]?.bestTimeMs).toBe(1);
    },
  );

  test(
    "chơi lại lấy ít xu hơn không làm tụt số xu đã lưu",
    { tag: ["@TC-LEVELCOMPLETE-004", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.seedSave(saveWith({ "1": { bestTimeMs: 60_000, coins: 5 } }));
      await gamePage.goto();
      await gamePage.startLevel("1");
      const { totalCoins } = await gamePage.state();
      await gamePage.reachGoal();
      expect(await gamePage.texts(SCENE.levelComplete)).toContain(`0/${totalCoins}`);
      expect((await gamePage.readSave())?.levels["1"]?.coins).toBe(5);
    },
  );
});
