import { test, expect } from "@/fixtures";
import { allCleared } from "@/data/test-data";

// FR-07 first half: the power-up a "!" block releases turns the player into the powered form, and the first hit takes
// it away instead of a heart (design.md §2). Played for real from the block of level 3, not seeded (decisions Q1).

const STAND_Y = 136;

test.describe("power-up", () => {
  test(
    "ăn nấm thì sang dạng mạnh; trúng đòn thì mất nấm, tim không đổi",
    { tag: ["@TC-POWERUP-001", "@TC-POWERUP-002", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.seedSave(allCleared());
      await gamePage.goto();
      await gamePage.startLevel("3");
      await gamePage.keepOnlyEnemy("walker", 0);
      await gamePage.waitUntilGrounded();
      await gamePage.recordEvents();
      expect(await gamePage.playerLook()).toBe("player");

      const block = (await gamePage.questionBlocks()).find((b) => b.gives === "powerUp")!;
      await gamePage.teleport(block.x, STAND_Y);
      await gamePage.waitUntilGrounded();
      await gamePage.jumpRise(30);
      expect(await gamePage.powerUps()).toHaveLength(1);

      const mushroom = (await gamePage.powerUps())[0]!;
      await gamePage.teleport(mushroom.x, mushroom.y);
      await expect.poll(async () => (await gamePage.state()).powered).toBe(true);
      expect(await gamePage.playerLook()).toBe("player-powered");
      expect(await gamePage.powerUps()).toEqual([]);
      expect((await gamePage.events()).map((e) => e.name)).toContain("powerUpTaken");

      // A walker's flank: the first hit costs the mushroom, not a heart.
      await gamePage.waitUntilGrounded();
      const walker = (await gamePage.enemies())[0]!;
      const spawn = (await gamePage.levelObjects("spawn"))[0]!;
      await gamePage.brush(walker.x - 10, walker.y, spawn);
      await expect.poll(async () => (await gamePage.state()).powered).toBe(false);
      expect(await gamePage.playerLook()).toBe("player");
      expect((await gamePage.state()).hearts).toBe(3);
      const names = (await gamePage.events()).map((e) => e.name);
      expect(names).toContain("powerUpLost");
      expect(names).not.toContain("playerHit");
    },
  );
});
