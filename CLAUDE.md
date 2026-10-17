# CLAUDE.md

**Duck Stomp** — a two-button pixel platformer (Phaser 3 + Vite + TypeScript), a static
site served from GitHub Pages (https://levananhduc.github.io/web-game-duck-stomp/). No
server, no database, no API: everything runs in the browser and progress lives in
`localStorage`. The methodology layer (docs contract, feature flow, hooks) is
`.claude/CLAUDE.md`; read it before working.

## Layout

| Folder | Holds |
| --- | --- |
| `client/` | the game app: `package.json`, `pnpm-lock.yaml`, `.env.example`, `index.html`, `src/`, `assets/levels/`, `scripts/`, unit tests (vitest, next to the code) |
| `automation-testing/` | the end-to-end regression suite (Playwright): requirements, test cases, defects, page objects, specs — its own `package.json`, rules in `automation-testing/CLAUDE.md` |
| `docs/` | product docs, requirements, ADRs, feature specs — map in `docs/README.md` |
| `.claude/`, `.githooks/`, `.github/`, `cliff.toml` | Claude config, git hooks, CI, release notes config — all at the root |

`.env.example` lives at `client/.env.example` (`.claude/CLAUDE.md` still draws it at the
root — same file, it moved with the app).

## Commands

```bash
cd client
pnpm install --frozen-lockfile
pnpm dev              # Vite dev server, http://localhost:5173
pnpm test             # vitest: unit tests for src/core/ (+ DOM tests for the sign-in files)
pnpm lint:core        # src/core/ purity boundary (invariants #2, #5)
pnpm build            # tsc --noEmit, then vite build to client/dist/
pnpm check:bundle     # NFR-PERF-08 gzipped script budget (after build)
pnpm levels           # regenerate assets/levels/*.json from their ASCII maps
pnpm release:next     # next version, from the commits (git-cliff, whole repo)
```

```bash
cd automation-testing
pnpm install && pnpm exec playwright install chromium
pnpm test             # starts the Vite dev servers of ../client (:4173, and :4174 with sign-in on), runs every module
pnpm typecheck
pnpm coverage:check   # REQ ↔ TC ↔ spec ↔ bug; --write regenerates the traceability matrix
```

Regression tests: automation-testing/ (/write-tests)

Git hooks: `git config core.hooksPath .githooks` (commit-msg + pre-commit `lint:core` and
`tsc` when staged `client/` files change).
