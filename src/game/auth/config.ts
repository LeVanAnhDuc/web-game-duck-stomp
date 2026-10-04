/**
 * The only module that reads the Ducker ID environment variables.
 *
 * Each one is read by its LITERAL name — Vite inlines only literal accesses to
 * `import.meta.env.VITE_*`. There is no fallback value for any of them:
 * `readDuckerConfig` decides, and `null` means the feature does not exist.
 */

import { readDuckerConfig } from '../../core/auth'

export const DUCKER_CONFIG = readDuckerConfig({
  enabled: import.meta.env.VITE_FEATURE_DUCKER_SIGN_IN,
  issuer: import.meta.env.VITE_DUCKER_ISSUER,
  clientId: import.meta.env.VITE_DUCKER_CLIENT_ID,
  scope: import.meta.env.VITE_DUCKER_SCOPE,
  profilePath: import.meta.env.VITE_DUCKER_PROFILE_PATH,
})

/** The app root — `redirect_uri` must match the URI registered at Ducker ID exactly. */
export function appRootPath(): string {
  return import.meta.env.BASE_URL
}
