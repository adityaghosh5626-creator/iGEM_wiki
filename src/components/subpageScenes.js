/**
 * Art for the parallax subpages (see SubpageScene). Every asset in a scene
 * is a full plate already aligned to the others, so pieces are placed by
 * their bounding box in plate px [x0, y0, x1, y1]; only that window renders.
 */

/**
 * The bottle-carrying crabs pace their tunnel (hole-mid-3) on a loop: walk in
 * from the right edge to the tunnel's left end, stop, turn around, walk back,
 * turn again. Kept slow so it doesn't pull focus from the text.
 */
const DRY_LAB_PATROL = {
  /** Crab's left edge at each end of the walk (plate px). */
  rightX: 765,
  leftX: 55,
  walkS: 22,
  pauseS: 1.4,
  turnS: 0.5,
  /** One wobble (lean one way) every this many seconds while walking. */
  stepS: 0.4,
  leanDeg: 3,
  /** Tunnel floor (plate y) along its length, by the crab's center x. */
  floor: [
    [100, 1930],
    [220, 1940],
    [340, 1949],
    [460, 1952],
    [580, 1953],
    [700, 1946],
    [820, 1941],
    [900, 1942],
  ],
}

const NEEDLEMAN_BASE = "https://static.igem.wiki/teams/6187/wiki/drylab-page/needleman/"

/**
 * Needleman the cactus and Wunsch the tumbleweed (see NeedlemanCactus), drawn
 * on their own 2580×1872 plate: `scale` and `at` (where the plate's top-left
 * lands, in scene px) put them on the skyline where the old saguaro stood.
 */
const DRY_LAB_CACTUS = {
  assetBase: NEEDLEMAN_BASE,
  plate: [2580, 1872],
  scale: 0.17,
  at: [512, -8],
  body: { name: "needleman", box: [1507, 472, 2016, 1713] },
  /** Where he sways from: the bottom of his trunk. */
  base: [1820, 1713],
  /** Rests flipped down about the shoulder; flips up on hover. */
  arm: { name: "needleman-arm", box: [1880, 559, 2176, 992], shoulderY: 940 },
  /** `tail`: the tip it pops out from. */
  bubble: { name: "text-box", box: [894, 87, 1616, 726], tail: [1520, 714] },
  /**
   * Wunsch and his scroll share one image; `clip` splits them along a line
   * just left of the scroll's outline, so none of it rolls away with him.
   */
  friend: {
    name: "wunch",
    box: [1930, 1310, 2302, 1745],
    clip: "polygon(0% 0%, 96.77% 0%, 96.24% 20.69%, 94.89% 25.29%, 94.09% 29.89%, 93.55% 34.48%, 92.47% 39.08%, 91.13% 43.68%, 90.05% 48.28%, 88.71% 52.87%, 87.9% 57.47%, 86.56% 62.07%, 85.75% 66.67%, 84.68% 71.26%, 83.06% 75.86%, 81.72% 80.46%, 79.84% 85.06%, 78.23% 89.66%, 77.69% 94.25%, 76.88% 100%, 0% 100%)",
    /** Center of the ball he rolls on, and its radius (plate px). */
    hub: [2100, 1600],
    radius: 118,
  },
  prop: {
    name: "wunch",
    box: [2205, 1310, 2355, 1745],
    clip: "polygon(56.67% 0%, 100% 0%, 100% 100%, 7.33% 100%, 9.33% 94.25%, 10.67% 89.66%, 14.67% 85.06%, 19.33% 80.46%, 22.67% 75.86%, 26.67% 71.26%, 29.33% 66.67%, 31.33% 62.07%, 34.67% 57.47%, 36.67% 52.87%, 40% 48.28%, 42.67% 43.68%, 46% 39.08%, 48.67% 34.48%, 50% 29.89%, 52% 25.29%, 55.33% 20.69%)",
  },
  /** The skyline Wunsch rolls along (scene px), with the painted cactus and tumbleweed smoothed out. */
  floor: [
    [0, 265], [40, 273], [80, 283], [120, 290], [160, 295], [200, 286],
    [240, 275], [280, 266], [320, 263], [360, 258], [400, 255], [440, 253],
    [480, 258], [520, 266], [560, 276], [600, 281], [640, 277], [680, 276],
    [720, 275], [760, 274], [800, 274], [840, 278], [880, 281], [917, 262],
  ],
}

