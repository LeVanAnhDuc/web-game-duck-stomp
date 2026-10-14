/**
 * The Ducker ID account control — a DOM overlay, ADR-0013.
 *
 * This game has no React, so the sign-in button is plain DOM modelled on
 * `#rotate-gate`: a static `#account-overlay` in index.html, styled with the pixel
 * tokens there, filled in here. It is shown ONLY while TitleScene is on screen,
 * because that is the one place a player is not mid-jump.
 *
 * Why DOM and not a Phaser `Button`: the account menu shows the player's own name
 * and email, which can carry Vietnamese diacritics, and the pixel fonts have no
 * glyphs for them (ADR-0005). Labels stay ASCII and go through `t()`; the user's
 * text is rendered in `system-ui` by the browser.
 *
 * With the feature off (`DUCKER_CONFIG === null`) nothing is mounted: the element
 * stays empty and hidden, no listener is added.
 */

import type Phaser from 'phaser'
import { initialOf, type AuthSnapshot, type DuckerProfile } from '../core/auth'
import { t } from '../core/strings'
import { DUCKER_CONFIG } from './auth/config'
import { getSnapshot, signIn, signOut, subscribe } from './auth/session'
import { REGISTRY, SCENE } from './scenes/keys'

/** The slice of the session store the overlay needs — injectable for tests. */
export type AccountStore = {
  subscribe(listener: () => void): () => void
  getSnapshot(): AuthSnapshot
  signIn(): void
  signOut(): void
}

export type AccountOverlay = {
  /** Show or hide the whole overlay (TitleScene active or not). */
  setVisible(visible: boolean): void
  destroy(): void
}

const SVG_NS = 'http://www.w3.org/2000/svg'

/** A 8x7 pixel bust — same crisp-edged SVG approach as the arrow in #rotate-gate. */
function userIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('class', 'acct-icon')
  svg.setAttribute('width', '16')
  svg.setAttribute('height', '14')
  svg.setAttribute('viewBox', '0 0 8 7')
  svg.setAttribute('shape-rendering', 'crispEdges')
  svg.setAttribute('aria-hidden', 'true')
  for (const [x, y, w, h] of [
    [2, 0, 4, 3],
    [3, 3, 2, 1],
    [1, 4, 6, 1],
    [0, 5, 8, 2],
  ] as const) {
    const rect = document.createElementNS(SVG_NS, 'rect')
    rect.setAttribute('x', String(x))
    rect.setAttribute('y', String(y))
    rect.setAttribute('width', String(w))
    rect.setAttribute('height', String(h))
    rect.setAttribute('fill', 'currentColor')
    svg.append(rect)
  }
  return svg
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  node.className = className
  if (text !== undefined) node.textContent = text
  return node
}

function avatar(profile: DuckerProfile): HTMLElement {
  const badge = el('span', 'acct-avatar acct-avatar--initial', initialOf(profile))
  badge.setAttribute('aria-hidden', 'true')
  if (!profile.picture) return badge

  const img = el('img', 'acct-avatar')
  // The picture host is whatever the issuer returned: send no referrer, and fall back to
  // the initial if it fails to load.
  img.referrerPolicy = 'no-referrer'
  img.src = profile.picture
  img.alt = ''
  img.width = 28
  img.height = 28
  img.addEventListener('error', () => img.replaceWith(badge), { once: true })
  return img
}

/**
 * The menu hangs below its trigger by default. On a short landscape viewport (568x320)
 * that runs off the bottom, so slide it up just enough to fit, never above the top edge.
 * It stays position: absolute inside the fixed host, so no surrounding layout moves.
 */
function keepMenuOnScreen(menu: HTMLElement): void {
  menu.style.top = ''
  const host = menu.parentElement
  if (host === null) return
  const hostTop = host.getBoundingClientRect().top
  const rect = menu.getBoundingClientRect()
  const margin = 8
  const overflow = rect.bottom - (window.innerHeight - margin)
  if (overflow <= 0) return
  const shifted = rect.top - overflow
  const top = Math.max(shifted, margin) - hostTop
  menu.style.top = `${Math.round(top)}px`
}

