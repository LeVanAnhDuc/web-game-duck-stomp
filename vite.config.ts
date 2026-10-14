import { defineConfig, loadEnv } from 'vite'

// `base` comes from VITE_BASE_PATH: "/" locally, "/<repo>/" on GitHub Pages (set by
// deploy.yml). It is read from the environment instead of being hardcoded because
// the Ducker ID `redirect_uri` is origin + base path, and it has to be exact.
// Unset means Vite's own default, the site root.
//
// `publicDir: 'assets'` is what makes NFR-GAME-04 true: level files authored in
// Tiled live in `assets/levels/` and are served verbatim at `/levels/*.json`.
// They are data, never bundled, so adding a level touches no code.
export default defineConfig(({ mode }) => {
  const basePath = loadEnv(mode, process.cwd(), '')['VITE_BASE_PATH']
  return {
    // An explicit branch, not a `|| '/'` default: unset leaves Vite's own default.
    ...(basePath ? { base: basePath } : {}),
    publicDir: 'assets',
    build: {
      target: 'es2022',
      assetsInlineLimit: 0,
    },
  }
})
