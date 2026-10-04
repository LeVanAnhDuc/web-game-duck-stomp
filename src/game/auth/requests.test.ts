// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { exchangeCode, fetchProfile } from './requests'

const config = {
  issuer: 'http://localhost:3000',
  clientId: 'game-client',
  scope: 'openid',
  profileUrl: 'http://localhost:3000/profile',
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

afterEach(() => vi.unstubAllGlobals())

describe('exchangeCode', () => {
  it('POSTs the PKCE form with no client_secret, and a timeout signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ access_token: 'at' }))
    vi.stubGlobal('fetch', fetchMock)
    await expect(exchangeCode(config, 'c1', 'v1')).resolves.toEqual({ accessToken: 'at' })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe('http://localhost:3000/oauth/token')
    expect(init.method).toBe('POST')
    expect(init.signal).toBeInstanceOf(AbortSignal)
    const body = init.body as URLSearchParams
    expect(Object.fromEntries(body)).toEqual({
      grant_type: 'authorization_code',
      code: 'c1',
      code_verifier: 'v1',
      redirect_uri: expect.stringMatching(/^https?:\/\//),
      client_id: 'game-client',
    })
    expect(body.has('client_secret')).toBe(false)
  })

  it('throws on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({}, 400)))
    await expect(exchangeCode(config, 'c', 'v')).rejects.toThrow('token_exchange_failed_400')
  })

  it.each([{}, { access_token: 5 }, { access_token: '' }])('throws when the 200 body is %o', async (body) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(body)))
    await expect(exchangeCode(config, 'c', 'v')).rejects.toThrow('token_response_invalid')
  })
})

describe('fetchProfile', () => {
  it('sends the bearer token with a timeout signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ sub: 'u1' }))
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchProfile(config, 'at')).resolves.toEqual({ sub: 'u1' })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe('http://localhost:3000/oauth/userinfo')
    expect(init.headers).toEqual({ Authorization: 'Bearer at' })
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('throws on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({}, 401)))
    await expect(fetchProfile(config, 'at')).rejects.toThrow('userinfo_failed_401')
  })
})
