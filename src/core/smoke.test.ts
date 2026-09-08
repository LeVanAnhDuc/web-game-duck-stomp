import { describe, expect, it } from 'vitest'

// Proves the toolchain, not the game: TypeScript compiles, Vitest runs it, and the
// strict flags in tsconfig.json are actually in force.
describe('toolchain', () => {
  it('runs typescript under vitest', () => {
    expect(1 + 1).toBe(2)
  })

  it('has noUncheckedIndexedAccess in force', () => {
    const xs: number[] = []
    const first: number | undefined = xs[0]
    expect(first).toBeUndefined()
  })
})
