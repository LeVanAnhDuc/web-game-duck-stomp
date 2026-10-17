import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { FONT_HOSTS } from "@/data/test-data";

// NFR-REL-01 / NFR-DATA-01: the only outside call is Google Fonts. Keyboard and data-scene only, so this runs on the
// deployed site too.

test.describe("network", () => {
  test(
    "từ lúc mở tới lúc đang chơi chỉ gọi tới site và Google Fonts",
    { tag: ["@TC-PRIVACY-003", "@smoke"] },
    async ({ gamePage, page, urls }) => {
      const allowed = [new URL(urls.webUrl).origin, ...FONT_HOSTS];
      const elsewhere: string[] = [];
      page.on("request", (request) => {
        const url = request.url();
        if (url.startsWith("data:") || url.startsWith("blob:")) return;
        if (!allowed.includes(new URL(url).origin)) elsewhere.push(url);
      });

      await gamePage.goto();
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.worldMap);
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.game);
      await gamePage.frames(30);
      expect(elsewhere, elsewhere.join("\n")).toEqual([]);
    },
  );
});
