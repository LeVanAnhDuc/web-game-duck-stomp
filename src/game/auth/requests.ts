/**
 * The only network calls of the Ducker ID sign-in — both go to the configured
 * issuer, and neither runs before the player has clicked sign-in and come back
 * with a code (ADR-0013).
 */

import type { DuckerConfig, DuckerProfile } from '../../core/auth'
import { redirectUri } from './duckerAuth'

/** A hung issuer must end in signed-out, not a button stuck on SIGNING IN... forever. */
const REQUEST_TIMEOUT_MS = 15_000

/** Redeem the code for a token. Public client — there is no client_secret. */
export async function exchangeCode(
  config: DuckerConfig,
  code: string,
  verifier: string,
): Promise<{ accessToken: string }> {
  const response = await fetch(new URL('/oauth/token', config.issuer), {
    method: 'POST',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri(),
      client_id: config.clientId,
    }),
  })
  if (!response.ok) throw new Error(`token_exchange_failed_${response.status}`)
  const data = (await response.json()) as { access_token?: unknown }
  if (typeof data.access_token !== 'string' || data.access_token === '') throw new Error('token_response_invalid')
  return { accessToken: data.access_token }
}

const optionalString = (value: unknown): boolean => value === undefined || value === null || typeof value === 'string'

/** A malformed userinfo must end in signed-out, never reach the renderer. */
function isProfile(value: unknown): value is DuckerProfile {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p['sub'] === 'string' &&
    p['sub'] !== '' &&
    optionalString(p['name']) &&
    optionalString(p['email']) &&
    optionalString(p['picture']) &&
    (p['email_verified'] === undefined || typeof p['email_verified'] === 'boolean')
  )
}

export async function fetchProfile(config: DuckerConfig, accessToken: string): Promise<DuckerProfile> {
  const response = await fetch(new URL('/oauth/userinfo', config.issuer), {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`userinfo_failed_${response.status}`)
  const data: unknown = await response.json()
  if (!isProfile(data)) throw new Error('userinfo_invalid')
  return data
}
