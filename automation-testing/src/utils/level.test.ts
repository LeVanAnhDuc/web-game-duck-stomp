import { test, expect } from "@playwright/test";
import { coinsInFile } from "./level";

test("coinsInFile counts loose, hidden and coin-giving question blocks", () => {
  expect(
    coinsInFile([
      { type: "coin", props: {} },
      { type: "coinHidden", props: {} },
      { type: "questionBlock", props: {} },
      { type: "questionBlock", props: { gives: "coin" } },
      { type: "questionBlock", props: { gives: "powerUp" } },
      { type: "walker", props: {} },
    ]),
  ).toBe(4);
});
