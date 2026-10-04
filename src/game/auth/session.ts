/**
 * The session store — a tiny external store, so the DOM overlay (no React here)
 * can `subscribe` to it (ADR-0013).
 *
 * The profile lives in memory only. A reload is signed out; nothing is persisted.
 */

import type { AuthSnapshot, CallbackResult, DuckerConfig } from '../../core/auth'
import { DUCKER_CONFIG } from './config'
import { capturedCallback, startLogin } from './duckerAuth'
import { exchangeCode, fetchProfile } from './requests'

const IDLE: AuthSnapshot = { status: 'idle', profile: null }
const SIGNED_OUT: AuthSnapshot = { status: 'signed-out', profile: null }

let snapshot: AuthSnapshot = IDLE
let started = false
const listeners = new Set<() => void>()

function set(next: AuthSnapshot): void {
  snapshot = next
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot(): AuthSnapshot {
  return snapshot
}

/**
 * Code -> profile, exactly ONCE per page load. Every failure only drops to
 * signed-out: sign-in is an extra, never a gate in front of the game.
 * (The default arguments are test injection points, not config defaults.)
 */
export function startSession(
  config: DuckerConfig | null = DUCKER_CONFIG,
  callback: CallbackResult | null = capturedCallback(),
): void {
  if (started || !config) return
  started = true
  if (!callback || callback.error || !callback.code || !callback.verifier) {
    set(SIGNED_OUT)
    return
  }
  set({ status: 'loading', profile: null })
  exchangeCode(config, callback.code, callback.verifier)
    .then((tokens) => fetchProfile(config, tokens.accessToken))
    .then(
      (profile) => set({ status: 'signed-in', profile }),
      () => set(SIGNED_OUT),
    )
}

export function signIn(): void {
  if (DUCKER_CONFIG) void startLogin(DUCKER_CONFIG)
}

/** Forget the profile in memory. The Ducker ID session stays — that is what SSO means. */
export function signOut(): void {
  set(SIGNED_OUT)
}

/** Test seam. */
export function resetSessionForTests(): void {
  snapshot = IDLE
  started = false
  listeners.clear()
}

if (typeof window !== 'undefined') startSession()
