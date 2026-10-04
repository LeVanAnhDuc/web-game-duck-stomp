// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthSnapshot } from '../core/auth'
import { createAccountOverlay, type AccountStore } from './accountOverlay'

const PROFILE_URL = 'http://localhost:3000/profile'

function makeStore(initial: AuthSnapshot) {
  let snapshot = initial
  const listeners = new Set<() => void>()
  const store: AccountStore = {
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => snapshot,
    signIn: vi.fn(),
    signOut: vi.fn(() => set({ status: 'signed-out', profile: null })),
  }
  const set = (next: AuthSnapshot): void => {
    snapshot = next
    listeners.forEach((listener) => listener())
  }
  return { store, set }
}

const signedIn: AuthSnapshot = {
  status: 'signed-in',
  profile: { sub: 'u1', name: 'Le Van Anh Duc', email: 'duc@ducker.id' },
}

let host: HTMLElement

beforeEach(() => {
  document.body.innerHTML = '<div id="account-overlay" hidden></div><button id="outside">outside</button>'
  host = document.getElementById('account-overlay')!
})

function mount(initial: AuthSnapshot, visible = true) {
  const { store, set } = makeStore(initial)
  const overlay = createAccountOverlay(host, { store, profileUrl: PROFILE_URL })
  overlay.setVisible(visible)
  return { store, set, overlay }
}

const buttons = (): HTMLButtonElement[] => [...host.querySelectorAll('button')]

describe('accountOverlay', () => {
  it('renders nothing while the store is idle', () => {
    mount({ status: 'idle', profile: null })
    expect(host.hidden).toBe(true)
    expect(host.children.length).toBe(0)
  })

  it('stays hidden when the title scene is not active', () => {
    mount({ status: 'signed-out', profile: null }, false)
    expect(host.hidden).toBe(true)
  })

  it('shows SIGN IN when signed out and starts login on click', () => {
    const { store } = mount({ status: 'signed-out', profile: null })
    expect(host.hidden).toBe(false)
    const button = buttons()[0]!
    expect(button.textContent).toContain('SIGN IN')
    button.click()
    expect(store.signIn).toHaveBeenCalledOnce()
  })

  it('disables the button while signing in', () => {
    mount({ status: 'loading', profile: null })
    const button = buttons()[0]!
    expect(button.textContent).toContain('SIGNING IN...')
    expect(button.disabled).toBe(true)
    expect(button.getAttribute('aria-busy')).toBe('true')
  })

  it('opens the account menu with profile link and sign out', () => {
    mount(signedIn)
    const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!
    expect(trigger.getAttribute('aria-label')).toBe('Ducker ID account')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    trigger.click()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(host.textContent).toContain('Le Van Anh Duc')
    expect(host.textContent).toContain('duc@ducker.id')
    const link = host.querySelector<HTMLAnchorElement>('a[role="menuitem"]')!
    expect(link.getAttribute('href')).toBe(PROFILE_URL)
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.textContent).toBe('DUCKER ID PROFILE')
    expect(document.activeElement).toBe(link)
  })

  it('shows the first letter of the name when there is no picture, and the picture when there is', () => {
    const first = mount(signedIn)
    expect(host.querySelector('[aria-haspopup="menu"]')!.textContent).toContain('L')
    first.overlay.destroy()
    mount({
      status: 'signed-in',
      profile: { sub: 'u1', name: 'A', picture: 'https://example.test/a.png' },
    })
    expect(host.querySelector('img')!.getAttribute('src')).toBe('https://example.test/a.png')
  })

  it('closes on Escape and returns focus to the trigger', () => {
    mount(signedIn)
    const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!
    trigger.click()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('closes on a pointer press outside, but not inside', () => {
    mount(signedIn)
    const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!
    trigger.click()
    host.querySelector('[role="menu"]')!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    document.getElementById('outside')!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('moves focus with the arrow keys, wrapping, and Home / End', () => {
    mount(signedIn)
    host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!.click()
    const [link, out] = [...host.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    const press = (key: string): void => {
      document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
    }
    expect(document.activeElement).toBe(link)
    press('ArrowDown')
    expect(document.activeElement).toBe(out)
    press('ArrowDown')
    expect(document.activeElement).toBe(link)
    press('ArrowUp')
    expect(document.activeElement).toBe(out)
    press('Home')
    expect(document.activeElement).toBe(link)
    press('End')
    expect(document.activeElement).toBe(out)
  })

  it('closes on Tab without pulling focus back', () => {
    mount(signedIn)
    const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!
    trigger.click()
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).not.toBe(trigger)
  })

  it('closes when focus leaves to somewhere outside', () => {
    mount(signedIn)
    const trigger = host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!
    trigger.click()
    document.getElementById('outside')!.focus()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(document.getElementById('outside'))
  })

  it('shows the email as the main line when there is no name, and no email line when none', () => {
    const first = mount({ status: 'signed-in', profile: { sub: 'u', email: 'a@b.c' } })
    expect(host.querySelector('.acct-name')!.textContent).toBe('a@b.c')
    expect(host.querySelector('.acct-email')).toBeNull()
    first.overlay.destroy()
    mount({ status: 'signed-in', profile: { sub: 'u', name: 'Only Name' } })
    expect(host.querySelector('.acct-name')!.textContent).toBe('Only Name')
    expect(host.querySelector('.acct-email')).toBeNull()
  })

  it('signs out from the menu and shows SIGN IN again', () => {
    const { store } = mount(signedIn)
    host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!.click()
    const signOut = host.querySelector<HTMLButtonElement>('button[role="menuitem"]')!
    expect(signOut.textContent).toBe('SIGN OUT')
    signOut.click()
    expect(store.signOut).toHaveBeenCalledOnce()
    expect(buttons()[0]!.textContent).toContain('SIGN IN')
    expect(document.activeElement).toBe(buttons()[0])
  })

  it('does not let keys leak to the game while focus is in the overlay', () => {
    mount({ status: 'signed-out', profile: null })
    const seen = vi.fn()
    window.addEventListener('keydown', seen)
    buttons()[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    window.removeEventListener('keydown', seen)
    expect(seen).not.toHaveBeenCalled()
  })

  it('hides again and closes the menu when the title scene goes away', () => {
    const { overlay } = mount(signedIn)
    host.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]')!.click()
    overlay.setVisible(false)
    expect(host.hidden).toBe(true)
    overlay.setVisible(true)
    expect(host.querySelector('[aria-haspopup="menu"]')!.getAttribute('aria-expanded')).toBe('false')
  })

  it('follows the store: loading, then signed in', () => {
    const { set } = mount({ status: 'loading', profile: null })
    set(signedIn)
    expect(host.querySelector('[aria-haspopup="menu"]')).not.toBeNull()
  })
})
