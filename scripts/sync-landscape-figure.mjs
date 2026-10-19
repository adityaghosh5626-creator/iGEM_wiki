/**
 * Copy the adjacency landscape figure out of the petadex-adjacency-landscape
 * repository into static/figures/dry-lab-landscape/.
 *
 *   node scripts/sync-landscape-figure.mjs [path-to-petadex-adjacency-landscape]
 *
 * The figure is one self-contained HTML file (all of its data is inlined by
 * make_landscapes.py), so the only work here is the three things the wiki needs
 * that the standalone version does not:
 *
 *   1. Its images are PNG and JPEG and sit a directory up; the wiki serves AVIF
 *      next to the page, which is what keeps the figure inside iGEM's 5 MB
 *      upload budget (see scripts/trim-pages-artifact.mjs).
 *   2. While the stacked panels are showing, the figure steps through its views
 *      on the wheel and calls preventDefault. On its own page that is the right
 *      thing; inside the overview page's iframe it would swallow the page's
 *      scroll, so an embedded copy leaves the wheel alone and is stepped with
 *      the ↑ Back / ↓ Next buttons, the step list and the arrow keys.
 *   3. The wiki wants the Story panel alone. Panels 1-7 share almost every code
 *      path with the stacked panel the story is built on, so rather than cut
 *      them out they are made unreachable: goTo refuses any index but the story
 *      panel, which closes the nav, the keyboard and the URL hash at once, and
 *      the panel strip is hidden. Every step, view, hover card, the simulated
 *      volume with its turntable and both of its buttons come across.
 *   4. Two things that only cost bytes go: the structure renders are 700 px and
 *      are drawn about 100 px wide, so they are resized on the way through, and
 *      KNN_EDGES is emptied. It feeds a "graph" view of the interpretation
 *      layer that no longer exists in VIEWS, so it was parsed and turned into a
 *      geometry on every load and never drawn.
 *
 * Rerun make_landscapes.py in that repository and then rerun this, rather than
 * editing the copy under static/.
 */
import fs from "fs/promises"
import path from "path"
import process from "process"
import sharp from "sharp"

const DEFAULT_SOURCE = path.join(
  process.env.HOME ?? "",
  "Documents/projects/petadex-adjacency-landscape"
)
const sourceRoot = path.resolve(process.argv[2] ?? DEFAULT_SOURCE)
const destRoot = path.join(process.cwd(), "static/figures/dry-lab-landscape")

// Quality picked to land on the file sizes the figure shipped with: the
// structures are line-art-like renders on transparency, the site photos are
// drawn into a 204x80 box, so they only need enough pixels for a 2x screen.
const STRUCTURE_AVIF = { quality: 50 }
const SITE_AVIF = { quality: 55 }
const SITE_WIDTH = 408
const STRUCTURE_WIDTH = 224   // about 2x the ~100 px the cards draw them at

const EMBED_GUARD = `// Embedded in the wiki's overview page: the host page owns the wheel, so the
// walkthrough is stepped with the buttons, the step list and the arrow keys
// instead. Added by scripts/sync-landscape-figure.mjs.
const EMBEDDED = (() => { try { return window.self !== window.top; } catch { return true; } })();
stage.addEventListener("wheel", e => {
  if (EMBEDDED) return;`

const WHEEL_ANCHOR = `stage.addEventListener("wheel", e => {`

// Each of these must match exactly once. If the figure changes shape the sync
// fails loudly here rather than shipping a page with a live panel strip.
const STORY_PATCHES = [
  [
    "the story panel is the only reachable one",
    `function goTo(i, instant = false) {
  i = clip(i, 0, STATES.length - 1);`,
    `function goTo(i, instant = false) {
  i = clip(i, 0, STATES.length - 1);
  if (i !== STORY_PANEL) return;   // wiki copy: the story panel is the only one`,
  ],
  [
    "no panel tour to play",
    "function play() {",
    `function play() {
  return;   // wiki copy: there is no panel tour`,
  ],
  [
    "the embed must not write to the host's URL",
    `  history.replaceState(null, "", "#" + (i + 1));\n`,
    "",
  ],
  [
    "open on the story panel, ignoring any hash",
    `const start = parseInt(location.hash.slice(1), 10);
goTo(Number.isFinite(start) ? start - 1 : 0, true);`,
    "goTo(STORY_PANEL, true);",
  ],
  [
    "hide the chrome of the panels that are gone",
    "  .site-cap { position: absolute;",
    `  /* wiki copy: only the story panel exists, so its chrome is all that shows */
  #ctl, #stamp, #legend { display: none !important; }
  .title:not([data-t="7"]) { display: none !important; }
  .site-cap { position: absolute;`,
  ],
]

