# core-game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một game platformer 2D chơi được hết 6 màn, trên bàn phím và cảm ứng, static 100%, lưu tiến độ vào localStorage.

**Architecture:** `src/core/` là TypeScript thuần không biết Phaser tồn tại và chứa toàn bộ luật kiểm thử được (di chuyển, phóng, điểm, tiến độ, lưu, chuỗi). `src/game/` là tầng Phaser: scene, entity, input, audio, texture. Màn chơi là dữ liệu Tiled JSON, không phải code. Sự kiện đi một chiều gameplay → HUD/audio/progress.

**Tech Stack:** Phaser 3.90 · TypeScript strict · Vite · Vitest · Playwright · npm

**Spec:** `docs/specs/core-game/design.md`

## Global Constraints

- Base render `320×180`. Zoom **chỉ số nguyên**: `zoom = max(1, floor(min(vw/320, vh/180)))`. Letterbox màu `#131735`. (NFR-GAME-01, invariants #1)
- Tile `16×16`. Nhân vật `16×16`. (ADR-0006)
- `src/core/**` **không được** `import 'phaser'` và không import `src/game/**`. (invariants #2)
- `core/movement.step()` nhận `dtMs` truyền vào; **không** gọi `Date.now()` / `performance.now()`. (invariants #5)
- Vòng `update()` không cấp phát object mới. (NFR-PERF-06, invariants #6)
- Save luôn có `version: 1`; không bao giờ đọc save mà không validate. (invariants #4)
- Mọi chuỗi hiển thị **ASCII-only**, qua `core/strings`. (NFR-I18N-01, NFR-I18N-04, ADR-0005)
- Token màu: `--night-deep #131735` · `--night #262E5E` · `--panel #2E376B` · `--ink #F2ECDF` · `--ink-dim #AEB4DA` · `--gold #F2B33D` · `--heart #F4666B` · `--locked #7B84BA` · `--on-gold #131735`. Placeholder art: `#3B4581` `#4E58A0` `#6E79C8`. `border-radius: 0`, bóng khối đặc không blur, không `transition`.
- Đúng **hai** điều khiển khi chơi: di chuyển, nhảy. Không nút thứ ba. (ADR-0004)
- Không backend, không biến môi trường. (`.env.example` rỗng có chủ ý)
- Conventional Commits, subject tiếng Anh, body giải thích **lý do**.

---

### Task 1: Scaffold dự án

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `src/main.ts`, `.gitignore` (bổ sung), `README.md`
- Create: `src/core/.gitkeep`, `src/game/.gitkeep`, `assets/levels/.gitkeep`
- Test: `src/core/smoke.test.ts`

**Interfaces:**
- Consumes: —
- Produces: `npm run dev` · `npm run build` · `npm run test` · `npm run lint:core` (script grep chặn `core/` import phaser)

- [ ] **Step 1: `npm init -y`, cài dependency**

```bash
npm install phaser@^3.90.0
npm install -D vite typescript vitest @types/node
```

- [ ] **Step 2: `tsconfig.json` strict**

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "bundler",
    "strict": true, "noUncheckedIndexedAccess": true, "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true, "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"], "skipLibCheck": true, "isolatedModules": true,
    "verbatimModuleSyntax": true, "outDir": "dist"
  },
  "include": ["src", "tests"]
}
```

- [ ] **Step 3: Viết test khói**

```ts
// src/core/smoke.test.ts
import { describe, expect, it } from 'vitest'
describe('toolchain', () => {
  it('runs typescript under vitest', () => { expect(1 + 1).toBe(2) })
})
```

- [ ] **Step 4: Chạy `npm test` — phải PASS**

Run: `npm test`. Expected: 1 passed.

- [ ] **Step 5: Script `lint:core` chặn vi phạm invariants #2**

```json
"lint:core": "node scripts/check-core-boundary.mjs"
```
Script đọc mọi file trong `src/core/`, fail nếu tìm thấy `from 'phaser'`, `require('phaser')`, `../game/`, `Date.now(`, `performance.now(`.

- [ ] **Step 6: Chạy `npm run lint:core` và `npm run build` — cả hai phải xanh**

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "chore: scaffold vite + typescript + phaser + vitest"
```

---

### Task 2: `core/scale` — phóng số nguyên

**Files:**
- Create: `src/core/scale.ts`
- Test: `src/core/scale.test.ts`

**Interfaces:**
- Produces: `BASE_W = 320`, `BASE_H = 180`, `computeScale(vw: number, vh: number): { zoom: number; canvasW: number; canvasH: number }`

- [ ] **Step 1: Viết test thất bại**

```ts
import { describe, expect, it } from 'vitest'
import { BASE_H, BASE_W, computeScale } from './scale'

describe('computeScale', () => {
  it('never returns a fractional zoom', () => {
    for (let vw = 200; vw <= 2000; vw += 7) {
      for (let vh = 150; vh <= 1200; vh += 11) {
        const { zoom } = computeScale(vw, vh)
        expect(Number.isInteger(zoom)).toBe(true)
      }
    }
  })
  it('never returns zoom below 1, even on tiny viewports', () => {
    expect(computeScale(100, 80).zoom).toBe(1)
  })
  it('picks the limiting axis', () => {
    expect(computeScale(667, 375).zoom).toBe(2)   // 667/320=2.08, 375/180=2.08
    expect(computeScale(1024, 768).zoom).toBe(3)  // 1024/320=3.2
    expect(computeScale(1440, 900).zoom).toBe(4)  // 1440/320=4.5, 900/180=5
  })
  it('canvas is always base times zoom', () => {
    const r = computeScale(1440, 900)
    expect(r.canvasW).toBe(BASE_W * r.zoom)
    expect(r.canvasH).toBe(BASE_H * r.zoom)
  })
})
```

- [ ] **Step 2: Chạy — phải FAIL** (`Cannot find module './scale'`)
- [ ] **Step 3: Hiện thực tối thiểu**

```ts
export const BASE_W = 320
export const BASE_H = 180
export function computeScale(vw: number, vh: number) {
  const zoom = Math.max(1, Math.floor(Math.min(vw / BASE_W, vh / BASE_H)))
  return { zoom, canvasW: BASE_W * zoom, canvasH: BASE_H * zoom }
}
```

- [ ] **Step 4: Chạy — phải PASS**
- [ ] **Step 5: Commit** — `feat(core): integer-only canvas scaling (NFR-GAME-01)`

---

### Task 3: `core/strings` — bảng chuỗi ASCII

**Files:**
- Create: `src/core/strings.ts`
- Test: `src/core/strings.test.ts`

**Interfaces:**
- Produces: `STRINGS: Record<StringKey, string>`, `t(key: StringKey): string`, type `StringKey`

Khoá cần có: `play` `continue` `start` `paused` `resume` `retry` `map` `time` `coins` `best` `newBest` `levelN` `clear` `soundOn` `soundOff` `jump` `moveLeft` `moveRight` `rotateHint`.

- [ ] **Step 1: Viết test thất bại**

```ts
import { describe, expect, it } from 'vitest'
import { STRINGS, t } from './strings'

describe('strings', () => {
  it('is ASCII-only in every value (NFR-I18N-04)', () => {
    for (const [key, value] of Object.entries(STRINGS)) {
      const bad = [...value].filter((c) => c.codePointAt(0)! > 127)
      expect(bad, `${key} has non-ASCII: ${bad.join('')}`).toEqual([])
    }
  })
  it('has no empty value', () => {
    for (const [key, value] of Object.entries(STRINGS)) {
      expect(value.length, key).toBeGreaterThan(0)
    }
  })
  it('formats level labels', () => { expect(t('levelN').replace('{n}', '3')).toBe('LEVEL 3') })
})
```

- [ ] **Step 2: FAIL** → **Step 3: hiện thực** → **Step 4: PASS**
- [ ] **Step 5: Commit** — `feat(core): ascii-only string table (ADR-0005)`

---

### Task 4: `core/tuning` — mọi con số cảm giác điều khiển

**Files:**
- Create: `src/core/tuning.ts`
- Test: `src/core/tuning.test.ts`

**Interfaces:**
- Produces: `TUNING` (object hằng `as const`) với: `maxRun` `accel` `friction` `turnAccel` `jumpVelocity` `cutMultiplier` `gravity` `coyoteTimeMs` `jumpBufferMs` `breakSpeed` `invulnMs` `knockbackX` `knockbackY` `stompBounce` `maxFallSpeed`

Đơn vị: px/giây cho vận tốc, px/giây² cho gia tốc, ms cho thời gian. Số ban đầu là **điểm khởi đầu để gọt**, không phải kết quả đo.

- [ ] **Step 1: Test bảo vệ tính hợp lý** (không test giá trị cụ thể — chúng sẽ được gọt)

```ts
import { describe, expect, it } from 'vitest'
import { TUNING } from './tuning'
describe('tuning', () => {
  it('turning is at least as sharp as accelerating', () => {
    expect(TUNING.turnAccel).toBeGreaterThanOrEqual(TUNING.accel)
  })
  it('break speed is reachable', () => {
    expect(TUNING.breakSpeed).toBeLessThan(TUNING.maxRun)
  })
  it('jump cut shortens, never lengthens', () => {
    expect(TUNING.cutMultiplier).toBeGreaterThan(0)
    expect(TUNING.cutMultiplier).toBeLessThan(1)
  })
  it('has a terminal fall speed', () => {
    expect(TUNING.maxFallSpeed).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2–4: FAIL → hiện thực → PASS**
- [ ] **Step 5: Commit** — `feat(core): single tuning table for game feel`

---

### Task 5: `core/movement` — máy trạng thái thuần

**Files:**
- Create: `src/core/movement.ts`
- Test: `src/core/movement.test.ts`

**Interfaces:**
- Consumes: `TUNING` (Task 4)
- Produces:

```ts
export type InputSnapshot = { left: boolean; right: boolean; jumpPressed: boolean; jumpHeld: boolean }
export type MoveState = {
  vx: number; vy: number; facing: 1 | -1
  coyoteMs: number; bufferMs: number
  onGround: boolean; jumping: boolean
}
export function initialMoveState(): MoveState
export function step(state: MoveState, input: InputSnapshot, dtMs: number, onGround: boolean): MoveState
```

`step` trả về state **mới** (không mutate) — nhưng để tránh cấp phát mỗi frame (NFR-PERF-06), `GameScene` giữ đúng một state object và `step` ghi vào một object đích tái dùng: chữ ký thật là `step(state, input, dtMs, onGround, out)`. Test dùng `out` riêng để so sánh dễ.

- [ ] **Step 1: Viết test thất bại — bảng luật ở design.md §1**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { TUNING } from './tuning'
import { initialMoveState, step, type InputSnapshot, type MoveState } from './movement'

const NONE: InputSnapshot = { left: false, right: false, jumpPressed: false, jumpHeld: false }
const RIGHT: InputSnapshot = { ...NONE, right: true }
const JUMP: InputSnapshot = { ...NONE, jumpPressed: true, jumpHeld: true }
const FRAME = 16

let s: MoveState
beforeEach(() => { s = initialMoveState() })

describe('runRamp', () => {
  it('accelerates toward maxRun while held, never past it', () => {
    for (let i = 0; i < 200; i++) s = step(s, RIGHT, FRAME, true)
    expect(s.vx).toBeCloseTo(TUNING.maxRun, 1)
  })
  it('takes several frames to reach top speed - not instant', () => {
    s = step(s, RIGHT, FRAME, true)
    expect(s.vx).toBeGreaterThan(0)
    expect(s.vx).toBeLessThan(TUNING.maxRun * 0.5)
  })
  it('decays toward zero when released', () => {
    for (let i = 0; i < 200; i++) s = step(s, RIGHT, FRAME, true)
    const top = s.vx
    for (let i = 0; i < 10; i++) s = step(s, NONE, FRAME, true)
    expect(s.vx).toBeLessThan(top)
    expect(s.vx).toBeGreaterThanOrEqual(0)
  })
  it('turns faster than it accelerates from rest', () => {
    for (let i = 0; i < 200; i++) s = step(s, RIGHT, FRAME, true)
    const before = s.vx
    s = step(s, { ...NONE, left: true }, FRAME, true)
    expect(before - s.vx).toBeGreaterThan(TUNING.accel * (FRAME / 1000))
  })
  it('resolves both directions held without sticking', () => {
    s = step(s, { ...NONE, left: true, right: true }, FRAME, true)
    expect(s.vx).toBe(0)
  })
  it('tracks facing and keeps it when idle', () => {
    s = step(s, RIGHT, FRAME, true); expect(s.facing).toBe(1)
    s = step(s, { ...NONE, left: true }, FRAME, true); expect(s.facing).toBe(-1)
    s = step(s, NONE, FRAME, true); expect(s.facing).toBe(-1)
  })
})

describe('variableJump', () => {
  it('launches upward on press while grounded', () => {
    s = step(s, JUMP, FRAME, true)
    expect(s.vy).toBeCloseTo(-TUNING.jumpVelocity, 1)
  })
  it('cuts the rise when the button is released early', () => {
    s = step(s, JUMP, FRAME, true)
    const full = s.vy
    s = step(s, NONE, FRAME, false)
    expect(s.vy).toBeGreaterThan(full * TUNING.cutMultiplier - 1)
    expect(s.vy).toBeGreaterThan(full)
  })
  it('does not cut again once falling', () => {
    s = step(s, JUMP, FRAME, true)
    for (let i = 0; i < 60; i++) s = step(s, NONE, FRAME, false)
    const v = s.vy
    s = step(s, NONE, FRAME, false)
    expect(s.vy).toBeGreaterThanOrEqual(v)
  })
  it('clamps fall speed', () => {
    for (let i = 0; i < 600; i++) s = step(s, NONE, FRAME, false)
    expect(s.vy).toBeLessThanOrEqual(TUNING.maxFallSpeed)
  })
  it('ignores a press in mid-air with no buffer left', () => {
    s = step(s, NONE, FRAME, false)
    for (let i = 0; i < 60; i++) s = step(s, NONE, FRAME, false)
    const before = s.vy
    s = step(s, JUMP, FRAME, false)
    expect(s.vy).toBeGreaterThan(before - 1)
  })
})

describe('coyoteTime', () => {
  it('allows a jump shortly after leaving the ground', () => {
    s = step(s, NONE, FRAME, true)
    s = step(s, NONE, FRAME, false)
    s = step(s, JUMP, FRAME, false)
    expect(s.vy).toBeCloseTo(-TUNING.jumpVelocity, 1)
  })
  it('expires after coyoteTimeMs', () => {
    s = step(s, NONE, FRAME, true)
    s = step(s, NONE, TUNING.coyoteTimeMs + FRAME, false)
    const before = s.vy
    s = step(s, JUMP, FRAME, false)
    expect(s.vy).toBeGreaterThan(before - 1)
  })
  it('is consumed by the jump, so it cannot double jump', () => {
    s = step(s, NONE, FRAME, true)
    s = step(s, JUMP, FRAME, false)
    s = step(s, JUMP, FRAME, false)
    expect(s.vy).toBeGreaterThan(-TUNING.jumpVelocity * 1.1)
  })
})

describe('jumpBuffer', () => {
  it('fires on the landing frame when pressed slightly early', () => {
    s = step(s, JUMP, FRAME, false)
    s = step(s, NONE, FRAME, true)
    expect(s.vy).toBeCloseTo(-TUNING.jumpVelocity, 1)
  })
  it('expires after jumpBufferMs', () => {
    s = step(s, JUMP, FRAME, false)
    s = step(s, NONE, TUNING.jumpBufferMs + FRAME, false)
    s = step(s, NONE, FRAME, true)
    expect(s.vy).toBeGreaterThan(-TUNING.jumpVelocity * 0.5)
  })
})

describe('determinism (NFR-GAME-02)', () => {
  it('same input sequence yields identical state', () => {
    const run = () => {
      let x = initialMoveState()
      const seq: InputSnapshot[] = [RIGHT, RIGHT, JUMP, RIGHT, NONE, NONE, RIGHT]
      for (const i of seq) x = step(x, i, FRAME, i === NONE)
      return x
    }
    expect(run()).toEqual(run())
  })
  it('never reads the wall clock', () => {
    const src = String(step)
    expect(src).not.toContain('Date.now')
    expect(src).not.toContain('performance.now')
  })
})
```

- [ ] **Step 2: Chạy — phải FAIL**
- [ ] **Step 3: Hiện thực `step` theo đúng bảng ở design.md §1**
- [ ] **Step 4: Chạy — mọi test PASS**
- [ ] **Step 5: Commit** — `feat(core): pure movement state machine with coyote time and jump buffer (FR-03)`

---

### Task 6: `core/scoring` + `core/progress`

**Files:**
- Create: `src/core/scoring.ts`, `src/core/progress.ts`
- Test: `src/core/scoring.test.ts`, `src/core/progress.test.ts`

**Interfaces:**
- Produces:
```ts
// scoring.ts
export type LevelResult = { timeMs: number; coins: number }
export type LevelRecord = { cleared: boolean; bestTimeMs: number | null; coins: number }
export function mergeResult(prev: LevelRecord | undefined, r: LevelResult): { next: LevelRecord; isNewBest: boolean }
export function formatTime(ms: number): string        // "0:42", tabular, m:ss
// progress.ts
export const LEVEL_IDS = ['1','2','3','4','5','6'] as const
export type LevelId = (typeof LEVEL_IDS)[number]
export function isUnlocked(levels: Record<string, LevelRecord>, id: LevelId): boolean
export function nextLevel(id: LevelId): LevelId | null
export function totalCoins(levels: Record<string, LevelRecord>): number
```

- [ ] **Step 1: Test thất bại**

```ts
// scoring.test.ts
import { describe, expect, it } from 'vitest'
import { formatTime, mergeResult } from './scoring'

describe('mergeResult', () => {
  it('first clear records the time and flags a new best', () => {
    const { next, isNewBest } = mergeResult(undefined, { timeMs: 42_000, coins: 6 })
    expect(next).toEqual({ cleared: true, bestTimeMs: 42_000, coins: 6 })
    expect(isNewBest).toBe(true)
  })
  it('keeps the faster time and flags a new best', () => {
    const prev = { cleared: true, bestTimeMs: 42_000, coins: 6 }
    const { next, isNewBest } = mergeResult(prev, { timeMs: 39_500, coins: 4 })
    expect(next.bestTimeMs).toBe(39_500)
    expect(isNewBest).toBe(true)
  })
  it('does NOT flag a new best on a slower run', () => {
    const prev = { cleared: true, bestTimeMs: 42_000, coins: 6 }
    const { next, isNewBest } = mergeResult(prev, { timeMs: 51_000, coins: 8 })
    expect(next.bestTimeMs).toBe(42_000)
    expect(isNewBest).toBe(false)
  })
  it('coins only ever go up (US-02)', () => {
    const prev = { cleared: true, bestTimeMs: 42_000, coins: 6 }
    expect(mergeResult(prev, { timeMs: 60_000, coins: 2 }).next.coins).toBe(6)
    expect(mergeResult(prev, { timeMs: 60_000, coins: 8 }).next.coins).toBe(8)
  })
  it('cleared never reverts to false', () => {
    const prev = { cleared: true, bestTimeMs: 1, coins: 0 }
    expect(mergeResult(prev, { timeMs: 999, coins: 0 }).next.cleared).toBe(true)
  })
})

describe('formatTime', () => {
  it('formats as m:ss', () => {
    expect(formatTime(42_000)).toBe('0:42')
    expect(formatTime(9_000)).toBe('0:09')
    expect(formatTime(125_400)).toBe('2:05')
  })
  it('clamps negatives to 0:00', () => { expect(formatTime(-5)).toBe('0:00') })
})
```

```ts
// progress.test.ts
import { describe, expect, it } from 'vitest'
import { isUnlocked, nextLevel, totalCoins } from './progress'

const clear = { cleared: true, bestTimeMs: 1000, coins: 3 }
describe('isUnlocked', () => {
  it('level 1 is always unlocked', () => { expect(isUnlocked({}, '1')).toBe(true) })
  it('level N unlocks only when N-1 is cleared', () => {
    expect(isUnlocked({}, '2')).toBe(false)
    expect(isUnlocked({ '1': clear }, '2')).toBe(true)
    expect(isUnlocked({ '1': clear }, '3')).toBe(false)
  })
  it('does not unlock from a non-adjacent clear', () => {
    expect(isUnlocked({ '4': clear }, '6')).toBe(false)
  })
})
describe('nextLevel', () => {
  it('walks forward and stops at the last', () => {
    expect(nextLevel('1')).toBe('2')
    expect(nextLevel('6')).toBe(null)
  })
})
describe('totalCoins', () => {
  it('sums coins across levels', () => {
    expect(totalCoins({ '1': clear, '2': { ...clear, coins: 5 } })).toBe(8)
  })
})
```

- [ ] **Step 2–4: FAIL → hiện thực → PASS**
- [ ] **Step 5: Commit** — `feat(core): scoring and unlock rules (FR-12, FR-02)`

---

### Task 7: `core/storage` — lưu có version, validate, migrate

**Files:**
- Create: `src/core/storage.ts`
- Test: `src/core/storage.test.ts`

**Interfaces:**
- Consumes: `LevelRecord` (Task 6)
- Produces:
```ts
export const SAVE_KEY = 'platformer.save.v1'
export type SaveData = { version: 1; levels: Record<string, LevelRecord>; muted: boolean }
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>
export function emptySave(): SaveData
export function loadSave(s: StorageLike | null): SaveData          // never throws
export function saveSave(s: StorageLike | null, d: SaveData): boolean  // false = not persisted
```

- [ ] **Step 1: Test thất bại — 6 payload rác + storage throw**

```ts
import { describe, expect, it, vi } from 'vitest'
import { emptySave, loadSave, SAVE_KEY, saveSave, type StorageLike } from './storage'

const mem = (init?: string): StorageLike & { data: Record<string, string> } => {
  const data: Record<string, string> = init === undefined ? {} : { [SAVE_KEY]: init }
  return { data, getItem: (k) => data[k] ?? null, setItem: (k, v) => { data[k] = v } }
}

describe('loadSave never throws (NFR-REL-04)', () => {
  const junk = ['', 'not json at all', '[]', 'null', '{"version":99}', '{"version":1,"levels":"nope","muted":false}']
  for (const j of junk) {
    it(`treats ${JSON.stringify(j).slice(0, 24)} as no save`, () => {
      expect(loadSave(mem(j))).toEqual(emptySave())
    })
  }
  it('drops malformed level records but keeps valid ones', () => {
    const s = mem(JSON.stringify({ version: 1, muted: false, levels: {
      '1': { cleared: true, bestTimeMs: 1000, coins: 3 },
      '2': { cleared: 'yes', bestTimeMs: 'fast', coins: null },
    } }))
    const out = loadSave(s)
    expect(out.levels['1']).toEqual({ cleared: true, bestTimeMs: 1000, coins: 3 })
    expect(out.levels['2']).toBeUndefined()
  })
  it('survives a storage that throws on read (NFR-REL-05)', () => {
    const bad: StorageLike = { getItem: () => { throw new Error('blocked') }, setItem: () => {} }
    expect(loadSave(bad)).toEqual(emptySave())
  })
  it('survives no storage at all', () => { expect(loadSave(null)).toEqual(emptySave()) })
})

describe('saveSave', () => {
  it('round-trips', () => {
    const s = mem()
    const d = emptySave(); d.muted = true
    expect(saveSave(s, d)).toBe(true)
    expect(loadSave(s)).toEqual(d)
  })
  it('is idempotent (NFR-REL-02)', () => {
    const s = mem(); const d = emptySave()
    saveSave(s, d); const first = s.data[SAVE_KEY]
    saveSave(s, d); expect(s.data[SAVE_KEY]).toBe(first)
  })
  it('reports false when storage throws, without throwing (NFR-REL-05)', () => {
    const bad: StorageLike = { getItem: () => null, setItem: () => { throw new Error('quota') } }
    expect(saveSave(bad, emptySave())).toBe(false)
  })
})
```

- [ ] **Step 2–4: FAIL → hiện thực → PASS**
- [ ] **Step 5: Commit** — `feat(core): versioned, validating localStorage save (FR-14)`

---

### Task 8: `game/textures` — sinh art placeholder

**Files:**
- Create: `src/game/textures.ts`

**Interfaces:**
- Produces: `TEX` (bảng khoá texture: `terrain` `player` `playerPowered` `walker` `spiker` `flyer` `coin` `powerUp` `crackedBlock` `questionBlock` `spikes` `platform` `checkpoint` `goal`), `generateTextures(scene: Phaser.Scene): void`

Mỗi texture `16×16` (trừ `goal` `16×32`), vẽ bằng `Graphics` rồi `generateTexture(key, w, h)`. Palette placeholder: `#3B4581` thân, `#4E58A0` viền sáng, `#6E79C8` nhấn; player `#F2ECDF`, powered `#F2B33D` viền, địch `#7B84BA`, spiker `#F4666B` gai, xu `#F2B33D`.

- [ ] **Step 1: Hiện thực** — không có unit test (cần Phaser runtime); được bọc bởi smoke test ở Task 18
- [ ] **Step 2: `npm run build` xanh**
- [ ] **Step 3: Commit** — `feat(game): generate placeholder textures at boot (ADR-0006)`

---

### Task 9: `game/audio` — SFX WebAudio

**Files:**
- Create: `src/game/audio.ts`

**Interfaces:**
- Produces: `class Sfx { unlock(): void; play(name: SfxName): void; setMuted(m: boolean): void; get muted(): boolean }`
  với `SfxName = 'jump' | 'coin' | 'stomp' | 'hurt' | 'break' | 'thud' | 'clear'`

`thud` là tiếng "đâm tường mà chưa đủ đà" — design.md §3 yêu cầu nó **khác** `break`.
`unlock()` gọi ở cú bấm PLAY. `AudioContext` không dùng được → im lặng, không throw (ADR-0007).

- [ ] **Step 1: Hiện thực** — oscillator + gain envelope, mỗi tiếng < 300ms
- [ ] **Step 2: Commit** — `feat(game): synthesised chiptune sfx (FR-17, ADR-0007)`

---

### Task 10: `game/input` — một snapshot cho hai nền tảng

**Files:**
- Create: `src/game/input.ts`

**Interfaces:**
- Consumes: `InputSnapshot` (Task 5)
- Produces: `class InputManager { constructor(scene: Phaser.Scene); readonly snapshot: InputSnapshot; get showTouch(): boolean; update(): void; destroy(): void }`

Bàn phím: `←/→/A/D` di chuyển, `Space/W/↑` nhảy. Cảm ứng: ba vùng `Zone` do `GameScene` đặt.
`sawTouch` / `sawKey` quyết định `showTouch` — **không đọc user-agent** (invariants #11).
`snapshot` là **một object tái dùng**, ghi tại chỗ (NFR-PERF-06).

- [ ] **Step 1: Hiện thực** → **Step 2: build xanh** → **Step 3: Commit** — `feat(game): unified keyboard and touch input (FR-15, ADR-0004)`

---

### Task 11: Boot + Preload + cổng xoay màn + main

**Files:**
- Create: `src/game/scenes/BootScene.ts`, `src/game/scenes/PreloadScene.ts`, `src/game/rotateGate.ts`
- Modify: `src/main.ts`, `index.html`

**Interfaces:**
- Consumes: `computeScale` (Task 2), `generateTextures` (Task 8)
- Produces: `createGame(): Phaser.Game`, `mountRotateGate(game: Phaser.Game): void`

Phaser config: `pixelArt: true`, `roundPixels: true`, `scale.mode = Phaser.Scale.NONE`, kích thước từ `computeScale`, `backgroundColor: '#131735'`. Resize → tính lại zoom, `game.scale.resize`, canvas căn giữa.
`rotateGate` là overlay DOM; bật khi `innerHeight > innerWidth`; **gọi `scene.pause()` trước khi hiện** (US-03).

- [ ] **Step 1: Hiện thực** → **Step 2: `npm run dev`, mở browser, thấy nền và không có lỗi console** → **Step 3: Commit** — `feat(game): boot with integer scaling and rotate gate (FR-16, FR-18)`

---

### Task 12: `LevelLoader` + định dạng màn + màn 1

**Files:**
- Create: `src/game/levelLoader.ts`, `assets/levels/level-1.json`
- Create: `scripts/make-level.mjs` (sinh Tiled JSON từ một khai báo ASCII gọn, để 6 màn nhất quán)

**Interfaces:**
- Produces: `type LevelData`, `loadLevel(scene, id): LevelData`, `countCoins(id): number`

Object layer `type`: `spawn` `goal` `checkpoint` `coin` `coinHidden` `powerUp` `questionBlock` `crackedBlock` `walker` `spiker` `flyer` `spikes` `movingPlatform`. Thuộc tính: `turnAtEdge`, `path` (`x2`,`y2`,`speed`), `gives`.

- [ ] **Step 1: Viết `scripts/make-level.mjs`** — nhận map ASCII + bảng ký hiệu, xuất Tiled JSON
- [ ] **Step 2: Sinh `level-1.json`** — hành lang hẹp, một vực, một xu treo cao. Không chữ.
- [ ] **Step 3: Hiện thực `loadLevel`**
- [ ] **Step 4: Commit** — `feat(game): tiled level loader, level 1 (FR-04, FR-19)`

---

### Task 13: `Player` + `GameScene` + `HUDScene`

**Files:**
- Create: `src/game/entities/Player.ts`, `src/game/scenes/GameScene.ts`, `src/game/scenes/HUDScene.ts`, `src/game/events.ts`

**Interfaces:**
- Consumes: `step`/`InputSnapshot` (5), `InputManager` (10), `loadLevel` (12), `Sfx` (9), `formatTime` (6)
- Produces: `GAME_EVENTS` (`coinCollected` `playerHit` `powerUpTaken` `blockBroken` `blockThudded` `checkpointReached` `levelCompleted` `playerDied`), `class Player`

`GameScene.update(_, dt)`: đọc `input.snapshot` → `step(...)` → áp `vx`/`vy` lên Arcade body. Callback va chạm **chỉ phát sự kiện**, không sửa UI. Đồng hồ **không reset khi hồi sinh** (invariants #9).

- [ ] **Step 1: Hiện thực** → **Step 2: chơi thử màn 1 bằng bàn phím, cảm giác nhảy đúng** → **Step 3: Commit** — `feat(game): playable level with hud (FR-03, FR-06)`

---

### Task 14: Vật phẩm và khối

**Files:**
- Create: `src/game/entities/Coin.ts`, `PowerUp.ts`, `QuestionBlock.ts`, `CrackedBlock.ts`, `Checkpoint.ts`, `Goal.ts`
- Modify: `src/game/scenes/GameScene.ts`

Luật phá khối nứt đúng design.md §3: `|vx| >= TUNING.breakSpeed` theo chiều ngang, **hoặc** `vy > 0` từ trên. Không đủ đà → `blockThudded`, khối rung một nhịp, SFX `thud`.

- [ ] **Step 1: Hiện thực** → **Step 2: thử tay cả hai nhánh phá/không phá** → **Step 3: Commit** — `feat(game): coins, power-up, question and cracked blocks (FR-05, FR-07, FR-10, FR-11)`

---

### Task 15: Địch và hazard

**Files:**
- Create: `src/game/entities/Walker.ts`, `Spiker.ts`, `Flyer.ts`, `Spikes.ts`, `MovingPlatform.ts`
- Modify: `src/game/scenes/GameScene.ts`

Thứ tự sát thương đúng design.md §2. `pit` bỏ qua bảng đó — chết ngay (invariants #8).
`spiker` không chết khi bị đạp. `walker.turnAtEdge` đọc từ Tiled, không phải hai lớp code.

- [ ] **Step 1: Hiện thực** → **Step 2: thử tay: đạp walker chết, đạp spiker mất tim, rơi vực chết ngay** → **Step 3: Commit** — `feat(game): three enemy types and hazards (FR-08, FR-09)`

---

### Task 16: Màn 2–6

**Files:**
- Create: `assets/levels/level-2.json` … `level-6.json`

Theo bảng dạy-gì ở design.md §5. Màn 6 có checkpoint giữa màn.

- [ ] **Step 1: Sinh 5 màn** → **Step 2: chơi hết từng màn, xác nhận đi được tới cờ** → **Step 3: Commit** — `feat(game): levels 2-6 (FR-19)`

---

### Task 17: `WorldMapScene` + overlay Pause và LevelComplete

**Files:**
- Create: `src/game/scenes/WorldMapScene.ts`, `TitleScene.ts`, `PauseScene.ts`, `LevelCompleteScene.ts`, `src/game/ui.ts`

**Interfaces:**
- Consumes: `isUnlocked`/`nextLevel`/`totalCoins` (6), `loadSave`/`saveSave` (7), `t` (3), `Sfx` (9)

`ui.ts` dựng nút/panel theo token `MASTER.md`: `border-radius 0`, bóng khối đặc 4px, không transition, focus vàng.
Signature element: đường bản đồ **tự vẽ từng đoạn** khi mở node mới, ~400ms, tôn trọng `prefers-reduced-motion` (NFR-A11Y-05).
Cú bấm PLAY gọi `sfx.unlock()` (ADR-0007).

- [ ] **Step 1: Hiện thực** → **Step 2: đi hết vòng Title → Map → Play → Clear → Map, xác nhận node mở và kỷ lục lưu** → **Step 3: Commit** — `feat(game): title, world map and overlays (FR-01, FR-02, FR-12, FR-13)`

---

### Task 18: Smoke test Playwright + xem app thật

**Files:**
- Create: `tests/smoke.spec.ts`, `playwright.config.ts`
- Modify: `package.json`

Một test duy nhất: tải trang, bấm PLAY, vào màn 1, chụp ảnh ở `667×375` · `1024×768` · `1440×900`, khẳng định không có lỗi console. **Không** E2E physics.

- [ ] **Step 1: Hiện thực** → **Step 2: `npx playwright test` xanh, xem 3 ảnh** → **Step 3: Commit** — `test: playwright smoke across three viewports`

---

### Task 19: README + đồng bộ tài liệu

**Files:**
- Modify: `README.md`, `docs/02-requirements/scope.md` (FR → `xong`), `docs/04-state/backlog.md`

- [ ] **Step 1: README có `## Features`, mỗi FR user-facing một dòng tiếng Anh ngắn**
- [ ] **Step 2: Đổi trạng thái FR trong `scope.md`**
- [ ] **Step 3: `bash .claude/scripts/docs-regen.sh` — không có ID mồ côi, không thiếu biến env**
- [ ] **Step 4: Commit** — `docs: record shipped features and sync scope`

---

## Self-review

**Spec coverage:** design.md §1→T5 · §2→T15 · §3→T14 · §4→T12 · §5→T12+T16 · §6→T6+T7 · §7→T2 · §8→T10+T11 · §9→T2,3,5,6,7,18 · §10→ADR-0006/0007 (cố ý chưa làm).
FR-01→T17 · FR-02→T6,T17 · FR-03→T5,T13 · FR-04→T12 · FR-05→T14 · FR-06→T13,T15 · FR-07→T14 · FR-08→T15 · FR-09→T15 · FR-10→T14 · FR-11→T14 · FR-12→T6,T17 · FR-13→T17 · FR-14→T7 · FR-15→T10 · FR-16→T11 · FR-17→T9 · FR-18→T2,T11 · FR-19→T12,T16. Không FR nào thiếu task.

**Placeholder scan:** không có TBD/TODO. Mọi task core có code test thật.

**Type consistency:** `LevelRecord` định nghĩa ở T6 và dùng lại ở T7 · `InputSnapshot` định nghĩa ở T5 và dùng ở T10, T13 · `SfxName` ở T9 dùng ở T13–T17 · `TEX` ở T8 dùng ở T12–T15.

**Rủi ro đã biết:** T8–T17 không có unit test (cần Phaser runtime) và chỉ được bọc bởi thử tay + một smoke test. Đó là lựa chọn có ý thức ở design.md §9: E2E physics chập chờn thì sẽ bị tắt, và test bị tắt tệ hơn test không có.
