// Entry point. Kept deliberately thin: it wires nothing but the boot sequence, so
// that everything worth reading lives in a named module.
import { BASE_H, BASE_W, computeScale } from './core/scale'

const app = document.getElementById('app')
if (app === null) throw new Error('index.html is missing #app')

const { zoom, canvasW, canvasH } = computeScale(window.innerWidth, window.innerHeight)
app.textContent = `${BASE_W}x${BASE_H} @${zoom}x -> ${canvasW}x${canvasH}`
