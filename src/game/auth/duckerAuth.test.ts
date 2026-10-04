// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { captureCallback, consumeCallback, resetCaptureForTests, startLogin } from './duckerAuth'

const config = {
  issuer: 'http://localhost:3000',
  clientId: 'game-client',
  scope: 'openid profile email',
  profileUrl: 'http://localhost:3000/profile',
}

describe('consumeCallback', () => {
  beforeEach(() => sessionStorage.clear())

  it('returns null and leaves the URL alone when there is no callback', () => {
    window.history.replaceState(null, '', '/?level=3')
    expect(consumeCallback()).toBeNull()
    expect(window.location.search).toBe('?level=3')
  })

  it('returns code + verifier + returnTo when state matches, and strips only OAuth params', () => {
    sessionStorage.setItem('ducker.pkce', JSON.stringify({ state: 's1', verifier: 'v1', returnTo: '/?level=3' }))
    window.history.replaceState(null, '', '/?level=3&code=c1&state=s1&iss=x')
    expect(consumeCallback()).toEqual({ code: 'c1', verifier: 'v1', returnTo: '/?level=3' })
    expect(window.location.search).toBe('?level=3')
    expect(sessionStorage.getItem('ducker.pkce')).toBeNull()
  })

  it('reports state_mismatch when the state differs', () => {
    sessionStorage.setItem('ducker.pkce', JSON.stringify({ state: 's1', verifier: 'v1', returnTo: '/' }))
    window.history.replaceState(null, '', '/?code=c1&state=evil')
    expect(consumeCallback()).toEqual({ error: 'state_mismatch' })
    expect(window.location.search).toBe('')
    expect(sessionStorage.getItem('ducker.pkce')).toBeNull()
  })

  it('reports state_mismatch when there is no pending entry (other tab)', () => {
    window.history.replaceState(null, '', '/?code=c1&state=s1')
    expect(consumeCallback()).toEqual({ error: 'state_mismatch' })
  })

  it('reports state_mismatch when the pending entry is not JSON', () => {
    sessionStorage.setItem('ducker.pkce', '{nope')
    window.history.replaceState(null, '', '/?code=c1&state=s1')
    expect(consumeCallback()).toEqual({ error: 'state_mismatch' })
  })

  it('IdP error returns returnTo so the game params come back', () => {
    sessionStorage.setItem('ducker.pkce', JSON.stringify({ state: 's1', verifier: 'v1', returnTo: '/?level=3' }))
    window.history.replaceState(null, '', '/?error=access_denied&state=s1')
    expect(consumeCallback()).toEqual({ error: 'access_denied', returnTo: '/?level=3' })
  })

  it.each(['//evil.test/x', 'https://evil.test/', 'javascript:1', 5])('drops an unsafe returnTo %s', (returnTo) => {
    sessionStorage.setItem('ducker.pkce', JSON.stringify({ state: 's1', verifier: 'v1', returnTo }))
    window.history.replaceState(null, '', '/?code=c1&state=s1')
    expect(consumeCallback()).toEqual({ code: 'c1', verifier: 'v1' })
  })

  it('captureCallback restores returnTo once; a second call is a no-op', () => {
    resetCaptureForTests()
    sessionStorage.setItem('ducker.pkce', JSON.stringify({ state: 's1', verifier: 'v1', returnTo: '/?level=3' }))
    window.history.replaceState(null, '', '/?code=c1&state=s1')
    captureCallback()
    expect(window.location.search).toBe('?level=3')
    window.history.replaceState(null, '', '/?code=c2&state=s2')
    captureCallback()
    expect(window.location.search).toBe('?code=c2&state=s2')
    resetCaptureForTests()
  })

  it('passes the IdP error through and cleans the URL', () => {
    window.history.replaceState(null, '', '/?error=access_denied&error_description=no&state=s1')
    expect(consumeCallback()).toEqual({ error: 'access_denied' })
    expect(window.location.search).toBe('')
  })
})

describe('startLogin', () => {
  const assign = vi.fn()
  beforeEach(() => {
    resetCaptureForTests()
    sessionStorage.clear()
    assign.mockClear()
    vi.stubGlobal('location', {
      ...window.location,
      assign,
      origin: 'http://localhost:4301',
      pathname: '/',
      search: '?level=2',
    })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('stores the pending entry and redirects to /oauth/authorize with PKCE', async () => {
    await startLogin(config)
    const pending = JSON.parse(sessionStorage.getItem('ducker.pkce')!)
    expect(pending.returnTo).toBe('/?level=2')
    const url = new URL(assign.mock.calls[0]![0])
    expect(url.origin + url.pathname).toBe('http://localhost:3000/oauth/authorize')
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('client_id')).toBe('game-client')
    expect(url.searchParams.get('redirect_uri')).toBe('http://localhost:4301/')
    expect(url.searchParams.get('scope')).toBe('openid profile email')
    expect(url.searchParams.get('state')).toBe(pending.state)
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(url.searchParams.get('code_challenge')).toMatch(/^[A-Za-z0-9_-]{43}$/)
  })

  it('ignores a second click while the first is in flight', async () => {
    await Promise.all([startLogin(config), startLogin(config)])
    expect(assign).toHaveBeenCalledTimes(1)
  })

  it('can sign in again after a bfcache restore (persisted pageshow)', async () => {
    await startLogin(config)
    await startLogin(config)
    expect(assign).toHaveBeenCalledTimes(1)
    const event = new Event('pageshow')
    Object.defineProperty(event, 'persisted', { value: true })
    window.dispatchEvent(event)
    await startLogin(config)
    expect(assign).toHaveBeenCalledTimes(2)
  })

  it('does not redirect when sessionStorage throws', async () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error('blocked')
      },
    })
    await startLogin(config)
    expect(assign).not.toHaveBeenCalled()
  })
})
