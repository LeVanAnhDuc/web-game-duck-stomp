import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { coinsInFile } from "@/utils/level";

// The HUD on entering a level, the clock, and picking up a coin (FR-05, FR-06). Reaching the coin is physics; touching
// it is the game's business (decisions/level-play.md Q2).

test.describe("level HUD", () => {
  test("vào màn 1: ba tim, 0/N xu, đồng hồ 0:00", { tag: ["@TC-LEVELPLAY-001", "@smoke", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    const total = coinsInFile((await gamePage.levelFile("1")).objects);
    expect(total).toBe(9);

    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    const hud = await gamePage.hud();
    expect(hud.hearts).toBe(3);
    expect(hud.coins).toBe(`0/${total}`);
    // The clock starts at 0:00 and only shows whole seconds already played.
    const { elapsedMs } = await gamePage.state();
    if (elapsedMs < 1000) expect(hud.clock).toBe("0:00");
  });

  test("đồng hồ chạy và hiện m:ss", { tag: ["@TC-LEVELPLAY-002", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await expect.poll(async () => (await gamePage.state()).elapsedMs, { timeout: 10_000 }).toBeGreaterThanOrEqual(1000);
    await gamePage.press("Escape"); // freeze the clock so state and HUD are read at the same instant
    await gamePage.waitForActive(SCENE.pause);
    const { elapsedMs } = await gamePage.state();
    const expected = `${Math.floor(elapsedMs / 60_000)}:${String(Math.floor(elapsedMs / 1000) % 60).padStart(2, "0")}`;
    expect((await gamePage.hud()).clock).toBe(expected);
    expect(expected).toMatch(/^\d+:\d{2}$/);
  });

  test("chạm đồng xu thì HUD tăng đúng 1, không tính lại", { tag: ["@TC-LEVELPLAY-006", "@smoke", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    const { totalCoins, x: spawnX, y: spawnY } = await gamePage.state();
    const coin = (await gamePage.levelObjects("coin"))[0]!;

    await gamePage.teleport(coin.x, coin.y);
    await expect.poll(async () => (await gamePage.hud()).coins).toBe(`1/${totalCoins}`);

    await gamePage.teleport(spawnX, spawnY);
    await gamePage.frames(10);
    await gamePage.teleport(coin.x, coin.y);
    await gamePage.frames(20);
    expect((await gamePage.hud()).coins).toBe(`1/${totalCoins}`);
    expect((await gamePage.state()).coins).toBe(1);
  });
});