export const DRY_LAB_SCENE = {
  header: "Dry Lab",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/drylab-page/",
  plate: [918, 4000],
  /** Shown behind the art while it loads. */
  background: "#c9b48a",
  /** Sky band above the boxes where the header sits (plate px). */
  skyBottom: 290,
  headerColor: "#5c3f2e",
  /** Subsection bars and small headings in the text box. */
  accent: "#a0603a",
  /** Background art, back to front. */
  layers: [
    // Ground layers (whole width).
    { name: "layer-1", box: [0, 0, 918, 4000] },
    // Paints out layer-1's saguaro, where Needleman (`cactus`) now stands.
    { name: "cactus-patch", src: `${NEEDLEMAN_BASE}cactus-patch.avif`, box: [760, 85, 918, 300] },
    { name: "layer-2", box: [0, 1305, 918, 3136] },
    { name: "layer-3", box: [0, 2567, 918, 4000] },
    // Holes and paths dug into the ground.
    { name: "hole-top-1", box: [0, 278, 918, 1088] },
    { name: "hole-top-2", box: [0, 1218, 273, 1337] },
    { name: "hole-top-3", box: [763, 1076, 918, 1248] },
    { name: "hole-mid-1", box: [0, 1511, 163, 1632] },
    { name: "hole-mid-2", box: [0, 2266, 199, 2528] },
    { name: "hole-mid-3", box: [39, 1814, 918, 1984] },
    { name: "hole-bottom-1", box: [563, 2986, 918, 3121] },
    { name: "microplastic-fragments", box: [32, 327, 918, 3170] },
    // Buried objects.
    { name: "vase-mid", box: [0, 2536, 192, 2848] },
    { name: "fossil-bottom", box: [8, 3696, 296, 3969] },
    { name: "dino-bottom", box: [504, 3266, 918, 3744] },
    { name: "bottle-top", box: [856, 269, 914, 361] },
    { name: "bottle-bottom", box: [0, 3336, 144, 3553] },
    { name: "web-mid", box: [478, 1817, 689, 1952] },
    { name: "web-bottom", box: [803, 2983, 918, 3120] },
    // Critters.
    { name: "crab-2", crab: true, box: [11, 946, 77, 1017] },
    {
      name: "crab-carrying-bottle",
      patrol: DRY_LAB_PATROL,
      box: [99, 1849, 242, 1937],
    },
    { name: "red-crab", crab: true, box: [260, 1875, 320, 1934] },
    { name: "crab-1", crab: true, box: [70, 2407, 145, 2496] },
    // Second crab-1 in the cobweb tunnel (hole-bottom-1), where the mockup has
    // it; `from` is where the sprite sits on its plate.
    {
      name: "crab-cobweb",
      src: "crab-1",
      from: [70, 2407, 145, 2496],
      crab: true,
      box: [655, 3014, 730, 3103],
    },
    // Not in the mockup (three crabs on the path where crab-2 sits) — kept for
    // an animation / easter egg later.
    { name: "crab-in-a-row", box: [11, 855, 232, 1016], hidden: true },
  ],
  /** Side box (subsection list); `caps` are the unstretched top/bottom (plate px). */
  side: {
    name: "subsection-box",
    box: [78, 314, 249, 865],
    caps: [60, 70],
    /** First item's distance below the box top (plate px). */
    navTop: 32,
    /** A little taller than the other boxes shut, so the overview fits. */
    maxHeight: "min(26rem, 56vh)",
    indicator: { name: "box-subsection-indicator", box: [88, 452, 241, 513] },
    /** The highlight's painted colour, for UI that matches it (footer button). */
    highlightColor: "#9c6e56",
    /**
     * Fossil riding on the left end of the highlight. Its own image rather
     * than a plate layer; `crop` is the painted part of its `size` canvas.
     */
    indicatorIcon: {
      name: "https://static.igem.wiki/teams/6187/wiki/drylab-page/icon-dry-lab-small.avif",
      box: [63, 467, 96, 498],
      canvas: { size: [360, 342], crop: [0, 0, 360, 342] },
    },
    /** Crab sitting on the box's bottom edge. */
    crab: { name: "box-crab", box: [144, 804, 195, 860] },
    linkColor: "#fbf3ea",
    /** Narrow screens: the list becomes a sticky strip of this colour. */
    stripColor: "#b0886c",
    /** The compact menu's "Compact" chip. */
    railTag: { bg: "#e9d5bf", text: "#5c3f2e" },
    stripTexture: true,
  },
  /** Text box; it stretches with the text between its caps. */
  text: {
    name: "box-extendable",
    box: [274, 320, 804, 2488],
    caps: [40, 40],
    /** Shortest box (plate px): the mockup's length. */
    minH: 2168,
    /** Callouts, placeholders and other capped blocks span the whole box. */
    fullWidthBlocks: true,
  },
  /**
   * Where the text ends in the art (plate y): just above the cobweb tunnel,
   * so its crab is in view. The art scrolls at whatever pace lands this line
   * on the text box's bottom edge; below it (bottle, dino, fossil) is a
   * decorative ending that scrolls with the page.
   */
  textEndY: 2960,
  cactus: DRY_LAB_CACTUS,
  /**
   * The Dry Lab calendar (overview page) in desert colours: parchment panels,
   * sandstone lines, terracotta for what's selected. Its workstreams carry
   * their own colours (dryLabCalendar.js); "all" is the header's brown.
   */
  vars: {
    "--cal-surface": "#fffaf2",
    "--cal-chrome": "#f4e8d6",
    "--cal-line": "#dcc6a4",
    "--cal-ink": "#3b2a1f",
    "--cal-muted": "#76604c",
    "--cal-accent": "#a0603a",
    "--cal-hover": "#f3e6d2",
    "--cal-tint": "rgba(160, 96, 58, 0.12)",
    "--cal-cell": "#fffaf2",
    "--cal-cell-hover": "#f7ecdc",
    "--cal-cell-line": "rgba(120, 84, 50, 0.2)",
    "--cal-cell-out": "#f3e7d6",
    "--cal-cell-out-hover": "#ebdcc6",
    "--cal-cell-out-line": "rgba(120, 84, 50, 0.1)",
    "--cal-band": "#ecc9a8",
    "--cal-band-out": "#f3dfcb",
    "--cal-band-line": "#a0603a",
    "--cal-band-out-line": "rgba(160, 96, 58, 0.35)",
    "--cal-sunday": "#a0603a",
  },
}

