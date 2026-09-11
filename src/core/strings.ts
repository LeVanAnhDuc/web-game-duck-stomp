/**
 * Every string a player can see or hear read out, in one table — NFR-I18N-01.
 *
 * ASCII only, and that is a hard constraint rather than a style preference: the
 * pixel typefaces this game uses (Jersey 15, Pixelify Sans) ship a latin-ext
 * subset that covers U+1E00-1E9F and U+1EF2-1EFF but leaves U+1EA0-U+1EF1 empty,
 * which is where almost every Vietnamese tone-marked vowel lives. A single such
 * character falls back to a different face mid-word and reads as a rendering bug.
 * See ADR-0005. A test in strings.test.ts fails the build if one sneaks in.
 */

export const STRINGS = {
  // Title
  play: 'PLAY',
  continue: 'CONTINUE',

  // World map
  start: 'START',
  levelN: 'LEVEL {n}',
  best: 'BEST',
  locked: 'LOCKED',

  // Play + HUD
  time: 'TIME',
  coins: 'COINS',

  // Overlays
  paused: 'PAUSED',
  resume: 'RESUME',
  retry: 'RETRY',
  map: 'MAP',
  clearN: 'LEVEL {n} CLEAR',
  newBest: 'NEW BEST',
  nextN: 'LEVEL {n}',

  // Icon-only controls. These are never drawn as text — they are the accessible
  // names for buttons that carry only a sprite (NFR-A11Y-04).
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  pause: 'Pause',
  moveLeft: 'Move left',
  moveRight: 'Move right',
  jump: 'Jump',
} as const

export type StringKey = keyof typeof STRINGS

/**
 * Look up a string, substituting `{name}` placeholders.
 *
 * Unknown placeholders are left as-is rather than blanked: a visible `{n}` in the
 * UI is a bug you notice, an empty gap is a bug you ship.
 */
export function t(key: StringKey, params?: Readonly<Record<string, string | number>>): string {
  const template: string = STRINGS[key]
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => {
    const value = params[name]
    return value === undefined ? whole : String(value)
  })
}
