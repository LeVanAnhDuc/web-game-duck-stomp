# 🦆 DuckStomp — a two-button pixel platformer in the browser

[![CI](https://github.com/LeVanAnhDuc/web-game-duck-stomp/actions/workflows/ci.yml/badge.svg)](https://github.com/LeVanAnhDuc/web-game-duck-stomp/actions/workflows/ci.yml)
[![Deploy](https://github.com/LeVanAnhDuc/web-game-duck-stomp/actions/workflows/deploy.yml/badge.svg)](https://github.com/LeVanAnhDuc/web-game-duck-stomp/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/LeVanAnhDuc/web-game-duck-stomp?sort=semver)](https://github.com/LeVanAnhDuc/web-game-duck-stomp/releases)

Six hand-designed levels on a world map, played with **exactly two controls** — so a
phone and a keyboard play the same game rather than one being a port of the other.
Runs entirely in the browser: no install, no account, no backend. Progress lives in
`localStorage` on the player's own machine. Landscape only.

**Play**: https://levananhduc.github.io/web-game-duck-stomp/

![DuckStomp level 1: three hearts, a coin counter and a running clock above a pixel
platformer, the player standing beside a pit with a question block ahead](docs/assets/screenshot.png)

**Status:** playable end to end. The art is generated placeholder geometry until the
CC0 sprite pack is wired in — see ADR-0006. The local folder is still
`web-game-platformer`; the brand changed, the path did not.

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

## Controls

Two controls while playing, and that is the whole scheme. There is no run button and
no attack button: every ability rides on moving and jumping.

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move left / right | `←` `→` or `A` `D` | the two buttons at the bottom left |
| Jump | `Space`, `↑` or `W` | the larger button at the bottom right |
| Jump higher | hold the jump control longer | same |
| Build up speed | hold a direction — top speed after about half a second | same |
| Smash a cracked wall | run into it at full speed while powered up | same |
| Stomp an enemy | land on it from above | same |
| Pause | `Esc` or `P` | the pause icon in the HUD |
| Menus | `←` `→` to move, `Enter` or `Space` to choose | tap |

On-screen controls are not guessed from the user agent: they appear after the first
touch and hide again after the first key press, because a touchscreen laptop is a
real device and guessing wrong hurts somebody either way.

## Commands

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
| `npm run check:bundle` | Fails if the gzipped script payload exceeds its budget |
| `npm run levels` | Regenerates the level files from their ASCII maps |
| `npm run verify` | Boundary, tests, build and end-to-end, in order |

## How it is put together

```
src/core/     Pure TypeScript. Does not import Phaser, does not read the clock.
              Movement, integer scaling, scoring, unlock rules, save, strings.
src/game/     The Phaser layer: scenes, entities, input, audio, generated art.
assets/levels/ Six Tiled JSON files. Levels are data, not code.
docs/         Why any of this is the way it is.
```

Phaser 3.90 with Arcade Physics, TypeScript, Vite, Vitest and Playwright.

The boundary is the load-bearing part. Game feel is the thing most likely to
regress and the most expensive thing to re-check by hand, so the movement state
machine is a pure function of `(state, input, deltaTime, onGround)` and is covered
by unit tests that run in milliseconds without a browser. `npm run lint:core`
fails the build if anything in `src/core/` imports Phaser, reads the wall clock, or
calls `Math.random`.

Two more consequences of that split are worth knowing before changing anything.
Gravity belongs to `src/core/movement.ts`, not to Arcade Physics, which is why the
whole vertical story — jump, early-release cut, terminal velocity — is testable.
And gameplay only ever *emits* domain events: no collision callback touches the
HUD, plays a sound, or writes a save. That is what lets the HUD be a separate
scene at a different camera zoom without either knowing about the other.

Adding a level does not touch code: drop a Tiled file in `assets/levels/` and add
a node to the map. `scripts/make-level.mjs` authors the six levels as ASCII maps
and refuses to emit one whose pit is wider than the jump arc.

## Art

All sprites are generated in code as placeholders. The intended art is the CC0
[Pixel Adventure](https://pixelfrog-assets.itch.io/pixel-adventure-1) pack by
Pixel Frog; itch.io serves it through a browser flow rather than a URL, so it is
not wired up yet. Every texture sits behind one module, so swapping it in is a
change to `src/game/textures.ts` and nothing else. See ADR-0006.

## Releases and versioning

Three workflows, all in `.github/workflows/`:

| Workflow | When | What it does |
| --- | --- | --- |
| `ci.yml` | every pull request and push to `main` | Core purity boundary, level reproducibility, type-check, unit tests, dependency review, bundle budget, end-to-end smoke tests |
| `deploy.yml` | push to `main` | Builds and publishes to GitHub Pages. Re-runs the unit tests rather than trusting a CI run it cannot see |
| `release.yml` | push to `main` | Derives the next version and composes the release notes from the commits since the last tag |

Versions come from Conventional Commit subjects, not from a hand-edited file. A
`feat:` since the last tag bumps the minor, a `!` or `BREAKING CHANGE` bumps the
major, anything else is a patch. Both steps are scripts in the repo so they can be
exercised on a laptop rather than only by pushing:

```bash
npm run release:next            # prints the tag the next release would carry, and why
npm run release:notes v1.1.0    # prints the notes it would publish
```

Add `[skip release]` to a commit subject to publish nothing, or `[release minor]` /
`[release major]` to override the derived bump.

Those markers are read from the **commit subject on `main`**, and that is easy to
get wrong: putting one in a pull-request title does nothing. A squash of a
single-commit PR reuses that commit's own message, so the marker never reaches
`main` and the release goes out anyway. Put it in the commit.

A `docs:` push cutting a patch release is expected, not a mistake — the marker is
for the case where a docs commit rides along in the same push as a `feat:` that
already earned the version.

GitHub Pages has to be enabled once, by hand, in the repository settings —
`GITHUB_TOKEN` can deploy to Pages but cannot create the site. See ADR-0008.

## Documentation

Start at [`docs/README.md`](docs/README.md). The two worth reading before changing
anything:

- [`docs/03-design/invariants.md`](docs/03-design/invariants.md) — the eleven ways
  this game breaks *silently*, tests still green.
- [`docs/decisions/`](docs/decisions/README.md) — why Phaser and not PixiJS, why no
  lives, why landscape only, why the UI is in English, why the art is generated.