export const VENTURE_SCENE = {
  header: "Entrepreneurship",
  /** The header already names the page, so the text box opens with this. */
  boxTitle: "Overview",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/venture/",
  plate: [1110, 4000],
  /** The top of bg.avif has a mock navbar painted in; start the art below it. */
  cropTop: 78,
  background: "#46557a",
  skyBottom: 400,
  headerColor: "#23395b",
  accent: "#c4701f",
  /** Table header rows in the menu highlight's orange. */
  tableHead: "#f2b574",
  layers: [
    { name: "bg", box: [0, 0, 1110, 4000] },
    { name: "coins", box: [11, 1696, 176, 3041] },
    // Hover (tap on touch) a kangaroo: coins burst out from behind it.
    { name: "sad-venturoo", coinBurst: true, box: [16, 1286, 289, 1728] },
    { name: "second-venturoo", coinBurst: true, box: [88, 2564, 352, 2960] },
    // Same spot as second-venturoo with the bag swung behind it; not in the
    // mockup — kept for an animation later.
    { name: "venturoo-reaching", box: [23, 2564, 352, 2985], hidden: true },
  ],
  /** Loose coins on coins.avif used for the kangaroo bursts (plate px). */
  coinSprites: [
    { name: "coins", box: [123, 1995, 157, 2030] },
    { name: "coins", box: [97, 2359, 132, 2387] },
  ],
  // The side column and text box are both flat rectangles on `text-space`.
  side: {
    name: "text-space",
    box: [135, 412, 288, 1225],
    caps: [4, 4],
    navTop: 40,
    linkPadY: 7,
    indicator: { name: "nav-bar-highlight", box: [136, 456, 289, 528] },
    /** The highlight's painted colour, for UI that matches it (footer button). */
    highlightColor: "#f2b574",
    /**
     * Coin that rides on the left end of the highlight; turned so its $
     * stands upright, and drawn 5px left of where it's painted so it clears
     * the item's text.
     */
    indicatorIcon: {
      name: "navbar-icon",
      from: [100, 460, 160, 515],
      box: [95, 460, 155, 515],
      rotate: -30,
    },
    linkColor: "#5b3a1a",
    /** Narrower column than Dry Lab's, so slightly smaller section names. */
    linkSize: 11.5,
    stripColor: "#f6e4aa",
  },
  text: {
    name: "text-space",
    box: [339, 412, 980, 3691],
    caps: [4, 4],
    minH: 2000,
  },
  /** Bottom of the mockup's text box; the river below is the ending. */
  textEndY: 3691,
}

/** Homepage art reused on the subpages (birds). */
const HOME_ART = "https://static.igem.wiki/teams/6187/wiki/homepage-components/"

/**
 * Homepage birds, each with its two flap frames and the window it's drawn
 * in (`from`) on its source image (`plate`). They face left unless `faces`
 * is 1 (right).
 */
const BIRD_SPRITES = {
  // White bird gliding, facing left (homepage sky).
  glider: {
    a: `${HOME_ART}birds/wiki-front-page-bird-1.avif`,
    b: `${HOME_ART}birds/wiki-front-page-bird-1-2.avif`,
    plate: [1440, 3239],
    from: [495, 634, 686, 769],
    flapMs: 980,
  },
  // White bird angled into a dive, facing left (homepage sky).
  diver: {
    a: `${HOME_ART}birds/wiki-front-page-bird-2.avif`,
    b: `${HOME_ART}birds/wiki-front-page-bird-2-2.avif`,
    plate: [1440, 3239],
    from: [1242, 228, 1384, 404],
    flapMs: 480,
  },
  // Faint distant birds (homepage sky).
  farGlider: {
    a: `${HOME_ART}birds/wiki-front-page-bird-3.avif`,
    b: `${HOME_ART}birds/wiki-front-page-bird-3-2.avif`,
    plate: [1440, 3239],
    from: [433, 197, 620, 336],
    flapMs: 1100,
  },
  farDiver: {
    a: `${HOME_ART}birds/wiki-front-page-bird-4.avif`,
    b: `${HOME_ART}birds/wiki-front-page-bird-4-2.avif`,
    plate: [1440, 3239],
    from: [74, 346, 211, 514],
    flapMs: 520,
  },
  // Jungle birds (homepage explorer section).
  jungleDiver: {
    a: `${HOME_ART}section-3-animals/section-3-bird-a.avif`,
    b: `${HOME_ART}section-3-animals/section-3-bird-a-2.avif`,
    plate: [2238, 3132],
    from: [1546, 1092, 1688, 1268],
    flapMs: 480,
  },
  // Hovering, facing right.
  hoverer: {
    faces: 1,
    a: `${HOME_ART}section-3-animals/section-3-bird-b.avif`,
    b: `${HOME_ART}section-3-animals/section-3-bird-b-2.avif`,
    plate: [2238, 3132],
    from: [691, 1055, 857, 1209],
    flapMs: 720,
  },
}

/**
 * A bird placed on a scene plate: left/top and width in plate px (height
 * keeps the sprite's shape). `opts` can flip it or change its idle motion.
 */
function bird(name, sprite, x, y, width, opts = {}) {
  const s = BIRD_SPRITES[sprite]
  const [fx0, fy0, fx1, fy1] = s.from
  const height = Math.round((width * (fy1 - fy0)) / (fx1 - fx0))
  return {
    name,
    flyer: { ...s, ...opts },
    box: [x, y, x + width, y + height],
  }
}

