import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { SAVE_KEY, type SaveData } from "@/data/test-data";

// Phaser scene keys (../client/src/game/scenes/keys.ts). `<html data-scene>` carries the one underneath HUD/overlays.
export const SCENE = {
  boot: "Boot",
  preload: "Preload",
  title: "Title",
  worldMap: "WorldMap",
  game: "Game",
  hud: "Hud",
  pause: "Pause",
  levelComplete: "LevelComplete",
} as const;
export type SceneKey = (typeof SCENE)[keyof typeof SCENE];

export interface PlayState {
  levelId: string;
  hearts: number;
  powered: boolean;
  coins: number;
  totalCoins: number;
  elapsedMs: number;
  finished: boolean;
  paused: boolean;
  x: number;
  y: number;
  vy: number;
  onGround: boolean;
  respawnX: number;
  respawnY: number;
  levelHeightPx: number;
  showTouch: boolean;
  touchVisible: boolean;
  snapshot: { left: boolean; right: boolean; jumpHeld: boolean };
}

export interface LevelObject {
  type: string;
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * The whole game: one canvas, eight Phaser scenes. Everything a player sees is drawn, so there is no DOM to query.
 *
 * Two windows into it, both shipped by the app on purpose (../client/src/main.ts):
 *   - `<html data-scene>`: the running scene, in production too — `scene()` / `waitForScene()`.
 *   - `window.duckstomp`: the Phaser.Game, dev bundle only — everything else here. Specs using it are tagged @dev-build.
 *
 * Buttons inside the canvas are pressed for real: `clickText` asks the running scene where a caption is drawn and
 * clicks (or taps) that point, so the game's own pointer hit-testing decides what was pressed.
 */
export class GamePage extends BasePage {
  readonly canvas: Locator;
  readonly rotateGate: Locator;
  readonly accountOverlay: Locator;

  constructor(page: Page) {
    super(page);
    this.canvas = page.locator("#app canvas");
    this.rotateGate = page.locator("#rotate-gate");
    this.accountOverlay = page.locator("#account-overlay");
  }

  /** Opens the game (relative, so the GitHub Pages base path is kept) and waits for the title screen. */
  async goto(query = ""): Promise<void> {
    await this.page.goto(`./${query}`);
    await this.waitForScene(SCENE.title);
  }

  /** Plants a save before the page loads. Call before goto(). */
  async seedSave(save: SaveData | string): Promise<void> {
    const raw = typeof save === "string" ? save : JSON.stringify(save);
    await this.page.addInitScript(
      ([key, value]) => {
        // Only the first load of this test: a reload must see what the game itself wrote.
        if (sessionStorage.getItem("e2e.seeded") === null) {
          localStorage.setItem(key, value);
          sessionStorage.setItem("e2e.seeded", "1");
        }
      },
      [SAVE_KEY, raw] as const,
    );
  }

