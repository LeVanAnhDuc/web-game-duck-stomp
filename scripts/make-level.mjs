#!/usr/bin/env node
/**
 * Authors the six levels as ASCII maps and emits Tiled-shaped JSON — FR-19.
 *
 * Levels are DATA, never code (invariants #3, NFR-GAME-04). Tiled is the intended
 * editor and the output here is its JSON shape, but hand-editing a 112-column grid
 * of gids is how off-by-one level bugs happen, so the maps live as ASCII and this
 * script does the arithmetic. Re-run it after editing a map:
 *
 *   node scripts/make-level.mjs
 *
 * Conventions that matter:
 *   - 12 rows tall. Rows 9-11 are the ground band; row 8 is where things stand.
 *   - A jump apexes at 49px, a shade over three tiles, so anything a player must
 *     REACH sits no higher than row 5. Rows 0-4 are sky.
 *   - Object x/y is the CENTRE of the cell in pixels. Sprites are centre-origin,
 *     so a thing in row 8 rests exactly on the row 9 tile top with no fudge factor.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const TILE = 16
const ROWS = 12
const GROUND_ROW = 9
const OUT_DIR = join('assets', 'levels')

/**
 * The widest pit a player can actually cross, in tiles.
 *
 * Derived, not guessed: jumpVelocity 280 against gravity 800 gives 0.7s of air
 * time, and at maxRun 112 px/s that is 78px of travel — 4.9 tiles. So four tiles
 * (64px) clears with margin and five (80px) is impossible.
 *
 * This began as three levels that could not be finished, found by playing them
 * rather than by reading them. It is asserted at build time now, because
 * "remember the jump arc" is not a plan.
 */
const MAX_GAP = 4

// --- map symbols ------------------------------------------------------------
// Terrain becomes tile gids; everything else becomes an object.
const GID = { '=': 1, '#': 2 }

const OBJECTS = {
  P: { type: 'spawn' },
  G: { type: 'goal' },
  C: { type: 'checkpoint' },
  o: { type: 'coin' },
  '*': { type: 'coinHidden' },
  M: { type: 'powerUp' },
  '?': { type: 'questionBlock', props: { gives: 'coin' } },
  '!': { type: 'questionBlock', props: { gives: 'powerUp' } },
  X: { type: 'crackedBlock' },
  w: { type: 'walker', props: { turnAtEdge: true } },
  v: { type: 'walker', props: { turnAtEdge: false } },
  s: { type: 'spiker', props: { turnAtEdge: true } },
  f: { type: 'flyer', props: { dx: 3, dy: 0, speed: 40 } },
  F: { type: 'flyer', props: { dx: 0, dy: 3, speed: 34 } },
  '^': { type: 'spikes' },
  '-': { type: 'movingPlatform', props: { dx: 4, dy: 0, speed: 32 } },
  '|': { type: 'movingPlatform', props: { dx: 0, dy: 3, speed: 28 } },
}

/** Builds one row of exactly `width` cells by stamping strings at x positions. */
function row(width, ...entries) {
  const cells = new Array(width).fill('.')
  for (const [x, text] of entries) {
    for (let i = 0; i < text.length; i += 1) {
      if (x + i < width) cells[x + i] = text[i]
    }
  }
  return cells.join('')
}

/**
 * Ground band: one grassy top row and TWO fill rows. Three rather than two so the
 * map is 192px tall against a 180px viewport — with only two, the camera showed a
 * 4px strip of nothing beneath the floor.
 */
function band(width, segments) {
  const top = []
  const fill = []
  for (const [x, len] of segments) {
    top.push([x, '='.repeat(len)])
    fill.push([x, '#'.repeat(len)])
  }
  const fillRow = row(width, ...fill)
  return [row(width, ...top), fillRow, fillRow]
}

/** Fails the build on a pit no jump can clear. */
function assertGaps(id, groundRow) {
  let run = 0
  let at = 0
  for (let x = 0; x <= groundRow.length; x += 1) {
    const cell = groundRow[x]
    const solid = cell === '=' || cell === '#'
    if (!solid && x < groundRow.length) {
      if (run === 0) at = x
      run += 1
      continue
    }
    if (run > MAX_GAP) {
      throw new Error(`level ${id}: pit of ${run} tiles at x=${at} exceeds the ${MAX_GAP}-tile jump arc`)
    }
    run = 0
  }
}

/** Fails the build when something that must stand on ground is over a pit. */
const MUST_STAND = new Set(['P', 'G', 'C', 'w', 'v', 's', '^'])

function assertFooting(id, map) {
  const ground = map[GROUND_ROW]
  const standRow = map[GROUND_ROW - 1]
  for (let x = 0; x < standRow.length; x += 1) {
    if (!MUST_STAND.has(standRow[x])) continue
    const under = ground[x]
    if (under !== '=' && under !== '#') {
      throw new Error(`level ${id}: "${standRow[x]}" at x=${x} has no ground under it`)
    }
  }
}

