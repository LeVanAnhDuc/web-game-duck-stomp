import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { saveWith } from "@/data/test-data";

// FR-06 + the damage order of docs/specs/core-game/design.md §2, on the static spikes of level 4 (decisions Q2).

// TUNING.invulnMs (client/src/core/tuning.ts) is 900 ms of real game time after a hit.
const INVULN_MS = 900;

test.describe("damage", () => {
  test.beforeEach(async ({ gamePage }) => {
    await gamePage.seedSave(saveWith({ "1": {}, "2": {}, "3": {} }));
    await gamePage.goto();
    await gamePage.startLevel("4");
    await gamePage.waitUntilGrounded();
    // Level 4's walker patrols towards the spawn point; left in, it decides some runs instead of the spikes.
    await gamePage.removeEnemies();
    await gamePage.recordEvents();
  });

  test("chạm gai mất đúng một tim, rồi bất tử một lúc", { tag: ["@TC-HEALTH-001", "@smoke", "@dev-build"] }, async ({ gamePage }) => {
    const spikes = (await gamePage.levelObjects("spikes"))[0]!;
    const spawn = (await gamePage.levelObjects("spawn"))[0]!;
    await gamePage.teleport(spikes.x, spikes.y);
    await expect.poll(async () => (await gamePage.events()).some((e) => e.name === "playerHit")).toBe(true);
    // Back to safe ground at once: the knock-back can drop the player onto the spikes again once the window ends.
    await gamePage.teleport(spawn.x, spawn.y);
    const first = (await gamePage.events()).filter((e) => e.name === "playerHit");
    expect(first[0]!.payload).toEqual({ hearts: 2 });
    if (first.length === 1) await expect.poll(async () => (await gamePage.hud()).hearts).toBe(2);

    // Keep standing on the spikes: a further hit may only land once the invulnerability window has passed, measured
    // on the game's own clock (a loaded machine stretches real time between frames, not game time).
    await gamePage.standOn(spikes.x, spikes.y, 20);
    const events = await gamePage.events();
    const diedAt = events.findIndex((e) => e.name === "playerDied");
    const hits = (diedAt === -1 ? events : events.slice(0, diedAt)).filter((e) => e.name === "playerHit");
    for (let i = 1; i < hits.length; i += 1) {
      expect(hits[i]!.gameTime - hits[i - 1]!.gameTime).toBeGreaterThanOrEqual(INVULN_MS);
    }
  });

  test(
    "mất tim cuối thì hồi sinh ngay ở điểm xuất phát với đủ ba tim",
    { tag: ["@TC-HEALTH-002", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      const spikes = (await gamePage.levelObjects("spikes"))[0]!;
      const spawn = (await gamePage.levelObjects("spawn"))[0]!;

      // Stand on the spikes until the third hit kills. Each hit starts INVULN_MS of game-time invulnerability and
      // knocks the player back, so the page re-places the player every frame until the death (GamePage.standOn).
      const hits = async () => (await gamePage.events()).filter((e) => e.name === "playerHit").length;
      await gamePage.standOn(spikes.x, spikes.y, 600);
      const dump = async () => JSON.stringify((await gamePage.events()).map((e) => [e.name, e.payload, Math.round(e.gameTime)]));
      expect(await hits(), await dump()).toBe(3);
      const times = (await gamePage.events()).filter((e) => e.name === "playerHit").map((e) => e.gameTime);
      // No hit inside the previous one's invulnerability window (game clock).
      expect(times[1]! - times[0]!).toBeGreaterThanOrEqual(INVULN_MS);
      expect(times[2]! - times[1]!).toBeGreaterThanOrEqual(INVULN_MS);

      const events = await gamePage.events();
      const died = events.find((e) => e.name === "playerDied");
      const respawned = events.find((e) => e.name === "playerRespawned");
      expect(died).toBeDefined();
      expect(respawned?.payload).toEqual({ hearts: 3 });
      expect(respawned!.at - died!.at).toBeLessThan(1000);

      const state = await gamePage.state();
      expect(state.hearts, await dump()).toBe(3);
      expect(state.respawnX).toBe(spawn.x);
      expect(state.respawnY).toBe(spawn.y);
      expect((await gamePage.hud()).hearts).toBe(3);
      expect(await gamePage.scene()).toBe(SCENE.game);
      expect(await gamePage.isActive(SCENE.pause)).toBe(false);
      expect(await gamePage.isActive(SCENE.levelComplete)).toBe(false);
    },
  );

  test("dạng mạnh trúng đòn mất nấm, tim không đổi", { tag: ["@TC-HEALTH-006", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.setPowered(true);
    const spikes = (await gamePage.levelObjects("spikes"))[0]!;
    await gamePage.teleport(spikes.x, spikes.y);
    await expect.poll(async () => (await gamePage.state()).powered).toBe(false);
    expect((await gamePage.state()).hearts).toBe(3);
    const names = (await gamePage.events()).map((e) => e.name);
    expect(names).toContain("powerUpLost");
    expect(names).not.toContain("playerHit");
  });
});
