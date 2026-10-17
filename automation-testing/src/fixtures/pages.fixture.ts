import { GamePage } from "@/pages/game.page";
import { test as core } from "./core.fixture";

// One fixture per page object, named like the class in camelCase. The game is one canvas: GamePage carries every
// scene (title, map, level, HUD, overlays) and the two DOM pieces next to it (rotate gate, account overlay).
export const test = core.extend<{ gamePage: GamePage }>({
  gamePage: async ({ page }, use) => use(new GamePage(page)),
});
