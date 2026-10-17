import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { saveWith } from "@/data/test-data";

// Moving around the map by keyboard and by mouse (README §Controls "Menus").

test.describe("map navigation", () => {
  test("← / → và A / D đổi node, đi vòng 6 → 1", { tag: ["@TC-WORLDMAP-005", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
    expect(await gamePage.selectedNode()).toBe("1");

    await gamePage.press("ArrowLeft");
    expect(await gamePage.selectedNode()).toBe("6");
    await gamePage.press("ArrowRight");
    expect(await gamePage.selectedNode()).toBe("1");
    await gamePage.press("d");
    expect(await gamePage.selectedNode()).toBe("2");
    await gamePage.press("a");
    expect(await gamePage.selectedNode()).toBe("1");
  });

  test("Space vào màn đang mở như Enter", { tag: ["@TC-WORLDMAP-006", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.seedSave(saveWith({ "1": {} }));
    await gamePage.goto();
    await gamePage.clickText(SCENE.title, copy.play);
    await gamePage.waitForScene(SCENE.worldMap);
    await gamePage.press("ArrowRight");
    await gamePage.press("Space");
    await gamePage.waitForActive(SCENE.game);
    expect((await gamePage.state()).levelId).toBe("2");
  });

  test("bấm node chỉ chọn; bấm START mới vào màn", { tag: ["@TC-WORLDMAP-007", "@dev-build"] }, async ({ gamePage, page }) => {
    await gamePage.seedSave(saveWith({ "1": {} }));
    await gamePage.goto();
    await gamePage.clickText(SCENE.title, copy.play);
    await gamePage.waitForScene(SCENE.worldMap);

    const node2 = (await gamePage.mapNodes())[1]!;
    await page.mouse.click(node2.x, node2.y);
    await page.mouse.click(node2.x, node2.y);
    await gamePage.frames(20);
    expect(await gamePage.scene()).toBe(SCENE.worldMap);
    expect(await gamePage.selectedNode()).toBe("2");

    await gamePage.clickText(SCENE.worldMap, copy.start);
    await gamePage.waitForActive(SCENE.game);
    expect((await gamePage.state()).levelId).toBe("2");
  });
});
