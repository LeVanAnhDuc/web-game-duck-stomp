import { describe, expect, it } from 'vitest'
import { initialOf, readDuckerConfig } from './auth'

const full = {
  enabled: 'true',
  issuer: 'http://localhost:3000',
  clientId: 'game-client',
  scope: 'openid profile email',
  profilePath: '/profile',
}

describe('readDuckerConfig', () => {
  it('returns the config when the flag is on and every value is set', () => {
    expect(readDuckerConfig(full)).toEqual({
      issuer: 'http://localhost:3000',
      clientId: 'game-client',
      scope: 'openid profile email',
      profileUrl: 'http://localhost:3000/profile',
    })
  })

  it.each(['false', '1', 'TRUE', '', undefined])('is off when the flag is %s', (enabled) => {
    expect(readDuckerConfig({ ...full, enabled })).toBeNull()
  })

  it.each(['issuer', 'clientId', 'scope', 'profilePath'] as const)('is off when %s is missing', (key) => {
    expect(readDuckerConfig({ ...full, [key]: undefined })).toBeNull()
    expect(readDuckerConfig({ ...full, [key]: '' })).toBeNull()
  })

  it('is off instead of throwing when the issuer is not a URL', () => {
    expect(readDuckerConfig({ ...full, issuer: 'localhost:3000' })).toBeNull()
    expect(readDuckerConfig({ ...full, issuer: 'http://' })).toBeNull()
  })
})

describe('initialOf', () => {
  it.each([
    [{ sub: '1', name: 'đức lê' }, 'Đ'],
    [{ sub: '1', name: '  ', email: 'an@x.vn' }, 'A'],
    [{ sub: '1', email: 'zed@x.vn' }, 'Z'],
    [{ sub: '1' }, '?'],
  ])('initialOf(%o) = %s', (profile, expected) => {
    expect(initialOf(profile)).toBe(expected)
  })
})
