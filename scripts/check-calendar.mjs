#!/usr/bin/env node
/**
 * Checks the Dry Lab calendar and its iterations (src/data/dryLabCalendar.js,
 * src/data/dryLabIterations.js) against the wiki's MDX sources:
 *   - every link points at a page that exists, and at a heading on it
 *   - every iteration has its required fields, known values and dates in season
 * and warns where a link lands on a section that is still a placeholder.
 *
 * Reads headings from src/content/wiki with the same slugs rehype-slug gives
 * them, so it needs no build and is safe to run next to `npm run develop`.
 *
 *   npm run check:calendar
 */
import fs from "node:fs"
import path from "node:path"
import GithubSlugger from "github-slugger"
import { STANDARD_ROUTE_ALIASES } from "../src/data/standardRoutes.mjs"
import { DRY_LAB_WEEKS } from "../src/data/dryLabCalendar.js"
import {
  DRY_LAB_ITERATIONS,
  ITERATION_CRITERIA,
  ITERATION_KINDS,
  ITERATION_STAGES,
  ITERATION_STATUSES,
  ITERATION_TRACK_BY_ID,
} from "../src/data/dryLabIterations.js"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const CONTENT = path.join(ROOT, "src/content/wiki")
const SEASON = ["2026-02-01", "2026-10-31"]

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) return e.name.startsWith("_") ? [] : walk(p)
    return e.name.endsWith(".mdx") ? [p] : []
  })
}

/** Page path → { headings: Map(slug → placeholder?) } from the MDX sources. */
function readPages() {
  const pages = new Map()
  for (const file of walk(CONTENT)) {
    const src = fs.readFileSync(file, "utf8")
    const route = src.match(/^path:\s*"([^"]+)"/m)?.[1]
    if (!route) continue
    // Drop MDX comments and code fences so their contents aren't read as headings.
    const body = src
      .replace(/^---[\s\S]*?\n---/, "")
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/```[\s\S]*?```/g, "")
    const slugger = new GithubSlugger()
    const headings = new Map()
    const lines = body.split("\n")
    lines.forEach((line, i) => {
      const m = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/)
      if (!m) return
      const slug = slugger.slug(m[1].replace(/[*_`]/g, ""))
      // First rendered line after the heading, past an "*Owner: …*" byline.
      const next = lines
        .slice(i + 1)
        .find((l) => l.trim() && !/^\s*\*Owner:/.test(l) && !/^\s*\{/.test(l))
      headings.set(slug, /^\s*<?Placeholder\b/.test(next || ""))
    })
    pages.set(route, { file: path.relative(ROOT, file), headings })
  }
  for (const [alias, source] of Object.entries(STANDARD_ROUTE_ALIASES)) {
    if (pages.has(source)) pages.set(alias, pages.get(source))
  }
  return pages
}

const pages = readPages()
const errors = []
/** Placeholder section → the items linking to it. */
const placeholders = new Map()

function checkLink([label, href], where) {
  if (!label || !href) return errors.push(`${where}: link needs [label, href]`)
  const [route, anchor] = href.split("#")
  const page = pages.get(route)
  if (!page) return errors.push(`${where}: no page at ${route} (${label})`)
  if (!anchor) return
  if (!page.headings.has(anchor)) return errors.push(`${where}: no heading #${anchor} on ${route} (${label})`)
  if (page.headings.get(anchor)) {
    const key = `${label} (${page.file}#${anchor})`
    if (!placeholders.has(key)) placeholders.set(key, new Set())
    placeholders.get(key).add(where.replace(/ .*$/, ""))
  }
}

// Calendar weeks
for (const w of DRY_LAB_WEEKS) {
  for (const l of w.see || []) checkLink(l, `${w.id} overview`)
  for (const [id, t] of Object.entries(w.subteams)) for (const l of t.see || []) checkLink(l, `${w.id} ${id}`)
  for (const m of w.milestones) {
    if (m.date < w.start || m.date > w.end) errors.push(`${w.id}: milestone "${m.label}" (${m.date}) is outside its week`)
    if (m.see) checkLink(m.see, `${w.id} milestone "${m.label}"`)
  }
}

// Iterations
const ids = new Set()
for (const it of DRY_LAB_ITERATIONS) {
  const at = `iteration ${it.id}`
  if (ids.has(it.id)) errors.push(`${at}: duplicate id`)
  ids.add(it.id)
  for (const f of ["title", "expected", "happened", "foundBy", "learned", "changed", "source"]) {
    if (!it[f]?.trim()) errors.push(`${at}: missing ${f}`)
  }
  if (!ITERATION_TRACK_BY_ID[it.track]) errors.push(`${at}: unknown track ${it.track}`)
  if (!ITERATION_KINDS[it.kind]) errors.push(`${at}: unknown kind ${it.kind}`)
  if (!ITERATION_STATUSES[it.status]) errors.push(`${at}: unknown status ${it.status}`)
  for (const c of it.criteria || []) if (!ITERATION_CRITERIA[c]) errors.push(`${at}: unknown criterion ${c}`)
  if (!it.criteria?.length) errors.push(`${at}: needs at least one criterion`)
  if (!it.steps?.length) errors.push(`${at}: needs at least one step`)
  for (const s of it.steps || []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date) || s.date < SEASON[0] || s.date > SEASON[1]) {
      errors.push(`${at}: step date ${s.date} is outside the season`)
    }
    if (!ITERATION_STAGES[s.stage]) errors.push(`${at}: unknown stage ${s.stage}`)
    if (!s.text?.trim()) errors.push(`${at}: step on ${s.date} has no text`)
  }
  if (!it.see?.length) errors.push(`${at}: needs at least one evidence link`)
  for (const l of it.see || []) checkLink(l, at)
}

// Iterations first: they're the ones a judge reads as evidence.
const sorted = [...placeholders].sort(
  ([, a], [, b]) => [...b].filter((x) => x === "iteration").length - [...a].filter((x) => x === "iteration").length
)
for (const [section, from] of sorted) {
  const its = DRY_LAB_ITERATIONS.filter((it) => it.see.some(([l, h]) => section.startsWith(`${l} (`) && section.includes(h.split("#")[1] || "~")))
  const weeks = [...from].filter((x) => x.startsWith("week-")).length
  console.warn(
    `warn  placeholder: ${section}\n        linked from ${its.length} iteration(s)${its.length ? ` [${its.map((i) => i.id).join(", ")}]` : ""} and ${weeks} week(s)`
  )
}
for (const e of errors) console.error(`error ${e}`)
console.log(
  `\n${DRY_LAB_WEEKS.length} weeks, ${DRY_LAB_ITERATIONS.length} iterations: ` +
    `${errors.length} error(s), ${placeholders.size} placeholder section(s) linked.`
)
process.exit(errors.length ? 1 : 0)
