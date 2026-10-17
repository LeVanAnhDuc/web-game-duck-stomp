/**
 * All seven sounds, synthesised — FR-17, ADR-0007.
 *
 * No audio files anywhere. Each sound is an oscillator and a short envelope, which
 * for chiptune blips is not a compromise but the right tool: it is the same 8-bit
 * character, costs zero download, and re-pitching one is editing a number rather
 * than sourcing a new wav.
 *
 * `thud` exists because of one line in the spec: failing to break a cracked block
 * must be distinguishable from the block being unbreakable. A dull low thud next
 * to the bright `break` chirp is what carries that, without a word of text.
 *
 * Everything here fails silently. Browsers block audio until a real gesture, some
 * refuse an AudioContext entirely, and none of that is allowed to break the game.
 */

export type SfxName = 'jump' | 'coin' | 'stomp' | 'hurt' | 'break' | 'thud' | 'clear' | 'unlock'

type Voice = {
  type: OscillatorType
  /** Start frequency in Hz. */
  from: number
  /** End frequency; a slide from `from` to `to` over the sound's life. */
  to: number
  durationMs: number
  gain: number
  /** Optional second note, played after the first, for two-tone jingles. */
  then?: Omit<Voice, 'then'>
}

const VOICES: Readonly<Record<SfxName, Voice>> = {
  jump: { type: 'square', from: 220, to: 560, durationMs: 110, gain: 0.16 },
  coin: { type: 'square', from: 880, to: 1320, durationMs: 70, gain: 0.12 },
  stomp: { type: 'square', from: 300, to: 120, durationMs: 90, gain: 0.16 },
  hurt: { type: 'sawtooth', from: 420, to: 90, durationMs: 260, gain: 0.18 },
  break: { type: 'square', from: 700, to: 180, durationMs: 130, gain: 0.2 },
  // Deliberately dull and low: "you were too slow", not "this wall is solid".
  thud: { type: 'triangle', from: 150, to: 110, durationMs: 90, gain: 0.2 },
  clear: {
    type: 'square',
    from: 660,
    to: 660,
    durationMs: 110,
    gain: 0.15,
    then: { type: 'square', from: 990, to: 990, durationMs: 200, gain: 0.15 },
  },
  unlock: { type: 'square', from: 520, to: 780, durationMs: 160, gain: 0.13 },
}

export class Sfx {
  private context: AudioContext | null = null
  private mutedFlag = false

  constructor(muted: boolean) {
    this.mutedFlag = muted
  }

  /**
   * Called from the first real gesture — the PLAY button. That button is the one
   * door every player walks through, so there is no need for a separate
   * "tap to enable sound" affordance anywhere in the game.
   */
  unlock(): void {
    if (this.context !== null) return
    try {
      const Ctor: typeof AudioContext | undefined =
        globalThis.AudioContext ??
        (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctor === undefined) return
      this.context = new Ctor()
      void this.context.resume()
    } catch {
      this.context = null
    }
  }

  get muted(): boolean {
    return this.mutedFlag
  }

  setMuted(muted: boolean): void {
    this.mutedFlag = muted
  }

  play(name: SfxName): void {
    if (this.mutedFlag) return
    const context = this.context
    if (context === null) return

    const voice = VOICES[name]
    try {
      this.emit(context, voice, context.currentTime)
      if (voice.then !== undefined) {
        this.emit(context, voice.then, context.currentTime + voice.durationMs / 1000)
      }
    } catch {
      // A dead context is not worth a crash, or a log the player will never read.
    }
  }

  private emit(context: AudioContext, voice: Omit<Voice, 'then'>, startAt: number): void {
    const seconds = voice.durationMs / 1000
    const osc = context.createOscillator()
    const amp = context.createGain()

    osc.type = voice.type
    osc.frequency.setValueAtTime(voice.from, startAt)
    if (voice.to !== voice.from) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, voice.to), startAt + seconds)
    }

    // A hard stop clicks, so the tail is always ramped out.
    amp.gain.setValueAtTime(voice.gain, startAt)
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + seconds)

    osc.connect(amp)
    amp.connect(context.destination)
    osc.start(startAt)
    osc.stop(startAt + seconds)
  }
}
