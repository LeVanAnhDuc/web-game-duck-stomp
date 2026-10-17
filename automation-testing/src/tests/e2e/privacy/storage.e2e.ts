import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { SAVE_KEY } from "@/data/test-data";

// NFR-DATA-01: no PII, no analytics, no cookie, no device id — the save is the only thing written to the device.

test.describe("what the game writes to the device", () => {
  test(
    "chơi trọn màn 1: không cookie, chỉ một khoá localStorage, sessionStorage trống",
    { tag: ["@TC-PRIVACY-001", "@smoke", "@dev-build"] },
    async ({ gamePage, page, context }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.takeCoin();
      await gamePage.reachGoal();

      expect(await context.cookies()).toEqual([]);
      const stored = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));
      expect(stored.local).toEqual([SAVE_KEY]);
      expect(stored.session).toEqual([]);
    },
  );

  test("save chỉ có version, levels và muted", { tag: ["@TC-PRIVACY-002", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.reachGoal();

    const save = (await gamePage.readSave())!;
    expect(Object.keys(save).sort()).toEqual(["levels", "muted", "version"]);
    for (const record of Object.values(save.levels)) {
      expect(Object.keys(record).sort()).toEqual(["bestTimeMs", "cleared", "coins"]);
    }
  });
});
