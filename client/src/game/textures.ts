/**
 * Every sprite in the game, drawn in code — ADR-0006.
 *
 * The real art is the CC0 Pixel Adventure pack, which itch.io serves through a
 * browser flow rather than a URL. Rather than block the whole build on a 204 kB
 * zip, all art is generated at boot from the ASCII maps below. Nothing outside
 * this file names a texture: gameplay code only ever uses the `TEX` keys, so
 * swapping in the real atlas means changing `generateTextures` and nothing else.
 *
 * The colours are the placeholder palette from MASTER.md, deliberately NOT the
 * game's final look. Two exceptions carry real meaning and will survive the swap:
 * coins are `--gold` because gold means "worth taking", and the powered player is
 * the same silhouette with a gold outline instead of a dark one. That last trick
 * is why a power-up reads as "same character, stronger" rather than "different
 * character" — the design called for two sprites of the same family, and one
 * palette swap gets there for free.
 */

import Phaser from 'phaser'

export const TILE = 16

export const TEX = {
  tileset: 'tex-tileset',
  player: 'tex-player',
  playerPowered: 'tex-player-powered',
  walker: 'tex-walker',
  spiker: 'tex-spiker',
  flyer: 'tex-flyer',
  coin: 'tex-coin',
  powerUp: 'tex-power-up',
  crackedBlock: 'tex-cracked-block',
  questionBlock: 'tex-question-block',
  questionBlockSpent: 'tex-question-block-spent',
  spikes: 'tex-spikes',
  platform: 'tex-platform',
  checkpointOff: 'tex-checkpoint-off',
  checkpointOn: 'tex-checkpoint-on',
  goal: 'tex-goal',
  spark: 'tex-spark',
} as const

export type TextureKey = (typeof TEX)[keyof typeof TEX]

/** Placeholder palette. `D` is the outline, and swapping it is the whole power-up. */
export const ART = {
  D: 0x131735,
  B: 0x3b4581,
  L: 0x4e58a0,
  H: 0x6e79c8,
  I: 0xf2ecdf,
  G: 0xf2b33d,
  R: 0xf4666b,
  V: 0x7b84ba,
} as const

export type Art = readonly string[]

function paint(g: Phaser.GameObjects.Graphics, art: Art, palette: Readonly<Record<string, number>>): void {
  for (let y = 0; y < art.length; y += 1) {
    const row = art[y]
    if (row === undefined) continue
    for (let x = 0; x < row.length; x += 1) {
      const colour = palette[row[x] ?? '.']
      if (colour === undefined) continue
      g.fillStyle(colour, 1)
      g.fillRect(x, y, 1, 1)
    }
  }
}

/**
 * Same body for both player forms. `D` is the outline colour, so the powered form
 * is one palette entry away — see the note at the top of this file.
 */
const PLAYER: Art = [
  '.....DDDDDD.....',
  '....DIIIIIID....',
  '....DIDIIDID....',
  '....DIIIIIID....',
  '....DDIIIIDD....',
  '...DDIIIIIIDD...',
  '..DDIIIIIIIIDD..',
  '..DIIIIIIIIIID..',
  '..DIIIIIIIIIID..',
  '..DDIIIIIIIIDD..',
  '....DIIIIIID....',
  '....DIIIIIID....',
  '....DDII IIDD...',
  '....DI....ID....',
  '...DDD....DDD...',
  '................',
]

const WALKER: Art = [
  '................',
  '................',
  '................',
  '..DDDDDDDDDDDD..',
  '.DVVVVVVVVVVVVD.',
  '.DVVDVVVVVVDVVD.',
  '.DVVDVVVVVVDVVD.',
  '.DVVVVVVVVVVVVD.',
  '.DVVVVVVVVVVVVD.',
  '.DVVVVVVVVVVVVD.',
  '.DVVDDDDDDDDVVD.',
  '..DDDDDDDDDDDD..',
  '..DD........DD..',
  '.DDD........DDD.',
  '................',
  '................',
]

const SPIKER: Art = [
  '...R....R...R...',
  '..RRR..RRR.RRR..',
  '.RRRRRRRRRRRRRR.',
  '..DDDDDDDDDDDD..',
  '.DVVVVVVVVVVVVD.',
  '.DVVDVVVVVVDVVD.',
  '.DVVDVVVVVVDVVD.',
  '.DVVVVVVVVVVVVD.',
  '.DVVVVVVVVVVVVD.',
  '.DVVVVVVVVVVVVD.',
  '.DVVDDDDDDDDVVD.',
  '..DDDDDDDDDDDD..',
  '..DD........DD..',
  '.DDD........DDD.',
  '................',
  '................',
]

