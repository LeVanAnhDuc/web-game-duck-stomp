/**
 * Every number that decides how the game FEELS, in one place.
 *
 * Units are deliberate and uniform: velocities in px/second, accelerations in
 * px/second^2, durations in milliseconds. The world is 16px tiles on a 320x180
 * base, so it is worth reading these in tiles: `maxRun` 112 is seven tiles a
 * second, `jumpVelocity` 280 against `gravity` 800 apexes at 49px, a shade over
 * three tiles.
 *
 * These are a STARTING POINT for hand-tuning on a real device, not measurements.
 * Nothing here has been felt yet. The tests below guard relationships between the
 * numbers, never the numbers themselves, precisely so tuning stays cheap.
 *
 * Gravity lives here rather than in Arcade Physics on purpose: `core/movement`
 * owns the whole vertical story (jump, early-release cut, terminal velocity) so
 * that all of it is unit-testable without a browser. Arcade's own gravity is set
 * to zero — see game/scenes/GameScene.ts.
 */
export const TUNING = {
  // --- horizontal -----------------------------------------------------------
  /** Top running speed. Seven tiles a second. */
  maxRun: 112,
  /** Ramp up to `maxRun` in roughly 0.43s. This curve replaces a run button (ADR-0004). */
  accel: 260,
  /** Decay when no direction is held. Slightly faster than accel, so stopping feels intentional. */
  friction: 340,
  /** Reversing bites harder than starting, or turning around feels like ice. */
  turnAccel: 700,

  // --- vertical -------------------------------------------------------------
  gravity: 800,
  /** Apex of a full-height jump is v^2/2g = 49px, just over three tiles. */
  jumpVelocity: 280,
  /** Releasing the button while still rising keeps this fraction of the remaining rise. */
  cutMultiplier: 0.4,
  /** Terminal velocity, so a long fall stays readable and cannot tunnel through tiles. */
  maxFallSpeed: 420,

  // --- forgiveness ----------------------------------------------------------
  /** Grace after walking off a ledge during which a jump still counts. */
  coyoteTimeMs: 90,
  /** How early a jump press is remembered so it fires on the landing frame. */
  jumpBufferMs: 110,

  // --- interactions ---------------------------------------------------------
  /** Horizontal speed needed to smash a cracked block while powered (FR-07). */
  breakSpeed: 90,
  /** Invulnerability after taking a hit, so one touch cannot cost two hearts. */
  invulnMs: 900,
  knockbackX: 90,
  knockbackY: 150,
  /** Upward kick after stomping an enemy — smaller than a real jump. */
  stompBounce: 190,
} as const
