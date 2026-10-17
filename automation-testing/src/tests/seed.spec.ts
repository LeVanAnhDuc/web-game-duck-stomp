import { test } from "@/fixtures";

// Seed for the playwright-test agents (planner / generator): an anonymous browser on the title screen, with an empty
// save. "./" keeps the GitHub Pages base path on prd.
test("seed", async ({ gamePage }) => {
  await gamePage.goto();
});
