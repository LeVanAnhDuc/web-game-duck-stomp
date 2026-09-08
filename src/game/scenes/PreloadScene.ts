/**
 * Loads the six level files. They are JSON in `assets/`, served verbatim and never
 * bundled, which is what makes "add a level without touching code" true
 * (NFR-GAME-04). Paths are relative so the same build works from a GitHub Pages
 * subpath.
 */

import Phaser from 'phaser'
import { LEVEL_IDS } from '../../core/progress'
import { COLOR, CSS, FONT, metrics } from '../ui'
import { SCENE } from './keys'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE.preload)
  }

  preload(): void {
    const { s, w, h } = metrics(this)

    const label = this.add
      .text(w / 2, h / 2 + 24 * s, '', {
        fontFamily: FONT.ui,
        fontSize: `${Math.round(12 * s)}px`,
        color: CSS.inkDim,
      })
      .setOrigin(0.5, 0.5)

    const barWidth = Math.round(120 * s)
    const track = this.add.rectangle(w / 2, h / 2, barWidth, 6 * s, COLOR.panel).setOrigin(0.5, 0.5)
    const fill = this.add.rectangle(track.x - barWidth / 2, h / 2, 0, 6 * s, COLOR.gold).setOrigin(0, 0.5)

    this.load.on('progress', (value: number) => {
      fill.width = barWidth * value
      label.setText(`${Math.round(value * 100)}%`)
    })

    for (const id of LEVEL_IDS) {
      this.load.json(`level-${id}`, `levels/level-${id}.json`)
    }

    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.error(`[preload] failed to load ${file.key} from ${file.url}`)
    })
  }

  create(): void {
    this.scene.start(SCENE.title)
  }
}
