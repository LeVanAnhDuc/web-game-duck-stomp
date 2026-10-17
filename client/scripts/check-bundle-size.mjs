#!/usr/bin/env node
/**
 * Fails the build when the shipped script payload grows past its budget — the CI
 * half of NFR-PERF-08.
 *
 *   node scripts/check-bundle-size.mjs [dist-dir]
 *
 * It measures the GZIPPED size of the JS and CSS in `dist/`, because that is what
 * a browser actually pulls down, and it reads the files rather than parsing the
 * table Vite prints — a gate built on printed output breaks every time the
 * formatting changes, and this one breaks only when the bundle really grows.
 *
 * On the budget: 333 kB gzipped measured on 08.09.2026, almost all of it Phaser.
 * The ceiling is 450 kB, which leaves room for ordinary growth while still
 * catching the thing this gate exists for — somebody adding a heavy dependency
 * without noticing. It is deliberately NOT the 3 MB product ceiling from
 * nfr.md: a gate that can never fire is worse than no gate, because people trust
 * it. Images and audio are excluded and covered by that separate ceiling.
 *
 * Raising this number is a decision, not a fix. Change nfr.md too.
 */

import { gzipSync } from 'node:zlib'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const BUDGET_BYTES = 450 * 1024
const COUNTED = /\.(js|mjs|css)$/

const distDir = process.argv[2] ?? 'dist'

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path)))
    else if (COUNTED.test(entry.name)) out.push(path)
  }
  return out
}

const files = await walk(distDir)

if (files.length === 0) {
  console.error(`check-bundle-size: no js/css found under ${distDir}/ — run the build first`)
  process.exit(1)
}

const measured = []
let total = 0

for (const file of files) {
  const bytes = gzipSync(await readFile(file), { level: 9 }).length
  measured.push({ file, bytes })
  total += bytes
}

measured.sort((a, b) => b.bytes - a.bytes)

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`

for (const { file, bytes } of measured) {
  console.log(`  ${kb(bytes).padStart(10)}  ${file}`)
}

const headroom = BUDGET_BYTES - total
const verdict = total <= BUDGET_BYTES ? 'ok' : 'OVER BUDGET'
console.log(
  `check-bundle-size: ${verdict} — ${kb(total)} gzipped against a ${kb(BUDGET_BYTES)} budget ` +
    `(${headroom >= 0 ? kb(headroom) + ' spare' : kb(-headroom) + ' over'})`,
)

if (total > BUDGET_BYTES) {
  console.error(
    '\nThis is NFR-PERF-08. Either the growth is justified — in which case raise the\n' +
      'budget here AND in docs/02-requirements/nfr.md, with a reason — or something\n' +
      'heavy got pulled in that should not have been.',
  )
  process.exit(1)
}
