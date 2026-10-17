import { test, expect } from "@/fixtures";
import { SCENE, type Box } from "@/pages/game.page";
import { copy } from "@/data/copy";

// FR-15 / ADR-0010: the on-screen controls appear after the first real touch and hide after the first key press.
// Runs in project app-touch (hasTouch, desktop user agent — the touchscreen laptop of invariants #11). What is asserted
// is the input state while a finger is held, never a physics outcome.

const centre = (b: Box) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });

test.describe("on-screen controls", () => {
  test(
    "chưa chạm thì không có nút; bấm chuột cũng không làm chúng hiện",
    { tag: ["@TC-TOUCH-001", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.startLevelOne();
      await gamePage.waitForActive(SCENE.hud);
      expect((await gamePage.state()).touchVisible).toBe(false);

      const canvas = (await gamePage.canvas.boundingBox())!;
      await page.mouse.click(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
      await gamePage.frames(10);
      const state = await gamePage.state();
      expect(state.showTouch).toBe(false);
      expect(state.touchVisible).toBe(false);
    },
  );

  test(
    "một cú chạm bất kỳ đâu trong màn chơi làm hiện cụm nút",
    { tag: ["@TC-TOUCH-002", "@smoke", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.tapIntoLevelOne();
      // Tapping START was a touch on another scene; the level itself has not been touched yet.
      expect((await gamePage.state()).touchVisible).toBe(false);

      const canvas = (await gamePage.canvas.boundingBox())!;
      await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
      await expect.poll(async () => (await gamePage.state()).touchVisible).toBe(true);
    },
  );

  test(
    "giữ nút hướng phải / trái thì nhân vật nhận hướng đó, nhấc ngón là hết",
    { tag: ["@TC-TOUCH-003", "@smoke", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.tapIntoLevelOne();
      const canvas = (await gamePage.canvas.boundingBox())!;
      await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
      await expect.poll(async () => (await gamePage.state()).touchVisible).toBe(true);
      const buttons = await gamePage.touchButtons();

      await gamePage.touchDown([centre(buttons.right)]);
      await expect.poll(async () => (await gamePage.state()).snapshot).toEqual({ left: false, right: true, jumpHeld: false });
      await gamePage.touchUp();
      await expect.poll(async () => (await gamePage.state()).snapshot.right).toBe(false);

      await gamePage.touchDown([centre(buttons.left)]);
      await expect.poll(async () => (await gamePage.state()).snapshot).toEqual({ left: true, right: false, jumpHeld: false });
      await gamePage.touchUp();
      await expect.poll(async () => (await gamePage.state()).snapshot.left).toBe(false);
    },
  );

  test("chạm nút nhảy thì nhân vật nhảy lên", { tag: ["@TC-TOUCH-004", "@dev-build"] }, async ({ gamePage, page }) => {
    await gamePage.goto();
    await gamePage.tapIntoLevelOne();
    const canvas = (await gamePage.canvas.boundingBox())!;
    await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
    await expect.poll(async () => (await gamePage.state()).touchVisible).toBe(true);
    await gamePage.waitUntilGrounded();
    const ground = (await gamePage.state()).y;
    const jump = centre((await gamePage.touchButtons()).jump);

    // A jump is an edge on a grounded frame; a loaded machine can miss one, so up to three separate presses.
    let highest = ground;
    for (let attempt = 0; attempt < 3 && highest >= ground - 8; attempt += 1) {
      await gamePage.touchDown([jump]);
      const until = Date.now() + 2_000;
      while (Date.now() < until && highest >= ground - 8) {
        highest = Math.min(highest, (await gamePage.state()).y);
        await gamePage.frames(2);
      }
      await gamePage.touchUp();
      await gamePage.waitUntilGrounded();
    }
    expect(highest).toBeLessThan(ground - 8);
  });

  test("bấm phím thì cụm nút cảm ứng ẩn lại", { tag: ["@TC-TOUCH-005", "@dev-build"] }, async ({ gamePage, page }) => {
    await gamePage.goto();
    await gamePage.tapIntoLevelOne();
    const canvas = (await gamePage.canvas.boundingBox())!;
    await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
    await expect.poll(async () => (await gamePage.state()).showTouch).toBe(true);

    // A keyboard player must not be left with buttons painted over the level.
    await gamePage.press("ArrowRight");
    await expect.poll(async () => (await gamePage.state()).showTouch).toBe(false);
    await expect.poll(async () => (await gamePage.state()).touchVisible).toBe(false);
  });

  test(
    "nút hướng ≥ 72 px ở góc trái dưới, nút nhảy ≥ 88 px ở góc phải dưới",
    { tag: ["@TC-TOUCH-006", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.tapIntoLevelOne();
      const canvas = (await gamePage.canvas.boundingBox())!;
      await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
      await expect.poll(async () => (await gamePage.state()).touchVisible).toBe(true);
      const { left, right, jump } = await gamePage.touchButtons();
      const midX = canvas.x + canvas.width / 2;
      const midY = canvas.y + canvas.height / 2;

      for (const [name, b] of [["left", left], ["right", right]] as const) {
        expect(b.width, `${name} width`).toBeGreaterThanOrEqual(72);
        expect(b.height, `${name} height`).toBeGreaterThanOrEqual(72);
        expect(b.x + b.width, `${name} sits in the left half`).toBeLessThanOrEqual(midX);
        expect(b.y, `${name} sits in the bottom half`).toBeGreaterThanOrEqual(midY);
      }
      expect(jump.width).toBeGreaterThanOrEqual(88);
      expect(jump.height).toBeGreaterThanOrEqual(88);
      expect(jump.width).toBeGreaterThan(left.width);
      expect(jump.x).toBeGreaterThanOrEqual(midX);
      expect(jump.y).toBeGreaterThanOrEqual(midY);
    },
  );

  test(
    "giữ hai nút hướng cùng lúc rồi nhấc cả hai thì không hướng nào kẹt",
    { tag: ["@TC-TOUCH-007", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.tapIntoLevelOne();
      const canvas = (await gamePage.canvas.boundingBox())!;
      await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
      await expect.poll(async () => (await gamePage.state()).touchVisible).toBe(true);
      const { left, right } = await gamePage.touchButtons();

      await gamePage.touchDown([centre(left), centre(right)]);
      await gamePage.frames(10);
      await gamePage.touchUp();
      await expect.poll(async () => (await gamePage.state()).snapshot).toEqual({ left: false, right: false, jumpHeld: false });
    },
  );
});

test.describe("menus by touch", () => {
  test(
    "chạm node khoá thì xem trước được, chạm START không đưa đi đâu",
    { tag: ["@TC-TOUCH-008", "@dev-build"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.clickText(SCENE.title, copy.play, { touch: true });
      await gamePage.waitForScene(SCENE.worldMap);

      // Node 2 is locked on a fresh save. Selecting it is allowed — previewing the next level is the point (ADR-0011).
      const node2 = (await gamePage.mapNodes())[1]!;
      await page.touchscreen.tap(node2.x, node2.y);
      await expect.poll(() => gamePage.selectedNode()).toBe("2");
      expect((await gamePage.mapCard()).best).toBe(copy.locked);

      await gamePage.clickText(SCENE.worldMap, copy.start, { touch: true });
      await gamePage.frames(20);
      expect(await gamePage.scene()).toBe(SCENE.worldMap);
    },
  );
});
