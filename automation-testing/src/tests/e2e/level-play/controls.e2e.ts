import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";

// FR-03 keyboard half: which way the player goes, never how far or how fast (that is frame timing, unit tested in
// client/src/core/movement.test.ts — decisions/level-play.md Q1).

test.describe("keyboard controls", () => {
  test(
    "giữ → hoặc D đi sang phải, giữ ← hoặc A đi sang trái",
    { tag: ["@TC-LEVELPLAY-004", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.waitUntilGrounded();

      for (const [key, sign] of [["ArrowRight", 1], ["ArrowLeft", -1], ["d", 1], ["a", -1]] as const) {
        const before = (await gamePage.state()).x;
        await gamePage.holdUntil(key, async () => ((await gamePage.state()).x - before) * sign > 6);
        await gamePage.frames(3);
        const snapshot = (await gamePage.state()).snapshot;
        expect(snapshot, `after releasing ${key}`).toEqual({ left: false, right: false, jumpHeld: false });
        await gamePage.waitUntilGrounded();
      }
    },
  );

  for (const key of ["Space", "ArrowUp", "w"]) {
    test(`Space, ↑ và W đều làm nhân vật nhảy lên (${key})`, { tag: ["@TC-LEVELPLAY-005", "@dev-build"] }, async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.waitUntilGrounded();
      const ground = (await gamePage.state()).y;
      let highest = ground;
      // A jump is an edge on a frame where the player counts as grounded; on a loaded machine one press can land on a
      // frame that does not. Up to three separate presses, each held for 2s — a real player would press again too.
      for (let attempt = 0; attempt < 3 && highest >= ground - 8; attempt += 1) {
        await gamePage
          .holdUntil(key, async () => {
            highest = Math.min(highest, (await gamePage.state()).y);
            return highest < ground - 8;
          }, 2_000)
          .catch(() => undefined);
        await gamePage.waitUntilGrounded();
      }
      expect(highest).toBeLessThan(ground - 8);
    });
  }
});
