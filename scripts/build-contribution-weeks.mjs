#!/usr/bin/env node
/**
 * Timeline -> contribution calendar generator.
 *
 * Reads the timeline file (.md / .mdx, the "### YYYY-MM-DD (Weekday)" +
 * "- [Subteam] text. (Source: ...)" format) and writes a JS module with one
 * entry per week (Sunday start, id "week-YYYY-MM-DD").
 *
 * Usage:
 *   node scripts/build-contribution-weeks.mjs <timeline.mdx> <out.generated.js> [flags]
 *
 * Flags:
 *   --check               exit 1 if the output file is out of date (for CI)
 *   --max-bullets=N       bullets kept per subteam per week (default 5)
 *   --max-chars=N         bullets longer than this are never used (default 450)
 *   --no-date-prefix      don't prefix bullets with "Oct 5: "
 *   --no-milestones       don't derive milestones
 *
 * Description text is copied verbatim from the timeline (source tag removed).
 * Nothing is paraphrased or truncated; a bullet is either used whole or not used.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { createHash } from "node:crypto"

// ---------------------------------------------------------------- config ----
const args = process.argv.slice(2)
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=")
    return [k, v ?? true]
  })
)
const [INPUT, OUTPUT] = args.filter((a) => !a.startsWith("--"))
if (!INPUT || !OUTPUT) {
  console.error("Usage: build-contribution-weeks.mjs <timeline.mdx> <out.generated.js> [--check]")
  process.exit(2)
}

const CONFIG = {
  maxBullets: Number(flags["max-bullets"] ?? 5),
  maxChars: Number(flags["max-chars"] ?? 450),
  datePrefix: !flags["no-date-prefix"],
  milestones: !flags["no-milestones"],
  maxMilestonesPerWeek: 3,
  maxOverviewSentences: 2,
  dedupeSimilarity: 0.55,
}

// Timeline subteam name -> calendar SubteamId
const SUBTEAM_MAP = {
  "Wet Lab": "wetLab",
  "Dry Lab": "dryLab",
  Hardware: "hardware",
  "Human Practices": "humanPractices",
  Venture: "venture",
  Outreach: "outreach",
  Web: "web",
}
// Not subteams on the calendar: these feed the week overview and "all" milestones
const TEAM_WIDE = new Set(["Cross-Team", "Leadership", "Finance", "Competitions"])

// Safety net on top of the timeline's own exclusions (absences, health, personnel).
const DENYLIST =
  /\b(unwell|contagious|self-isolate|out of office|without gloves|accused|on vacation|laptop malfunction)\b/i
// Entries that only confirm a meeting was scheduled, or are pure media dumps.
const NOISE = /^(Calendar event:|.*\(images only\)\.?$)/i

const MILESTONE_RE =
  /\b(won|second place|took (first|second)|went live|launched|arrived|published|released|secured|declared done|first validated|finished its entire)\b|^Milestone:/i
const IMPORTANT_RE =
  /\b(won|placed|launched|went live|secured|confirmed|completed|finished|arrived|submitted|decided|decision|first|passed|released|published|finalized|locked|milestone)\b/i

// ----------------------------------------------------------------- parse ----
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_RE = /^###\s+(\d{4}-\d{2}-\d{2})\s+\(/
const EVENT_RE = /^-\s+\[([^\]]+)\]\s+(.*)$/

const clean = (s) => s.replace(/â‰¥/g, "≥").replace(/\s+/g, " ").trim()

function parseTimeline(raw) {
  const events = []
  let date = null
  let inFence = false
  let order = 0
  for (const line of raw.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (line.startsWith("### ")) {
      const m = line.match(DAY_RE)
      date = m ? m[1] : null // month-level headings (no exact day) are skipped
      continue
    }
    if (!date) continue
    const m = line.match(EVENT_RE)
    if (!m) continue
    const body = m[2]
    const i = body.lastIndexOf("(Source:")
    if (i < 0) continue
    events.push({
      date,
      team: m[1].trim(),
      text: clean(body.slice(0, i)),
      source: body.slice(i + 8).replace(/\)\s*$/, "").trim(),
      order: order++,
    })
  }
  return events
}

// ------------------------------------------------------------- utilities ----
function weekStartOf(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - d.getUTCDay()) // Sunday
  return d.toISOString().slice(0, 10)
}
function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
function shortDate(dateStr) {
  const [, m, d] = dateStr.split("-").map(Number)
  return `${MONTHS[m - 1]} ${d}`
}
function firstSentence(text, max) {
  const m = text.match(/^.*?[.!?](?=\s|$)/)
  let s = (m ? m[0] : text).replace(/[.!?]$/, "").replace(/^Milestone:\s*/i, "")
  if (s.length > max) {
    s = s.slice(0, max).replace(/\s+\S*$/, "") + "…"
  }
  return s
}
const tokens = (s) =>
  new Set(s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w.length > 2))
function similarity(a, b) {
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter || 1)
}

