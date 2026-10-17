/**
 * The only thing this game persists — FR-14, invariants #4.
 *
 * Two rules govern everything here, and both come from the same fact: a save file
 * lives on the player's machine longer than the code that wrote it does.
 *
 *   1. Every save carries a `version`, and nothing is ever read without being
 *      validated field by field. A dev machine always has a save the current code
 *      just wrote; a real player may have one from three releases ago, or one they
 *      edited by hand, or one a different site on the same origin clobbered.
 *   2. Nothing here throws. Storage can be unavailable (private mode), full
 *      (quota), or blocked outright. NFR-REL-05 says the game stays fully playable
 *      in that case — it just forgets. So failure is a return value, never an
 *      exception, and a corrupt save is indistinguishable from no save.
 */

import type { LevelRecord } from './scoring'

export const SAVE_KEY = 'platformer.save.v1'
export const SAVE_VERSION = 1 as const

export type SaveData = {
  version: typeof SAVE_VERSION
  levels: Record<string, LevelRecord>
  muted: boolean
}

/**
 * The slice of `Storage` this module actually uses. Narrower than `Storage` so
 * tests can hand in a plain object, and so nothing here can reach for `clear()`.
 */
export type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function emptySave(): SaveData {
  return { version: SAVE_VERSION, levels: {}, muted: false }
}

/** Returns the real `localStorage`, or null when it cannot be touched at all. */
export function browserStorage(): StorageLike | null {
  try {
    const probe = globalThis.localStorage
    if (probe === undefined || probe === null) return null
    // Some browsers expose the object and throw only on use, so use it once.
    const key = `${SAVE_KEY}.probe`
    probe.setItem(key, '1')
    probe.removeItem(key)
    return probe
  } catch {
    return null
  }
}

function isValidLevelRecord(value: unknown): value is LevelRecord {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>

  if (typeof record['cleared'] !== 'boolean') return false

  const best = record['bestTimeMs']
  const bestOk = best === null || (typeof best === 'number' && Number.isFinite(best) && best >= 0)
  if (!bestOk) return false

  const coins = record['coins']
  if (typeof coins !== 'number' || !Number.isInteger(coins) || coins < 0) return false

  return true
}

/**
 * Reads the save. Never throws, and never returns a partially-trusted object:
 * anything that fails validation is dropped, and a whole-file failure yields a
 * fresh empty save (NFR-REL-04).
 */
export function loadSave(storage: StorageLike | null): SaveData {
  if (storage === null) return emptySave()

  let raw: string | null
  try {
    raw = storage.getItem(SAVE_KEY)
  } catch {
    return emptySave()
  }
  if (raw === null || raw === '') return emptySave()

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return emptySave()
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return emptySave()
  const root = parsed as Record<string, unknown>

  // Unknown version: there is exactly one version so far, so there is nothing to
  // migrate FROM yet. When a version 2 exists, this is where its upgrade goes —
  // and the point of failing closed here is that a future save can never be read
  // as if it were this one.
  if (root['version'] !== SAVE_VERSION) return emptySave()

  const save = emptySave()
  save.muted = root['muted'] === true

  const levels = root['levels']
  if (typeof levels === 'object' && levels !== null && !Array.isArray(levels)) {
    for (const [id, value] of Object.entries(levels as Record<string, unknown>)) {
      if (!isValidLevelRecord(value)) continue
      save.levels[id] = { cleared: value.cleared, bestTimeMs: value.bestTimeMs, coins: value.coins }
    }
  }

  return save
}

/** Writes the save. Returns false when it could not be persisted — the caller carries on. */
export function saveSave(storage: StorageLike | null, data: SaveData): boolean {
  if (storage === null) return false
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}