  /** Makes `window.localStorage` throw, the way private mode / blocked site data does. Call before goto(). */
  async blockLocalStorage(): Promise<void> {
    await this.page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("The operation is insecure.", "SecurityError");
        },
      });
    });
  }

  /**
   * Starts collecting what the page reports as wrong: uncaught errors, console errors and warnings — minus the GPU
   * driver's own chatter (`ignore`). Returns the live list.
   */
  collectProblems(ignore: RegExp): string[] {
    const problems: string[] = [];
    this.page.on("console", (message) => {
      const type = message.type();
      if (type !== "error" && type !== "warning") return;
      if (ignore.test(message.text())) return;
      problems.push(`${type}: ${message.text()}`);
    });
    this.page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
    return problems;
  }

  /**
   * Wraps the Web Audio API before the page runs, so sound can be proven without speakers: how many contexts were
   * created and resumed, and how many oscillators were started. Read back with `audio()`. Call before goto().
   */
  async probeAudio(): Promise<void> {
    await this.page.addInitScript(() => {
      const probe = { contexts: 0, resumed: 0, started: 0 };
      (window as any).__audioProbe = probe;
      const Original = window.AudioContext;
      if (Original === undefined) return;
      class Probed extends Original {
        constructor(options?: AudioContextOptions) {
          super(options);
          probe.contexts += 1;
        }
        override resume(): Promise<void> {
          probe.resumed += 1;
          return super.resume();
        }
        override createOscillator(): OscillatorNode {
          const osc = super.createOscillator();
          const start = osc.start.bind(osc);
          osc.start = (when?: number) => {
            probe.started += 1;
            start(when);
          };
          return osc;
        }
      }
      (window as any).AudioContext = Probed;
    });
  }

  async audio(): Promise<{ contexts: number; resumed: number; started: number }> {
    return this.page.evaluate(() => ({ ...(window as any).__audioProbe }));
  }

  async readSave(): Promise<SaveData | null> {
    const raw = await this.page.evaluate((key) => localStorage.getItem(key), SAVE_KEY);
    return raw === null ? null : (JSON.parse(raw) as SaveData);
  }

  async scene(): Promise<string | undefined> {
    return this.page.evaluate(() => document.documentElement.dataset["scene"]);
  }

  async waitForScene(key: SceneKey, timeout = 20_000): Promise<void> {
    await this.page.waitForFunction((k) => document.documentElement.dataset["scene"] === k, key, { timeout });
  }

  /** True when the scene is running (not paused, not stopped). @dev-build */
  async isActive(key: SceneKey): Promise<boolean> {
    return this.page.evaluate((k) => {
      const game = (window as any).duckstomp;
      return game === undefined ? false : game.scene.isActive(k) === true;
    }, key);
  }

  /** True when the scene exists and is paused. @dev-build */
  async isPaused(key: SceneKey): Promise<boolean> {
    return this.page.evaluate((k) => (window as any).duckstomp?.scene.isPaused(k) === true, key);
  }

  /** Waits until a scene is running. @dev-build */
  async waitForActive(key: SceneKey, timeout = 20_000): Promise<void> {
    await this.page.waitForFunction((k) => (window as any).duckstomp?.scene.isActive(k) === true, key, { timeout });
  }

  /** A real key press, held long enough for Phaser's per-frame polling to see it. */
  async press(key: string): Promise<void> {
    await this.page.keyboard.down(key);
    await this.page.waitForFunction(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await this.page.keyboard.up(key);
  }

  /** Title → PLAY → map → START: level 1 running, by keyboard. */
  async startLevelOne(): Promise<void> {
    await this.press("Enter");
    await this.waitForScene(SCENE.worldMap);
    await this.press("Enter");
    await this.waitForScene(SCENE.game);
  }

  /** Goes straight into a level the save has unlocked: title → map, select by arrows, START. */
  async startLevel(id: string): Promise<void> {
    await this.press("Enter");
    await this.waitForScene(SCENE.worldMap);
    for (let i = 1; i < Number(id); i += 1) await this.press("ArrowRight");
    await this.press("Enter");
    await this.waitForScene(SCENE.game);
    await this.waitForActive(SCENE.hud);
  }

  /** Every visible Text object in a scene, containers included. @dev-build */
  async texts(key: SceneKey): Promise<string[]> {
    return this.page.evaluate((k) => {
      const scene = (window as any).duckstomp?.scene.getScene(k);
      if (!scene || (!scene.sys.isActive() && !scene.sys.isPaused())) return [];
      const out: string[] = [];
      const walk = (o: any, visible: boolean): void => {
        const shown = visible && o.visible !== false;
        if (Array.isArray(o.list)) o.list.forEach((c: any) => walk(c, shown));
        else if (o.type === "Text" && shown && o.text !== "") out.push(o.text);
      };
      scene.children.list.forEach((c: any) => walk(c, true));
      return out;
    }, key);
  }

  /** Page-coordinate box of the visible Text whose caption is exactly `caption`. @dev-build */
  async textBox(key: SceneKey, caption: string): Promise<Box | null> {
    return this.page.evaluate(
      ([k, cap]) => {
        const scene = (window as any).duckstomp?.scene.getScene(k);
        if (!scene) return null;
        const rect = document.querySelector("#app canvas")!.getBoundingClientRect();
        let found: any = null;
        const walk = (o: any, visible: boolean): void => {
          const shown = visible && o.visible !== false;
          if (Array.isArray(o.list)) o.list.forEach((c: any) => walk(c, shown));
          else if (o.type === "Text" && shown && o.text === cap && found === null) found = o;
        };
        scene.children.list.forEach((c: any) => walk(c, true));
        if (found === null) return null;
        const b = found.getBounds();
        return { x: rect.x + b.x, y: rect.y + b.y, width: b.width, height: b.height };
      },
      [key, caption] as const,
    );
  }

  /** Clicks (or taps, with `touch`) the centre of a drawn caption — a real pointer event on the canvas. @dev-build */
  async clickText(key: SceneKey, caption: string, options: { touch?: boolean } = {}): Promise<void> {
    const box = await this.textBox(key, caption);
    if (box === null) throw new Error(`"${caption}" is not drawn in ${key}`);
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    if (options.touch) await this.page.touchscreen.tap(x, y);
    else await this.page.mouse.click(x, y);
  }

  /**
   * Page-coordinate boxes of the icon-only buttons in a scene, by accessible name (`Sound on`, `Sound off`, `Pause`).
   * The name is the Phaser object's name (IconButton → setName). @dev-build
   */
  async iconButtons(key: SceneKey): Promise<Array<Box & { name: string }>> {
    return this.page.evaluate((k) => {
      const scene = (window as any).duckstomp?.scene.getScene(k);
      if (!scene) return [];
      const rect = document.querySelector("#app canvas")!.getBoundingClientRect();
      return scene.children.list
        .filter((o: any) => o.type === "Container" && typeof o.name === "string" && o.name !== "" && o.visible)
        .map((o: any) => {
          const b = o.getBounds();
          return { name: o.name as string, x: rect.x + b.x, y: rect.y + b.y, width: b.width, height: b.height };
        });
    }, key);
  }

  async clickIcon(key: SceneKey, name: string, options: { touch?: boolean } = {}): Promise<void> {
    const icon = (await this.iconButtons(key)).find((b) => b.name === name);
    if (icon === undefined) throw new Error(`no icon button "${name}" in ${key}`);
    const x = icon.x + icon.width / 2;
    const y = icon.y + icon.height / 2;
    if (options.touch) await this.page.touchscreen.tap(x, y);
    else await this.page.mouse.click(x, y);
  }

  /** Page-coordinate centres of the six map nodes, in level order. @dev-build */
  async mapNodes(): Promise<Array<{ x: number; y: number }>> {
    return this.page.evaluate(() => {
      const scene = (window as any).duckstomp.scene.getScene("WorldMap");
      const rect = document.querySelector("#app canvas")!.getBoundingClientRect();
      return scene.nodes.map((n: any) => ({ x: rect.x + n.x, y: rect.y + n.y }));
    });
  }

  /** Which node the map has selected. @dev-build */
  async selectedNode(): Promise<string> {
    return this.page.evaluate(() => (window as any).duckstomp.scene.getScene("WorldMap").selected as string);
  }

  /** The map's card for the selected node, and the total in the top bar. @dev-build */
  async mapCard(): Promise<{ title: string; best: string; coins: string; coinIconVisible: boolean; totalCoins: string }> {
    return this.page.evaluate(() => {
      const scene = (window as any).duckstomp.scene.getScene("WorldMap");
      // The top-bar total is the first Text the scene adds (WorldMapScene.create).
      const total = scene.children.list.find((o: any) => o.type === "Text");
      return {
        title: scene.cardTitle.text,
        best: scene.cardBest.text,
        coins: scene.cardCoins.text,
        coinIconVisible: scene.cardCoinIcon.visible === true,
        totalCoins: total?.text ?? "",
      };
    });
  }

  /** Selects a node with the arrow keys, the way a keyboard player does. @dev-build */
  async selectNode(id: string): Promise<void> {
    for (let guard = 0; guard < 6 && (await this.selectedNode()) !== id; guard += 1) await this.press("ArrowRight");
  }

  /** True when the START button on the map accepts input. @dev-build */
  async startEnabled(): Promise<boolean> {
    return this.page.evaluate(() => (window as any).duckstomp.scene.getScene("WorldMap").startButton.enabled === true);
  }

  /** How much of the freshly unlocked trail is drawn (0…1); 1 when nothing animates. @dev-build */
  async trailProgress(): Promise<number> {
    return this.page.evaluate(() => (window as any).duckstomp.scene.getScene("WorldMap").trailProgress as number);
  }

  /** What the running level knows about itself and the player. @dev-build */
  async state(): Promise<PlayState> {
    return this.page.evaluate(() => {
      const game = (window as any).duckstomp;
      const play = game.scene.getScene("Game");
      const hud = game.scene.getScene("Hud");
      const containers = (hud?.children?.list ?? []).filter((o: any) => o.type === "Container" && !o.name);
      const touchGroup = containers[containers.length - 1];
      return {
        levelId: play.levelId,
        hearts: play.player.hearts,
        powered: play.player.powered,
        coins: play.coinsCollected,
        totalCoins: play.level.totalCoins,
        elapsedMs: play.elapsedMs,
        finished: play.finished,
        paused: game.scene.isPaused("Game"),
        x: play.player.x,
        y: play.player.y,
        vy: play.player.body.velocity.y,
        onGround: play.player.body.blocked.down === true || play.player.body.touching.down === true,
        respawnX: play.respawnAt.x,
        respawnY: play.respawnAt.y,
        levelHeightPx: play.level.heightPx,
        showTouch: play.inputs.showTouch,
        touchVisible: touchGroup?.visible === true,
        snapshot: { left: play.inputs.snapshot.left, right: play.inputs.snapshot.right, jumpHeld: play.inputs.snapshot.jumpHeld },
      };
    });
  }

  /** The level's object layer (spawn, goal, coins, checkpoints, spikes…) as parsed by the game. @dev-build */
  async levelObjects(type?: string): Promise<LevelObject[]> {
    return this.page.evaluate((t) => {
      const play = (window as any).duckstomp.scene.getScene("Game");
      return play.level.objects
        .filter((o: any) => t === undefined || o.type === t)
        .map((o: any) => ({ type: o.type, x: o.x, y: o.y }));
    }, type);
  }

  /**
   * Puts the player at a world position (goal, checkpoint, coin, below the pit line). Reaching a place is physics,
   * which is unit tested in ../client/src/core/movement.test.ts; what the game does once the player is there is what
   * the e2e suite checks. @dev-build
   */
  async teleport(x: number, y: number): Promise<void> {
    await this.page.evaluate(
      ([px, py]) => {
        const play = (window as any).duckstomp.scene.getScene("Game");
        play.player.body.reset(px, py);
      },
      [x, y] as const,
    );
  }

  /**
   * The level file exactly as the site serves it (`levels/level-<id>.json`, relative to the base path), flattened to
   * its objects with their custom properties. Independent of how the game parses it.
   */
  async levelFile(id: string): Promise<{ status: number; objects: Array<LevelObject & { props: Record<string, unknown> }> }> {
    return this.page.evaluate(async (levelId) => {
      const res = await fetch(`levels/level-${levelId}.json`);
      if (!res.ok) return { status: res.status, objects: [] };
      const json = await res.json();
      const objects = json.layers
        .filter((l: any) => l.type === "objectgroup")
        .flatMap((l: any) => l.objects)
        .map((o: any) => ({
          type: o.type ?? o.class,
          x: o.x,
          y: o.y,
          props: Object.fromEntries((o.properties ?? []).map((p: any) => [p.name, p.value])),
        }));
      return { status: res.status, objects };
    }, id);
  }

  /** Holds a key until `done` says so (or the timeout), then releases it. */
  async holdUntil(key: string, done: () => Promise<boolean>, timeout = 10_000): Promise<void> {
    await this.page.keyboard.down(key);
    try {
      const until = Date.now() + timeout;
      while (!(await done())) {
        if (Date.now() > until) throw new Error(`holding ${key}: condition not reached in ${timeout}ms`);
        await this.frames(2);
      }
    } finally {
      await this.page.keyboard.up(key);
    }
  }

  /**
   * Waits until the player stands on the ground: the same height for several frames in a row. (Arcade reports
   * `blocked.down` only every other frame while standing, because core/movement re-applies gravity each step.) @dev-build
   */
  async waitUntilGrounded(): Promise<void> {
    let still = 0;
    let lastY = Number.NaN;
    const until = Date.now() + 20_000;
    while (still < 6) {
      if (Date.now() > until) throw new Error("player never settled on the ground");
      const { y } = await this.state();
      still = y === lastY ? still + 1 : 0;
      lastY = y;
      await this.frames(1);
    }
  }

  /**
   * Starts recording the running level's domain events (playerHit, playerDied, playerRespawned, checkpointReached,
   * levelCompleted…) with their payloads and the real time they fired. Read back with `events()`. @dev-build
   */
  async recordEvents(): Promise<void> {
    await this.page.evaluate(() => {
      const play = (window as any).duckstomp.scene.getScene("Game");
      const log: Array<{ name: string; payload: unknown; at: number; gameTime: number }> = [];
      (window as any).__e2eEvents = log;
      const emit = play.events.emit.bind(play.events);
      // GAME_EVENT names (client/src/game/events.ts) minus the per-frame timeTick. Phaser emits its own lifecycle
      // events on the same emitter every frame; those are not recorded.
      const names = new Set([
        "coinCollected", "powerUpTaken", "playerHit", "powerUpLost", "blockBroken", "blockThudded", "blockBumped",
        "enemyStomped", "checkpointReached", "playerDied", "playerRespawned", "levelCompleted",
      ]);
      play.events.emit = (name: string, payload: unknown, ...rest: unknown[]) => {
        if (names.has(name)) {
          const plain = JSON.parse(JSON.stringify(payload ?? null));
          log.push({ name, payload: plain, at: performance.now(), gameTime: play.time.now });
        }
        return emit(name, payload, ...rest);
      };
    });
  }

  /** `at`: page real time; `gameTime`: the scene clock the game itself uses for invulnerability and cooldowns. */
  async events(): Promise<Array<{ name: string; payload: any; at: number; gameTime: number }>> {
    return this.page.evaluate(() => (window as any).__e2eEvents ?? []);
  }

  /** Real-time clock of the page, to measure how long the game took to do something. */
  async now(): Promise<number> {
    return this.page.evaluate(() => performance.now());
  }

  /** Seeds the powered form (as taking a mushroom would). @dev-build */
  async setPowered(on: boolean): Promise<void> {
    await this.page.evaluate((v) => (window as any).duckstomp.scene.getScene("Game").player.setPowered(v), on);
  }

  /** Puts the player on the goal flag and waits for the level-clear card. @dev-build */
  async reachGoal(): Promise<void> {
    const goal = (await this.levelObjects("goal"))[0];
    if (goal === undefined) throw new Error("level has no goal");
    await this.teleport(goal.x, goal.y);
    await this.waitForActive(SCENE.levelComplete);
  }

  /** Picks up the first loose coin of the level and waits for the HUD to count it. @dev-build */
  async takeCoin(index = 0): Promise<void> {
    const coin = (await this.levelObjects("coin"))[index];
    if (coin === undefined) throw new Error(`level has no coin #${index}`);
    const before = (await this.state()).coins;
    await this.teleport(coin.x, coin.y);
    await this.page.waitForFunction(
      (n) => (window as any).duckstomp.scene.getScene("Game").coinsCollected > n,
      before,
    );
  }

  /** The HUD as drawn: hearts (full count), coin label, clock. @dev-build */
  async hud(): Promise<{ hearts: number; coins: string; clock: string }> {
    return this.page.evaluate(() => {
      const hud = (window as any).duckstomp.scene.getScene("Hud");
      return {
        hearts: hud.hearts.filter((h: any) => h.texture.key === "ui-heart").length,
        coins: hud.coinLabel.text,
        clock: hud.clock.text,
      };
    });
  }

  /** The integer zoom the game picked for this viewport. @dev-build */
  async zoom(): Promise<number> {
    return this.page.evaluate(() => Number((window as any).duckstomp.registry.get("zoom")));
  }

  /** CSS size of the canvas, from the DOM — works on every build. */
  async canvasSize(): Promise<{ width: number; height: number }> {
    return this.canvas.evaluate((c) => ({ width: c.clientWidth, height: c.clientHeight }));
  }

  /** Waits a number of real animation frames — lets Phaser run its loop without a fixed sleep. */
  async frames(n: number): Promise<void> {
    await this.page.evaluate(
      (count) =>
        new Promise<void>((resolve) => {
          let left = count;
          const tick = (): void => {
            left -= 1;
            if (left <= 0) resolve();
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      n,
    );
  }
}