export function createAccountOverlay(
  host: HTMLElement,
  deps: { store: AccountStore; profileUrl: string },
): AccountOverlay {
  const { store, profileUrl } = deps
  let visible = false
  let open = false
  let trigger: HTMLButtonElement | null = null
  let menu: HTMLElement | null = null

  const setOpen = (next: boolean, refocus: boolean): void => {
    open = next
    if (trigger === null || menu === null) return
    trigger.setAttribute('aria-expanded', String(next))
    menu.hidden = !next
    if (next) keepMenuOnScreen(menu)
    if (next) menu.querySelector<HTMLElement>('a,button')?.focus()
    else if (refocus) trigger.focus()
  }

  const render = (): void => {
    const snapshot = store.getSnapshot()
    open = false
    host.replaceChildren()
    trigger = null
    menu = null
    host.hidden = !visible || snapshot.status === 'idle'

    if (snapshot.status === 'idle') return

    if (snapshot.status !== 'signed-in' || snapshot.profile === null) {
      const loading = snapshot.status === 'loading'
      const button = el('button', 'acct-btn')
      button.type = 'button'
      button.disabled = loading
      button.setAttribute('aria-busy', String(loading))
      button.append(userIcon(), el('span', 'acct-label', loading ? t('signingIn') : t('signIn')))
      button.addEventListener('click', () => store.signIn())
      host.append(button)
      return
    }

    const { profile } = snapshot
    trigger = el('button', 'acct-btn acct-btn--avatar')
    trigger.type = 'button'
    trigger.setAttribute('aria-haspopup', 'menu')
    trigger.setAttribute('aria-expanded', 'false')
    trigger.setAttribute('aria-label', t('duckerAccount'))
    trigger.append(avatar(profile))
    trigger.addEventListener('click', () => setOpen(!open, true))

    menu = el('div', 'acct-menu')
    menu.setAttribute('role', 'menu')
    menu.hidden = true
    // The user's own text. system-ui on purpose: the pixel fonts lack Vietnamese glyphs.
    // No name: the email is the main line. No email: no second line.
    const main = profile.name || profile.email
    // The identity block is not an item: role="none" keeps it out of the menu's item list.
    const identity = el('div', 'acct-identity')
    identity.setAttribute('role', 'none')
    if (main) identity.append(el('p', 'acct-name', main))
    if (profile.name && profile.email) identity.append(el('p', 'acct-email', profile.email))
    if (identity.children.length > 0) menu.append(identity)

    const link = el('a', 'acct-item', t('duckerProfile'))
    link.setAttribute('role', 'menuitem')
    link.href = profileUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.addEventListener('click', () => setOpen(false, false))

    const out = el('button', 'acct-item', t('signOut'))
    out.type = 'button'
    out.setAttribute('role', 'menuitem')
    out.addEventListener('click', () => {
      setOpen(false, false)
      store.signOut()
      host.querySelector<HTMLElement>('button')?.focus()
    })

    menu.addEventListener('keydown', (event) => {
      const items = [...menu!.querySelectorAll<HTMLElement>('[role="menuitem"]')]
      const at = items.indexOf(document.activeElement as HTMLElement)
      let next = -1
      if (event.key === 'ArrowDown') next = (at + 1) % items.length
      else if (event.key === 'ArrowUp') next = (at <= 0 ? items.length : at) - 1
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = items.length - 1
      else if (event.key === 'Tab') setOpen(false, false) // focus moves on by itself
      if (next >= 0) {
        event.preventDefault()
        items[next]?.focus()
      }
    })
    menu.append(link, out)
    host.append(trigger, menu)
  }

  // Capture phase: runs before the overlay's own keydown guard below.
  const onKeyDown = (event: KeyboardEvent): void => {
    if (open && event.key === 'Escape') {
      event.stopPropagation() // the game's own Escape (pause) must not fire behind the menu
      setOpen(false, true)
    }
  }
  const onPointerDown = (event: Event): void => {
    if (open && !host.contains(event.target as Node)) setOpen(false, false)
  }
  // Phaser listens for Enter / Space / arrows on `window`; a key pressed while the
  // focus is on one of these buttons must not also press PLAY underneath.
  // Focus leaving the control by any other route (a click elsewhere, a Tab out) closes
  // the menu without pulling focus back.
  const onFocusOut = (event: FocusEvent): void => {
    const to = event.relatedTarget as Node | null
    // Safari does not focus a clicked button, so focusout then has relatedTarget null and
    // would close the menu just before the click re-opens it. Outside clicks are the
    // pointerdown handler's job; only a real focus target outside the control closes here.
    if (open && to !== null && !host.contains(to)) setOpen(false, false)
  }
  // Enter / Space always (they activate the focused button); everything else only while
  // the menu is open, so a closed menu leaves the game's keys exactly as before.
  const stopKeys = (event: KeyboardEvent): void => {
    if (open || event.key === 'Enter' || event.key === ' ') event.stopPropagation()
  }

  document.addEventListener('keydown', onKeyDown, true)
  document.addEventListener('pointerdown', onPointerDown)
  host.addEventListener('keydown', stopKeys)
  host.addEventListener('focusout', onFocusOut)
  const unsubscribe = store.subscribe(render)
  render()

  return {
    setVisible(next) {
      visible = next
      render()
    },
    destroy() {
      unsubscribe()
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('keydown', stopKeys)
      host.removeEventListener('focusout', onFocusOut)
      host.replaceChildren()
      host.hidden = true
    },
  }
}

