/**
 * The one place the game talks to persistence.
 *
 * `core/storage` is pure and knows nothing about when to write. This holds the
 * loaded save for the session and writes it back, so no scene ever pokes
 * localStorage directly (architecture.md §3 forbids it) and no scene has to care
 * whether persistence actually worked.
 *
 * `persisted` being false is not an error state to show anyone: the game is fully
 * playable without storage (NFR-REL-05), it simply forgets between visits.
 */

import { browserStorage, emptySave, loadSave, saveSave, type SaveData, type StorageLike } from '../core/storage'
import { mergeResult, type LevelResult } from '../core/scoring'

export class SaveStore {
  private readonly storage: StorageLike | null
  private data: SaveData

  constructor(storage: StorageLike | null = browserStorage()) {
    this.storage = storage
    this.data = loadSave(storage)
  }

  get save(): Readonly<SaveData> {
    return this.data
  }

  get persisted(): boolean {
    return this.storage !== null
  }

  get muted(): boolean {
    return this.data.muted
  }

  setMuted(muted: boolean): void {
    this.data.muted = muted
    this.flush()
  }

  /** Folds a finished run into the record and reports whether it beat the best. */
  recordResult(levelId: string, result: LevelResult): boolean {
    const { next, isNewBest } = mergeResult(this.data.levels[levelId], result)
    this.data.levels[levelId] = next
    this.flush()
    return isNewBest
  }

  /** Wipes progress. Not reachable from the UI yet; here so tests and dev can reset. */
  reset(): void {
    this.data = emptySave()
    this.flush()
  }

  private flush(): void {
    saveSave(this.storage, this.data)
  }
}
