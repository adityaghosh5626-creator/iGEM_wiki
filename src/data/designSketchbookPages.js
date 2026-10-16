/**
 * Design outreach sketchbook — sections (colored tabs) + ordered pages.
 *
 * Optional per spread or notes page:
 * - imageSrc / imageAlt / caption — single hero image
 * - imagePlaceholder — label shown when imageSrc is missing
 * - sectionId — which tab this page belongs to
 * - tocHalf — "left" | "right" for the two-page table of contents
 *
 * With showCover + landscape, spreads are [0], [1,2], [3,4], …
 * Each section starts on a LEFT page and pairs with a soft notes page on the right
 * so two different section tabs never share one open spread.
 */

/** Images uploaded from the team's Discord and Drive. */
const NB_IMG = (name) =>
  `https://static.igem.wiki/teams/6187/wiki/outreach/notebook/${name}.avif`

export const DESIGN_SKETCHBOOK_SECTIONS = [
  {
    id: "web-design",
    tabCrop: [1486, 486, 1859, 593],
    label: "Web Design",
    color: "#3B82A0",
    progress: "Homepage painted and built; subpages follow.",
    startPageId: "web-design",
  },
  {
    id: "animation",
    tabCrop: [1485, 599, 1858, 706],
    label: "Animation",
    color: "#E07A3A",
    progress: "Promo animation drawn and delivered in July.",
    startPageId: "animation",
  },
  {
    id: "character-design",
    tabCrop: [1484, 711, 1857, 818],
    label: "Character Design",
    color: "#5A9E4B",
    progress: "PETamon designed and printed as trading cards.",
    startPageId: "character-design",
  },
  {
    id: "social",
    tabCrop: [1481, 827, 1854, 934],
    label: "Social",
    color: "#C45B8C",
    progress: "Intro post, reels, newsletters and the promo.",
    startPageId: "social",
  },
  {
    id: "branding",
    tabCrop: [1482, 940, 1855, 1047],
    label: "Branding",
    color: "#7B5EA7",
    progress: "Competition winner became the PetaBite logo.",
    startPageId: "branding",
  },
  {
    id: "other",
    tabCrop: [1481, 1054, 1854, 1161],
    label: "Other",
    color: "#8A8680",
    progress: "Promo out; presentation video filming now.",
    startPageId: "other",
  },
]

/** The right-hand page of a section's spread: one more image from the season. */
function sectionSnapshotPage(sectionId, image, caption, alt) {
  return {
    id: `${sectionId}-notes`,
    title: "Snapshots",
    sectionId,
    density: "soft",
    variant: "notes",
    imageSrc: NB_IMG(image),
    imageAlt: alt,
    caption,
  }
}

