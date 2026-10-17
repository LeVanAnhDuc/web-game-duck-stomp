// Test data. Static values and small builders only — nothing that reads the environment or touches the UI.

// The only thing the game persists: ../client/src/core/storage.ts (SAVE_KEY, SAVE_VERSION, SaveData).
export const SAVE_KEY = "platformer.save.v1";
export const SAVE_VERSION = 1;

export interface LevelRecord {
  cleared: boolean;
  bestTimeMs: number | null;
  coins: number;
}

export interface SaveData {
  version: number;
  levels: Record<string, LevelRecord>;
  muted: boolean;
}

export const LEVEL_IDS = ["1", "2", "3", "4", "5", "6"] as const;

/** A valid save with the given levels cleared, e.g. saveWith({ "1": { bestTimeMs: 42_000, coins: 3 } }). */
export function saveWith(
  levels: Record<string, Partial<LevelRecord>> = {},
  muted = false,
): SaveData {
  const out: Record<string, LevelRecord> = {};
  for (const [id, record] of Object.entries(levels)) {
    out[id] = { cleared: true, bestTimeMs: 60_000, coins: 0, ...record };
  }
  return { version: SAVE_VERSION, levels: out, muted };
}

/** Every level cleared: all six nodes open. */
export function allCleared(): SaveData {
  return saveWith(Object.fromEntries(LEVEL_IDS.map((id) => [id, { bestTimeMs: 90_000, coins: 1 }])));
}

// Viewports: the three the design is checked at (docs/02-requirements/nfr.md NFR-PERF-05), plus the smallest landscape
// phone the account menu promises to fit (ADR-0013) and a portrait phone for the rotate gate (FR-16).
export const VIEWPORT = {
  phoneLandscape: { width: 667, height: 375 },
  smallLandscape: { width: 568, height: 320 },
  tablet: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
  phonePortrait: { width: 375, height: 667 },
} as const;

// Hosts the deployed page is allowed to talk to: its own origin and Google Fonts (NFR-REL-01, NFR-DATA-01).
export const FONT_HOSTS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"] as const;

// Headless Chromium's software GL stack logs performance advice while textures are baked; that is the CI machine's
// driver talking, not the game. Anything else on the console is the game's and counts.
export const DRIVER_NOISE = /GL Driver Message|\.WebGL-0x/;

// The flag-on dev server (playwright.config.ts, :4174) signs in against this fake issuer. It is never resolved:
// the issuer fixture answers every request to it (ADR-0013).
export const DUCKER = {
  issuer: "http://ducker.test",
  profilePath: "/profile",
  user: { sub: "u1", name: "Lê Văn Anh Đức", email: "duc@ducker.id" },
  pkceKey: "ducker.pkce",
} as const;
