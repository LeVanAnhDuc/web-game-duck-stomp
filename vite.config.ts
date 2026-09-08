import { defineConfig } from 'vite'

// `base: './'` keeps every asset path relative, so the same `dist/` works from a
// repo subpath on GitHub Pages and from `file://` without a rebuild.
//
// `publicDir: 'assets'` is what makes NFR-GAME-04 true: level files authored in
// Tiled live in `assets/levels/` and are served verbatim at `/levels/*.json`.
// They are data, never bundled, so adding a level touches no code.
export default defineConfig({
  base: './',
  publicDir: 'assets',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
})
