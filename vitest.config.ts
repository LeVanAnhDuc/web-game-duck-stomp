import { defineConfig } from 'vitest/config'

// Only `src/core/**` is unit tested, and it is pure TypeScript that must not know
// Phaser exists (invariants #2). A `node` environment is therefore correct, and it
// is also a second line of defence: anything reaching for `window` fails here.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['default'],
  },
})
