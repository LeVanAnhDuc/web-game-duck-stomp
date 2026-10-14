/**
 * Ducker ID sign-in — the pure part (ADR-0013).
 *
 * Types, the config gate and the avatar initial. Nothing here touches the
 * window, storage or the network, so it is unit tested in the plain `node`
 * environment like the rest of `core/`. The parts that do touch them live in
 * `src/game/auth/`.
 */

/** The raw values from the environment, exactly as the bundler inlined them. */
export type DuckerEnv = {
  enabled: string | undefined
  issuer: string | undefined
  clientId: string | undefined
  scope: string | undefined
  profilePath: string | undefined
}

export type DuckerConfig = {
  issuer: string
  clientId: string
  scope: string
  profileUrl: string
}

export type DuckerProfile = {
  sub: string
  name?: string
  email?: string
  email_verified?: boolean
  picture?: string | null
}

export type PendingAuth = {
  state: string
  verifier: string
  returnTo: string
}

export type CallbackResult = {
  code?: string
  verifier?: string
  error?: string
  returnTo?: string
}

export type AuthStatus = 'idle' | 'loading' | 'signed-in' | 'signed-out'

export type AuthSnapshot = {
  status: AuthStatus
  profile: DuckerProfile | null
}

/** The one sessionStorage key the feature uses. Deleted when the player returns. */
export const DUCKER_PKCE_KEY = 'ducker.pkce'

/**
 * Sign-in is on only when the flag is exactly "true" AND all four values are set.
 * There is no default for any of them: missing means off, never a guess.
 */
export function readDuckerConfig(raw: DuckerEnv): DuckerConfig | null {
  if (raw.enabled !== 'true') return null
  const { issuer, clientId, scope, profilePath } = raw
  if (!issuer || !clientId || !scope || !profilePath) return null
  // "localhost:3000" parses as a URL with the scheme "localhost:" — refuse it.
  if (!/^https?:\/\//.test(issuer)) return null
  try {
    return {
      issuer: new URL(issuer).origin,
      clientId,
      scope,
      profileUrl: new URL(profilePath, issuer).toString(),
    }
  } catch {
    return null // a malformed issuer means "not configured"; the game still runs
  }
}

/** First letter of the name (or email) for the avatar when there is no picture. */
export function initialOf(profile: DuckerProfile): string {
  const source = profile.name?.trim() || profile.email?.trim() || ''
  const first = [...source][0]
  return first === undefined ? '?' : first.toLocaleUpperCase('vi')
}
