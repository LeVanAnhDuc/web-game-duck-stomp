#!/usr/bin/env node
// Enforces invariants #2 and #5 from docs/03-design/invariants.md.
//
// Both are silent failures: importing Phaser into src/core/ does not break a
// build, and reading the wall clock inside the movement state machine keeps every
// test green while the game behaves differently on a 120Hz display. No type
// checker catches either, so this script does.

import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const CORE = 'src/core'

/** @type {{ pattern: RegExp, why: string }[]} */
const BANNED = [
  { pattern: /from\s+['"]phaser['"]/, why: "imports phaser — core must not know Phaser exists (invariants #2)" },
  { pattern: /require\(\s*['"]phaser['"]\s*\)/, why: "requires phaser (invariants #2)" },
  { pattern: /from\s+['"][^'"]*\/game\//, why: "imports from src/game/ — the dependency only points inward (invariants #2)" },
  { pattern: /\bDate\.now\s*\(/, why: "reads the wall clock — delta time must be passed in (invariants #5)" },
  { pattern: /\bperformance\.now\s*\(/, why: "reads the wall clock (invariants #5)" },
  { pattern: /\bMath\.random\s*\(/, why: "is non-deterministic — core must be reproducible (NFR-GAME-02)" },
]

async function walk(dir) {
  /** @type {string[]} */
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (e.name.endsWith('.ts')) out.push(p)
  }
  return out
}

const files = await walk(CORE)
if (files.length === 0) {
  console.error(`check-core-boundary: found no .ts files under ${CORE}/ — wrong working directory?`)
  process.exit(1)
}

/** @type {string[]} */
const problems = []

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const lines = source.split(/\r?\n/)
  lines.forEach((line, i) => {
    // A line that only talks about the rule is fine; a line that does it is not.
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return
    for (const { pattern, why } of BANNED) {
      if (pattern.test(line)) {
        problems.push(`${relative('.', file)}:${i + 1}  ${why}\n    ${line.trim()}`)
      }
    }
  })
}

if (problems.length > 0) {
  console.error(`check-core-boundary: ${problems.length} violation(s)\n`)
  for (const p of problems) console.error(`  ${p}\n`)
  process.exit(1)
}

console.log(`check-core-boundary: ok — ${files.length} file(s) in ${CORE}/ stay pure`)