async function readHtml() {
  const file = path.join(sourceRoot, "web/landscape.html")
  let html = await fs.readFile(file, "utf8")

  for (const [what, from, to] of STORY_PATCHES) {
    const hits = html.split(from).length - 1
    if (hits !== 1) {
      throw new Error(
        `Expected exactly one place to patch for "${what}", found ${hits}. The ` +
        `figure changed; re-check scripts/sync-landscape-figure.mjs.`
      )
    }
    html = html.replace(from, to)
  }

  const edges = html.match(/const KNN_EDGES = .*?;\n/s)
  if (!edges) throw new Error("KNN_EDGES not found; re-check scripts/sync-landscape-figure.mjs.")
  html = html.replace(edges[0], "const KNN_EDGES = [];   // wiki copy: the graph view is gone\n")

  const structures = new Set()
  html = html.replace(/"\.\.\/structures\/([A-Za-z0-9_]+)\.png"/g, (_, name) => {
    structures.add(name)
    return `"structures/${name}.avif"`
  })

  const sites = new Set()
  html = html.replace(/"sites\/([A-Za-z0-9_-]+)\.jpg"/g, (_, name) => {
    sites.add(name)
    return `"sites/${name}.avif"`
  })

  const hits = html.split(WHEEL_ANCHOR).length - 1
  if (hits !== 1) {
    throw new Error(
      `Expected exactly one wheel listener to guard, found ${hits}. The figure's ` +
      `scroll handling changed; re-check scripts/sync-landscape-figure.mjs.`
    )
  }
  html = html.replace(WHEEL_ANCHOR, EMBED_GUARD)

  return { html, structures: [...structures].sort(), sites: [...sites].sort() }
}

async function convert(from, to, transform) {
  const out = await transform(sharp(from)).toBuffer()
  await fs.writeFile(to, out)
  return out.length
}

const { html, structures, sites } = await readHtml()

await fs.mkdir(path.join(destRoot, "structures"), { recursive: true })
await fs.mkdir(path.join(destRoot, "sites"), { recursive: true })
await fs.mkdir(path.join(destRoot, "vendor"), { recursive: true })

await fs.writeFile(path.join(destRoot, "landscape.html"), html)
await fs.copyFile(
  path.join(sourceRoot, "web/vendor/three.min.js"),
  path.join(destRoot, "vendor/three.min.js")
)

let assetBytes = 0
for (const name of structures) {
  assetBytes += await convert(
    path.join(sourceRoot, `structures/${name}.png`),
    path.join(destRoot, `structures/${name}.avif`),
    (img) => img.resize({ width: STRUCTURE_WIDTH, withoutEnlargement: true }).avif(STRUCTURE_AVIF)
  )
}
for (const name of sites) {
  assetBytes += await convert(
    path.join(sourceRoot, `web/sites/${name}.jpg`),
    path.join(destRoot, `sites/${name}.avif`),
    (img) => img.resize({ width: SITE_WIDTH, withoutEnlargement: true }).avif(SITE_AVIF)
  )
}

// Anything the previous copy left behind that this one no longer references.
for (const [dir, keep, ext] of [
  ["structures", structures, ".avif"],
  ["sites", sites, ".avif"],
]) {
  for (const entry of await fs.readdir(path.join(destRoot, dir))) {
    if (keep.includes(path.basename(entry, ext))) continue
    await fs.rm(path.join(destRoot, dir, entry))
    console.log(`Removed unreferenced ${dir}/${entry}`)
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`
console.log(
  `Story panel only. landscape.html ${kb(Buffer.byteLength(html))}, ` +
  `${structures.length} structures + ${sites.length} site photos ${kb(assetBytes)}, ` +
  `three.min.js ${kb((await fs.stat(path.join(destRoot, "vendor/three.min.js"))).size)}`
)
