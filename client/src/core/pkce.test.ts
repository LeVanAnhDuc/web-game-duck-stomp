import { describe, expect, it } from 'vitest'
import { challengeOf, randomUrlSafeToken } from './pkce'

describe('pkce', () => {
  it('matches the RFC 7636 appendix B vector', async () => {
    expect(await challengeOf('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    )
  })

  it('produces a base64url challenge with no +, / or = padding', async () => {
    expect(await challengeOf(randomUrlSafeToken())).toMatch(/^[A-Za-z0-9_-]{43}$/)
  })

  it('makes a verifier that is base64url and at least 43 characters (RFC 7636 4.1)', () => {
    const verifier = randomUrlSafeToken()
    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(verifier.length).toBeGreaterThanOrEqual(43)
  })

  it('makes a different token every call', () => {
    const tokens = new Set(Array.from({ length: 20 }, () => randomUrlSafeToken()))
    expect(tokens.size).toBe(20)
  })

  it('maps the same verifier to the same challenge', async () => {
    const verifier = randomUrlSafeToken()
    expect(await challengeOf(verifier)).toBe(await challengeOf(verifier))
  })
})
