import { describe, expect, it } from 'vitest'
import { formatTime, mergeResult, type LevelRecord } from './scoring'

const record = (over: Partial<LevelRecord> = {}): LevelRecord => ({
  cleared: true,
  bestTimeMs: 42_000,
  coins: 6,
  ...over,
})

describe('mergeResult', () => {
  it('records a first clear and flags it as a new best', () => {
    const { next, isNewBest } = mergeResult(undefined, { timeMs: 42_000, coins: 6 })
    expect(next).toEqual({ cleared: true, bestTimeMs: 42_000, coins: 6 })
    expect(isNewBest).toBe(true)
  })

  it('keeps the faster time and flags a new best', () => {
    const { next, isNewBest } = mergeResult(record(), { timeMs: 39_500, coins: 4 })
    expect(next.bestTimeMs).toBe(39_500)
    expect(isNewBest).toBe(true)
  })

  it('keeps the old time and does NOT flag a new best on a slower run', () => {
    const { next, isNewBest } = mergeResult(record(), { timeMs: 51_000, coins: 8 })
    expect(next.bestTimeMs).toBe(42_000)
    expect(isNewBest).toBe(false)
  })

  it('does not flag a new best for an exactly equal time', () => {
    expect(mergeResult(record(), { timeMs: 42_000, coins: 0 }).isNewBest).toBe(false)
  })

  it('only ever raises the coin count, never lowers it (US-02)', () => {
    expect(mergeResult(record(), { timeMs: 60_000, coins: 2 }).next.coins).toBe(6)
    expect(mergeResult(record(), { timeMs: 60_000, coins: 8 }).next.coins).toBe(8)
  })

  it('never reverts cleared to false', () => {
    expect(mergeResult(record({ bestTimeMs: 1 }), { timeMs: 999_999, coins: 0 }).next.cleared).toBe(true)
  })

  it('does not mutate the previous record', () => {
    const prev = record()
    mergeResult(prev, { timeMs: 1, coins: 99 })
    expect(prev).toEqual({ cleared: true, bestTimeMs: 42_000, coins: 6 })
  })

  it('handles a record that was cleared but somehow has no time', () => {
    const { next, isNewBest } = mergeResult(record({ bestTimeMs: null }), { timeMs: 70_000, coins: 1 })
    expect(next.bestTimeMs).toBe(70_000)
    expect(isNewBest).toBe(true)
  })
})

describe('formatTime', () => {
  it('formats as m:ss with a padded seconds field', () => {
    expect(formatTime(42_000)).toBe('0:42')
    expect(formatTime(9_000)).toBe('0:09')
    expect(formatTime(125_400)).toBe('2:05')
    expect(formatTime(600_000)).toBe('10:00')
  })

  it('floors rather than rounds, so it never shows a time you did not beat', () => {
    expect(formatTime(41_999)).toBe('0:41')
  })

  it('clamps negatives to zero', () => {
    expect(formatTime(-5)).toBe('0:00')
  })

  it('handles zero', () => {
    expect(formatTime(0)).toBe('0:00')
  })
})
