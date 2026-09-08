/**
 * Which nodes on the world map are open — FR-02.
 *
 * Six levels, strictly sequential: node N opens when node N-1 is cleared. Nothing
 * else unlocks anything, which is why `isUnlocked` looks only at its immediate
 * predecessor rather than counting clears. A save that has been hand-edited to
 * clear level 4 does NOT open level 6.
 */

import type { LevelRecord } from './scoring'

export const LEVEL_IDS = ['1', '2', '3', '4', '5', '6'] as const
export type LevelId = (typeof LEVEL_IDS)[number]

export type LevelBook = Readonly<Record<string, LevelRecord>>

export function isLevelId(value: string): value is LevelId {
  return (LEVEL_IDS as readonly string[]).includes(value)
}

export function isUnlocked(levels: LevelBook, id: LevelId): boolean {
  const index = (LEVEL_IDS as readonly string[]).indexOf(id)
  if (index <= 0) return true
  const previous = LEVEL_IDS[index - 1]
  if (previous === undefined) return true
  return levels[previous]?.cleared === true
}

export function nextLevel(id: LevelId): LevelId | null {
  const index = (LEVEL_IDS as readonly string[]).indexOf(id)
  return LEVEL_IDS[index + 1] ?? null
}

/** The frontier: the first level that is open but not yet cleared, else the last one. */
export function currentLevel(levels: LevelBook): LevelId {
  for (const id of LEVEL_IDS) {
    if (isUnlocked(levels, id) && levels[id]?.cleared !== true) return id
  }
  return LEVEL_IDS[LEVEL_IDS.length - 1] as LevelId
}

export function totalCoins(levels: LevelBook): number {
  let sum = 0
  for (const record of Object.values(levels)) sum += record?.coins ?? 0
  return sum
}

export function clearedCount(levels: LevelBook): number {
  let n = 0
  for (const id of LEVEL_IDS) if (levels[id]?.cleared === true) n += 1
  return n
}

/** True once every level is cleared — used to decide whether to offer CONTINUE. */
export function hasAnyProgress(levels: LevelBook): boolean {
  return clearedCount(levels) > 0
}