const FLYER: Art = [
  '................',
  '................',
  'DD..........DD..',
  'DHD........DHD..',
  'DHHD..DDDD..DHHD',
  '.DHHDDHHHHDDHHD.',
  '..DHHHHDDHHHHHD.',
  '..DHHHDIIDHHHHD.',
  '..DHHHDIIDHHHD..',
  '...DHHHHDDHHHD..',
  '....DDHHHHDDD...',
  '......DDDD......',
  '................',
  '................',
  '................',
  '................',
]

// A disc with a cream highlight down the left. The first version had a dark bar
// through the middle, which read as a coin seen edge-on -- at HUD size it looked
// like an exclamation mark.
const COIN: Art = [
  '................',
  '................',
  '.....GGGGGG.....',
  '....GGGGGGGG....',
  '...GGGGGGGGGG...',
  '..GGGIGGGGGGGG..',
  '..GGIGGGGGGGGG..',
  '..GGIGGGGGGGGG..',
  '..GGIGGGGGGGGG..',
  '..GGGIGGGGGGGG..',
  '...GGGGGGGGGG...',
  '....GGGGGGGG....',
  '.....GGGGGG.....',
  '................',
  '................',
  '................',
]

const POWER_UP: Art = [
  '................',
  '................',
  '.....GGGGGG.....',
  '...GGGGGGGGGG...',
  '..GGGIIGGIIGGG..',
  '..GGGIIGGIIGGG..',
  '..GGGGGGGGGGGG..',
  '...GGGGGGGGGG...',
  '.....DIIIID.....',
  '.....DIIIID.....',
  '.....DIIIID.....',
  '.....DDDDDD.....',
  '................',
  '................',
  '................',
  '................',
]

const CRACKED: Art = [
  'LLLLLLLLLLLLLLLL',
  'LBBBDBBBBBBBBBBL',
  'LBBBBDBBBBBBBBBL',
  'LBBBBBDBBBBDBBBL',
  'LBBBBDBBBBDBBBBL',
  'LBBBDBBBBDBBBBBL',
  'LBBBBDBBBBDBBBBL',
  'LBBBBBDBBBBDBBBL',
  'LBBBBBBDBBBBBBBL',
  'LBBBBBDBBBBBBBBL',
  'LBBBBDBBBBBDBBBL',
  'LBBBDBBBBBBDBBBL',
  'LBBBBDBBBBBBDBBL',
  'LBBBBBDBBBBBBBBL',
  'LBBBBBBDBBBBBBBL',
  'LLLLLLLLLLLLLLLL',
]

const QUESTION: Art = [
  'LLLLLLLLLLLLLLLL',
  'LHHHHHHHHHHHHHHL',
  'LHHHGGGGGGHHHHHL',
  'LHHGGHHHHGGHHHHL',
  'LHHGGHHHHGGHHHHL',
  'LHHHHHHHHGGHHHHL',
  'LHHHHHHHGGHHHHHL',
  'LHHHHHHGGHHHHHHL',
  'LHHHHHGGHHHHHHHL',
  'LHHHHHGGHHHHHHHL',
  'LHHHHHHHHHHHHHHL',
  'LHHHHHGGHHHHHHHL',
  'LHHHHHGGHHHHHHHL',
  'LHHHHHHHHHHHHHHL',
  'LHHHHHHHHHHHHHHL',
  'LLLLLLLLLLLLLLLL',
]

const QUESTION_SPENT: Art = [
  'LLLLLLLLLLLLLLLL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LBBBBBBBBBBBBBBL',
  'LLLLLLLLLLLLLLLL',
]

const SPIKES: Art = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '..R....R....R...',
  '.RRR..RRR..RRR..',
  '.RRR..RRR..RRR..',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'DDDDDDDDDDDDDDDD',
  'DDDDDDDDDDDDDDDD',
  '................',
  '................',
  '................',
]

const PLATFORM: Art = [
  'HHHHHHHHHHHHHHHH',
  'HLLLLLLLLLLLLLLH',
  'HLBBBBBBBBBBBBLH',
  'DDDDDDDDDDDDDDDD',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]

