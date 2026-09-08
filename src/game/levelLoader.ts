/**
 * Reads a Tiled JSON level — FR-04, invariants #3.
 *
 * Levels are data, and data from disk is validated like anything else: a level
 * file that is missing, truncated or hand-edited must produce a clear failure the
 * caller can recover from (NFR-REL-03 — there is always a way back to the map),
 * never a half-built scene that limps along with no floor.
 *
 * Object coordinates in these files are cell CENTRES in pixels, which is what
 * `scripts/make-level.mjs` writes and what centre-origin sprites want.
 */

export type TiledProperty = { name: string; type: string; value: unknown }

export type TiledObject = {
  id: number
  type: string
  x: number
  y: number
  width: number
  height: number
  properties?: TiledProperty[]
}

export type LevelData = {
  widthTiles: number
  heightTiles: number
  tileSize: number
  widthPx: number
  heightPx: number
  /** Row-major tile indices. -1 is empty; 0 and 1 are the two terrain tiles. */
  tiles: number[][]
  objects: TiledObject[]
  /** Everything a perfect run can collect, blocks included. Drives the `6/8` readout. */
  totalCoins: number
}

export class LevelFormatError extends Error {}

function asRecord(value: unknown, what: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new LevelFormatError(`${what} is not an object`)
  }
  return value as Record<string, unknown>
}

function asNumber(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new LevelFormatError(`${what} is not a finite number`)
  }
  return value
}

export function parseLevel(raw: unknown): LevelData {
  const root = asRecord(raw, 'level')

  const widthTiles = asNumber(root['width'], 'level.width')
  const heightTiles = asNumber(root['height'], 'level.height')
  const tileSize = asNumber(root['tilewidth'], 'level.tilewidth')

  const layers = root['layers']
  if (!Array.isArray(layers)) throw new LevelFormatError('level.layers is not an array')

  const terrain = layers.map((l) => asRecord(l, 'layer')).find((l) => l['name'] === 'terrain')
  if (terrain === undefined) throw new LevelFormatError('level has no "terrain" layer')

  const flat = terrain['data']
  if (!Array.isArray(flat)) throw new LevelFormatError('terrain.data is not an array')
  if (flat.length !== widthTiles * heightTiles) {
    throw new LevelFormatError(`terrain.data has ${flat.length} cells, expected ${widthTiles * heightTiles}`)
  }

  const tiles: number[][] = []
  for (let y = 0; y < heightTiles; y += 1) {
    const row: number[] = []
    for (let x = 0; x < widthTiles; x += 1) {
      const gid = flat[y * widthTiles + x]
      // Tiled uses 0 for empty and firstgid-based ids for tiles; Phaser wants -1
      // for empty and a zero-based index otherwise.
      row.push(typeof gid === 'number' && gid > 0 ? gid - 1 : -1)
    }
    tiles.push(row)
  }

  const objectLayer = layers.map((l) => asRecord(l, 'layer')).find((l) => l['name'] === 'objects')
  const rawObjects = objectLayer === undefined ? [] : objectLayer['objects']
  const objects: TiledObject[] = []
  if (Array.isArray(rawObjects)) {
    for (const item of rawObjects) {
      const o = asRecord(item, 'object')
      const type = o['type']
      if (typeof type !== 'string' || type === '') continue
      objects.push({
        id: asNumber(o['id'], 'object.id'),
        type,
        x: asNumber(o['x'], `object ${type}.x`),
        y: asNumber(o['y'], `object ${type}.y`),
        width: typeof o['width'] === 'number' ? o['width'] : tileSize,
        height: typeof o['height'] === 'number' ? o['height'] : tileSize,
        ...(Array.isArray(o['properties']) ? { properties: o['properties'] as TiledProperty[] } : {}),
      })
    }
  }

  if (!objects.some((o) => o.type === 'spawn')) throw new LevelFormatError('level has no spawn')
  if (!objects.some((o) => o.type === 'goal')) throw new LevelFormatError('level has no goal')

  return {
    widthTiles,
    heightTiles,
    tileSize,
    widthPx: widthTiles * tileSize,
    heightPx: heightTiles * tileSize,
    tiles,
    objects,
    totalCoins: countCoins(objects),
  }
}

/**
 * Counts every coin a perfect run can end with: loose coins, hidden coins, and
 * the ones inside question blocks. Derived from the file rather than written down
 * twice, so the `6/8` readout can never disagree with the level.
 */
export function countCoins(objects: readonly TiledObject[]): number {
  let total = 0
  for (const o of objects) {
    if (o.type === 'coin' || o.type === 'coinHidden') total += 1
    else if (o.type === 'questionBlock' && prop(o, 'gives', 'coin') === 'coin') total += 1
  }
  return total
}

/** Reads a Tiled custom property, falling back when it is absent or the wrong type. */
export function prop<T extends string | number | boolean>(object: TiledObject, name: string, fallback: T): T {
  const found = object.properties?.find((p) => p.name === name)
  if (found === undefined) return fallback
  return typeof found.value === typeof fallback ? (found.value as T) : fallback
}
