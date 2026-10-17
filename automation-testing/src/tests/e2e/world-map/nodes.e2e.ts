import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { saveWith } from "@/data/test-data";

// FR-02: six nodes, strictly sequential unlocking, and the locked node that is selectable but refuses (ADR-0011).

test.describe("map nodes", () => {
  test(
    "máy mới: màn 1 mở, năm màn còn lại khoá",
    { tag: ["@TC-WORLDMAP-001", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.worldMap);

      expect(await gamePage.mapNodes()).toHaveLength(6);
      const card = await gamePage.mapCard();
      expect(card).toMatchObject({ title: copy.levelN(1), best: `${copy.best} --`, totalCoins: "0" });
      expect(await gamePage.startEnabled()).toBe(true);

      for (const id of ["2", "3", "4", "5", "6"]) {
        await gamePage.press("ArrowRight");
        expect(await gamePage.selectedNode()).toBe(id);
        expect(await gamePage.mapCard()).toMatchObject({ title: copy.levelN(id), best: copy.locked });
        expect(await gamePage.startEnabled(), `START on locked level ${id}`).toBe(false);
      }
    },
  );

  test(
    "xong màn 1 thì màn 2 mở, thẻ màn 1 hiện kỷ lục và xu",
    { tag: ["@TC-WORLDMAP-002", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.seedSave(saveWith({ "1": { bestTimeMs: 42_300, coins: 5 } }));
      await gamePage.goto();
      await gamePage.clickText(SCENE.title, copy.play);
      await gamePage.waitForScene(SCENE.worldMap);

      expect(await gamePage.mapCard()).toMatchObject({
        title: copy.levelN(1),
        best: `${copy.best} 0:42`,
        coins: "5",
        coinIconVisible: true,
        totalCoins: "5",
      });

      await gamePage.press("ArrowRight");
      expect(await gamePage.mapCard()).toMatchObject({ title: copy.levelN(2), best: `${copy.best} --`, coins: "0" });
      expect(await gamePage.startEnabled()).toBe(true);

      await gamePage.press("ArrowRight");
      expect(await gamePage.mapCard()).toMatchObject({ title: copy.levelN(3), best: copy.locked });
      expect(await gamePage.startEnabled()).toBe(false);
    },
  );

  test(
    "save sửa tay xong màn 4 chỉ mở thêm màn 5",
    { tag: ["@TC-WORLDMAP-003", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.seedSave(saveWith({ "4": {} }));
      await gamePage.goto();
      await gamePage.clickText(SCENE.title, copy.continue);
      await gamePage.waitForScene(SCENE.worldMap);

      const open: Record<string, boolean> = {};
      for (const id of ["1", "2", "3", "4", "5", "6"]) {
        await gamePage.selectNode(id);
        open[id] = await gamePage.startEnabled();
      }
      expect(open).toEqual({ "1": true, "2": false, "3": false, "4": false, "5": true, "6": false });
    },
  );

  test(
    "node khoá: chọn được, thẻ ghi LOCKED, Enter / Space / bấm START không vào màn",
    { tag: ["@TC-WORLDMAP-004", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.worldMap);
      await gamePage.press("ArrowRight");

      const card = await gamePage.mapCard();
      expect(card).toMatchObject({ title: copy.levelN(2), best: copy.locked, coins: "", coinIconVisible: false });

      await gamePage.press("Enter");
      await gamePage.press("Space");
      await gamePage.clickText(SCENE.worldMap, copy.start);
      await gamePage.frames(20);
      expect(await gamePage.scene()).toBe(SCENE.worldMap);
      expect(await gamePage.isActive(SCENE.game)).toBe(false);
      expect(await gamePage.selectedNode()).toBe("2");
    },
  );
});