/**
 * Wire the overlay to the game: visible only while TitleScene is active, and kept
 * clear of the sound button that TitleScene draws in the canvas's top-right corner.
 */
export function mountAccountOverlay(game: Phaser.Game): () => void {
  const host = document.getElementById('account-overlay')
  if (host === null || DUCKER_CONFIG === null) return () => {}

  const overlay = createAccountOverlay(host, {
    store: { subscribe, getSnapshot, signIn, signOut },
    profileUrl: DUCKER_CONFIG.profileUrl,
  })

  /**
   * TitleScene's sound IconButton is 44s square, centred 30s from the canvas's top and
   * right edges (s = zoom / 2, see ui.ts). The account control keeps its own 44px
   * height, centred on the same line, with an 8px gap to the left of it. Positioned
   * from the canvas rect because the page letterboxes the canvas.
   */
  const place = (): void => {
    const zoom = Number(game.registry.get(REGISTRY.zoom) ?? 2)
    const s = zoom / 2
    const canvas = document.querySelector('#app canvas')
    const rect = canvas === null ? null : canvas.getBoundingClientRect()
    const rightEdge = rect === null ? window.innerWidth : rect.right
    const topEdge = rect === null ? 0 : rect.top
    host.style.top = `${Math.round(topEdge + 30 * s - 22)}px`
    host.style.right = `${Math.round(window.innerWidth - rightEdge + 52 * s + 8)}px`
  }

  const show = (): void => {
    overlay.setVisible(true)
    place()
  }
  const hide = (): void => overlay.setVisible(false)

  const wire = (): void => {
    // Typed as always-present, but null until the scene manager has built the scenes
    // (it does that on the game's own 'ready'). Same guard as rotateGate.ts.
    const title = game.scene.getScene(SCENE.title) as Phaser.Scene | null
    if (title === null) {
      game.events.once('ready', wire)
      return
    }
    // 'create' / 'shutdown' are Phaser.Scenes.Events.CREATE / SHUTDOWN. Plain
    // strings keep Phaser out of this module's value imports, so it stays testable.
    title.events.on('create', show)
    title.events.on('shutdown', hide)
    if (game.scene.isActive(SCENE.title)) show()
  }
  wire()

  window.addEventListener('resize', place)

  return () => {
    window.removeEventListener('resize', place)
    overlay.destroy()
  }
}
