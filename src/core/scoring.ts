/**
 * What a finished run does to a level's record — FR-12.
 *
 * The asymmetry here is the point, and it comes straight from US-02: a replay must
 * never be able to make your record worse. Time keeps the minimum, coins keep the
 * maximum, and `cleared` is a one-way door. Put another way, a record only ever
 * improves, so a bad run costs nothing but the time you spent on it.
 */

export type LevelResult = {
  timeMs: number
  coins: number
}

export type LevelRecord = {
  cleared: boolean
  /** null means never finished. */
  bestTimeMs: number | null
  /** Most coins ever collected in one run of this level. */
  coins: number
}

export type MergeOutcome = {
  next: LevelRecord
  /** Drives the NEW BEST badge. False on a slower run, even though the record is kept. */
  isNewBest: boolean
}

export function mergeResult(prev: LevelRecord | undefined, result: LevelResult): MergeOutcome {
  const bestBefore = prev?.bestTimeMs ?? null
  const isNewBest = bestBefore === null || result.timeMs < bestBefore

  return {
    next: {
      cleared: true,
      bestTimeMs: isNewBest ? result.timeMs : bestBefore,
      coins: Math.max(prev?.coins ?? 0, result.coins),
    },
    isNewBest,
  }
}

/**
 * `m:ss` for the HUD and the summary card.
 *
 * Seconds are floored rather than rounded so the clock never shows a time the
 * player did not actually beat. Negative input clamps to `0:00` instead of
 * rendering `-1:59`, which is what a paused-then-resumed clock can produce.
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