export const HP_SCENE = {
  header: "Human Practices",
  boxTitle: "Overview",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/hp-page/",
  plate: [1110, 4000],
  background: "#cfe6ef",
  skyBottom: 400,
  headerColor: "#2c4f43",
  accent: "#4c8269",
  layers: [
    { name: "bg-w-trees", box: [0, 0, 1110, 4000] },
    // Distant (faint) birds fly behind the scenery: the cloud and trees
    // below are drawn over them.
    bird("bird-far-1", "farGlider", 30, 150, 120, {
      phaseMs: 400,
      cross: { dir: -1, seconds: 95, at: 0.3 },
    }),
    bird("bird-far-2", "farDiver", 25, 960, 80, { phaseMs: 900, sway: 10 }),
    bird("bird-far-3", "farGlider", 985, 3330, 110, {
      phaseMs: 2200,
      cross: { dir: -1, seconds: 90, at: 0.7 },
    }),
    // Same as the cloud painted into bg-w-trees, so drawn over the distant
    // birds it hides them as they pass behind it. (It doesn't move: that
    // would show the painted copy underneath.)
    { name: "cloud-if-u-want-it-to-move", box: [352, 63, 1081, 419] },
    // Just the trees (bg-w-trees minus plain-bg), over the distant birds.
    { name: "trees-only", box: [0, 3023, 1110, 4000] },
    // The other birds fly in front. Five of all the birds cross the page on
    // a loop (slowly, 55–95 s a crossing, in the direction they face); the
    // rest hover in the margins.
    bird("bird-glider-1", "glider", 905, 40, 150, {
      phaseMs: 1800,
      cross: { dir: -1, seconds: 60, at: 0.05 },
    }),
    bird("bird-diver-1", "diver", 995, 1330, 100, { phaseMs: 2600, sway: 10 }),
    bird("bird-hover-1", "hoverer", 12, 1820, 118, { phaseMs: 1300, sway: 10 }),
    bird("bird-glider-2", "glider", 8, 2560, 122, {
      flip: true,
      phaseMs: 3100,
      cross: { dir: 1, seconds: 70, at: 0.55 },
    }),
    bird("bird-jungle-1", "jungleDiver", 996, 2860, 100, {
      phaseMs: 700,
      sway: 8,
    }),
    bird("bird-hover-2", "hoverer", 960, 3560, 120, {
      phaseMs: 1600,
      cross: { dir: 1, seconds: 75, at: 0.2 },
    }),
  ],
  // Side column and text box are flat rectangles on `text`, like Venture's.
  side: {
    name: "text",
    box: [135, 412, 288, 1225],
    caps: [4, 4],
    navTop: 40,
    linkPadY: 7,
    linkSize: 11.5,
    indicator: { name: "nav-bar-highlight", box: [136, 456, 289, 528] },
    /** The highlight's painted colour, for UI that matches it (footer button). */
    highlightColor: "#689581",
    /** Feather riding on the left end of the highlight. */
    indicatorIcon: { name: "new-nav-icon", box: [111, 453, 156, 523] },
    linkColor: "#2e4a3c",
    /** Light text on the dark green highlight. */
    activeLinkColor: "#ffffff",
    stripColor: "#cdd6b7",
  },
  text: {
    name: "text",
    box: [339, 412, 980, 3691],
    caps: [4, 4],
    minH: 2000,
  },
  /** Bottom of the mockup's text box; the treeline below is the ending. */
  textEndY: 3691,
}

/** Every Hardware page; each box is titled with its page's short name. */
export const HARDWARE_SCENE = {
  header: "Hardware",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/hardware-notebook/",
  plate: [1110, 4000],
  background: "#20222e",
  skyBottom: 400,
  headerColor: "#e6e1ff",
  /** Light title on the dark cave: a soft crystal glow instead of a highlight. */
  headerShadow:
    "0 0 0.4em rgba(135, 123, 199, 0.6), 0 0.08em 0.3em rgba(0, 0, 0, 0.5)",
  accent: "#6b5cb5",
  layers: [
    { name: "bg", box: [0, 0, 1110, 4000] },
    // Extra lighting: glints down the walls and pillars into the pool.
    { name: "bottom-lightning-turtles", box: [127, 1985, 1088, 3942] },
    // Hover (tap on touch) the turtle: it shivers and the lightning on
    // zapzap crackles round it.
    {
      name: "turtle-1",
      box: [76, 1815, 426, 2392],
      hit: [125, 1865, 315, 2150],
      zap: { name: "zapzap", box: [122, 1830, 352, 2133] },
    },
    // The turtle lying in the pool does the same with its own lightning.
    {
      name: "turtle-2",
      box: [173, 3760, 566, 3961],
      hit: [170, 3815, 569, 3950],
      zap: { name: "zapzap", box: [164, 3819, 568, 4000] },
    },
  ],
  // Side column and text box are flat rectangles on `text-space`.
  side: {
    name: "text-space",
    box: [135, 412, 288, 1225],
    caps: [4, 4],
    navTop: 40,
    linkPadY: 7,
    linkSize: 11.5,
    indicator: { name: "nav-bar-highlight", box: [136, 458, 287, 517] },
    /** The highlight's painted colour, for UI that matches it (footer button). */
    highlightColor: "#877bc7",
    /** Crystal riding on the left end of the highlight. */
    indicatorIcon: { name: "navbaricon", box: [107, 452, 164, 520] },
    /** The crystal reaches further in than Venture's coin; clear its text. */
    linkIndent: 20,
    linkColor: "#2a2350",
    activeLinkColor: "#ffffff",
    stripColor: "#a39dcb",
  },
  text: {
    name: "text-space",
    box: [339, 412, 980, 3691],
    caps: [4, 4],
    minH: 2000,
  },
  /** Bottom of the mockup's text box; the pool below is the ending. */
  textEndY: 3691,
}

/**
 * Every Wet Lab page: a sunset sea. Bubbles keep rising, the school of fish
 * keeps swimming laps, and the three axolotls light up when hovered (tapped
 * on touch): two hide behind the text box, peeking out, until the pointer
 * leaves; the one in open water swims a lap round the page.
 */
