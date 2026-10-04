/**
 * The browser half of the Ducker ID sign-in: start the redirect, and catch the
 * callback on the way back (ADR-0013).
 *
 * The ONLY places this feature touches storage are here (sessionStorage key
 * `ducker.pkce`, deleted on return) and the network is touched only in
 * `requests.ts`. With the flag off, importing this module does nothing at all — it
 * does not even read `location.search`.
 */

import { DUCKER_PKCE_KEY, type CallbackResult, type DuckerConfig, type PendingAuth } from '../../core/auth'
import { challengeOf, randomUrlSafeToken } from '../../core/pkce'
import { appRootPath, DUCKER_CONFIG } from './config'

/** The only query params this module removes. Game params are never touched. */
const CALLBACK_PARAMS = ['code', 'state', 'error', 'error_description', 'iss']

export function redirectUri(): string {
  return new URL(appRootPath(), window.location.origin).toString()
}

function readPending(): PendingAuth | null {
  try {
    const raw = sessionStorage.getItem(DUCKER_PKCE_KEY)
    return raw ? (JSON.parse(raw) as PendingAuth) : null
  } catch {
    return null
  }
}

function clearPending(): void {
  try {
    sessionStorage.removeItem(DUCKER_PKCE_KEY)
  } catch {
    // sessionStorage is blocked — treat it as "no pending sign-in"
  }
}

/** Build the authorize URL, then send the whole page to Ducker ID. */
export async function startLogin(config: DuckerConfig): Promise<void> {
  const verifier = randomUrlSafeToken()
  const state = randomUrlSafeToken()
  const pending: PendingAuth = {
    state,
    verifier,
    returnTo: window.location.pathname + window.location.search,
  }
  try {
    sessionStorage.setItem(DUCKER_PKCE_KEY, JSON.stringify(pending))
  } catch {
    return // no place to keep the verifier means the callback would dead-end
  }
  const url = new URL('/oauth/authorize', config.issuer)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', redirectUri())
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', await challengeOf(verifier))
  url.searchParams.set('code_challenge_method', 'S256')
  window.location.assign(url.toString())
}

/**
 * Read ?code / ?error and strip EXACTLY the OAuth params from the URL. A code is
 * single-use; leaving it in the address bar means F5 would try to redeem it again.
 */
export function consumeCallback(): CallbackResult | null {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const error = params.get('error')
  const state = params.get('state')
  if (!code && !error) return null

  const pending = readPending()
  clearPending()
  for (const key of CALLBACK_PARAMS) params.delete(key)
  const query = params.toString()
  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname + (query ? `?${query}` : '') + window.location.hash,
  )

  if (error) return { error }
  if (!pending || pending.state !== state || !code) return { error: 'state_mismatch' }
  return { code, verifier: pending.verifier, returnTo: pending.returnTo }
}

let captured: CallbackResult | null = null
let didCapture = false

/** Runs once when the module loads in a browser, before any game code reads the URL. */
export function captureCallback(): void {
  if (didCapture) return
  didCapture = true
  captured = consumeCallback()
  if (captured?.returnTo) window.history.replaceState(window.history.state, '', captured.returnTo)
}

export function capturedCallback(): CallbackResult | null {
  return captured
}

/** Test seam. */
export function resetCaptureForTests(): void {
  captured = null
  didCapture = false
}

if (typeof window !== 'undefined' && DUCKER_CONFIG) captureCallback()
