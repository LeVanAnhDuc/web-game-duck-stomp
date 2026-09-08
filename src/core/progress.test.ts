import { describe, expect, it } from 'vitest'
import {
  clearedCount,
  currentLevel,
  hasAnyProgress,
  isLevelId,
  isUnlocked,
  LEVEL_IDS,
  nextLevel,
  totalCoins,
  type LevelBook,
} from './progress'
import type { LevelRecord } from './scoring'

const cleared = (coins = 3): LevelRecord => ({ cleared: true, bestTimeMs: 1_000, coins })
const opened = (): LevelRecord => ({ cleared: false, bestTimeMs: null, coins: 0 })

describe('isUnlocked', () => {
  it('always opens level 1, even with an empty save', () => {
    expect(isUnlocked({}, '1')).toBe(true)
  })

  it('opens level N only once N-1 is cleared', () => {
    expect(isUnlocked({}, '2')).toBe(false)
    expect(isUnlocked({ '1': cleared() }, '2')).toBe(true)
    expect(isUnlocked({ '1': cleared() }, '3')).toBe(false)
  })

  it('does not open a level from a non-adjacent clear', () => {
    expect(isUnlocked({ '4': cleared() }, '6')).toBe(false)
  })

  it('does not treat an opened-but-unfinished level as a clear', () => {
    expect(isUnlocked({ '1': opened() }, '2')).toBe(false)
  })

  it('opens the whole map when everything is cleared', () => {
    const all: LevelBook = Object.fromEntries(LEVEL_IDS.map((id) => [id, cleared()]))
    for (const id of LEVEL_IDS) expect(isUnlocked(all, id)).toBe(true)
  })
})

describe('nextLevel', () => {
  it('walks forward', () => {
    expect(nextLevel('1')).toBe('2')
    expect(nextLevel('5')).toBe('6')
  })

  it('returns null past the last level', () => {
    expect(nextLevel('6')).toBe(null)
  })
})

describe('currentLevel', () => {
  it('is level 1 for a fresh save', () => {
    expect(currentLevel({})).toBe('1')
  })

  it('is the first open level that is not yet cleared', () => {
    expect(currentLevel({ '1': cleared(), '2': cleared() })).toBe('3')
  })

  it('stays on the last level once everything is cleared', () => {
    const all: LevelBook = Object.fromEntries(LEVEL_IDS.map((id) => [id, cleared()]))
    expect(currentLevel(all)).toBe('6')
  })
})

describe('counting', () => {
  it('sums coins across levels', () => {
    expect(totalCoins({ '1': cleared(3), '2': cleared(5) })).toBe(8)
  })

  it('ignores unknown keys when counting clears', () => {
    expect(clearedCount({ '1': cleared(), '99': cleared() })).toBe(1)
  })

  it('reports whether CONTINUE should be offered', () => {
    expect(hasAnyProgress({})).toBe(false)
    expect(hasAnyProgress({ '1': opened() })).toBe(false)
    expect(hasAnyProgress({ '1': cleared() })).toBe(true)
  })
})

describe('isLevelId', () => {
  it('accepts only the six real ids', () => {
    expect(isLevelId('1')).toBe(true)
    expect(isLevelId('6')).toBe(true)
    expect(isLevelId('0')).toBe(false)
    expect(isLevelId('7')).toBe(false)
    expect(isLevelId('')).toBe(false)
  })
})