export const WET_LAB_SCENE = {
  header: "Wet Lab",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/wetlab/",
  plate: [1110, 4000],
  background: "#0b8fa6",
  skyBottom: 400,
  /** Deep sea blue: reads on the pink and gold of the sunset. */
  headerColor: "#123540",
  accent: "#0b6f80",
  layers: [
    { name: "1-background", box: [0, 266, 1110, 4000] },
    // Rising from the seafloor to the surface, in the open water either side
    // of the text box, behind everything else in the sea.
    {
      name: "bubbles",
      bubbles: {
        lanes: [
          { x: [15, 315], count: 16 },
          { x: [990, 1095], count: 9 },
        ],
        from: 3480,
        /** The water's surface, under the waves' edge: they fade out there. */
        to: 385,
        seconds: [26, 40],
      },
    },
    { name: "2-sky", box: [0, 0, 1110, 358] },
    { name: "3-sunset-clouds", box: [0, 0, 1110, 353] },
    { name: "4-waves", box: [0, 152, 1110, 396] },
    // Painted on the left; drawn on the right of the text box instead,
    // mirrored so it still dives out towards the page's edge.
    {
      name: "8-shark",
      from: [69, 2411, 261, 2631],
      box: [918, 2411, 1110, 2631],
      flip: true,
    },
    { name: "6-seabed", box: [0, 3349, 1110, 4000] },
    { name: "9-seaweeds", box: [0, 1696, 1110, 4000] },
    { name: "5-kelp", box: [56, 2960, 257, 3475] },
    // The school faces right: off the right edge, back in from the left.
    {
      name: "7-fishies",
      box: [947, 1022, 1093, 1111],
      swim: { ms: 52000, delayMs: 1200, dir: 1 },
    },
    // These two (`box` covers their glow) slide `dx` plate px behind the text
    // box (333–982) when hovered, leaving their heads peeking out.
    // Its painting stops flat where the box covers it: rest it 30px further
    // in than painted, so the pop back out (which overshoots) never shows that
    // edge.
    {
      name: "15-pop-out-glow",
      from: [36, 1357, 429, 1788],
      box: [66, 1357, 459, 1788],
      peek: { plain: "14-pop-out", dx: 131 },
    },
    // Painted beside the other two; drawn up near the top of the text box
    // instead, above the fish, so the three spread down the page.
    {
      name: "11-swimming-right-glow",
      from: [829, 1480, 1110, 1720],
      box: [829, 640, 1110, 880],
      peek: { plain: "10-swimming-right", dx: -58 },
    },
    // This one swims a lap: out the left edge, back in at the right edge to
    // peek, then left again behind the text box to its spot. Drawn lower
    // than it's painted: just above the seabed, in front of the kelp.
    {
      name: "13-swimming-left-glow",
      from: [21, 1934, 331, 2171],
      box: [21, 3080, 331, 3317],
      lap: { plain: "12-swimming-left", out: -340, enter: 1100, peek: 965 },
    },
  ],
  side: {
    name: "17-side-box",
    box: [135, 413, 289, 1224],
    caps: [4, 4],
    navTop: 40,
    linkPadY: 7,
    linkSize: 11.5,
    /** No highlight is painted for this page: a flat one in the axolotls' yellow. */
    indicator: { fill: "#f7e36b", box: [135, 456, 289, 517] },
    highlightColor: "#f7e36b",
    /**
     * A homepage bubble rides on its left end, standing in until one is
     * drawn; a soft glow keeps it from getting lost against the water.
     */
    indicatorIcon: {
      name: "https://static.igem.wiki/teams/6187/wiki/homepage-cropped/bubbles-bubble3.avif",
      box: [92, 461, 144, 508],
      canvas: { size: [68, 61], crop: [0, 0, 68, 61] },
      glow: "rgba(255, 255, 255, 0.9)",
    },
    linkColor: "#0b4a57",
    activeLinkColor: "#0b4a57",
    stripColor: "#e6f6f8",
  },
  text: {
    // The box's solid edges: its painted top and bottom rows are see-through,
    // and stretched on a long page they'd show as a fade.
    name: "16-main-body-box",
    box: [340, 413, 980, 3691],
    caps: [4, 4],
    minH: 2000,
  },
  /** Bottom of the mockup's text box; the seabed below is the ending. */
  textEndY: 3691,
}

/**
 * Project › Contribution: a greenhouse. The page is one big season calendar,
 * so there's no section list and the text box is wide, ending just above the
 * petamons on the steps (they and the pool below are the ending).
 */
