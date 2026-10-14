import { defineConfig } from 'vitest/config'

// `src/core/**` is pure TypeScript that must not know Phaser exists (invariants #2).
// A `node` environment is therefore the default, and it is also a second line of
// defence: anything in core reaching for `window` fails here. The Ducker ID sign-in
// files in `src/game/auth/` and the account overlay are the exception: they touch
// the DOM on purpose, so their tests opt in per file with a
// `// @vitest-environment happy-dom` docblock (ADR-0013).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
  },
})
