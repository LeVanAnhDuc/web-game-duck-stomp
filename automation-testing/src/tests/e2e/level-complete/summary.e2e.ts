import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { allCleared } from "@/data/test-data";

// FR-12: the level-clear card and where its three buttons lead. Reaching the flag is physics; the player is put on
// it (decisions/level-complete.md Q1).

const mss = (ms: number) => `${Math.floor(ms / 60_000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;

test.describe("level-clear card", () => {
  test(
    "chạm cờ đích màn 1 lần đầu: bảng tổng kết có NEW BEST, máy lưu kết quả",
    { tag: ["@TC-LEVELCOMPLETE-001", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.recordEvents();
      await gamePage.takeCoin();
      await gamePage.reachGoal();

      const completed = (await gamePage.events()).find((e) => e.name === "levelCompleted")!;
      const { timeMs, totalCoins } = completed.payload as { timeMs: number; totalCoins: number };
      const texts = await gamePage.texts(SCENE.levelComplete);
      expect(texts).toEqual(
        expect.arrayContaining([copy.clearN(1), copy.time, mss(timeMs), copy.coins, `1/${totalCoins}`, copy.newBest]),
      );
      expect(await gamePage.isPaused(SCENE.game)).toBe(true);

      const save = await gamePage.readSave();
      expect(save?.levels["1"]).toEqual({ cleared: true, bestTimeMs: timeMs, coins: 1 });
    },
  );

  test(
    "nút màn kế được chọn sẵn: Enter vào thẳng màn 2",
    { tag: ["@TC-LEVELCOMPLETE-005", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.reachGoal();
      expect(await gamePage.texts(SCENE.levelComplete)).toEqual(
        expect.arrayContaining([copy.retry, copy.map, copy.nextN(2)]),
      );

      await gamePage.press("Enter");
      await expect.poll(async () => (await gamePage.isActive(SCENE.game)) && (await gamePage.state()).levelId).toBe("2");
      expect(await gamePage.isActive(SCENE.levelComplete)).toBe(false);
      expect((await gamePage.state()).coins).toBe(0);
    },
  );

  test("RETRY chơi lại màn từ 0:00", { tag: ["@TC-LEVELCOMPLETE-006", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await expect.poll(async () => (await gamePage.state()).elapsedMs).toBeGreaterThan(500);
    await gamePage.takeCoin();
    await gamePage.reachGoal();
    const finishedAt = (await gamePage.state()).elapsedMs;

    await gamePage.clickText(SCENE.levelComplete, copy.retry);
    await gamePage.waitForActive(SCENE.game);
    await gamePage.waitForActive(SCENE.hud);
    const state = await gamePage.state();
    expect(state.levelId).toBe("1");
    expect(state.finished).toBe(false);
    expect(state.elapsedMs).toBeLessThan(finishedAt);
    expect(state.coins).toBe(0);
    expect(state.hearts).toBe(3);
  });

  test("lần đầu xong màn 1, MAP chọn sẵn màn 2 vừa mở", { tag: ["@TC-LEVELCOMPLETE-007", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.reachGoal();

    await gamePage.clickText(SCENE.levelComplete, copy.map);
    await gamePage.waitForScene(SCENE.worldMap);
    expect(await gamePage.selectedNode()).toBe("2");
    expect(await gamePage.startEnabled()).toBe(true);
    expect(await gamePage.isActive(SCENE.game)).toBe(false);
  });

  test("màn 6 không có nút màn kế", { tag: ["@TC-LEVELCOMPLETE-008", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.seedSave(allCleared());
    await gamePage.goto();
    await gamePage.startLevel("6");
    await gamePage.reachGoal();
    const texts = await gamePage.texts(SCENE.levelComplete);
    expect(texts).toEqual(expect.arrayContaining([copy.clearN(6), copy.retry, copy.map]));
    expect(texts).not.toContain(copy.nextN(7));
  });
});