export const CONTRIBUTION_SCENE = {
  header: "Contribution",
  boxTitle: "Overview",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/contributions/",
  plate: [1110, 4000],
  background: "#c0dad3",
  skyBottom: 400,
  headerColor: "#2e5247",
  accent: "#46725f",
  layers: [
    { name: "bg", box: [0, 0, 1110, 4000] },
    // Seedlings in the planter, behind the Dry Lab bug.
    { name: "sprouts", box: [70, 2997, 290, 3090] },
    // Each subteam's petamon on the steps, one file each so they can move
    // on their own. Five do what their subteam's critters do on hover (tap
    // on touch): the kangaroo throws Venture's coins, the bird loops like
    // the Human Practices birds, the crab scuttles like Dry Lab's, the
    // turtle gets Hardware's lightning and the axolotl hides like Wet Lab's.
    { name: "venpetamon", coinBurst: true, box: [0, 2800, 196, 3362] },
    // Faces us; looping "rightward" rolls it counterclockwise.
    { name: "hppetamon", loop: { facing: 1 }, box: [120, 2724, 348, 2822] },
    { name: "orpetamon", box: [222, 2806, 396, 3005] },
    // Catches fire like the Wiki dragons: a fiery glow spreads out from
    // behind it, from its head, its eyes glow and it trembles.
    {
      name: "webpetamon",
      box: [371, 2755, 644, 3004],
      dragon: {
        // Its haze is cut off square at the left: the glow fades out there.
        heat: { pad: 60, fade: [362, 404] },
        from: [452, 2930],
        reach: 260,
        eyes: [
          [437.8, 2947.5],
          [475.4, 2945.6],
        ],
        eyeSize: 18,
        // Glowing markings on its grey patches, along the body's lie.
        swirls: [
          { at: [621, 2808], rx: 5, ry: 13, rot: 8 },
          { at: [578, 2832], rx: 9, ry: 5, rot: -28 },
          { at: [579, 2871], rx: 10, ry: 5.5, rot: -22 },
          { at: [511, 2872], rx: 10, ry: 5.5, rot: -20 },
        ],
        hits: [[371, 2755, 644, 3004]],
      },
    },
    // The axolotl hides like the Wet Lab ones: it lights up, hops back over
    // the floor's back edge (where the water starts) and sinks behind it,
    // peeking over, until the pointer leaves.
    {
      name: "wlpetamon",
      box: [604, 2783, 805, 2910],
      // The floor's back edge slopes down to the right under it.
      duck: { edge: [[600, 2881], [800, 2893]], show: 60, hop: 36 },
    },
    { name: "dlpetamon", crab: true, box: [161, 3046, 290, 3148] },
    {
      name: "hwpetamon",
      box: [300, 3006, 541, 3210],
      hit: [304, 3012, 534, 3202],
      // The standing turtle's lightning on the Hardware plate, stretched
      // over this one.
      zap: {
        name: `${HARDWARE_SCENE.assetBase}zapzap.avif`,
        from: [122, 1830, 352, 2133],
        box: [288, 2984, 552, 3218],
      },
    },
  ],
  /** Loose coins on Venture's coins.avif, for the kangaroo (same plate size). */
  coinSprites: VENTURE_SCENE.coinSprites.map(coin => ({
    ...coin,
    name: `${VENTURE_SCENE.assetBase}${coin.name}.avif`,
  })),
  side: null,
  /** No menu highlight to match, so the footer button takes the accent. */
  footerButton: { bg: "#46725f", text: "#ffffff" },
  /** Not painted: a flat box in the greenhouse's paper colour. */
  text: {
    fill: "#fdf9f0",
    box: [90, 412, 1020, 2690],
    minH: 900,
  },
  textEndY: 2690,
  /**
   * The calendar in greenhouse colours: paper panels, sandstone lines, sage
   * for what's selected, terracotta Sundays. Subteams take the team's painted
   * swatches (Hardware, Venture and Human Practices match their pages' menu
   * highlights), each with a dark label that reads on it.
   */
  vars: {
    "--cal-surface": "#fffdf7",
    "--cal-chrome": "#f3ecdc",
    "--cal-line": "#d9c9a8",
    "--cal-ink": "#2b3a30",
    "--cal-muted": "#6a6650",
    "--cal-accent": "#46725f",
    "--cal-hover": "#f1ead9",
    "--cal-tint": "rgba(70, 114, 95, 0.12)",
    "--cal-cell": "#fffdf7",
    "--cal-cell-hover": "#f5eee0",
    "--cal-cell-line": "rgba(120, 96, 60, 0.2)",
    "--cal-cell-out": "#f1eadb",
    "--cal-cell-out-hover": "#e8dfcc",
    "--cal-cell-out-line": "rgba(120, 96, 60, 0.1)",
    "--cal-band": "#bcdccf",
    "--cal-band-out": "#dce9e1",
    "--cal-band-line": "#46725f",
    "--cal-band-out-line": "rgba(70, 114, 95, 0.35)",
    "--cal-sunday": "#b0543c",
    "--cal-team-wetLab": "#76b8c8",
    "--cal-team-wetLab-text": "#0c2a32",
    "--cal-team-dryLab": "#f5e5b2",
    "--cal-team-dryLab-text": "#3d3112",
    "--cal-team-hardware": "#877bc3",
    "--cal-team-hardware-text": "#17122e",
    "--cal-team-humanPractices": "#648b80",
    "--cal-team-humanPractices-text": "#0b1d18",
    "--cal-team-outreach": "#cd7261",
    "--cal-team-outreach-text": "#2a0d08",
    "--cal-team-venture": "#eab781",
    "--cal-team-venture-text": "#3a230e",
    "--cal-team-web": "#afbc90",
    "--cal-team-web-text": "#1f2914",
    "--cal-team-all": "#2b3a30",
    "--cal-team-all-text": "#fffdf7",
  },
}

/**
 * Attributions: a sunset over the Toronto skyline. No section list yet; the
 * box ends above the buildings, which (with the birds) are the ending.
 */
export const ATTRIBUTIONS_SCENE = {
  header: "Attributions",
  boxTitle: "Overview",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/attributions/",
  plate: [1110, 4000],
  background: "#c0c0be",
  skyBottom: 400,
  headerColor: "#4f4159",
  accent: "#8a4f60",
  layers: [
    { name: "bg1", box: [0, 0, 1110, 4000] },
    // Loop-the-loop on hover (tap on touch), counterclockwise like the
    // Contribution bird.
    { name: "birds", loop: { facing: 1 }, box: [1020, 3388, 1108, 3484] },
  ],
  side: null,
  /** No menu highlight to match: the skyline's purple. */
  footerButton: { bg: "#584960", text: "#ffffff" },
  /** Not painted: a flat, faintly warm box on the sunset. */
  text: {
    fill: "#fffbf7",
    box: [140, 412, 970, 3400],
    minH: 2000,
  },
  textEndY: 3400,
}

