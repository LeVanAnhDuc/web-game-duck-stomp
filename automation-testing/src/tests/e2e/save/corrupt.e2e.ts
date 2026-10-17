import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { DRIVER_NOISE, SAVE_VERSION, saveWith } from "@/data/test-data";

// NFR-REL-04 / invariants #4: a save lives on the player's machine longer than the code that wrote it, so nothing in
// it is trusted — a broken file is no file, and one broken level record is dropped on its own.

test.describe("untrusted save", () => {
  test("save hỏng bị coi như chưa có save", { tag: ["@TC-SAVE-002", "@smoke", "@dev-build"] }, async ({ gamePage }) => {
    const problems = gamePage.collectProblems(DRIVER_NOISE);
    await gamePage.seedSave("{not json");
    await gamePage.goto();

    const title = await gamePage.texts(SCENE.title);
    expect(title).toContain(copy.play);
    expect(title).not.toContain(copy.continue);

    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
    await gamePage.press("ArrowRight");
    expect((await gamePage.mapCard()).best).toBe(copy.locked);
    await gamePage.press("ArrowLeft");
    await gamePage.press("Enter");
    await gamePage.waitForActive(SCENE.game);
    expect((await gamePage.state()).levelId).toBe("1");
    expect(problems, problems.join("\n")).toEqual([]);
  });

  for (const [label, version] of [["version 2", 2], ["thiếu version", undefined]] as const) {
    test(`save của phiên bản khác bị coi như chưa có save (${label})`, { tag: ["@TC-SAVE-003", "@dev-build"] }, async ({ gamePage }) => {
      const save: Record<string, unknown> = { ...saveWith({ "1": {}, "2": {} }) };
      if (version === undefined) delete save["version"];
      else save["version"] = version;
      await gamePage.seedSave(JSON.stringify(save));
      await gamePage.goto();
      expect(await gamePage.texts(SCENE.title)).not.toContain(copy.continue);
    });
  }

  test("bản ghi hỏng của một màn bị bỏ, màn hợp lệ còn giữ", { tag: ["@TC-SAVE-004", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.seedSave(
      JSON.stringify({
        version: SAVE_VERSION,
        muted: false,
        levels: {
          "1": { cleared: true, bestTimeMs: 30_000, coins: 2 },
          "2": { cleared: true, bestTimeMs: 20_000, coins: -1 },
          "3": { cleared: true, bestTimeMs: "fast", coins: 1 },
        },
      }),
    );
    await gamePage.goto();
    await gamePage.clickText(SCENE.title, copy.continue);
    await gamePage.waitForScene(SCENE.worldMap);

    await gamePage.selectNode("1");
    expect(await gamePage.mapCard()).toMatchObject({ best: `${copy.best} 0:30`, coins: "2" });
    await gamePage.selectNode("2");
    expect(await gamePage.mapCard()).toMatchObject({ best: `${copy.best} --` });
    expect(await gamePage.startEnabled()).toBe(true);
    await gamePage.selectNode("3");
    expect((await gamePage.mapCard()).best).toBe(copy.locked);
    await gamePage.selectNode("4");
    expect((await gamePage.mapCard()).best).toBe(copy.locked);
  });
});
