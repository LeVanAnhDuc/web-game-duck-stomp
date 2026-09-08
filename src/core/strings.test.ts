import { describe, expect, it } from 'vitest'
import { STRINGS, t } from './strings'

describe('strings', () => {
  it('is ASCII-only in every value (NFR-I18N-04, ADR-0005)', () => {
    for (const [key, value] of Object.entries(STRINGS)) {
      const offenders = [...value].filter((c) => (c.codePointAt(0) ?? 0) > 127)
      expect(offenders, `${key} contains non-ASCII: ${offenders.join(' ')}`).toEqual([])
    }
  })

  it('has no empty value', () => {
    for (const [key, value] of Object.entries(STRINGS)) {
      expect(value.length, `${key} is empty`).toBeGreaterThan(0)
    }
  })

  it('substitutes placeholders', () => {
    expect(t('levelN', { n: 3 })).toBe('LEVEL 3')
    expect(t('clearN', { n: 6 })).toBe('LEVEL 6 CLEAR')
  })

  it('leaves an unfilled placeholder visible rather than blank', () => {
    expect(t('levelN')).toBe('LEVEL {n}')
    expect(t('levelN', { wrong: 1 })).toBe('LEVEL {n}')
  })

  it('returns plain strings unchanged', () => {
    expect(t('play')).toBe('PLAY')
    expect(t('newBest')).toBe('NEW BEST')
  })
})