/** Finance: one painting of snowy peaks with a mine cart of gold coins. */
export const FINANCE_SCENE = {
  header: "Finance",
  hideIntro: true,
  assetBase: "https://static.igem.wiki/teams/6187/wiki/finance/",
  plate: [1216, 4000],
  background: "#c0d8db",
  skyBottom: 400,
  headerColor: "#2f3b52",
  accent: "#94651a",
  layers: [{ name: "img-3638", box: [0, 0, 1216, 4000] }],
  side: {
    fill: "#f8fafb",
    box: [70, 412, 365, 1100],
    navTop: 24,
    linkColor: "#2f3b52",
    activeLinkColor: "#ffffff",
    linkSize: 15,
    linkIndent: 18,
    stripColor: "#f8fafb",
    highlightColor: "#94651a",
    indicator: { fill: "#94651a", box: [80, 442, 355, 492] },
  },
  /** No menu highlight to match: the valley's navy. */
  footerButton: { bg: "#3a4760", text: "#ffffff" },
  /** Not painted: a flat, cool white box, right of the mine cart. */
  text: {
    fill: "#f8fafb",
    box: [400, 412, 1140, 3400],
    minH: 2000,
  },
  textEndY: 3400,
}

/** Safety and Security: a murky swamp, caution tape strung through the trees. */
export const SAFETY_SCENE = {
  header: "Safety",
  boxTitle: "Overview",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/safety/",
  plate: [1110, 4000],
  background: "#578b7d",
  skyBottom: 400,
  /** The tape's cream, lifted off the teal with a dark shadow. */
  headerColor: "#f4e6a8",
  headerShadow:
    "0 0.06em 0 rgba(16, 32, 48, 0.55), 0 0.1em 0.4em rgba(0, 0, 0, 0.35)",
  accent: "#a8483a",
  layers: [
    { name: "bg", box: [0, 0, 1110, 4000] },
    // Strung either side of the box (the right-hand strands run behind it).
    { name: "caution-tape", box: [0, 1664, 1072, 3712] },
  ],
  side: null,
  /** No menu highlight to match: the caution tape. */
  footerButton: { bg: "#e9d684", text: "#102030" },
  text: {
    name: "text-space",
    box: [135, 413, 979, 3691],
    caps: [4, 4],
    minH: 2000,
  },
  /** Bottom of the painted box; the pond below is the ending. */
  textEndY: 3691,
}

/** Engineering: a sunset quarry, a bucket hung on a rope from a gear. */
export const ENGINEERING_SCENE = {
  header: "Engineering",
  boxTitle: "Overview",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/engineering/",
  plate: [1110, 4000],
  background: "#fee7c5",
  skyBottom: 400,
  /** The mountain's dark brown, on the pale sunset. */
  headerColor: "#3e3128",
  accent: "#b04a38",
  layers: [
    { name: "bg", box: [0, 0, 1110, 4000] },
    // The rope runs up behind the gear, so it swings from under it.
    {
      name: "rope-bucket-only",
      box: [960, 850, 1110, 2462],
      swing: { pivot: [1027, 857], deg: 2, hit: [965, 2280, 1100, 2462] },
    },
    { name: "gear-only", box: [985, 816, 1110, 1130] },
  ],
  side: null,
  /** No menu highlight to match: the girders' red. */
  footerButton: { bg: "#b04a38", text: "#ffffff" },
  text: {
    name: "text-space",
    box: [135, 413, 979, 3691],
    caps: [4, 4],
    minH: 2000,
  },
  /** Bottom of the painted box; the quarry below is the ending. */
  textEndY: 3691,
}

/**
 * Project Description: a night sky with two comets (the bottle and Gemy)
 * flying over the box, and the CN Tower rocket hovering over a planet below.
 * Comets and rocket burst into fireworks when clicked.
 */
export const PROJECT_SCENE = {
  header: "Project",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/project/",
  plate: [918, 4000],
  background: "#111926",
  skyBottom: 256,
  /** The box's cream, glowing like the planets. */
  headerColor: "#f1e6d4",
  headerShadow:
    "0 0 0.35em rgba(80, 130, 255, 0.55), 0 0.08em 0.3em rgba(0, 0, 0, 0.6)",
  accent: "#2f4fa0",
  layers: [
    { name: "project-back", box: [0, 0, 918, 4000] },
    // Flying through the sky head first, along their tails; clicked, they
    // burst into fireworks from their heads.
    {
      name: "project-gemy",
      box: [113, 101, 603, 224],
      fly: {
        slope: 0.17,
        ms: 34000,
        delayMs: 11000,
        head: [173, 178],
        colour: "#3fd94a",
      },
    },
    {
      name: "project-bottle",
      box: [321, 110, 793, 256],
      fly: {
        slope: 0.24,
        ms: 42000,
        delayMs: 30000,
        head: [360, 209],
        colour: "#4f86f0",
      },
    },
    // Hovers on its trail; rattles when hovered, bursts when clicked.
    {
      name: "cn-tower-rocket",
      box: [418, 2070, 492, 2364],
      rocket: {
        trail: "project-smoke-rocket",
        trailBox: [418, 2360, 495, 3620],
        hit: [395, 2050, 515, 2380],
        head: [455, 2190],
        colour: "#6f9cff",
      },
    },
  ],
  side: null,
  /** No menu highlight to match: the planet's orange. */
  footerButton: { bg: "#e2662c", text: "#111926" },
  text: {
    name: "project-box",
    box: [63, 256, 864, 2001],
    // The speckled edges reach 68 (top) and 105 (bottom) plate px in, so
    // they stay out of the stretched middle.
    caps: [75, 110],
    minH: 1500,
    // Clear of the speckled edges (on top of the box's usual padding).
    inset: [50, 50, 80, 36],
  },
  /** Bottom of the painted box; the rocket and planet below are the ending. */
  textEndY: 2001,
}