// ---------------------------------------------------------------------------
// LEVEL 1 — run, jump, coin, pit. Nothing else, and no words anywhere.
// The opening is flat and clear so the only thing to do is run; the first gap
// arrives while running, so the only thing to do is jump.
// ---------------------------------------------------------------------------
function level1() {
  const W = 56
  const ground = band(W, [
    [0, 10],
    [14, 8],
    [26, 13],
    [43, 13],
  ])
  return [
    row(W),
    row(W),
    row(W),
    row(W),
    row(W),
    row(W, [18, 'o'], [20, 'o'], [33, 'o']),
    row(W, [11, '?'], [31, 'ooo']),
    row(W, [6, 'o'], [46, 'o']),
    row(W, [4, 'P'], [50, 'G']),
    ...ground,
  ]
}

// ---------------------------------------------------------------------------
// LEVEL 2 — the walker, and stomping it. The first one sits on wide flat ground
// with room to miss and try again; only later does one share space with a pit.
// ---------------------------------------------------------------------------
function level2() {
  const W = 64
  const ground = band(W, [
    [0, 22],
    [26, 14],
    [44, 20],
  ])
  return [
    row(W),
    row(W),
    row(W),
    row(W),
    row(W),
    row(W, [30, 'o'], [32, 'o']),
    row(W, [12, '?'], [17, 'o'], [48, 'oo']),
    row(W, [8, 'o'], [55, 'o']),
    row(W, [3, 'P'], [14, 'w'], [30, 'w'], [37, 'v'], [50, 'w'], [60, 'G']),
    ...ground,
  ]
}

// ---------------------------------------------------------------------------
// LEVEL 3 — the power-up, the cracked wall, and the hidden coins behind it.
// The long clear runway before the wall IS the lesson: it is an invitation to
// hold the direction down, and nothing says so in words (US-05).
// ---------------------------------------------------------------------------
function level3() {
  const W = 72
  const ground = band(W, [
    [0, 30],
    [34, 38],
  ])
  return [
    row(W),
    row(W),
    row(W),
    row(W),
    row(W),
    row(W, [20, 'o'], [22, 'o']),
    row(W, [8, '!'], [26, 'o'], [62, 'o']),
    // A two-tile-tall cracked wall, with the reward sealed behind it.
    row(W, [5, 'o'], [56, 'X'], [58, '**']),
    row(W, [3, 'P'], [18, 'w'], [40, 'w'], [56, 'X'], [58, '**'], [67, 'G']),
    ...ground,
  ]
}

// ---------------------------------------------------------------------------
// LEVEL 4 — the spiker: the thing you must NOT stomp. Introduced alone on flat
// ground with an escape route, because the alternative is teaching it by killing
// someone who did the reasonable thing.
// ---------------------------------------------------------------------------
function level4() {
  const W = 72
  const ground = band(W, [
    [0, 18],
    [22, 16],
    [42, 12],
    [58, 14],
  ])
  return [
    row(W),
    row(W),
    row(W),
    row(W),
    row(W),
    row(W, [25, 'o'], [27, 'o'], [46, 'o']),
    row(W, [6, '!'], [30, 'o'], [50, 'o'], [64, 'oo']),
    row(W, [12, 'o'], [35, 'o']),
    row(W, [3, 'P'], [10, 's'], [25, 'w'], [30, '^'], [46, 's'], [62, '^'], [68, 'G']),
    ...ground,
  ]
}

// ---------------------------------------------------------------------------
// LEVEL 5 — the flyer and the moving platform: a threat and a footing that both
// arrive from the direction a two-button platformer tends to forget, vertical.
// Every pit is still crossable on foot; the platforms are a shortcut, not a toll.
// ---------------------------------------------------------------------------
function level5() {
  const W = 80
  const ground = band(W, [
    [0, 16],
    [20, 12],
    [36, 10],
    [50, 12],
    [66, 14],
  ])
  return [
    row(W),
    row(W),
    row(W),
    row(W),
    row(W, [33, 'f']),
    row(W, [24, 'o'], [26, 'o'], [55, 'o']),
    row(W, [6, '!'], [38, 'o'], [52, 'o'], [70, 'oo']),
    row(W, [17, '-'], [33, '-'], [56, 'X'], [58, '*']),
    row(W, [3, 'P'], [12, 'w'], [24, 's'], [56, 'X'], [58, '*'], [70, '^'], [76, 'G']),
    ...ground,
  ]
}

