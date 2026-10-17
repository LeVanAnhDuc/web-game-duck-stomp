/**
 * PKCE (RFC 7636) — what stands in for a client_secret in a browser-only game.
 *
 * Duck Stomp is a public client: there is no backend, so nowhere to keep a
 * long-lived secret. A `code_verifier` is safe here because it is minted fresh per
 * sign-in, lives for a few seconds and is used once — leaking one ruins that
 * attempt only, unlike leaking a fixed secret.
 *
 * `crypto.getRandomValues`, not `Math.random`: a verifier has to be unguessable,
 * and `Math.random` is also banned in `core/` (NFR-GAME-02).
 */

const VERIFIER_BYTES = 32

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** A random base64url string — used for the code_verifier and for `state`. */
export function randomUrlSafeToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(VERIFIER_BYTES)).buffer)
}

/** challenge = BASE64URL(SHA256(ASCII(verifier))) — the S256 method. */
export async function challengeOf(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return toBase64Url(digest)
}
