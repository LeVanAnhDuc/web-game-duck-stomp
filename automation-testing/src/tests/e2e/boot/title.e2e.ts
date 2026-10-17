import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { DRIVER_NOISE, FONT_HOSTS, saveWith } from "@/data/test-data";

// The title screen and the way in (FR-01). What is NOT asserted here: jump heights, collisions, completing a level by
// playing — those depend on frame timing and live in client/src/core/movement.test.ts (docs/specs/core-game §9).

test.describe("title", () => {
  test("mở link tới thẳng màn Title", { tag: ["@TC-BOOT-001", "@smoke"] }, async ({ gamePage, page }) => {
    await gamePage.goto();
    await expect(page).toHaveTitle(copy.appName);
    await expect(gamePage.canvas).toHaveCount(1);
    expect(await gamePage.scene()).toBe(SCENE.title);
  });

  test("máy mới chỉ có PLAY, không có CONTINUE", { tag: ["@TC-BOOT-002", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    const texts = await gamePage.texts(SCENE.title);
    expect(texts).toContain(copy.titleLogo);
    expect(texts).toContain(copy.play);
    expect(texts).not.toContain(copy.continue);
  });

  test(
    "đã xong màn 1 và 2 thì CONTINUE mở bản đồ ở màn 3",
    { tag: ["@TC-BOOT-003", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.seedSave(saveWith({ "1": {}, "2": {} }));
      await gamePage.goto();
      const texts = await gamePage.texts(SCENE.title);
      expect(texts).toEqual(expect.arrayContaining([copy.play, copy.continue]));

      await gamePage.clickText(SCENE.title, copy.continue);
      await gamePage.waitForScene(SCENE.worldMap);
      expect(await gamePage.selectedNode()).toBe("3");
    },
  );

  test(
    "hai lần Enter từ Title là đang chơi màn 1",
    { tag: ["@TC-BOOT-004", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.worldMap);
      expect(await gamePage.selectedNode()).toBe("1");

      await gamePage.press("Enter");
      await gamePage.waitForActive(SCENE.game);
      await gamePage.waitForActive(SCENE.hud);
      const state = await gamePage.state();
      expect(state.levelId).toBe("1");
      expect(state.totalCoins).toBeGreaterThan(0);
      expect(state.x).toBeGreaterThan(0);
    },
  );

  test("từ lúc mở tới lúc vào màn 1, console im lặng", { tag: ["@TC-BOOT-007"] }, async ({ gamePage, page }) => {
    const noise: string[] = [];
    page.on("console", (message) => {
      const type = message.type();
      if (type !== "error" && type !== "warning") return;
      if (DRIVER_NOISE.test(message.text())) return;
      noise.push(`${type}: ${message.text()}`);
    });
    page.on("pageerror", (error) => noise.push(`pageerror: ${error.message}`));

    await gamePage.goto();
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.game);
    await gamePage.frames(30);
    expect(noise, `console was not quiet:\n${noise.join("\n")}`).toEqual([]);
  });

  test("Google Fonts bị chặn vẫn vào chơi được", { tag: ["@TC-BOOT-008"] }, async ({ gamePage, page }) => {
    for (const host of FONT_HOSTS) await page.route(`${host}/**`, (route) => route.abort());
    await gamePage.goto();
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.game);
  });
});
