// Pure helpers over a level file's objects (as GamePage.levelFile returns them). No UI, no environment.

export interface FileObject {
  type: string;
  props: Record<string, unknown>;
}

/**
 * Coins a perfect run can end with, counted the way docs/specs/core-game/design.md §4 defines it: loose coins, hidden
 * coins, and question blocks that give a coin (`gives` defaults to "coin").
 */
export function coinsInFile(objects: readonly FileObject[]): number {
  let total = 0;
  for (const o of objects) {
    if (o.type === "coin" || o.type === "coinHidden") total += 1;
    else if (o.type === "questionBlock" && (o.props["gives"] ?? "coin") === "coin") total += 1;
  }
  return total;
}
