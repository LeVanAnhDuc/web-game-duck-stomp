/// <reference types="vite/client" />

// Every VITE_* value is public — Vite inlines it into the bundle at build time.
interface ImportMetaEnv {
  /** Base path of the deployed app ("/" locally, "/<repo>/" on GitHub Pages). */
  readonly VITE_BASE_PATH: string | undefined
  /** Feature flag for Ducker ID sign-in. Only the string "true" enables it. */
  readonly VITE_FEATURE_DUCKER_SIGN_IN: string | undefined
  readonly VITE_DUCKER_ISSUER: string | undefined
  readonly VITE_DUCKER_CLIENT_ID: string | undefined
  readonly VITE_DUCKER_SCOPE: string | undefined
  readonly VITE_DUCKER_PROFILE_PATH: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
