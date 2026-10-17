import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { copy } from "@/data/copy";
import { saveWith } from "@/data/test-data";

// FR-17: the mute switch on every screen, remembered in the save, and silence that means silence.

test.describe("mute", () => {
  test(
    "tắt tiếng ở Title: tên nút đổi, lựa chọn còn sau khi tải lại",
    { tag: ["@TC-AUDIO-004", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.clickIcon(SCENE.title, copy.icon.soundOn);
      await expect
        .poll(async () => (await gamePage.iconButtons(SCENE.title)).map((b) => b.name))
        .toContain(copy.icon.soundOff);
      expect((await gamePage.readSave())?.muted).toBe(true);

      await page.reload();
      await gamePage.waitForScene(SCENE.title);
      expect((await gamePage.iconButtons(SCENE.title)).map((b) => b.name)).toContain(copy.icon.soundOff);
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.worldMap);
      expect((await gamePage.iconButtons(SCENE.worldMap)).map((b) => b.name)).toContain(copy.icon.soundOff);
    },
  );

  test(
    "đã tắt tiếng thì PLAY, ăn xu, nhảy đều im lặng",
    { tag: ["@TC-AUDIO-005", "@smoke", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.probeAudio();
      await gamePage.seedSave(saveWith({}, true));
      await gamePage.goto();
      await gamePage.clickText(SCENE.title, copy.play);
      await gamePage.waitForScene(SCENE.worldMap);
      await gamePage.press("Enter");
      await gamePage.waitForActive(SCENE.hud);
      await gamePage.takeCoin();
      await gamePage.waitUntilGrounded();
      await gamePage.press("Space");
      await gamePage.frames(20);
      expect((await gamePage.audio()).started).toBe(0);
    },
  );

  test(
    "nút tiếng trên HUD và màn tạm dừng: tắt giữa màn thì im ngay",
    { tag: ["@TC-AUDIO-006", "@dev-build"] },
    async ({ gamePage }) => {
      await gamePage.probeAudio();
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);

      await gamePage.clickIcon(SCENE.hud, copy.icon.soundOn);
      await expect.poll(async () => (await gamePage.iconButtons(SCENE.hud)).map((b) => b.name)).toContain(copy.icon.soundOff);
      const before = (await gamePage.audio()).started;
      await gamePage.takeCoin();
      await gamePage.frames(10);
      expect((await gamePage.audio()).started).toBe(before);

      await gamePage.press("Escape");
      await gamePage.waitForActive(SCENE.pause);
      expect((await gamePage.iconButtons(SCENE.pause)).map((b) => b.name)).toContain(copy.icon.soundOff);
    },
  );
});
