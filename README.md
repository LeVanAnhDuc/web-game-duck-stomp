# RUNUP

A 2D pixel platformer that runs in the browser. No install, no account, and
**exactly two controls** — so a phone and a keyboard play the same game rather
than one being a port of the other.

Six hand-designed levels on a world map. Static build, no backend, progress kept
in `localStorage`. Landscape only.

> The name `RUNUP` is a working title.

## Features

- Six hand-designed levels on a world map, unlocked in order, with a best time and
  a coin count remembered per level.
- Run-and-jump movement tuned for feel: acceleration that replaces a run button,
  jump height that follows how long you hold, coyote time, and a jump buffer.
- Stomp enemies from above — except the spiky one, which has to be avoided.
- A power-up that turns the player into a stronger form able to smash cracked
  walls at full speed, opening shortcuts and hidden coin rooms.
- Three hearts, a mid-level checkpoint, and respawn in under a second. No lives,
  no game-over screen; dying costs you time, and time is the record.
- Keyboard and touch from one input model: on-screen controls appear the first
  time you touch and disappear the first time you press a key.
- Sound effects synthesised in the browser — no audio files to download.
- Renders at 320×180 scaled by a whole number, so the pixels stay sharp at any
  window size.

## Running it

```bash
npm ci
npm run dev
```

No environment variables. None. See [`.env.example`](.env.example) — it is
deliberately empty, because there is no backend, no datastore and no API key.

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm test` | Unit tests for `src/core/` (Vitest) |
| `npm run test:e2e` | Browser smoke test at three viewports (Playwright) |
| `npm run lint:core` | Enforces the `src/core/` purity boundary |
| `npm run levels` | Regenerates the level files from their ASCII maps |
| `npm run verify` | All of the above, in order |

## How it is put together

```
src/core/     Pure TypeScript. Does not import Phaser, does not read the clock.
              Movement, integer scaling, scoring, unlock rules, save, strings.
src/game/     The Phaser layer: scenes, entities, input, audio, generated art.
assets/levels/ Six Tiled JSON files. Levels are data, not code.
docs/         Why any of this is the way it is.
```

The boundary is the load-bearing part. Game feel is the thing most likely to
regress and the most expensive thing to re-check by hand, so the movement state
machine is a pure function of `(state, input, deltaTime, onGround)` and is covered
by unit tests that run in milliseconds without a browser. `npm run lint:core`
fails the build if anything in `src/core/` imports Phaser, reads the wall clock, or
calls `Math.random`.

Adding a level does not touch code: drop a Tiled file in `assets/levels/` and add
a node to the map.

## Documentation

Start at [`docs/README.md`](docs/README.md). The two worth reading before changing
anything:

- [`docs/03-design/invariants.md`](docs/03-design/invariants.md) — the eleven ways
  this game breaks *silently*, tests still green.
- [`docs/decisions/`](docs/decisions/README.md) — why Phaser and not PixiJS, why no
  lives, why landscape only, why the UI is in English, why the art is generated.

## Art

All sprites are generated in code as placeholders. The intended art is the CC0
[Pixel Adventure](https://pixelfrog-assets.itch.io/pixel-adventure-1) pack by
Pixel Frog; itch.io serves it through a browser flow rather than a URL, so it is
not wired up yet. Every texture sits behind one module, so swapping it in is a
change to `src/game/textures.ts` and nothing else. See ADR-0006.
