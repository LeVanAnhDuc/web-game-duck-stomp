import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";

// FR-17 / ADR-0007: synthesised Web Audio, unlocked by the PLAY press — proven by counting what the game asks the
// Web Audio API to do (decisions/audio.md Q1).

const AUDIO_FILE = /\.(mp3|ogg|wav|m4a|aac|flac|webm)(\?|$)/i;

test.describe("sound", () => {
  test(
    "PLAY tạo đúng một ngữ cảnh âm thanh mới và cho nó chạy",
    { tag: ["@TC-AUDIO-001", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.probeAudio();
      await gamePage.goto();
      await gamePage.frames(30);
      const before = await gamePage.audio();

      await gamePage.clickText(SCENE.title, copy.play);
      await gamePage.waitForScene(SCENE.worldMap);
      const after = await gamePage.audio();
      expect(after.contexts - before.contexts).toBe(1);
      expect(after.resumed - before.resumed).toBeGreaterThanOrEqual(1);
    },
  );

  test(
    "chưa bấm gì thì chưa có ngữ cảnh âm thanh nào",
    { tag: ["@TC-AUDIO-007", "@dev-build"] },
    async ({ gamePage }) => {
      // BUG: defects/audio.md#bug-audio-01
      test.fail();
      await gamePage.probeAudio();
      await gamePage.goto();
      await gamePage.frames(30);
      expect((await gamePage.audio()).contexts).toBe(0);
    },
  );

  test("tiếng bật: PLAY và ăn xu phát âm thanh tổng hợp", { tag: ["@TC-AUDIO-002", "@dev-build"] }, async ({ gamePage }) => {
    await gamePage.probeAudio();
    await gamePage.goto();
    await gamePage.clickText(SCENE.title, copy.play);
    await gamePage.waitForScene(SCENE.worldMap);
    const afterPlay = (await gamePage.audio()).started;
    expect(afterPlay).toBeGreaterThan(0);

    await gamePage.press("Enter");
    await gamePage.waitForActive(SCENE.hud);
    const beforeCoin = (await gamePage.audio()).started;
    await gamePage.takeCoin();
    await expect.poll(async () => (await gamePage.audio()).started).toBeGreaterThan(beforeCoin);
  });

  test("từ lúc mở tới lúc chơi không tải file âm thanh nào", { tag: ["@TC-AUDIO-003"] }, async ({ gamePage, page }) => {
    const audioRequests: string[] = [];
    page.on("response", (response) => {
      const type = response.headers()["content-type"] ?? "";
      if (AUDIO_FILE.test(response.url()) || type.startsWith("audio/")) audioRequests.push(response.url());
    });
    await gamePage.goto();
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.worldMap);
    await gamePage.press("Enter");
    await gamePage.waitForScene(SCENE.game);
    await gamePage.frames(30);
    expect(audioRequests).toEqual([]);
  });
});
