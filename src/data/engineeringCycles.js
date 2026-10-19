export const ENGINEERING_STAGES = [
  { id: "design", label: "Design", color: "#91aebb", prompt: "Describe the problem, requirements, and design choices for this iteration." },
  { id: "build", label: "Build", color: "#a2b997", prompt: "Describe what the team built or changed, including methods and materials." },
  { id: "test", label: "Test", color: "#d6ba79", prompt: "Add the tests, controls, measurements, and results for this iteration." },
  { id: "learn", label: "Learn", color: "#ce967e", prompt: "Explain what the evidence showed and how it informed the next iteration." },
]

const ART_BASE = "https://static.igem.wiki/teams/6187/wiki/engineering/content/"

// Crops use [x, y, width, height] on the original 1110 × 4000 canvases.
export const ENGINEERING_ART = {
  buttonsImage: `${ART_BASE}buttons-gears.avif`,
  petamonImage: `${ART_BASE}button-petamon.avif`,
  gearImage: `${ART_BASE}buttons-gears.avif`,
  highlightedGearImage: `${ART_BASE}highlight-gear.avif`,
  gearCrop: [187, 1323, 35, 35],
  cycleImage: `${ART_BASE}dbtl-cycle.avif`,
  cycleCrop: [145, 1870, 415, 415],
  // Traced along the white dividers of cycleCrop, normalized to 340 × 340.
  // Adjacent regions use the exact same cubic boundary in reverse. Extend to
  // the crop edges to cover the irregular painted rim. Paths meet inside the
  // white centre hole (behind the centre illustration), leaving no untinted gap.
  cycleRegions: [
    // Design: top right.
    "M164 0 H340 V161 C305 181 263 185 230 170 L170 170 L171 108 C185 78 185 38 164 0 Z",
    // Build: bottom right.
    "M340 161 V340 H180 C151 306 148 261 167 226 L170 170 L230 170 C263 185 305 181 340 161 Z",
    // Test: bottom left.
    "M180 340 H0 V174 C34 151 79 149 111 164 L170 170 L167 226 C148 261 151 306 180 340 Z",
    // Learn: top left.
    "M0 174 V0 H164 C185 38 185 78 171 108 L170 170 L111 164 C79 149 34 151 0 174 Z",
  ],
  speechBubbleImage: `${ART_BASE}speech-bubble.avif`,
  speechBubbleCrop: [174, 2262, 335, 161],
  centerImage: "",
  centerAlt: "Engineering cycle illustration",
  showCycleLabels: true,
}

// Content lives in project/engineering/<team>/_version-N.mdx.
// Register new files in components/engineering/contentRegistry.js.
function initialVersions(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `version-${index + 1}`,
    label: `Version ${index + 1}`,
  }))
}

// centerBounds: [x, y, width, height] on the 340 × 340 wheel.
export const ENGINEERING_TEAMS = [
  // Change versionCount to add/remove gears; each gear is generated separately.
  { centerImage: `${ART_BASE}hw.avif`, centerCrop: [278, 2023, 152, 138],
    centerBounds: [121, 124, 100, 91],
    links: ["https://2026.igem.wiki/toronto/hardware/"],
    id: "hardware", label: "Hardware", color: "#9a7837", versionCount: 3,
    barCrop: [162, 1259, 178, 55], petamonCrop: [174, 1137, 174, 135] },
  { centerImage: `${ART_BASE}dl.avif`, centerCrop: [286, 2032, 143, 111],
    centerBounds: [119, 132, 104, 81],
    links: ["https://2026.igem.wiki/toronto/dry-lab/overview/"],
    id: "dry-lab", label: "Dry Lab", color: "#738555", versionCount: 2,
    barCrop: [364, 1259, 177, 55], petamonCrop: [364, 1137, 174, 131] },
  { centerImage: `${ART_BASE}wl.avif`, centerCrop: [231, 1981, 228, 172],
    centerBounds: [113, 127, 116, 88],
    links: ["https://2026.igem.wiki/toronto/wet-lab/overview/"],
    id: "wet-lab", label: "Wet Lab", color: "#497a68", versionCount: 3,
    barCrop: [567, 1259, 177, 55], petamonCrop: [565, 1137, 174, 134] },
  { centerImage: `${ART_BASE}hpven.avif`, centerCrop: [285, 1978, 191, 172],
    centerBounds: [118, 117, 106, 96],
    links: ["https://2026.igem.wiki/toronto/entrepreneurship/", "https://2026.igem.wiki/toronto/beyond-the-bench/outreach/"],
    petamonOffsetX: "6%",
    id: "entrepreneurship-outreach", label: "Entrepreneurship & Outreach", color: "#35657b", versionCount: 3,
    barCrop: [764, 1259, 178, 55], petamonCrop: [793, 1137, 178, 128] },
  { centerImage: `${ART_BASE}outweb.avif`, centerCrop: [256, 1972, 166, 177],
    centerBounds: [124, 114, 94, 100],
    links: ["https://2026.igem.wiki/toronto/human-practices/", "https://2026.igem.wiki/toronto/wiki/"],
    petamonOverlap: "clamp(-22px, -1.7vw, -6px)",
    id: "full-team", label: "Full Team", color: "#497a68", versionCount: 3, fullWidth: true,
    barCrop: [192, 1523, 714, 54], petamonCrop: [190, 1409, 680, 136] },
].map(team => ({ barImage: "", ...team, versions: initialVersions(team.versionCount) }))
