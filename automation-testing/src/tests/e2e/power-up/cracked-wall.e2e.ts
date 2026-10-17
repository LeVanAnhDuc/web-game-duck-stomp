import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { allCleared } from "@/data/test-data";

// FR-07 second half + US-05, on the cracked wall of level 3 (two blocks stacked at column 56, two hidden coins right
// behind it). Breaking needs the powered form AND either full speed sideways or a fall from above (design.md §3).
// The powered form is seeded here with setPowered; taking it for real is TC-POWERUP-001 (decisions/power-up.md Q2).

const STAND_Y = 136;
const PUSH_MS = 1_500;

type Cell = { x: number; y: number };

async function enter(gamePage: GamePage, powered: boolean): Promise<{ low: Cell; high: Cell }> {
  await gamePage.seedSave(allCleared());
  await gamePage.goto();
  await gamePage.startLevel("3");
  // Before anything else: walkers patrol towards the spawn point.
  await gamePage.removeEnemies();
  await gamePage.waitUntilGrounded();
  if (powered) await gamePage.setPowered(true);
  await gamePage.recordEvents();
  const blocks = (await gamePage.crackedBlocks()).sort((a, b) => b.y - a.y);
  return { low: blocks[0]!, high: blocks[1]! };
}

const blockEvents = async (gamePage: GamePage) =>
  (await gamePage.events()).map((e) => e.name).filter((n) => n === "blockBroken" || n === "blockThudded");

const solidAt = async (gamePage: GamePage, at: Cell) =>
  // A thud shudders the block 1.5 px sideways for ~180 ms, so the match is by cell, not exact pixel.
  (await gamePage.crackedBlocks()).some((b) => b.solid && Math.abs(b.x - at.x) < 4 && Math.abs(b.y - at.y) < 4);

/** Holds → for `ms` of real time. */
async function pushRight(gamePage: GamePage, ms: number): Promise<void> {
  const start = await gamePage.now();
  await gamePage.holdUntil("ArrowRight", async () => (await gamePage.now()) - start > ms, ms + 5_000);
}

test.describe("cracked walls", () => {
  test(
    "dạng mạnh chạy đủ đà đâm vào tường nứt: tường vỡ, khoang xu giấu phía sau mở ra",
    { tag: ["@TC-POWERUP-003", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      const { low } = await enter(gamePage, true);
      const hidden = (await gamePage.levelObjects("coinHidden")).filter((c) => c.x > low.x && c.y === low.y);
      expect(hidden.length).toBeGreaterThan(0);

      // Six tiles of run-up: breakSpeed (90 px/s) is reached in about one tile.
      await gamePage.teleport(low.x - 16 * 6, STAND_Y);
      await gamePage.waitUntilGrounded();
      const farthest = Math.max(...hidden.map((c) => c.x));
      await gamePage.holdUntil("ArrowRight", async () => (await gamePage.state()).x > farthest + 8, 5_000);

      expect(await blockEvents(gamePage)).toEqual(["blockBroken"]);
      expect(await solidAt(gamePage, low)).toBe(false);
      const state = await gamePage.state();
      expect(state.coins).toBe(hidden.length);
      expect((await gamePage.hud()).coins).toBe(`${hidden.length}/${state.totalCoins}`);
    },
  );

  test(
    "dạng mạnh bước chậm tới tường: tường rung \"chưa đủ nhanh\", không vỡ",
    { tag: ["@TC-POWERUP-004", "@dev-build"] },
    async ({ gamePage }) => {
      const { low } = await enter(gamePage, true);
      // 3 px from the wall: the player reaches it at walking pace, far below breakSpeed.
      await gamePage.teleport(low.x - 16, STAND_Y);
      await gamePage.waitUntilGrounded();
      await gamePage.holdUntil("ArrowRight", async () => (await blockEvents(gamePage)).length > 0, 3_000);

      // The first contact is a thud, not a break. (Keeping the key down after it is TC-POWERUP-005.)
      expect((await blockEvents(gamePage))[0]).toBe("blockThudded");
    },
  );

  test(
    "dạng mạnh đứng tì vào tường giữ hướng chạy: tường vẫn không vỡ",
    { tag: ["@TC-POWERUP-005", "@dev-build"] },
    async ({ gamePage }) => {
      // BUG: defects/power-up.md#bug-powerup-01
      test.fail();
      const { low } = await enter(gamePage, true);
      await gamePage.teleport(low.x - 16, STAND_Y);
      await gamePage.waitUntilGrounded();
      await pushRight(gamePage, PUSH_MS);

      // Leaning on the wall the whole time: never moving at speed, so the wall must stand.
      expect(await blockEvents(gamePage)).not.toContain("blockBroken");
      expect(await solidAt(gamePage, low)).toBe(true);
      expect((await gamePage.state()).x).toBeLessThan(low.x - 8);
    },
  );

  test(
    "dạng thường chạy đủ đà đâm vào tường: tường là tường, không rung không vỡ",
    { tag: ["@TC-POWERUP-006", "@dev-build"] },
    async ({ gamePage }) => {
      const { low } = await enter(gamePage, false);
      await gamePage.teleport(low.x - 16 * 6, STAND_Y);
      await gamePage.waitUntilGrounded();
      await pushRight(gamePage, PUSH_MS);

      expect(await blockEvents(gamePage)).toEqual([]);
      expect(await solidAt(gamePage, low)).toBe(true);
      const state = await gamePage.state();
      expect(state.x).toBeLessThan(low.x - 8);
      expect(state.coins).toBe(0);
    },
  );

  test(
    "rơi từ trên xuống khối nứt: dạng thường đứng lên được, dạng mạnh làm vỡ",
    { tag: ["@TC-POWERUP-007", "@dev-build"] },
    async ({ gamePage }) => {
      const { high } = await enter(gamePage, false);
      // Block centre-origin, 16 px: its top edge is y - 8.
      await gamePage.dropOnto(high.x, high.y - 8);
      await gamePage.waitUntilGrounded();
      expect(await blockEvents(gamePage)).toEqual([]);
      expect(await solidAt(gamePage, high)).toBe(true);
      expect((await gamePage.state()).y).toBeLessThan(high.y - 8);

      await gamePage.setPowered(true);
      await gamePage.dropOnto(high.x, high.y - 8, 24);
      await expect.poll(() => blockEvents(gamePage)).toContain("blockBroken");
      expect(await solidAt(gamePage, high)).toBe(false);
    },
  );
});