export const DESIGN_SKETCHBOOK_PAGES = [
  {
    id: "cover",
    title: "Design Team Sketchbook",
    subtitle: "iGEM Toronto 2026",
    density: "hard",
    variant: "cover",
    coverImage: "https://static.igem.wiki/teams/6187/wiki/outreach/sketchbook/front-cover.avif",
    coverAlt: "Design Team Sketchbook front cover",
    coverCanvas: [2360, 1640],
    coverCrop: [993, 428, 1594, 1542],
  },
  {
    id: "toc-left",
    title: "Contents",
    subtitle: "Jump to a section",
    density: "soft",
    variant: "toc",
    tocHalf: "left",
  },
  {
    id: "toc-right",
    title: "Contents",
    subtitle: "Continued",
    density: "soft",
    variant: "toc",
    tocHalf: "right",
  },
  {
    id: "web-design",
    title: "Web Design",
    sectionId: "web-design",
    body:
      "Web design started in March with landing-page concepts, then moved to a homepage that tells the project as a story you scroll through. Kathleen drafted the full composition in June; the homepage was split into six sketched sections, painted and stitched together over the summer, and the same hand-painted look carried into the Dry Lab, Entrepreneurship, Human Practices, Contribution and Attributions pages. In October the art was lightened for phones ahead of the wiki freeze.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("web-homepage-storyboard-jun11"),
    imageAlt: "Pencil storyboard of the homepage scroll, with numbered sections and handwritten notes about PETamon, a world map and the bottle",
    caption: "Kathleen's homepage storyboard (June 11).",
  },
  sectionSnapshotPage(
    "web-design",
    "web-landing-concept-mar30",
    "An early landing-page concept from March.",
    "Bold, collage-style landing page mockup reading Welcome to iGem TO, with a cartoon lab machine"
  ),
  {
    id: "animation",
    title: "Animation",
    sectionId: "animation",
    body:
      "Animation gave the promo video its educational middle: a short TED-Ed-style sequence on how microplastics travel from bottles and nets into fish and then into us, plus a flowchart beat. After a storyboard in July, the assets were drawn by hand with textured brushes like the wiki's, rigged and rendered in After Effects, and delivered at the end of July, ahead of the promo video's release on August 11.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("animation-storyboard-jul21"),
    imageAlt: "Storyboard sketches of a hand, a fish and figures eating, numbered shot by shot",
    caption: "Storyboard frames for the microplastics sequence (July 21).",
  },
  sectionSnapshotPage(
    "animation",
    "animation-assets-jul23",
    "A hand-drawn asset, split into layers for animating (July 23).",
    "Painted hand holding a fork with a piece of fish"
  ),
  {
    id: "character-design",
    title: "Character Design",
    sectionId: "character-design",
    body:
      "The characters began as a brief for subteam trainers, each with a PETamon partner, drawn to break stereotypes (hardware doesn't default to a male lead). Over the summer the sketches became the PETamon that live across the wiki, and in August the idea grew into Pokémon-style trading cards: PETamon cards, pollution cards and plastic-removal item cards. The cards were formatted for print in September and printed the day before the UofT Microplastics Conference.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("character-petamon-card-sep17"),
    imageAlt: "Trading card for Reactoise, a turtle PETamon, with the moves Bite and Catalytic Reaction",
    caption: "A PETamon card, formatted for print (September 17).",
  },
  sectionSnapshotPage(
    "character-design",
    "character-printed-cards-sep18",
    "The printed cards (September 18).",
    "A fanned-out row of printed PETamon trading cards"
  ),
  {
    id: "social",
    title: "Social",
    sectionId: "social",
    body:
      "Social launched in May with Project Intro, our first Instagram post (about 300 likes), in a pastel palette built around the axolotl PETamon. From June, Road to Jamboree reels followed the subteams at work, the newsletter went out roughly monthly from late May with a special edition for the conference, and the promo video premiered on Instagram in August. Posts through September promoted the UofT Microplastics Conference.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("social-project-intro-may"),
    imageAlt: "Instagram slide titled Plastic pollution on the rise, with an axolotl and facts about microplastics in the body",
    caption: "The first slide of Project Intro (May).",
  },
  sectionSnapshotPage(
    "social",
    "social-petadex-post-may",
    "Another Project Intro slide, introducing the PETadex.",
    "Instagram slide titled Our project: the PETadex, with an axolotl holding a bottle"
  ),
  {
    id: "branding",
    title: "Branding",
    sectionId: "branding",
    body:
      "Branding kept the season hand-made: earthy colours, painted textures and no AI art. The logo design competition opened in March with a Pokémon × synthetic biology theme; after a team vote in May, Chinmay's design won and was reworked from PETadex into the PetaBite wordmark, its letters linked like a molecule. Cindy recoloured it for the merch in September.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("branding-final-logo"),
    imageAlt: "The PetaBite logo: the letters P, e, t, a, B, i, t, e set in a chain of molecule rings",
    caption: "The final PetaBite logo, recoloured for merch (September 13).",
  },
  sectionSnapshotPage(
    "branding",
    "branding-competition-entry-mar",
    "Chinmay's competition entry (March), before it became PetaBite.",
    "Logo reading PETadex under a chemical structure, with circuit-board icons on each side"
  ),
  {
    id: "other",
    title: "Other",
    sectionId: "other",
    body:
      "Outreach also made the team's videos and merch. The promo video was scripted in June, filmed on campus, in the lab and on Centre Island in July, and released on August 11. Work on the 15-minute Grand Jamboree presentation video started in August, with filming from October 1. Merch went from designs in August to supplier mockups in September, and orders for hoodies, shirts and quarter-zips opened on October 5.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("other-promo-filming-jul26"),
    imageAlt: "A team member in a red shirt fishing off Centre Island with the Toronto skyline behind",
    caption: "Filming the promo video on Centre Island (July 26).",
  },
  sectionSnapshotPage(
    "other",
    "other-merch-mockup-sep25",
    "The supplier's mockup of the PetaBite hoodies (September 25).",
    "Mockup sheet of sage green PetaBite hoodies, front and back"
  ),
  {
    id: "back",
    title: "That's the season",
    subtitle: "Flip back or tap a tab",
    body:
      "Each tab covers one part of outreach design from March to October 2026, with images from the team's Discord.",
    density: "hard",
    variant: "back",
    coverImage: "https://static.igem.wiki/teams/6187/wiki/outreach/sketchbook/back-cover.avif",
    coverAlt: "Design Team Sketchbook back cover",
    coverCanvas: [2360, 1640],
    coverCrop: [386, 420, 998, 1574],
  },
]