function score(e) {
  let s = 0
  // Meeting minutes and status summaries are the curated record
  if (/^(AH|LM) #/.test(e.source)) s += 3
  else if (/^daily note/.test(e.source)) s += 2
  else if (/^Knowledge\/|^Writing\//.test(e.source)) s += 1
  if (IMPORTANT_RE.test(e.text)) s += 2
  if (/\d/.test(e.text)) s += 1 // concrete numbers/dates
  if (e.text.length >= 60 && e.text.length <= 300) s += 1
  return s
}

function usable(e) {
  return (
    !NOISE.test(e.text) &&
    !DENYLIST.test(e.text) &&
    e.text.length >= 20 &&
    e.text.length <= CONFIG.maxChars
  )
}

/** Drop near-duplicates (same event recorded by two sources), keeping the better one. */
function dedupe(items) {
  const kept = []
  for (const e of items.sort((a, b) => b.score - a.score || b.text.length - a.text.length)) {
    e.tok = tokens(e.text)
    if (!kept.some((k) => similarity(k.tok, e.tok) >= CONFIG.dedupeSimilarity)) kept.push(e)
  }
  return kept
}

// ----------------------------------------------------------------- build ----
function build(events) {
  const byWeek = new Map()
  for (const e of events) {
    if (!usable(e)) continue
    e.score = score(e)
    const wk = weekStartOf(e.date)
    if (!byWeek.has(wk)) byWeek.set(wk, [])
    byWeek.get(wk).push(e)
  }

  const weeks = {}
  for (const [wk, list] of [...byWeek.entries()].sort()) {
    const out = { subteams: {}, milestones: [] }

    // Per-subteam summary + detail
    for (const [teamName, id] of Object.entries(SUBTEAM_MAP)) {
      const mine = dedupe(list.filter((e) => e.team === teamName))
      if (!mine.length) continue
      const top = mine.slice(0, CONFIG.maxBullets)
      const bullets = [...top]
        .sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order)
        .map((e) => `• ${CONFIG.datePrefix ? shortDate(e.date) + ": " : ""}${e.text}`)
      out.subteams[id] = {
        summary: firstSentence(mine[0].text, 90),
        detail: bullets.join("\n"),
      }
    }

    // Overview from team-wide entries (verbatim first sentences)
    const teamWide = dedupe(list.filter((e) => TEAM_WIDE.has(e.team)))
    if (teamWide.length) {
      out.overview = teamWide
        .slice(0, CONFIG.maxOverviewSentences)
        .map((e) => firstSentence(e.text, 220) + ".")
        .join(" ")
    }

    // Milestones: strong-signal events only
    if (CONFIG.milestones) {
      const cands = dedupe(list.filter((e) => MILESTONE_RE.test(e.text) && e.text.length <= 220))
      out.milestones = cands.slice(0, CONFIG.maxMilestonesPerWeek).map((e) => ({
        date: e.date,
        label: firstSentence(e.text, 70),
        subteamId: SUBTEAM_MAP[e.team] || "all",
      }))
      out.milestones.sort((a, b) => a.date.localeCompare(b.date))
    }
    if (!out.milestones.length) delete out.milestones
    if (!Object.keys(out.subteams).length) delete out.subteams
    weeks[`week-${wk}`] = out
  }
  return weeks
}

// ------------------------------------------------------------------ main ----
const raw = readFileSync(INPUT, "utf8")
const events = parseTimeline(raw)
if (!events.length) {
  console.error(`No events parsed from ${INPUT}. Is it in the expected timeline format?`)
  process.exit(1)
}
const weeks = build(events)

const lastDate = events.reduce((m, e) => (e.date > m ? e.date : m), "0000-00-00")
const latestWeekStart = weekStartOf(lastDate)
const coversMatch = raw.match(/^covers:\s*\S+\s+to\s+(\d{4}-\d{2}-\d{2})/m)
const meta = {
  coveredThrough: coversMatch ? coversMatch[1] : lastDate,
  latestWeekId: `week-${latestWeekStart}`,
  // weeks starting before this date are "settled": empty subteams get a quiet placeholder
  quietBefore: addDays(latestWeekStart, 7),
  sourceSha1: createHash("sha1").update(raw).digest("hex").slice(0, 12),
  eventsParsed: events.length,
}

const content =
  `// AUTO-GENERATED by scripts/build-contribution-weeks.mjs. DO NOT EDIT BY HAND.\n` +
  `// Edit the timeline file and re-run the script.\n\n` +
  `export const GENERATED_META = ${JSON.stringify(meta, null, 2)}\n\n` +
  `export const GENERATED_WEEKS = ${JSON.stringify(weeks, null, 2)}\n`

if (flags.check) {
  const current = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : ""
  if (current !== content) {
    console.error(`${OUTPUT} is out of date. Run the build script and commit the result.`)
    process.exit(1)
  }
  console.log("Contribution calendar data is up to date.")
} else {
  writeFileSync(OUTPUT, content)
  const weekCount = Object.keys(weeks).length
  console.log(`Parsed ${events.length} events -> ${weekCount} weeks (through ${meta.coveredThrough}).`)
  console.log(`Latest week: ${meta.latestWeekId}. Wrote ${OUTPUT}`)
}
