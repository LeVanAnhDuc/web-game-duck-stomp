import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";

// FR-03 "tuned for feel" (README Features): variable jump height, jump buffer, coyote time — the forgiveness rules of
// design.md §1, checked as outcomes in the running game. The windows are 90/110 ms, so the buffer and coyote presses are
// made from inside the game loop on the game's own clock (decisions/level-play.md Q5).

// Level 1: ground band from column 0 to 9, then a pit (client/scripts/make-level.mjs). The player stands at y 136.
const STAND_Y = 136;
const LEDGE_RIGHT_X = 160;
// client/src/core/tuning.ts
const JUMP_BUFFER_MS = 110;
const COYOTE_MS = 90;

test.describe("movement feel", () => {
  test.beforeEach(async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startLevelOne();
    await gamePage.waitForActive(SCENE.hud);
    await gamePage.waitUntilGrounded();
  });

  test("giữ nút nhảy lâu thì nhảy cao hơn nhấn nhả nhanh", { tag: ["@TC-LEVELPLAY-007", "@dev-build"] }, async ({ gamePage }) => {
    // Two game steps (a tap) against sixty (held well past the apex).
    const tapRise = await gamePage.jumpRise(2);
    await gamePage.waitUntilGrounded();
    const holdRise = await gamePage.jumpRise(60);

    expect(tapRise).toBeGreaterThan(0);
    // A full jump apexes at 49 px (tuning.ts); an early release keeps 40% of the remaining rise.
    expect(holdRise).toBeGreaterThan(40);
    expect(tapRise).toBeLessThan(holdRise * 0.7);
  });

  test(
    "bấm nhảy ngay trước khi chạm đất thì vẫn nhảy lúc chạm đất (jump buffer)",
    { tag: ["@TC-LEVELPLAY-008", "@dev-build"] },
    async ({ gamePage }) => {
      const late = await gamePage.bufferedJump(80, STAND_Y, 64, 10);
      expect(late.pressToLandMs).toBeLessThan(JUMP_BUFFER_MS);
      expect(late.jumpedOnLanding).toBe(true);

      await gamePage.waitUntilGrounded();
      const early = await gamePage.bufferedJump(80, STAND_Y, 64, 56);
      expect(early.pressToLandMs).toBeGreaterThanOrEqual(JUMP_BUFFER_MS);
      expect(early.jumpedOnLanding).toBe(false);
    },
  );

  test(
    "vừa chạy khỏi mép vực vẫn nhảy được trong chốc lát (coyote time)",
    { tag: ["@TC-LEVELPLAY-009", "@dev-build"] },
    async ({ gamePage }) => {
      const inTime = await gamePage.coyoteJump(100, LEDGE_RIGHT_X, 30);
      expect(inTime.pressedAfterMs).toBeLessThan(COYOTE_MS);
      expect(inTime.jumped).toBe(true);
    },
  );

  test(
    "chạy khỏi mép quá lâu rồi mới bấm thì không nhảy giữa không trung",
    { tag: ["@TC-LEVELPLAY-010", "@dev-build"] },
    async ({ gamePage }) => {
      const tooLate = await gamePage.coyoteJump(100, LEDGE_RIGHT_X, 160);
      expect(tooLate.pressedAfterMs).toBeGreaterThanOrEqual(COYOTE_MS);
      expect(tooLate.jumped).toBe(false);
    },
  );
});
