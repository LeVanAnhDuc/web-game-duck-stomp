import { test, expect } from "@/fixtures";
import { SCENE } from "@/pages/game.page";
import { LEVEL_IDS } from "@/data/test-data";

// The static site under its base path: "/" on dev, /web-game-duck-stomp/ on GitHub Pages. No window.duckstomp here,
// so the same specs run against the deployed build (ENV=prd).

test.describe("static site", () => {
  test(
    "mọi tài nguyên của site tải được và nằm dưới đường dẫn gốc",
    { tag: ["@TC-DEPLOY-001", "@smoke"] },
    async ({ gamePage, page, urls }) => {
      const base = `${urls.webUrl}/`;
      const origin = new URL(base).origin;
      const broken: string[] = [];
      const outsideBase: string[] = [];
      page.on("response", (response) => {
        const url = response.url();
        if (!url.startsWith(origin)) return;
        if (response.status() >= 400) broken.push(`${response.status()} ${url}`);
        if (!url.startsWith(base)) outsideBase.push(url);
      });
      page.on("requestfailed", (request) => {
        if (request.url().startsWith(origin)) broken.push(`failed ${request.url()} ${request.failure()?.errorText}`);
      });

      await gamePage.goto();
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.worldMap);
      await gamePage.press("Enter");
      await gamePage.waitForScene(SCENE.game);
      await gamePage.frames(30);

      expect(broken, broken.join("\n")).toEqual([]);
      expect(outsideBase, outsideBase.join("\n")).toEqual([]);
    },
  );

  test("sáu file màn có ở levels/ dưới đường dẫn gốc", { tag: ["@TC-DEPLOY-002"] }, async ({ gamePage }) => {
    await gamePage.goto();
    for (const id of LEVEL_IDS) {
      const file = await gamePage.levelFile(id);
      expect(file.status, `level-${id}.json`).toBe(200);
      expect(file.objects.length, `level-${id}.json objects`).toBeGreaterThan(0);
    }
  });
});
