import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { saveWith } from "@/data/test-data";

// NFR-I18N-04 (ASCII only: the pixel fonts have no Vietnamese tone marks, ADR-0005) and NFR-A11Y-04 (every icon-only
// button has a name — in a canvas, the Phaser object's name; decisions/accessibility.md Q3).

const nonAscii = (texts: string[]) => texts.filter((t) => [...t].some((ch) => ch.codePointAt(0)! > 127));

test.describe("drawn text and names", () => {
  test("mọi chữ game vẽ ra chỉ có ký tự ASCII", { tag: ["@TC-ACCESSIBILITY-005", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.seedSave(saveWith({ "1": { bestTimeMs: 42_000, coins: 3 } }));
    await gamePage.goto();
    const seen: string[] = [...(await gamePage.texts(SCENE.title))];

    await gamePage.clickText(SCENE.title, copy.continue);
    await gamePage.waitForScene(SCENE.worldMap);
    seen.push(...(await gamePage.texts(SCENE.worldMap)));
    await gamePage.press("ArrowLeft");
    seen.push(...(await gamePage.texts(SCENE.worldMap)));
    await gamePage.press("ArrowRight");
    await gamePage.press("Enter");
    await gamePage.waitForActive(SCENE.hud);
    seen.push(...(await gamePage.texts(SCENE.hud)));

    await gamePage.press("Escape");
    await gamePage.waitForActive(SCENE.pause);
    seen.push(...(await gamePage.texts(SCENE.pause)));
    await gamePage.press("Escape");
    await gamePage.waitForActive(SCENE.game);
    await gamePage.reachGoal();
    seen.push(...(await gamePage.texts(SCENE.levelComplete)));

    expect(seen.length).toBeGreaterThan(15);
    expect(nonAscii(seen)).toEqual([]);
  });

  test("mọi nút biểu tượng đều có tên", { tag: ["@TC-ACCESSIBILITY-006", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    expect((await gamePage.iconButtons(SCENE.title)).map((b) => b.name)).toEqual([copy.icon.soundOn]);

    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
    expect((await gamePage.iconButtons(SCENE.worldMap)).map((b) => b.name)).toEqual([copy.icon.soundOn]);

    await gamePage.press("Enter");
    await gamePage.waitForActive(SCENE.hud);
    expect((await gamePage.iconButtons(SCENE.hud)).map((b) => b.name).sort()).toEqual(
      [copy.icon.pause, copy.icon.soundOn].sort(),
    );

    await gamePage.press("Escape");
    await gamePage.waitForActive(SCENE.pause);
    expect((await gamePage.iconButtons(SCENE.pause)).map((b) => b.name)).toEqual([copy.icon.soundOn]);
  });
});
