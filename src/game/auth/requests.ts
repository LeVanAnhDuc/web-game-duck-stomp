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

export async function fetchProfile(config: DuckerConfig, accessToken: string): Promise<DuckerProfile> {
  const response = await fetch(new URL('/oauth/userinfo', config.issuer), {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`userinfo_failed_${response.status}`)
  return (await response.json()) as DuckerProfile
}
