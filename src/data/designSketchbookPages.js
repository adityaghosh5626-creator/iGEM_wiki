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
 * Each section starts on a LEFT page and has an even number of pages (see
 * buildSketchbookPages), so two different section tabs never share one open
 * spread. Extra pages can show one image (imageSrc) or a gallery (images,
 * with cols).
 */

/** Images uploaded from the team's Discord and Drive. */
const NB_IMG = (name) =>
  `https://static.igem.wiki/teams/6187/wiki/outreach/notebook/${name}.avif`
/** Images from the web design team's sketchbook write-up. */
const SK_IMG = (name) =>
  `https://static.igem.wiki/teams/6187/wiki/outreach/sketchbook/content/${name}.avif`
/** A gallery's images: [file name, alt text] pairs. */
const gallery = (...images) => images.map(([name, alt]) => ({ src: SK_IMG(name), alt }))

/** One of a section's extra pages: a few lines and an image or a gallery. */
const sectionPage = (sectionId, id, title, fields) => ({
  id: `${sectionId}-${id}`,
  title,
  sectionId,
  density: "soft",
  variant: "notes",
  ...fields,
})

export const DESIGN_SKETCHBOOK_SECTIONS = [
  {
    id: "web-design",
    tabCrop: [1486, 486, 1859, 593],
    label: "Web Design",
    color: "#3B82A0",
    progress: "Concepts, storyboards, drafts and the finished pages.",
    startPageId: "web-design",
  },
  {
    id: "animation",
    tabCrop: [1485, 599, 1858, 706],
    label: "Animation",
    color: "#E07A3A",
    progress: "The logo animation and the promo video's animated part.",
    startPageId: "animation",
  },
  {
    id: "character-design",
    tabCrop: [1484, 711, 1857, 818],
    label: "Character Design",
    color: "#5A9E4B",
    progress: "Every subteam's PETamon, from sketch to mascot.",
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
    progress: "A hand-drawn brand, trading cards and merch.",
    startPageId: "branding",
  },
  {
    id: "other",
    tabCrop: [1481, 1054, 1854, 1161],
    label: "Other",
    color: "#8A8680",
    progress: "The promo and presentation videos.",
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
      "At the very start, the team pooled together everyone's own ideas for how the wiki should look. A lot of our early concepts were pixel art, playing into the Pokémon-like, gamey side of the project, but we also tried out a hand-drawn style.",
    density: "soft",
    variant: "spread",
    imageSrc: SK_IMG("web-hand-drawn-concept"),
    imageAlt: "A tall early mockup in a hand-drawn concept-art style, with a pixel title reading Name TBA",
    caption: "An early hand-drawn concept with concept-art-style graphics, by Kathleen.",
  },
  sectionPage("web-design", "pixel", "Early concepts", {
    images: gallery(
      ["web-early-concept-gallery", "A pastel pixel-art mockup with card-like panels"],
      ["web-early-concept-peta-play", "Pixel-art landing page titled PETA PLAY with an arcade machine"],
      ["web-early-concept-pet-apult", "Pixel-art landing page titled PET-APULT on a purple sunset"],
      ["web-early-concept-igem-to", "A busy collage-style page titled iGem TO with plastic-degrading enzymes"],
    ),
    cols: 2,
    caption: "Early pixel-style concepts for the wiki, by Hillary, Ibi, Wineta and Sara P respectively.",
  }),
  sectionPage("web-design", "biomes", "Biomes", {
    body:
      "Another idea was to build the design around biomes, since microplastics reach so many of our environments. It also fit our Pokémon-inspired idea of gyms and regions: the PETases became PETamon, and the reader is invited to collect them from the PETadex.",
    imageSrc: SK_IMG("web-environment-petamon-concept"),
    imageAlt: "A pixel forest scene with a PETamon, a speech bubble and an info box",
    caption: "An early proposal for an environment and PETamon concept, by Cindy.",
  }),
  sectionPage("web-design", "vote", "The vote", {
    body:
      "The team voted, and the winners were both the hand-drawn concept and the environment concept, so a proof of concept merging the two set our style going forward.",
    imageSrc: SK_IMG("web-first-environment-concept-kathleen"),
    imageAlt: "A hand-drawn teal wave over a beach, with the words Why plastic is bad and PETases",
    caption: "The first environment and hand-drawn concept, by Kathleen.",
  }),
  sectionPage("web-design", "storyboard", "Storyboard", {
    body:
      "Kathleen made the first storyboard of the homepage's flow, which the homepage is still built on. It was split into sections for the different artists on the web design team.",
    imageSrc: SK_IMG("web-homepage-outline"),
    imageAlt: "A long pencil outline of the homepage, with numbered sections and notes",
    caption: "The first outline of the homepage, split into sections.",
  }),
  sectionPage("web-design", "story", "A story to scroll", {
    body:
      "Every subteam was going to be a PETamon gym with a trainer and a PETamon partner, but we dropped the trainers along the way. The wiki would tell a story: you follow a bottle on a journey through Toronto as it breaks down into microplastics.",
    imageSrc: SK_IMG("web-section-1-draft-kathleen"),
    imageAlt: "A painted draft of the homepage's top: the PetaBite title over a plaza and waterfall",
    caption: "First draft of section 1 of the homepage, by Kathleen.",
  }),
  sectionPage("web-design", "drafts", "First drafts", {
    images: gallery(
      ["web-section-2-draft-noorine", "A tall painted draft of the waterfall and river, with three condition cards"],
      ["web-section-4-draft-cindy", "A red battle screen sketch reading This PETase is ready for battle, and a sketch of a cat at a tablet"],
    ),
    caption:
      "First drafts of section 2 (Noorine) and of section 4, which later moved to the Dry Lab page (Cindy).",
  }),
  sectionPage("web-design", "iteration", "Next iteration", {
    images: gallery(
      ["web-sections-1-3-iteration", "The homepage's first three sections painted top to bottom"],
      ["web-section-3-4-noorine", "The lab wall with its night-sky window, shelves and a blue tube"],
    ),
    caption:
      "The next iteration of sections 1 to 3 (Kathleen and Noorine, rendered over by Kathleen), and the section between 3 and 4 (Noorine).",
  }),
  sectionPage("web-design", "petamon", "PETamon at work", {
    body:
      "Once every subteam's PETamon was designed, we first planned a normal menu at the bottom with an icon for each team. Then came the idea of each PETamon breaking down a piece of the bottle, since that's what they do best: now they fill the wiki, breaking down microplastics as they go.",
    images: gallery(
      ["web-sections-4-5-plant", "The treatment plant's tanks and pipe pouring into the sea"],
      ["web-sections-4-5-ocean", "The deep ocean with coral and the PETamon around a broken bottle"],
    ),
    caption: "Sections 4 and 5, by Noorine.",
  }),
  sectionPage("web-design", "subpages", "Subteam pages", {
    body:
      "Each subteam page got its own world: Wet Lab's axolotl-catfish in the ocean, Dry Lab's spider-crab-scorpion on a desert dig, Hardware's steel turtle in deep caves, Outreach's squirrel in a beret (very French and artistique!), Venture's kangaroo with its pouch of gold, Web's fire dragon in its volcano and Human Practices' dove in the sky.",
    images: gallery(
      ["web-outreach-page-draft-meghan", "A draft of the Outreach page: an autumn forest around a white text box"],
      ["web-entrepreneurship-page-draft-noorine", "A draft of the Entrepreneurship page"],
      ["web-wet-lab-page-cindy", "The finished Wet Lab page: a sunset sea around a white text box"],
    ),
    caption:
      "Drafts of the Outreach page (Meghan) and the Entrepreneurship page (Noorine), and the finished Wet Lab page (Cindy).",
  }),
  sectionPage("web-design", "other-pages", "Other pages", {
    body:
      "The pages that aren't a subteam's were a chance to invent new places, and there's a Gemy easter egg on the Project Description page.",
    images: gallery(
      ["web-project-page-kathleen", "The finished Project Description page: a night sky with a rocket over a planet"],
      ["web-contribution-page-draft-noorine", "A draft of the Contribution page: sunlit stone steps in a greenhouse"],
    ),
    caption:
      "The finished Project Description page (Kathleen) and a draft of the Contribution page (Noorine).",
  }),
  {
    id: "web-design-build",
    title: "Building it",
    sectionId: "web-design",
    density: "soft",
    variant: "aside",
    body:
      "Sara turned the paintings into the site. The homepage became one scrolling story: from a bottle prototype in May, the bottle follows you down the waterfall and river, through the forest (where a bird steals it) and the lab, down the treatment plant, until the PETamon pull its pieces apart at the end. Along the way came the flapping birds, splashes and bubbles, the map pins, the lab's constellation, the logo's hand-off from the loading screen and auto-scroll.",
  },
  {
    id: "web-design-build-2",
    title: "Bringing it to life",
    sectionId: "web-design",
    density: "soft",
    variant: "aside",
    body:
      "Sara then built one scene for every subpage, so each painting scrolls with its text and its creatures react when you hover: Dry Lab's cactus and crabs, Venture's coin-throwing kangaroos, the Human Practices birds, Hardware's lightning turtles, Wet Lab's axolotls and fish, the Wiki's fire dragons, the Project page's comets and rocket, and Outreach's squirrels. She also built the contribution calendar, the Hardware notebook, Meet the Team and this sketchbook.",
  },
  {
    id: "web-design-end",
    title: "The result",
    sectionId: "web-design",
    density: "soft",
    variant: "aside",
    body:
      "The final result is the wiki you're on! We hope our passion and storytelling shows through it. The web design team had a lot of fun drawing everything, and we hope you have fun exploring our pages.",
  },
  {
    id: "animation",
    title: "Animation",
    sectionId: "animation",
    body:
      "Cindy animated our logo being cut, on the homepage and the loading screens, so our branding would be more interactive!",
    density: "soft",
    variant: "spread",
    imageSrc: SK_IMG("animation-logo-cindy"),
    imageAlt: "The PetaBite logo: the letters P, e, t, a, B, i, t, e in a chain of molecule rings",
    caption: "The PetaBite logo, animated by Cindy.",
  },
  sectionPage("animation", "storyboard", "Storyboard", {
    body:
      "For the promo video, the team wanted a 30-second animated segment with a voiceover. To save time, we drew the assets as static images and animated them in After Effects rather than frame by frame. Ibi, in charge of the script, wanted a TED-Ed-inspired style, so Kathleen drafted a storyboard to match it.",
    images: gallery(
      ["animation-storyboard-1", "Storyboard frames: a hand, the word Everywhere and fish"],
      ["animation-storyboard-2", "Storyboard frames of fish and shrimp, numbered shot by shot"],
      ["animation-storyboard-3", "Storyboard frames of a person eating, ending on a red heart"],
    ),
    caption: "Storyboard for the promo video's animation, by Kathleen.",
  }),
  sectionPage("animation", "assets", "Assets", {
    body:
      "Once the storyboard was final, every asset was broken down into components so different members could draw them.",
    images: gallery(
      ["animation-asset-anemone-angirmaa", "A row of painted anemones and coral"],
      ["animation-asset-water-sara", "A painted underwater background with bubbles"],
    ),
    caption: "Two of the assets: an anemone by Angirmaa and the background water by Sara P.",
  }),
  sectionPage("animation", "wip", "In progress", {
    body:
      "When every asset was finished, they were animated in After Effects into the animated segment of the final promo video.",
    images: gallery(
      ["animation-wip-1", "After Effects with the word Everywhere on screen"],
      ["animation-wip-2", "After Effects with an animated person eating"],
    ),
    cols: 1,
    caption: "Work-in-progress shots of the promo video's animation, by Kathleen.",
  }),
  {
    id: "character-design",
    title: "Character Design",
    sectionId: "character-design",
    body:
      "Once we decided each subteam would have its own PETamon and trainer mascot (the trainers were later dropped), we agreed no AI would be used in any artwork, character designs included. Our first PETamon and trainer were made for Wet Lab, as a proof of concept to get the ball rolling.",
    density: "soft",
    variant: "spread",
    imageSrc: SK_IMG("character-wet-lab-mascot-kathleen"),
    imageAlt: "The Wet Lab mascot: a pink and yellow axolotl with its mouth open",
    caption: "The Wet Lab mascot, by Kathleen.",
  },
  sectionPage("character-design", "wet-lab", "Wet Lab", {
    body:
      "The axolotl-catfish plays on the structure of a PET molecule: the balls on its fins and tail are oxygen (plus hydrogen). It's a water type (for 'wet' lab) but also electric, like enzymes speeding up reactions. Every PETamon after it plays on its PETase side and eats plastic. Its mustache nods to catfish, but also made it look French (said the PetaBite team).",
    imageSrc: SK_IMG("character-wet-lab-draft-kathleen"),
    imageAlt: "Sketches of an axolotl mascot with notes",
    caption: "A draft of the Wet Lab mascot, by Kathleen.",
  }),
  sectionPage("character-design", "trainer", "Trainers", {
    body:
      "The Wet Lab trainer was designed to communicate a scientist character archetype. She was drawn to have a sense of fashion, as seen by her dress-like lab coat and earrings, while still maintaining proper PPE of goggles, gloves and pants, as well as covered shoes and always tying her hair up in the lab. Sadly the trainer mascots were scrapped, but we had initial ideas of drawing Hardware as an engineer with either a mechanical wheelchair or prosthetics, Dry Lab as an archeologist explorer who uncovers new PETamons (PETases), and much more. The Dry Lab trainer is still on our homepage: he is the explorer in the forest section. He was not removed because we liked the animation of that section and thought it would be a shame to remove him.",
    imageSrc: SK_IMG("character-wet-lab-trainer-kathleen"),
    imageAlt: "Turnaround of a Wet Lab trainer in a lab coat",
    caption: "The Wet Lab trainer mascot (before the trainer concepts got scrapped), by Kathleen.",
  }),
  sectionPage("character-design", "mascots", "Mascots", {
    body:
      "Human Practices is a dove for the nature of their work, in a light, muted palette with molecules all around. Venture's kangaroo, Venturoo, carries a pouch of gold coins, with hydrogen and oxygen details. Outreach's squirrel got an acorn beret, for artists (and to be more French). Hover the PETamon on each subteam page: Venturoo spits out coins and the squirrel gets hit by a stray acorn!",
    images: gallery(
      ["character-hp-mascot-ibi", "The Human Practices mascot: a dove, front and side"],
      ["character-outreach-mascot-anastasia", "The Outreach mascot: a pink squirrel with a purple tail"],
      ["character-venture-mascot-noorine", "The Venture mascot: a kangaroo with a colour palette"],
    ),
    caption:
      "The Human Practices mascot by Ibi, the Outreach mascot by Anastasia and the Venture mascot by Noorine.",
  }),
  sectionPage("character-design", "dry-lab", "Dry Lab", {
    body:
      "Dry Lab asked for a web and bug theme, so their PETamon is a spider crab and scorpion fusion. Outreach thought it'd be cute to give it a bottle-cap hat, like a hermit crab's shell: it breaks down plastic to get at the caps it wears, recycling style!",
    imageSrc: SK_IMG("character-dry-lab-mascot-kathleen"),
    imageAlt: "The Dry Lab mascot: a dark spider crab wearing a teal bottle cap",
    caption: "The Dry Lab mascot, by Kathleen.",
  }),
  sectionPage("character-design", "rebecca", "Mascots", {
    body:
      "Web got a fire snake, and Hardware a steel turtle we named Gary. Its steel and electric typing suits Hardware's work!",
    images: gallery(
      ["character-web-mascot-rebecca", "The Web mascot: a fire snake"],
      ["character-hardware-mascot-rebecca", "The Hardware mascot: a steel turtle crackling with lightning"],
    ),
    cols: 1,
    caption: "The Web and Hardware mascots, by Rebecca.",
  }),
  {
    id: "social",
    title: "Social",
    sectionId: "social",
    body:
      "Our social media team launched PetaBite with our first Instagram post, Project Intro. To match the earthy colours the web design team laid down, it used a pastel palette around Wet Lab's axolotl PETamon, the very first one designed. Through the summer, the Road to Jamboree reels followed the subteams at work, and from late May our monthly newsletter, The Waterfront, brought members PetaBite's progress, events and the PETase and microplastics landscape. A special edition introduced the speakers at the Microplastics Conference in August, which we promoted on Instagram.",
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
      "Our vision for the PetaBite brand was earthy tones, textured brushes and an entirely hand-drawn visual style. Absolutely no generative AI was used to create anything that became part of PetaBite's brand. In May, we held a logo design competition: members inside and outside Outreach could submit designs inspired by our Pokémon x synthetic biology direction.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("branding-final-logo"),
    imageAlt: "The PetaBite logo: the letters P, e, t, a, B, i, t, e set in a chain of molecule rings",
    caption: "The final PetaBite logo, recoloured for merch (September 13).",
  },
  sectionPage("branding", "submissions", "Logo competition", {
    images: gallery(
      ["branding-logo-submission-1", "A round logo with a fluffy PETamon and the word PetaBite in vines"],
      ["branding-logo-submission-2", "A red round logo with a PET molecule inside"],
      ["branding-logo-submission-3", "A magnifying glass over a red PET molecule"],
      ["branding-logo-submission-petadex", "The word PETadex in blue between two circuit-board icons"],
    ),
    cols: 2,
    caption: "Some of the submissions to the PetaBite logo design competition.",
  }),
  sectionPage("branding", "winner", "The winning design", {
    body:
      "The winning design, by Chinmay, had “PETadex” framing the molecular structure of PET. Cindy reworked it to fit the wiki's developing visual direction, and in September it was recoloured for the CMYK palette of our merch.",
    images: gallery(
      ["branding-logo-winner-chinmay", "The word PETadex framing a PET molecule, with scissors cutting a bond"],
      ["branding-logo-rework-cindy", "The PetaBite logo: pastel letters in a chain of molecule rings"],
    ),
    cols: 1,
    caption: "Chinmay's winning design, and Cindy's rework to suit the wiki's narrative theme.",
  }),
  sectionPage("branding", "earth-tones", "Everywhere", {
    body:
      "Earth tones carried through every part of PetaBite's branding, including event promotions and the slide decks the Entrepreneurship and Human Practices subteams made for competitions.",
    images: gallery(
      ["branding-conference-logo-cindy", "A bottle-shaped logo reading UofT Microplastics Conference 2026 around the CN Tower"],
      ["branding-petascale-deck", "A title slide reading PetaScale: PET-microplastic degradation at scale"],
    ),
    caption:
      "The UofT Microplastics Conference logo, by Cindy, and the pitch deck for PetaScale, PetaBite's business arm, by members of our Entrepreneurship team.",
  }),
  sectionPage("branding", "cards", "Trading cards", {
    images: gallery(
      ["merch-card-1", "A PETase item card"],
      ["merch-card-2", "An Incinerator item card"],
      ["merch-card-3", "A pollution card with a plastic bottle in the sea"],
      ["merch-card-4", "A pollution card with a fork and knife in a forest"],
      ["merch-card-5", "Reactoise, a turtle PETamon card"],
      ["merch-card-6", "A PETamon card in a lab"],
    ),
    caption: "PetaBite trading card designs, by various members of iGEM Toronto.",
  }),
  sectionPage("branding", "printed", "Trading cards", {
    imageSrc: SK_IMG("merch-cards-printed"),
    imageAlt: "A row of printed PetaBite trading cards",
    caption: "The printed trading cards, displayed at the UofT Microplastics Conference.",
  }),
  sectionPage("branding", "merch", "Merch", {
    body:
      "Outreach made merch that captures the scale of the microplastics problem and ties it to PetaBite's north star: plastic-degrading enzymes that work in many environments. The first designs featured an enlarged PetaBite logo; the final ones show our PETase-based solution.",
    imageSrc: SK_IMG("merch-catalogue-initial"),
    imageAlt: "The first merch catalogue: black t-shirts, hoodies and quarter zips",
    caption: "The first iGEM Toronto merch catalogue: a t-shirt, hoodie and quarter zip.",
  }),
  sectionPage("branding", "redesign", "Merch", {
    body:
      "We wanted merch that looked more like the homepage's art and could be worn outside iGEM, so members of web and web design redesigned it. A stonewashed tee, a quarter zip and a forest-green hoodie with our sponsors made the cut; the tee was picked from a poll of four designs.",
    imageSrc: SK_IMG("merch-tee-final"),
    imageAlt: "The final stonewashed tee, front and back",
    caption: "The final stonewashed tee, by Kathleen (with inspiration from Abby).",
  }),
  sectionPage("branding", "tees", "Merch", {
    images: gallery(
      ["merch-tee-iteration-1", "A t-shirt design, front and back"],
      ["merch-tee-iteration-2", "A t-shirt design, front and back"],
      ["merch-tee-iteration-3", "A t-shirt design, front and back"],
      ["merch-tee-iteration-4", "A t-shirt design, front and back"],
    ),
    cols: 2,
    caption: "Iterations of the t-shirt design on a plain tee, by Kathleen (with inspiration from Abby).",
  }),
  sectionPage("branding", "final", "Merch", {
    images: gallery(
      ["merch-quarter-zip-final", "The final black quarter zip"],
      ["merch-hoodie-final", "The final forest-green hoodie, with sponsors framing the back design"],
    ),
    caption: "The final quarter zip and hoodie.",
  }),
  {
    id: "other",
    title: "Other",
    sectionId: "other",
    body:
      "Scripting for our two-minute promo video began in June. It gives a short introduction to the problem PetaBite addresses and a summary of the experiments that validate our solution, while staying accessible to an audience with little scientific background. We filmed across the University of Toronto campus and the Toronto Islands, and with voiceovers, animated scenes and editing, it was released on August 11.",
    density: "soft",
    variant: "spread",
    imageSrc: NB_IMG("other-promo-filming-jul26"),
    imageAlt: "A team member in a red shirt fishing off Centre Island with the Toronto skyline behind",
    caption: "Filming the promo video on Centre Island (July 26).",
  },
  {
    id: "other-presentation",
    title: "Presentation video",
    sectionId: "other",
    density: "soft",
    variant: "aside",
    body:
      "Planning for the 15-minute presentation video began in early September, with filming from mid-October. Unlike the promo video, it goes into the science and rationale behind the project's technical side, for an audience with a deeper understanding of biology, and documents PetaBite's real-world impact through our stakeholder discussions, entrepreneurial analysis and outreach. It was scripted, shot and edited in October.",
  },
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
 * The pages as the book shows them, so none ever has to scroll. A page in
 * `split` (ids) has its text and its picture on separate pages (the page is
 * too small for both without shrinking the picture). A page in `breaks` runs
 * its text on over more pages, from each of those word indices. With `pairs`
 * (two pages open at once) a section that ends up with an odd number of
 * pages gets a closing notes page, so every section still starts on a left
 * page.
 */
export function buildSketchbookPages({ split = [], breaks = {}, pairs = false } = {}) {
  const pages = []
  let count = 0
  DESIGN_SKETCHBOOK_PAGES.forEach((page, i) => {
    const own = pageRun(page, split.includes(page.id), breaks[page.id] || [])
    pages.push(...own)
    if (page.sectionId) count += own.length
    // Two pages open at once: a section that ends up with an odd number of
    // pages gets a closing note, so the next still starts on a left page.
    const next = DESIGN_SKETCHBOOK_PAGES[i + 1]
    if (page.sectionId && next?.sectionId !== page.sectionId) {
      const section = DESIGN_SKETCHBOOK_SECTIONS.find((s) => s.id === page.sectionId)
      if (pairs && count % 2 === 1 && section) {
        pages.push({
          id: `${section.id}-progress`,
          title: "Where it stands",
          body: section.progress,
          sectionId: section.id,
          density: "soft",
          variant: "aside",
        })
      }
      count = 0
    }
  })
  return pages
}

/** One page as it's laid out: its text over as many pages as it needs, then its picture if split. */
function pageRun(page, isSplit, cuts) {
  if (!isSplit && !cuts.length) return [page]
  const { imageSrc, imageAlt, images, cols, caption, body, ...text } = page
  const words = String(body || "").split(/\s+/).filter(Boolean)
  const ends = [...cuts, words.length]
  const chunk = (k) => words.slice(k ? ends[k - 1] : 0, ends[k]).join(" ")
  const run = ends.map((_, k) => {
    if (k === 0) {
      return isSplit
        ? { ...text, body: chunk(0), variant: page.variant === "spread" ? "text" : "aside" }
        : { ...page, body: chunk(0) }
    }
    return {
      id: `${page.id}-more-${k}`,
      sectionId: page.sectionId,
      density: "soft",
      variant: "aside",
      title: continuedTitle(page),
      body: chunk(k),
    }
  })
  if (isSplit) {
    run.push({
      id: `${page.id}-image`,
      sectionId: page.sectionId,
      density: "soft",
      variant: "image",
      imageSrc,
      imageAlt,
      images,
      cols,
      caption,
    })
  }
  return run
}

/** The heading a page's run-on pages carry (see pageRun). */
export function continuedTitle(page) {
  return page.variant === "spread" ? "continued" : `${page.title}, continued`
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