/**
 * The pages as the book shows them. A section in `split` has its text and its
 * photo on separate pages (the page is too small for both without shrinking
 * the photo). With `pairs` (two pages open at once) a split section also gets
 * a closing notes page, so every section still starts on a left page.
 */
export function buildSketchbookPages({ split = [], pairs = false } = {}) {
  const pages = []
  for (const page of DESIGN_SKETCHBOOK_PAGES) {
    const isSplit = page.variant === "spread" && split.includes(page.sectionId)
    if (!isSplit) {
      pages.push(page)
    } else {
      const { imageSrc, imageAlt, caption, ...text } = page
      pages.push({ ...text, variant: "text" })
      pages.push({
        id: `${page.id}-image`,
        sectionId: page.sectionId,
        density: "soft",
        variant: "image",
        imageSrc,
        imageAlt,
        caption,
      })
    }
    const section = DESIGN_SKETCHBOOK_SECTIONS.find(
      (s) => page.variant === "notes" && s.id === page.sectionId
    )
    if (section && pairs && split.includes(section.id)) {
      pages.push({
        id: `${section.id}-progress`,
        title: "Where it stands",
        body: section.progress,
        sectionId: section.id,
        density: "soft",
        variant: "aside",
      })
    }
  }
  return pages
}

/** Map section id → first page index in DESIGN_SKETCHBOOK_PAGES. */
export function getSectionStartIndex(sectionId) {
  const section = DESIGN_SKETCHBOOK_SECTIONS.find((s) => s.id === sectionId)
  if (!section) return -1
  return DESIGN_SKETCHBOOK_PAGES.findIndex((p) => p.id === section.startPageId)
}

/** Sections shown on the left vs right TOC page (3 + 3). */
export function getTocSections(half) {
  const mid = Math.ceil(DESIGN_SKETCHBOOK_SECTIONS.length / 2)
  if (half === "left") return DESIGN_SKETCHBOOK_SECTIONS.slice(0, mid)
  if (half === "right") return DESIGN_SKETCHBOOK_SECTIONS.slice(mid)
  return DESIGN_SKETCHBOOK_SECTIONS
}

/** StPageFlip / page-flip — https://github.com/Nodlik/StPageFlip (MIT, Copyright 2020 Nodlik) */
export const PAGE_FLIP_ATTRIBUTION = {
  name: "StPageFlip",
  author: "Nodlik (Oleg Litovski)",
  url: "https://github.com/Nodlik/StPageFlip",
  license: "MIT",
  npmPackage: "page-flip",
}
