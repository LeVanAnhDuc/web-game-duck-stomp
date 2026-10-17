import { test, expect } from "@/fixtures";
import type { GamePage } from "@/pages/game.page";
import { allCleared } from "@/data/test-data";

// FR-08 + design.md §2 "Đạp lên đầu địch": walker and flyer die and bounce the player; the spiker does not die and
// hurts. Only the enemy under test is kept, frozen where it stands, and the player is dropped a few pixels onto one (decisions/enemies.md Q1).

/** Starts a level with only the enemy under test left in it, frozen, and returns that enemy. */
async function enter(gamePage: GamePage, level: string, kind: string, nth = 0) {
  await gamePage.seedSave(allCleared());
  await gamePage.goto();
  await gamePage.startLevel(level);
  await gamePage.keepOnlyEnemy(kind, nth);
  await gamePage.waitUntilGrounded();
  await gamePage.recordEvents();
  return (await gamePage.enemies())[0]!;
}

const eventNames = async (gamePage: GamePage) => (await gamePage.events()).map((e) => e.name);

test.describe("stomping enemies", () => {
  test(
    "đạp lên đầu walker: walker bị hạ, nhân vật nảy lên, không mất tim",
    { tag: ["@TC-ENEMIES-001", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      // The second walker of level 2: nothing above it, so the bounce is not stopped by a block.
      const walker = await enter(gamePage, "2", "walker", 1);
      await gamePage.sampleApex();
      await gamePage.dropOnto(walker.x, walker.top);
      await expect.poll(() => eventNames(gamePage)).toContain("enemyStomped");
      const metAt = walker.top - 8;
      await gamePage.waitUntilGrounded();

      expect(await eventNames(gamePage)).not.toContain("playerHit");
      expect((await gamePage.state()).hearts).toBe(3);
      expect((await gamePage.hud()).hearts).toBe(3);
      // Bounced: went clearly higher than where it met the walker's head.
      expect(await gamePage.apex()).toBeLessThan(metAt - 8);
      const still = (await gamePage.enemies()).filter((e) => e.alive && Math.abs(e.x - walker.x) < 1);
      expect(still).toEqual([]);
    },
  );

  test("đạp lên flyer cũng hạ được nó", { tag: ["@TC-ENEMIES-002", "@dev-build"] }, async ({ gamePage }) => {
    const flyer = await enter(gamePage, "5", "flyer");
    await gamePage.dropOnto(flyer.x, flyer.top);
    await expect.poll(() => eventNames(gamePage)).toContain("enemyStomped");
    expect(await eventNames(gamePage)).not.toContain("playerHit");
    expect((await gamePage.enemies()).some((e) => e.kind === "flyer" && e.alive)).toBe(false);
  });

  test(
    "rơi lên spiker: mất một tim, spiker không chết",
    { tag: ["@TC-ENEMIES-003", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      const spiker = await enter(gamePage, "4", "spiker");
      expect(spiker.stompable).toBe(false);
      const spawn = (await gamePage.levelObjects("spawn"))[0]!;
      // Dropped from 6 px above its head, then back to the spawn point right after the contact (GamePage.brush): the
      // knock-back can land the player on it again once the invulnerability window ends.
      await gamePage.brush(spiker.x, spiker.top - 8 - 6, spawn);
      await expect.poll(() => eventNames(gamePage)).toContain("playerHit");
      expect(await eventNames(gamePage)).not.toContain("enemyStomped");
      expect((await gamePage.events()).find((e) => e.name === "playerHit")!.payload).toEqual({ hearts: 2 });
      await expect.poll(async () => (await gamePage.hud()).hearts).toBe(2);
      const alive = (await gamePage.enemies()).some((e) => e.kind === "spiker" && e.alive && Math.abs(e.x - spiker.x) < 1);
      expect(alive).toBe(true);
    },
  );

  test("chạm walker từ cạnh bên: mất một tim, walker còn sống", { tag: ["@TC-ENEMIES-004", "@dev-build"] }, async ({ gamePage }) => {
    const walker = await enter(gamePage, "2", "walker", 1);
    const spawn = (await gamePage.levelObjects("spawn"))[0]!;
    // Level with it on the ground, 2 px of overlap on its left flank (player hitbox 10 wide, walker 14); stepped back
    // to the spawn point right after the contact (GamePage.brush).
    await gamePage.brush(walker.x - 10, walker.y, spawn);
    await expect.poll(() => eventNames(gamePage)).toContain("playerHit");
    expect(await eventNames(gamePage)).not.toContain("enemyStomped");
    expect((await gamePage.state()).hearts).toBe(2);
    expect((await gamePage.enemies()).some((e) => e.alive && Math.abs(e.x - walker.x) < 1)).toBe(true);
  });
});
