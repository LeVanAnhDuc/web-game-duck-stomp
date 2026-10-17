// Text exactly as the game shows it. Source of every string: ../client/src/core/strings.ts (STRINGS, ASCII only —
// ADR-0005). The game has one locale and no server messages.
export const copy = {
  // TitleScene draws the name directly (not through STRINGS): the brand, not a translatable string.
  appName: "Duck Stomp",
  titleLogo: "DUCK STOMP",
  // strings.ts → play, continue
  play: "PLAY",
  continue: "CONTINUE",
  // strings.ts → start, levelN, best, locked
  start: "START",
  levelN: (n: string | number) => `LEVEL ${n}`,
  best: "BEST",
  locked: "LOCKED",
  // strings.ts → time, coins
  time: "TIME",
  coins: "COINS",
  // strings.ts → paused, resume, retry, map, clearN, newBest, nextN
  paused: "PAUSED",
  resume: "RESUME",
  retry: "RETRY",
  map: "MAP",
  clearN: (n: string | number) => `LEVEL ${n} CLEAR`,
  newBest: "NEW BEST",
  nextN: (n: string | number) => `LEVEL ${n}`,
  // strings.ts → signIn, signingIn, duckerProfile, signOut, duckerAccount
  account: {
    signIn: "SIGN IN",
    signingIn: "SIGNING IN...",
    profile: "DUCKER ID PROFILE",
    signOut: "SIGN OUT",
    accountButton: "Ducker ID account",
  },
  // strings.ts → soundOn, soundOff, pause, moveLeft, moveRight, jump: accessible names of icon-only buttons
  icon: {
    soundOn: "Sound on",
    soundOff: "Sound off",
    pause: "Pause",
  },
} as const;

export const serverMessage = {} as const;