/**
 * Wiki: two fire dragons in a volcano. Hovered (tapped), a dragon glows,
 * fire spreads across it from its head and its markings light up. Painted on a
 * 451×1476 canvas (positions below); the sharper files are the same canvas
 * scaled up, so they line up as is.
 */
/** The Wiki's sharper dragons and fire, on the same canvas at 1222×4000. */
const WIKI_HQ = "https://static.igem.wiki/teams/6187/wiki/wiki/higher-qual/"

export const WIKI_SCENE = {
  header: "Wiki",
  assetBase: "https://static.igem.wiki/teams/6187/wiki/wiki/",
  plate: [451, 1476],
  /**
   * Shows through the small gaps between the painting's strokes (mostly in
   * the lava): the dark of its outlines, so they read as painted, not holes.
   */
  background: "#211619",
  skyBottom: 156,
  /** Firelight on the smoky sky. */
  headerColor: "#ffe7c2",
  headerShadow:
    "0 0 0.35em rgba(240, 96, 0, 0.65), 0 0.08em 0.3em rgba(0, 0, 0, 0.6)",
  accent: "#b8430e",
  layers: [
    { name: "sky", src: `${WIKI_HQ}skygood.avif`, box: [0, 0, 451, 1223] },
    {
      name: "mountains",
      src: `${WIKI_HQ}mountainsgood.avif`,
      box: [0, 0, 451, 1476],
    },
    {
      name: "dragon1",
      src: `${WIKI_HQ}dragon1good.avif`,
      box: [300, 36, 451, 540],
      dragon: {
        glow: "dragon1glow",
        glowBox: [270, 0, 451, 548],
        fire: `${WIKI_HQ}fire1good.avif`,
        fireBox: [264, 0, 451, 250],
        from: [395, 70],
        reach: 240,
        // A few of its neck markings were drawn on dragon 2's highlight.
        highlights: [
          { name: `${WIKI_HQ}dragon1higlight.avif`, box: [330, 25, 451, 192] },
          { name: `${WIKI_HQ}dragon2higlight.avif`, box: [400, 170, 451, 206] },
        ],
        hits: [[300, 30, 451, 210]],
      },
    },
    {
      name: "dragon2",
      src: `${WIKI_HQ}dragon2good.avif`,
      box: [0, 537, 451, 1197],
      dragon: {
        glow: "dragon2glow",
        glowBox: [0, 633, 451, 1195],
        fire: `${WIKI_HQ}fire2good.avif`,
        fireBox: [0, 588, 451, 1202],
        tail: `${WIKI_HQ}dragon2tailgood.avif`,
        // Beside the box it's drawn over the box's end instead (text.front).
        tailNarrowOnly: true,
        tailBox: [0, 896, 451, 1152],
        from: [58, 760],
        reach: 640,
        highlights: [
          { name: `${WIKI_HQ}dragon2higlight.avif`, box: [0, 600, 451, 1120] },
        ],
        // Where it shows round the boxes: head (left) and coil (right).
        hits: [
          [0, 680, 136, 880],
          [392, 740, 451, 892],
        ],
        // Along the tail, where it's painted (lowered with it over the box).
        tailHits: [
          [0, 1085, 136, 1160],
          [136, 1030, 200, 1105],
          [200, 1005, 260, 1095],
          [260, 980, 330, 1088],
          [330, 945, 392, 1075],
          [392, 910, 451, 1052],
        ],
      },
    },
  ],
  side: {
    // A plain box in the painted one's colour: crisp at any size.
    fill: "#f1dece",
    radius: "0.6rem",
    box: [55, 160, 121, 594],
    navTop: 16,
    navBottom: 6,
    linkPadY: 7,
    linkSize: 11.5,
    /** No highlight is painted for this page: a flat one in the fire's orange. */
    indicator: { fill: "#f39a3d", box: [55, 178, 121, 203] },
    highlightColor: "#f39a3d",
    /**
     * A glowing dragon scale rides on its left end (three layers, top first),
     * a bit taller than the bar and clear of the titles; the list leaves
     * room under its last title for it (navBottom).
     */
    indicatorIcon: {
      layers: [
        `${WIKI_HQ}layer-29.avif`,
        `${WIKI_HQ}layer-28.avif`,
        `${WIKI_HQ}layer-27.avif`,
      ],
      from: [24, 167, 71, 217],
      box: [38.5, 179.3, 59.5, 201.7],
    },
    linkColor: "#4a2418",
    activeLinkColor: "#2a120a",
    stripColor: "#f6e6da",
  },
  text: {
    fill: "#f1dece",
    radius: "0.6rem",
    box: [136, 156, 392, 1047],
    minH: 700,
    // The lower dragon's tail, hung a little lower than painted, comes out
    // over the box's bottom corner, below the last text; its glow, fire and
    // markings below \`line\` (just above the tail) come with it.
    front: {
      dragon: "dragon2",
      line: [
        [0, 1067],
        [451, 872],
      ],
      dy: 50,
    },
    // Room under the text for the tail (it reaches ~70 plate px up the box).
    inset: [0, 0, 56, 0],
  },
  /** Bottom of the box; the lava below is the ending. */
  textEndY: 1047,
}
