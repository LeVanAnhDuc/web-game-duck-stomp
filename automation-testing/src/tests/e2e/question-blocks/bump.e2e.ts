import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { allCleared } from "@/data/test-data";

// FR-10: a block hit from below gives a coin or a power-up, once. The player is put on the ground right under the
// block and jumps (decisions/question-blocks.md Q1).

// Standing height of the player on the ground band (row 8 centre; client/scripts/make-level.mjs).
const STAND_Y = 136;

async function enter(gamePage: GamePage, level: string): Promise<void> {
  await gamePage.seedSave(allCleared());
  await gamePage.goto();
  await gamePage.startLevel(level);
  // Before anything else: walkers patrol towards the spawn point.
  await gamePage.removeEnemies();
  await gamePage.waitUntilGrounded();
  await gamePage.recordEvents();
}

const bumps = async (gamePage: GamePage) => (await gamePage.events()).filter((e) => e.name === "blockBumped").length;

/**
 * Stands under the block and makes one full jump (jump control held 30 game steps, GamePage.jumpRise). The real jump
 * key is proven by TC-LEVELPLAY-005; driven from outside, a held key on a loaded machine sometimes never produced a
 * jump inside the wait, which made this case about the transport instead of the block.
 */
async function jumpUnder(gamePage: GamePage, x: number): Promise<void> {
  await gamePage.teleport(x, STAND_Y);
  await gamePage.waitUntilGrounded();
  await gamePage.jumpRise(30);
  await gamePage.waitUntilGrounded();
}

test.describe("question blocks", () => {
  test(
    "đội khối \"?\" từ dưới: được đúng 1 xu, đội lần nữa không được thêm",
    { tag: ["@TC-QUESTIONBLOCKS-001", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await enter(gamePage, "2");
      const block = (await gamePage.questionBlocks()).find((b) => b.gives === "coin")!;
      const total = (await gamePage.state()).totalCoins;

      await jumpUnder(gamePage, block.x);
      expect(await bumps(gamePage)).toBe(1);
      expect((await gamePage.questionBlocks()).find((b) => b.x === block.x)!.spent).toBe(true);
      expect((await gamePage.state()).coins).toBe(1);
      expect((await gamePage.hud()).coins).toBe(`1/${total}`);

      await jumpUnder(gamePage, block.x);
      const names = (await gamePage.events()).map((e) => e.name);
      expect(names.filter((n) => n === "blockBumped")).toHaveLength(1);
      expect(names.filter((n) => n === "coinCollected")).toHaveLength(1);
      expect((await gamePage.hud()).coins).toBe(`1/${total}`);
    },
  );

  test(
    "đội khối \"!\" từ dưới: một cây nấm hiện ngay trên khối, khối hết",
    { tag: ["@TC-QUESTIONBLOCKS-002", "@dev-build"] },
    async ({ gamePage }) => {
      await enter(gamePage, "3");
      const block = (await gamePage.questionBlocks()).find((b) => b.gives === "powerUp")!;
      expect(await gamePage.powerUps()).toEqual([]);

      await jumpUnder(gamePage, block.x);
      expect(await bumps(gamePage)).toBe(1);
      expect((await gamePage.questionBlocks()).find((b) => b.x === block.x)!.spent).toBe(true);
      // One tile (16 px) above the block, same column.
      expect(await gamePage.powerUps()).toEqual([{ x: block.x, y: block.y - 16 }]);
      expect((await gamePage.state()).coins).toBe(0);
    },
  );
});
