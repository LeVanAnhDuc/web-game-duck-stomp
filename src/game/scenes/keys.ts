export const SCENE = {
  boot: 'Boot',
  preload: 'Preload',
  title: 'Title',
  worldMap: 'WorldMap',
  game: 'Game',
  hud: 'Hud',
  pause: 'Pause',
  levelComplete: 'LevelComplete',
} as const

export type SceneKey = (typeof SCENE)[keyof typeof SCENE]

export const REGISTRY = {
  zoom: 'zoom',
  sfx: 'sfx',
  save: 'save',
} as const
