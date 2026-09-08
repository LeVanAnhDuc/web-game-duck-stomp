/**
 * The one-way channel out of gameplay — see architecture.md §4.
 *
 * Collision callbacks emit these and nothing else. They never touch the HUD, never
 * play a sound directly, never write to storage. The HUD scene, the audio layer
 * and the progress layer each subscribe to what they care about.
 *
 * That one-directional rule is why the HUD can be a separate scene at a different
 * camera zoom, and why there is no sound call scattered through the entity code.
 */

export const GAME_EVENT = {
  coinCollected: 'coinCollected',
  powerUpTaken: 'powerUpTaken',
  playerHit: 'playerHit',
  powerUpLost: 'powerUpLost',
  blockBroken: 'blockBroken',
  blockThudded: 'blockThudded',
  blockBumped: 'blockBumped',
  enemyStomped: 'enemyStomped',
  checkpointReached: 'checkpointReached',
  playerDied: 'playerDied',
  playerRespawned: 'playerRespawned',
  levelCompleted: 'levelCompleted',
  timeTick: 'timeTick',
} as const

export type GameEventName = (typeof GAME_EVENT)[keyof typeof GAME_EVENT]

export type CoinCollectedPayload = { collected: number; total: number }
export type HeartsPayload = { hearts: number }
export type TimeTickPayload = { elapsedMs: number }
export type LevelCompletedPayload = { levelId: string; timeMs: number; coins: number; totalCoins: number }
