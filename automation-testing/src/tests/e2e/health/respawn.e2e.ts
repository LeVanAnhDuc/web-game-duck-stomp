import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { allCleared } from "@/data/test-data";

// FR-09 pit, FR-11 checkpoint, invariants #8 (the pit bypasses hearts) and #9 (the clock never resets on respawn).

test.describe("respawn", () => {
  test("rơi xuống vực khi đủ ba tim là hồi sinh ngay", { tag: ["@TC-HEALTH-003", "@smoke", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.waitUntilGrounded();
    await gamePage.recordEvents();
    const { x: spawnX, levelHeightPx } = await gamePage.state();

    await gamePage.teleport(spawnX + 64, levelHeightPx + 60);
    await expect.poll(async () => (await gamePage.events()).some((e) => e.name === "playerRespawned")).toBe(true);

    const events = await gamePage.events();
    const died = events.find((e) => e.name === "playerDied")!;
    const respawned = events.find((e) => e.name === "playerRespawned")!;
    expect(respawned.at - died.at).toBeLessThan(1000);
    expect(respawned.payload).toEqual({ hearts: 3 });
    expect(events.filter((e) => e.name === "playerHit")).toEqual([]);

    const state = await gamePage.state();
    expect(state.hearts).toBe(3);
    expect(state.x).toBeCloseTo(state.respawnX, 0);
    expect(await gamePage.scene()).toBe(SCENE.game);
  });

  test("chết và hồi sinh không reset đồng hồ", { tag: ["@TC-HEALTH-004", "@smoke", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await expect.poll(async () => (await gamePage.state()).elapsedMs, { timeout: 10_000 }).toBeGreaterThanOrEqual(1000);
    await gamePage.recordEvents();
    const before = (await gamePage.state()).elapsedMs;
    const { levelHeightPx, x } = await gamePage.state();

    await gamePage.teleport(x, levelHeightPx + 60);
    await expect.poll(async () => (await gamePage.events()).some((e) => e.name === "playerRespawned")).toBe(true);
    const after = (await gamePage.state()).elapsedMs;
    expect(after).toBeGreaterThanOrEqual(before);
    expect((await gamePage.hud()).clock).not.toBe("0:00");
  });

  test("đã chạm checkpoint thì hồi sinh tại checkpoint", { tag: ["@TC-HEALTH-005", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.seedSave(allCleared());
    await gamePage.goto();
    await gamePage.startLevel("6");
    await gamePage.waitUntilGrounded();
    await gamePage.recordEvents();
    const checkpoint = (await gamePage.levelObjects("checkpoint"))[0]!;
    const spawn = (await gamePage.levelObjects("spawn"))[0]!;

    await gamePage.teleport(checkpoint.x, checkpoint.y);
    await expect.poll(async () => (await gamePage.events()).some((e) => e.name === "checkpointReached")).toBe(true);

    const { levelHeightPx } = await gamePage.state();
    await gamePage.teleport(checkpoint.x, levelHeightPx + 60);
    await expect.poll(async () => (await gamePage.events()).some((e) => e.name === "playerRespawned")).toBe(true);

    // Read the respawn itself, not a later frame: a walker patrols next to this checkpoint and may reach the player
    // after it has stood there a while — that is gameplay, not the respawn.
    const respawned = (await gamePage.events()).find((e) => e.name === "playerRespawned")!;
    expect(respawned.payload).toEqual({ hearts: 3 });
    const state = await gamePage.state();
    expect({ x: state.respawnX, y: state.respawnY }).toEqual({ x: checkpoint.x, y: checkpoint.y });
    expect(state.respawnX).not.toBe(spawn.x);
    expect(Math.abs(state.x - checkpoint.x), `respawned at x=${state.x}, checkpoint x=${checkpoint.x}`).toBeLessThan(32);
  });
});
