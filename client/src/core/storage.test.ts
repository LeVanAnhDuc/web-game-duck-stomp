import { describe, expect, it } from 'vitest'
import { emptySave, loadSave, SAVE_KEY, saveSave, type StorageLike } from './storage'

type MemStorage = StorageLike & { data: Record<string, string> }

const mem = (initial?: string): MemStorage => {
  const data: Record<string, string> = initial === undefined ? {} : { [SAVE_KEY]: initial }
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value
    },
  }
}

describe('loadSave never throws and never half-trusts (NFR-REL-04)', () => {
  const junk = [
    '',
    'not json at all',
    '[]',
    'null',
    '0',
    '"a string"',
    '{}',
    '{"version":99}',
    '{"version":"1","levels":{},"muted":false}',
    '{"version":1,"levels":"nope","muted":false}',
    '{"version":1,"levels":[],"muted":false}',
  ]

  for (const payload of junk) {
    it(`treats ${JSON.stringify(payload).slice(0, 40)} as no save`, () => {
      expect(loadSave(mem(payload))).toEqual(emptySave())
    })
  }

  it('drops malformed level records but keeps the valid ones', () => {
    const storage = mem(
      JSON.stringify({
        version: 1,
        muted: false,
        levels: {
          '1': { cleared: true, bestTimeMs: 1_000, coins: 3 },
          '2': { cleared: 'yes', bestTimeMs: 'fast', coins: null },
          '3': { cleared: true, bestTimeMs: -5, coins: 1 },
          '4': { cleared: true, bestTimeMs: 2_000, coins: 1.5 },
          '5': { cleared: false, bestTimeMs: null, coins: 0 },
        },
      }),
    )
    const out = loadSave(storage)
    expect(out.levels['1']).toEqual({ cleared: true, bestTimeMs: 1_000, coins: 3 })
    expect(out.levels['5']).toEqual({ cleared: false, bestTimeMs: null, coins: 0 })
    expect(out.levels['2']).toBeUndefined()
    expect(out.levels['3'], 'negative time is not a time').toBeUndefined()
    expect(out.levels['4'], 'fractional coins are not coins').toBeUndefined()
  })

  it('rejects NaN and Infinity times, which survive JSON round-trips as null or error', () => {
    const storage = mem('{"version":1,"muted":false,"levels":{"1":{"cleared":true,"bestTimeMs":1e999,"coins":0}}}')
    expect(loadSave(storage).levels['1']).toBeUndefined()
  })

  it('keeps muted only when it is literally true', () => {
    expect(loadSave(mem('{"version":1,"levels":{},"muted":true}')).muted).toBe(true)
    expect(loadSave(mem('{"version":1,"levels":{},"muted":"true"}')).muted).toBe(false)
    expect(loadSave(mem('{"version":1,"levels":{}}')).muted).toBe(false)
  })

  it('survives a storage that throws on read (NFR-REL-05)', () => {
    const blocked: StorageLike = {
      getItem: () => {
        throw new Error('storage blocked')
      },
      setItem: () => {},
    }
    expect(loadSave(blocked)).toEqual(emptySave())
  })

  it('survives having no storage at all', () => {
    expect(loadSave(null)).toEqual(emptySave())
  })

  it('returns a fresh object each time, so callers cannot poison the default', () => {
    const a = loadSave(null)
    a.muted = true
    expect(loadSave(null).muted).toBe(false)
  })
})

describe('saveSave', () => {
  it('round-trips a save', () => {
    const storage = mem()
    const data = emptySave()
    data.muted = true
    data.levels['2'] = { cleared: true, bestTimeMs: 12_345, coins: 7 }

    expect(saveSave(storage, data)).toBe(true)
    expect(loadSave(storage)).toEqual(data)
  })

  it('is idempotent — writing the same state twice changes nothing (NFR-REL-02)', () => {
    const storage = mem()
    const data = emptySave()
    saveSave(storage, data)
    const first = storage.data[SAVE_KEY]
    saveSave(storage, data)
    expect(storage.data[SAVE_KEY]).toBe(first)
  })

  it('reports false when storage throws, without throwing (NFR-REL-05)', () => {
    const full: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota exceeded')
      },
    }
    expect(saveSave(full, emptySave())).toBe(false)
  })

  it('reports false with no storage', () => {
    expect(saveSave(null, emptySave())).toBe(false)
  })
})