// ---------------------------------------------------------------------------
// LEVEL 6 — nothing new. Longer, everything at once, and a checkpoint at the
// halfway mark, because losing two minutes to one mistimed jump is how you lose
// a player (ADR-0003).
// ---------------------------------------------------------------------------
function level6() {
  const W = 112
  const ground = band(W, [
    [0, 20],
    [24, 14],
    [42, 12],
    [58, 20],
    [82, 12],
    [98, 14],
  ])
  return [
    row(W),
    row(W),
    row(W),
    row(W),
    row(W, [47, 'f'], [88, 'F']),
    row(W, [28, 'o'], [30, 'o'], [64, 'o'], [66, 'o'], [104, 'o']),
    row(W, [8, '!'], [36, 'o'], [72, 'o'], [86, 'o'], [96, '?']),
    row(W, [20, '-'], [38, '-'], [74, 'X'], [76, '*'], [95, '-']),
    row(W, [3, 'P'], [14, 'w'], [26, 's'], [45, 'v'], [60, 'C'], [64, 'w'], [70, '^'], [74, 'X'], [76, '*'], [90, 's'], [108, 'G']),
    ...ground,
  ]
}

const LEVELS = { 1: level1(), 2: level2(), 3: level3(), 4: level4(), 5: level5(), 6: level6() }

// --- compile ----------------------------------------------------------------
function compile(id, map) {
  if (map.length !== ROWS) throw new Error(`level ${id}: expected ${ROWS} rows, got ${map.length}`)
  const width = map[0].length
  map.forEach((r, i) => {
    if (r.length !== width) throw new Error(`level ${id} row ${i}: width ${r.length}, expected ${width}`)
  })

  assertGaps(id, map[GROUND_ROW])
  assertFooting(id, map)

  const data = []
  const objects = []
  let objectId = 1
  let spawns = 0
  let goals = 0

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const ch = map[y][x]
      const gid = GID[ch]
      data.push(gid ?? 0)

      if (gid !== undefined || ch === '.') continue

      const spec = OBJECTS[ch]
      if (spec === undefined) throw new Error(`level ${id} at ${x},${y}: unknown symbol "${ch}"`)
      if (spec.type === 'spawn') spawns += 1
      if (spec.type === 'goal') goals += 1

      const properties = Object.entries(spec.props ?? {}).map(([name, value]) => ({
        name,
        type: typeof value === 'boolean' ? 'bool' : typeof value === 'number' ? 'float' : 'string',
        value,
      }))

      objects.push({
        id: objectId++,
        name: '',
        type: spec.type,
        x: x * TILE + TILE / 2,
        y: y * TILE + TILE / 2,
        width: TILE,
        height: TILE,
        visible: true,
        rotation: 0,
        ...(properties.length > 0 ? { properties } : {}),
      })
    }
  }

  if (spawns !== 1) throw new Error(`level ${id}: needs exactly one spawn, found ${spawns}`)
  if (goals !== 1) throw new Error(`level ${id}: needs exactly one goal, found ${goals}`)

  const loose = objects.filter((o) => o.type === 'coin' || o.type === 'coinHidden').length
  const fromBlocks = objects.filter(
    (o) => o.type === 'questionBlock' && (o.properties ?? []).some((p) => p.name === 'gives' && p.value === 'coin'),
  ).length

  return {
    json: {
      compressionlevel: -1,
      width,
      height: ROWS,
      tilewidth: TILE,
      tileheight: TILE,
      infinite: false,
      orientation: 'orthogonal',
      renderorder: 'right-down',
      tiledversion: '1.11.0',
      type: 'map',
      version: '1.10',
      nextlayerid: 3,
      nextobjectid: objectId,
      tilesets: [
        {
          firstgid: 1,
          name: 'tiles',
          image: 'tileset.png',
          imagewidth: TILE * 2,
          imageheight: TILE,
          tilewidth: TILE,
          tileheight: TILE,
          tilecount: 2,
          columns: 2,
          margin: 0,
          spacing: 0,
        },
      ],
      layers: [
        { id: 1, name: 'terrain', type: 'tilelayer', width, height: ROWS, x: 0, y: 0, opacity: 1, visible: true, data },
        { id: 2, name: 'objects', type: 'objectgroup', draworder: 'topdown', x: 0, y: 0, opacity: 1, visible: true, objects },
      ],
    },
    stats: { width, coins: loose + fromBlocks, objects: objects.length },
  }
}

await mkdir(OUT_DIR, { recursive: true })

for (const [id, map] of Object.entries(LEVELS)) {
  const { json, stats } = compile(id, map)
  const path = join(OUT_DIR, `level-${id}.json`)
  await writeFile(path, `${JSON.stringify(json, null, 1)}\n`, 'utf8')
  console.log(`level ${id}: ${stats.width} tiles wide, ${stats.objects} objects, ${stats.coins} coins -> ${path}`)
}
