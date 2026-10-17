import { test, expect } from "@/fixtures";
import { allCleared, LEVEL_IDS } from "@/data/test-data";
import { coinsInFile } from "@/utils/level";

// FR-04 / FR-19: six hand-designed levels, loaded from the Tiled files the site serves (NFR-GAME-04: levels are data).

test.describe("six levels", () => {
  for (const id of LEVEL_IDS) {
    test(
      `cả sáu màn nạp được, HUD khớp số xu trong file (màn ${id})`,
      { tag: ["@TC-LEVELPLAY-003", "@smoke", "@dev-build"] },
      async ({ gamePage }) => {
        await gamePage.seedSave(allCleared());
        await gamePage.goto();
        const file = await gamePage.levelFile(id);
        expect(file.status).toBe(200);
        const types = file.objects.map((o) => o.type);
        expect(types).toContain("spawn");
        expect(types).toContain("goal");

        await gamePage.startLevel(id);
        const state = await gamePage.state();
        expect(state.levelId).toBe(id);
        expect(state.totalCoins).toBe(coinsInFile(file.objects));
        expect((await gamePage.hud()).coins).toBe(`0/${coinsInFile(file.objects)}`);
      },
    );
  }
});
