import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { saveWith } from "@/data/test-data";

// FR-13: the pause overlay, its three ways out, and what a pause does to time and held input.

test.describe("pause", () => {
  test("Esc mở màn tạm dừng, đồng hồ đứng yên", { tag: ["@TC-PAUSE-001", "@smoke", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.press("Escape");
    await gamePage.waitForActive(SCENE.pause);

    expect(await gamePage.texts(SCENE.pause)).toEqual(
      expect.arrayContaining([copy.paused, copy.resume, copy.retry, copy.map]),
    );
    expect(await gamePage.isPaused(SCENE.game)).toBe(true);
    const frozen = (await gamePage.state()).elapsedMs;
    await gamePage.frames(30);
    expect((await gamePage.state()).elapsedMs).toBe(frozen);
  });

  test("P cũng mở màn tạm dừng", { tag: ["@TC-PAUSE-002", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.press("p");
    await gamePage.waitForActive(SCENE.pause);
    expect(await gamePage.isPaused(SCENE.game)).toBe(true);
  });

  test(
    "RESUME và Esc lần hai trở lại màn, đồng hồ chạy tiếp không reset",
    { tag: ["@TC-PAUSE-003", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await expect.poll(async () => (await gamePage.state()).elapsedMs).toBeGreaterThan(300);
      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.pause);
      const paused = (await gamePage.state()).elapsedMs;

      await gamePage.clickText(SCENE.pause, copy.resume);
      await gamePage.waitForActive(SCENE.game);
      expect(await gamePage.isActive(SCENE.pause)).toBe(false);
      expect((await gamePage.state()).elapsedMs).toBeGreaterThanOrEqual(paused);
      await expect.poll(async () => (await gamePage.state()).elapsedMs).toBeGreaterThan(paused);

      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.pause);
      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.game);
      expect(await gamePage.isActive(SCENE.pause)).toBe(false);
    },
  );

  test("RETRY chơi lại màn từ đầu", { tag: ["@TC-PAUSE-004", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.takeCoin();
    await expect.poll(async () => (await gamePage.state()).elapsedMs).toBeGreaterThan(1000);
    await gamePage.press("Escape");
    await gamePage.waitForActive(SCENE.pause);
    const paused = (await gamePage.state()).elapsedMs;

    await gamePage.clickText(SCENE.pause, copy.retry);
    await gamePage.waitForActive(SCENE.game);
    await gamePage.waitForActive(SCENE.hud);
    const state = await gamePage.state();
    expect(state.levelId).toBe("1");
    expect(state.elapsedMs).toBeLessThan(paused);
    expect(state.coins).toBe(0);
    expect(state.hearts).toBe(3);
    expect(await gamePage.isActive(SCENE.pause)).toBe(false);
  });

  test("MAP thoát về bản đồ, màn vừa chơi được chọn", { tag: ["@TC-PAUSE-005", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.seedSave(saveWith({ "1": {}, "2": {} }));
    await gamePage.goto();
    await gamePage.startLevel("3");
    await gamePage.press("Escape");
    await gamePage.waitForActive(SCENE.pause);

    await gamePage.clickText(SCENE.pause, copy.map);
    await gamePage.waitForScene(SCENE.worldMap);
    expect(await gamePage.selectedNode()).toBe("3");
    expect(await gamePage.isActive(SCENE.game)).toBe(false);
    expect(await gamePage.isActive(SCENE.hud)).toBe(false);
  });

  test("nút Pause trên HUD mở màn tạm dừng bằng chuột", { tag: ["@TC-PAUSE-006", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.clickIcon(SCENE.hud, copy.icon.pause);
    await gamePage.waitForActive(SCENE.pause);
    expect(await gamePage.isPaused(SCENE.game)).toBe(true);
  });

  test(
    "thả phím hướng trong lúc tạm dừng thì sau RESUME nhân vật không tự chạy",
    { tag: ["@TC-PAUSE-007", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.waitUntilGrounded();

      const start = (await gamePage.state()).x;
      await page.keyboard.down("ArrowRight");
      await expect.poll(async () => (await gamePage.state()).x).toBeGreaterThan(start + 4);
      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.pause);
      await page.keyboard.up("ArrowRight");
      await gamePage.frames(5);

      await gamePage.clickText(SCENE.pause, copy.resume);
      await gamePage.waitForActive(SCENE.game);
      await gamePage.frames(10);
      const resumed = await gamePage.state();
      expect(resumed.snapshot.right, "right still held after resume").toBe(false);
      await gamePage.frames(30);
      // Sliding to a stop is allowed; running on is not.
      expect((await gamePage.state()).x - resumed.x).toBeLessThan(8);
    },
  );
});