const checkpoint = (lit: boolean): Art => {
  const flag = lit ? 'G' : 'V'
  return [
    `....${flag}${flag}${flag}${flag}${flag}${flag}....`,
    `....${flag}${flag}${flag}${flag}${flag}${flag}....`,
    `....${flag}${flag}${flag}${flag}${flag}${flag}....`,
    `....${flag}${flag}${flag}${flag}${flag}${flag}....`,
    '....II..........',
    '....II..........',
    '....II..........',
    '....II..........',
    '....II..........',
    '....II..........',
    '....II..........',
    '....II..........',
    '....II..........',
    '....II..........',
    '...DIID.........',
    '...DDDD.........',
  ]
}

const GOAL: Art = [
  '...IGGGGGGGGGI..',
  '...IGGGGGGGGGI..',
  '...IGGGGGGGGGI..',
  '...IGGGGGGGGGI..',
  '...IGGGGGGGGGI..',
  '...IIIIIIIIIII..',
  '...II...........',
  '...II...........',
  '...II...........',
  '...II...........',
  '...II...........',
  '...II...........',
  '...II...........',
  '...II...........',
  '...II...........',
  '..DDIIDD........',
  '..DDDDDD........',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]

const SPARK: Art = ['GG', 'GG']

export function bakeArt(scene: Phaser.Scene, key: string, art: Art, palette: Readonly<Record<string, number>>): void {
  if (scene.textures.exists(key)) return
  const width = art.reduce((w, row) => Math.max(w, row.length), 0)
  const height = art.length
  const g = scene.make.graphics({ x: 0, y: 0 }, false)
  paint(g, art, palette)
  g.generateTexture(key, width, height)
  g.destroy()
}

/**
 * The terrain tileset: two tiles side by side in one 32x16 texture.
 * Tile 0 is a grassy top, tile 1 is fill. Drawn with rects rather than ASCII
 * because they are regular, and because the 1px dark right/bottom edge is what
 * makes a wall of them read as separate blocks instead of one flat slab.
 */
function bakeTileset(scene: Phaser.Scene): void {
  if (scene.textures.exists(TEX.tileset)) return
  const g = scene.make.graphics({ x: 0, y: 0 }, false)

  // tile 0 — top
  g.fillStyle(ART.B, 1)
  g.fillRect(0, 0, TILE, TILE)
  g.fillStyle(ART.L, 1)
  g.fillRect(0, 0, TILE, 4)
  g.fillStyle(ART.H, 1)
  g.fillRect(0, 0, TILE, 1)
  g.fillStyle(ART.D, 1)
  g.fillRect(TILE - 1, 0, 1, TILE)
  g.fillRect(0, TILE - 1, TILE, 1)

  // tile 1 — fill
  g.fillStyle(ART.B, 1)
  g.fillRect(TILE, 0, TILE, TILE)
  g.fillStyle(ART.L, 1)
  g.fillRect(TILE + 2, 2, 2, 2)
  g.fillRect(TILE + 9, 7, 2, 2)
  g.fillStyle(ART.D, 1)
  g.fillRect(TILE * 2 - 1, 0, 1, TILE)
  g.fillRect(TILE, TILE - 1, TILE, 1)

  g.generateTexture(TEX.tileset, TILE * 2, TILE)
  g.destroy()
}

export function generateTextures(scene: Phaser.Scene): void {
  bakeTileset(scene)

  bakeArt(scene, TEX.player, PLAYER, ART)
  // The whole power-up, visually: the same body with a gold outline.
  bakeArt(scene, TEX.playerPowered, PLAYER, { ...ART, D: ART.G })

  bakeArt(scene, TEX.walker, WALKER, ART)
  bakeArt(scene, TEX.spiker, SPIKER, ART)
  bakeArt(scene, TEX.flyer, FLYER, ART)
  bakeArt(scene, TEX.coin, COIN, ART)
  bakeArt(scene, TEX.powerUp, POWER_UP, ART)
  bakeArt(scene, TEX.crackedBlock, CRACKED, ART)
  bakeArt(scene, TEX.questionBlock, QUESTION, ART)
  bakeArt(scene, TEX.questionBlockSpent, QUESTION_SPENT, ART)
  bakeArt(scene, TEX.spikes, SPIKES, ART)
  bakeArt(scene, TEX.platform, PLATFORM, ART)
  bakeArt(scene, TEX.checkpointOff, checkpoint(false), ART)
  bakeArt(scene, TEX.checkpointOn, checkpoint(true), ART)
  bakeArt(scene, TEX.goal, GOAL, ART)
  bakeArt(scene, TEX.spark, SPARK, ART)
}
