import { SUBTEAM_BY_ID, SUBTEAM_IDS } from "../subteamTracks.js"
import { buildWeekSkeleton } from "./calendarUtils.js"

/** @typedef {import('../subteamTracks.js').SubteamId} SubteamId */

/**
 * @typedef {Object} WeekMilestone
 * @property {string} date - YYYY-MM-DD
 * @property {string} label
 * @property {SubteamId} subteamId
 */

/**
 * @typedef {Object} SubteamWeekContent
 * @property {string} summary
 * @property {string} [detail]
 * @property {string} [link]
 */

/**
 * @typedef {Object} ContributionWeek
 * @property {string} id
 * @property {string} start
 * @property {string} end
 * @property {string[]} monthKeys
 * @property {string} overview
 * @property {WeekMilestone[]} milestones
 * @property {Record<SubteamId, SubteamWeekContent>} subteams
 */

function defaultSubteams() {
  /** @type {Record<SubteamId, SubteamWeekContent>} */
  const subteams = {}
  for (const id of SUBTEAM_IDS) {
    subteams[id] = {
      summary: "Progress update coming soon.",
      detail: "",
    }
  }
  return subteams
}

/** Rich mock copy keyed by week id — merge over skeleton weeks. */
const WEEK_CONTENT_OVERRIDES = {
  "week-2026-04-05": {
    overview:
      "Kickoff month: safety training, workspace setup, and parallel planning across wet lab, dry lab, and hardware. Web begins building the wiki.",
    milestones: [
      { date: "2026-04-08", label: "Lab safety orientation", subteamId: "wetLab" },
      { date: "2026-04-10", label: "Wiki site-structure draft", subteamId: "web" },
    ],
    subteams: {
      wetLab: {
        summary: "Safety onboarding and inventory audit.",
        detail:
          "All members completed basic lab-safety training; starter bacteria ordered and storage mapped for the season.",
      },
      dryLab: {
        summary: "Enzyme database fields drafted.",
        detail:
          "Defined what metadata to store for each candidate plastic-degrading enzyme (PETase) and first filtering rules for PETadex, our enzyme sequence database.",
      },
      hardware: {
        summary: "Starter bioreactor kit build and early requirements.",
        detail:
          "• Completed first build of a Pioreactor (open-source small bioreactor kit); noted assembly pain points.\n• Accessibility talk set user-friendly design criteria; shared measurement needs with wet lab.",
        link: "/hardware/notebook/#journal-2026-03-27",
      },
      humanPractices: {
        summary: "Stakeholder map started.",
        detail: "Listed industry, academic, and community partners to interview in May.",
      },
      outreach: {
        summary: "Education toolkit outline.",
        detail: "Draft learning objectives for high-school workshop modules on plastics and enzymes.",
      },
      venture: {
        summary: "Market landscape scan.",
        detail: "Collected public reports on mechanical vs. enzyme-based plastic recycling economics.",
      },
      web: {
        summary: "Wiki site skeleton merged.",
        detail: "Navigation, page layout shell, and contribution timeline placeholder routes in place.",
        link: "/software/",
      },
    },
  },
  "week-2026-04-12": {
    subteams: {
      hardware: {
        summary: "Kit vendor debrief and parts-list kickoff.",
        detail:
          "• Met with the Pioreactor CEO; chose cheaper microcontrollers over Raspberry Pi for sensing boards.\n• Assigned owners for the bill of materials (parts list) — pumps, optical density (growth) sensors, pH, temperature, fan, glassware — and reviewed written requirements.",
        link: "/hardware/notebook/#journal-2026-04-15",
      },
    },
    milestones: [
      { date: "2026-04-15", label: "Hardware parts-list kickoff", subteamId: "hardware" },
    ],
  },
  "week-2026-04-26": {
    subteams: {
      hardware: {
        summary: "Parts research and clearer requirements.",
        detail:
          "• Compared pumps, sensors, and microcontroller options on the shared parts list (Digikey/Adafruit).\n• Synced with dry lab and wet lab on what the bioreactor must measure; flagged unclear requirement wording.",
        link: "/hardware/notebook/#journal-2026-04-29",
      },
    },
  },
  "week-2026-05-03": {
    overview:
      "First experimental cycles: assay pilots in wet lab, enzyme-sequence mining on the cluster, and early hardware parts evaluation.",
    milestones: [
      { date: "2026-05-08", label: "First assay plate pilot", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "First plate-reader enzyme test.",
        detail: "Ran color-based control wells; spotted buffer interference to fix next week.",
        link: "/wet-lab/notebook/",
      },
      dryLab: {
        summary: "First sequence-mining batch queued.",
        detail:
          "Submitted 12 environmental DNA data slices to the university cluster; expect candidate enzyme hits by mid-May.",
        link: "/dry-lab/overview/",
      },
      hardware: {
        summary: "Parts evaluation before May ordering.",
        detail:
          "• Compared sensor wiring options and cable costs for multi-sensor setups.\n• Team assigned to review Pioreactor source code ahead of prototyping.",
      },
      humanPractices: {
        summary: "First expert interview.",
        detail: "Interviewed a recycling facility operator; insights fed to hardware specs.",
      },
      outreach: {
        summary: "Classroom demo storyboard.",
        detail: "Storyboard approved for a 20-minute module; printing handouts.",
      },
      venture: {
        summary: "Problem–solution pitch draft.",
        detail: "Drafted how enzyme recycling differs from current industrial methods.",
      },
      web: {
        summary: "Interactive enzyme map prototype linked.",
        detail: "Embedded an interactive map on the dry lab overview and tuned performance.",
      },
    },
  },
  "week-2026-05-10": {
    subteams: {
      hardware: {
        summary: "Parts orders decided; prototyping assigned.",
        detail:
          "• May 12: locked ordering path for connectors, an external temperature sensor, and manual pH via a wet-lab probe.\n• May 16: split optical density (culture growth) sensing, heater, and microcontroller connectivity across owners; calibration box work started.",
        link: "/hardware/notebook/#journal-2026-05-16",
      },
    },
    milestones: [
      { date: "2026-05-16", label: "Sensor and controller prototyping assigned", subteamId: "hardware" },
    ],
  },
  "week-2026-05-17": {
    subteams: {
      hardware: {
        summary: "Pump and growth-sensor bench tests.",
        detail:
          "• Ran a peristaltic pump test with dyed water; plumbing looked good.\n• Optical density (growth) readings were noisy — calibration continues; real-time pH sensing deprioritized after wet-lab discussion.",
        link: "/hardware/notebook/#journal-2026-05-19",
      },
    },
  },
  "week-2026-05-24": {
    subteams: {
      hardware: {
        summary: "Cross-subteam bioreactor requirements aligned.",
        detail:
          "• Filmed a Pioreactor demo; dry lab confirmed temperature sweeps matter more than pH (25–70 °C target).\n• Agreed on continuous flow, growth-sensor feedback, and a 3-pump layout; documented heater power and warm-up time.",
        link: "/hardware/notebook/#journal-2026-05-26",
      },
    },
    milestones: [
      { date: "2026-05-26", label: "Bioreactor requirements aligned", subteamId: "hardware" },
    ],
  },
  // Replace the blocks with these keys in WEEK_CONTENT_OVERRIDES, from "week-2026-05-31" through "week-2026-10-04".
  // Other subteams and their milestones are copied unchanged. The old "Replace your existing..." comment can be deleted.
  "week-2026-05-31": {
    subteams: {
      hardware: {
        summary: "System architecture drafted; growth-sensor parts ordered.",
        detail:
          "• Drafted how sensors talk to a microcontroller and then to cloud analytics; split on-device controls (temp, runtime, growth) from cloud charts.\n• Chose a photodiode-based optical density sensor for culture growth; ordered parts and assigned validation experiments.",
        link: "/hardware/notebook/#journal-2026-06-02",
      },
      wetLab: {
        summary: "Reagents organized; media and plates made.",
        detail:
          "• Picked up orders and labeled reagents.\n• Made LB growth media and poured plates for cloning.",
        link: "/wet-lab/notebook/",
      },
    },
    milestones: [
      { date: "2026-06-02", label: "System architecture drafted", subteamId: "hardware" },
      { date: "2026-06-03", label: "Pick up orders; organize and label reagents", subteamId: "wetLab" },
      { date: "2026-06-04", label: "Prep growth media and pour plates", subteamId: "wetLab" },
    ],
  },
  "week-2026-06-07": {
    subteams: {
      hardware: {
        summary: "Validation experiments defined; CAD underway.",
        detail:
          "• Defined design-of-experiment checks for flow rate, temperature accuracy, autoclave (sterilization) path, and sourcing.\n• 3D design underway for caps and optical-density (growth) sensor parts; power budget documented.",
        link: "/hardware/notebook/#journal-2026-06-09",
      },
      wetLab: {
        summary: "Competent-cell prep.",
        detail:
          "• Toured the BME teaching lab.\n• Made SOB media and prepared competent cells (bacteria ready to take up DNA) with a Mix & Go kit.",
        link: "/wet-lab/notebook/",
      },
    },
    milestones: [
      { date: "2026-06-11", label: "Pick up cells for competent-cell prep", subteamId: "wetLab" },
      { date: "2026-06-12", label: "Make competent cells", subteamId: "wetLab" },
    ],
  },
  "week-2026-06-14": {
    overview:
      "Mid-season integration: enzyme shortlist, bioreactor prototyping, and wet-lab cloning practice.",
    milestones: [
      { date: "2026-06-16", label: "Optical-sensor housing prototype ordered", subteamId: "hardware" },
      { date: "2026-06-16", label: "Make competent cells; transform team plasmids", subteamId: "wetLab" },
      { date: "2026-06-18", label: "Save freezer stocks; purify plasmid DNA", subteamId: "wetLab" },
      { date: "2026-06-19", label: "Pour antibiotic selection plates", subteamId: "wetLab" },
      { date: "2026-06-20", label: "Top plastic-degrading enzyme shortlist", subteamId: "dryLab" },
    ],
    subteams: {
      wetLab: {
        summary: "Cloning practice with DH5α and BL21.",
        detail:
          "• Transformed test and distribution plasmids into DH5α and BL21.\n• Made freezer stocks and purified plasmid DNA (miniprep).\n• Poured antibiotic selection plates.",
        link: "/wet-lab/notebook/",
      },
      dryLab: {
        summary: "Top enzyme shortlist shared internally.",
        detail:
          "Filtered PETase (plastic-degrading enzyme) candidates for stability and active-site quality; handed sequences to wet lab.",
        link: "/model/",
      },
      hardware: {
        summary: "Optical-sensor housing printed; power architecture reviewed.",
        detail:
          "• First 3D-printed housing for the optical density (growth) sensor sent for print; task tracking moved to Jira.\n• Reviewed wiring diagrams, motor-driver choices, and team power diagram.",
        link: "/hardware/notebook/#journal-2026-06-16",
      },
      humanPractices: {
        summary: "Policy memo draft.",
        detail: "Summarized Canadian extended producer responsibility context for judges.",
      },
      outreach: {
        summary: "Hosted high-school workshop.",
        detail: "Ran enzyme demo station; collected feedback forms (n=28).",
      },
      venture: {
        summary: "Competitor comparison updated.",
        detail: "Compared three enzyme-recycling startups on maturity and partnerships.",
      },
      web: {
        summary: "Contribution calendar scaffold.",
        detail: "Shipped interactive timeline for subteam progress (this page).",
      },
    },
  },
  "week-2026-06-21": {
    milestones: [
      { date: "2026-06-24", label: "Miniprep BL21; transform NEB DH5α", subteamId: "wetLab" },
      { date: "2026-06-26", label: "Miniprep DH5α; send for sequencing", subteamId: "wetLab" },
    ],
    subteams: {
      hardware: {
        summary: "Parts handed out; build-session prep.",
        detail:
          "• Distributed subsystem components; reviewed wiring diagrams (growth sensor needs a voltage divider).\n• Planned an extended build session: circuit diagrams in KiCad and Arduino coding kickoff.",
        link: "/hardware/notebook/#journal-2026-06-23",
      },
      wetLab: {
        summary: "Plasmid purification and first sequencing samples.",
        detail:
          "• Grew BL21 cultures and purified their plasmids.\n• Transformed NEB DH5α cells, mini-prepped them, and sent samples for sequencing.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-06-28": {
    milestones: [
      { date: "2026-07-03", label: "Transform DH5α with selected plasmids", subteamId: "wetLab" },
      { date: "2026-07-04", label: "Pour selection plates", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "Competent cells frozen; plasmids transformed.",
        detail:
          "• Froze DH5α competent cells at -80 °C and transformed them with selected plasmids.\n• Poured chloramphenicol, ampicillin and kanamycin plates.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-07-05": {
    subteams: {
      hardware: {
        summary: "Code repository live; Thursday build nights set.",
        detail:
          "• Created the bioreactor GitHub repo; chose Thursday evenings as recurring in-person build nights.\n• Data-logging software wired to eight devices; pumps soldered, CAD libraries advanced, thermocouple tested near 55 °C.",
        link: "/hardware/notebook/#journal-2026-07-07",
      },
      wetLab: {
        summary: "Plasmid cleanup; first FAST-PETase expression.",
        detail:
          "• Purified plasmids from DH5α cultures.\n• Expressed FAST-PETase (an engineered plastic-degrading enzyme) in T7 bacteria.\n• Mini-prepped the team's plasmid parts.",
        link: "/wet-lab/notebook/",
      },
    },
    milestones: [
      { date: "2026-07-07", label: "Bioreactor code repo and build nights", subteamId: "hardware" },
      { date: "2026-07-08", label: "FAST-PETase expression in T7 cells", subteamId: "wetLab" },
      { date: "2026-07-10", label: "Miniprep team plasmid set", subteamId: "wetLab" },
    ],
  },
  "week-2026-07-19": {
    milestones: [
      { date: "2026-07-21", label: "Miniprep AS plasmids; send for sequencing", subteamId: "wetLab" },
      { date: "2026-07-24", label: "Finish BL21 competent cells", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "AS plasmid sequencing and BL21 competent cells.",
        detail:
          "• Purified AS plasmids and sent them for sequencing.\n• Made BL21 competent cells (two-day protocol) and began copper fabric staining.\n• Trained the team on the autoclave.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-07-26": {
    overview:
      "Summer crunch: hardware integration, scaled assays, and wiki content freeze targets for August review.",
    milestones: [
      { date: "2026-07-29", label: "Pour plates; test BL21 competence", subteamId: "wetLab" },
      { date: "2026-07-31", label: "Test copper toxicity", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "Media, plates and first copper toxicity tests.",
        detail:
          "• Made fresh media and poured ampicillin and kanamycin plates.\n• Tested BL21 competent cells with pUC19.\n• Began copper toxicity and copper-release tests on fabric.",
        link: "/wet-lab/notebook/",
      },
      dryLab: {
        summary: "Model checked on new data.",
        detail: "Tested the scoring model on held-out environmental DNA datasets it had not seen.",
      },
      hardware: {
        summary: "In-person builds and subsystem integration.",
        detail:
          "• Continued Thursday build evenings — wiring, subsystem code, and test runs.\n• Validating heater, pump, and optical density (growth) sensors against design-of-experiment protocols.",
        link: "/hardware/notebook/#journal-2026-07-07",
      },
      humanPractices: {
        summary: "Ethics checklist signed off.",
        detail: "Reviewed environmental release and waste disposal with faculty advisor.",
      },
      outreach: {
        summary: "Educator toolkit beta shared.",
        detail: "Released educator packet draft for partner schools.",
      },
      venture: {
        summary: "Pitch deck outline started.",
        detail: "Slides for the Jamboree entrepreneurship track outlined.",
      },
      web: {
        summary: "Homepage mockup speed pass.",
        detail: "Optimized scroll performance and the hardware notebook sandbox.",
      },
    },
  },
  "week-2026-08-02": {
    milestones: [
      { date: "2026-08-04", label: "Golden Gate assembly of AS plasmid", subteamId: "wetLab" },
      { date: "2026-08-07", label: "Miniprep and sequence AS products", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "First AS Golden Gate assemblies.",
        detail:
          "• Assembled the AS plasmid by Golden Gate assembly (GGA, joining DNA pieces) from newly arrived IDT/Twist DNA and transformed it into DH5α.\n• Mini-prepped the products for sequencing.\n• Ran copper and dye release tests on fabric.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-08-09": {
    milestones: [
      { date: "2026-08-10", label: "Gel check of AS GGA products", subteamId: "wetLab" },
      { date: "2026-08-13", label: "Make trimethoprim stock; first antibiotic + copper plates", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "Verified assemblies; antibiotic + copper plates.",
        detail:
          "• Checked AS products by gel and sent good ones for sequencing.\n• Made a trimethoprim stock and kanamycin + copper plates.\n• Finished the 96-hour dye release run.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-08-16": {
    milestones: [
      { date: "2026-08-18", label: "Copper mesh biosensor test", subteamId: "wetLab" },
      { date: "2026-08-20", label: "Test AS-sul1 on sulfa + copper plates", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "AS plasmids tested with copper and sulfa.",
        detail:
          "• Tested AS-sul1, AS-sul2 and AS-msGFP on copper and sulfa plates.\n• Ran a copper mesh leaching test.\n• Redid the AS + pCusC-RBS + dfrB10 assembly; toured the BioZone lab.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-08-23": {
    milestones: [
      { date: "2026-08-25", label: "Sequence AS empty and AS-dfr plasmids", subteamId: "wetLab" },
      { date: "2026-08-26", label: "Start PD plasmid PCR", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "Dose-response tests; PD plasmid begins.",
        detail:
          "• Sequenced the AS empty and AS-dfr plasmids.\n• Tested copper and sulfa concentration ranges.\n• Started PCR and assembly of the PD plasmid.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-08-30": {
    milestones: [
      { date: "2026-08-31", label: "Assemble PD plasmid", subteamId: "wetLab" },
      { date: "2026-09-01", label: "Start move to BioZone", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "PD plasmid assembled; BioZone move begins.",
        detail:
          "• Assembled the PD plasmid and transformed it into DH5α.\n• Began moving lab stocks to the new BioZone bench (room 403).",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-09-06": {
    overview:
      "Pre-Jamboree polish: documentation sprint, final characterization runs, and venture storytelling.",
    milestones: [
      { date: "2026-09-08", label: "Move plates and columns to BioZone", subteamId: "wetLab" },
      { date: "2026-09-10", label: "BioZone lab tour", subteamId: "wetLab" },
      { date: "2026-09-10", label: "Wiki content soft freeze", subteamId: "web" },
      { date: "2026-09-12", label: "Final bioreactor demo", subteamId: "hardware" },
    ],
    subteams: {
      wetLab: {
        summary: "Moving into BioZone.",
        detail:
          "• Moved plates and columns from BME to BioZone.\n• Cleared leftover media.\n• Toured the new lab.",
        link: "/wet-lab/notebook/",
      },
      dryLab: {
        summary: "Software documentation locked.",
        detail: "Install guide and API docs reviewed for judges.",
        link: "/software/",
      },
      hardware: {
        summary: "Demo script rehearsed.",
        detail: "Integrated sensing dashboard for live temperature and pH plots.",
      },
      humanPractices: {
        summary: "Integrated human-practices narrative.",
        detail: "Linked interviews to design decisions in wiki prose.",
      },
      outreach: {
        summary: "Educator toolkit v1.0 shipped.",
        detail: "Final PDF and slide deck uploaded to the education page.",
      },
      venture: {
        summary: "Business model slide complete.",
        detail: "Added market-size framing and partnership pipeline slide.",
      },
      web: {
        summary: "Site-wide link audit.",
        detail: "Fixed navigation order, page titles, and contribution deep links.",
      },
    },
  },
  "week-2026-09-13": {
    milestones: [
      { date: "2026-09-15", label: "Move -80 °C samples to BioZone", subteamId: "wetLab" },
      { date: "2026-09-15", label: "Restart PD plasmid assembly", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "Freezer move; PD plasmid restart.",
        detail:
          "• Moved the iGEM -80 °C samples to BioZone.\n• Resuspended Twist PD DNA, ran KLD (joins linear DNA ends into a plasmid), transformed it, and redid the fragment assembly.\n• Later shifts awaited RRF approval.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-09-20": {
    milestones: [
      { date: "2026-09-23", label: "Move Lash Miller samples to BioZone", subteamId: "wetLab" },
      { date: "2026-09-24", label: "Resuspend Twist PETase inserts; set up GGAs", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "Lab move finished; control PETase cloning starts.",
        detail:
          "• Moved Lash Miller samples to BioZone, plus the BME -80 °C samples if freezer space allowed.\n• Resuspended Twist PETase inserts and set up Golden Gate assemblies with the PD plasmid.\n• Made LB broth and autoclaved tips.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-10-04": {
    milestones: [
      { date: "2026-10-06", label: "Assemble PD with 5 control PETases; PCR and gel", subteamId: "wetLab" },
      { date: "2026-10-07", label: "Co-transform AS + PD into BL21(DE3)", subteamId: "wetLab" },
    ],
    subteams: {
      wetLab: {
        summary: "PD + control PETases built; AS + PD co-transformed.",
        detail:
          "• Assembled PD with the 5 control PETases and checked the products by PCR and gel.\n• Co-transformed AS-msGFP + PD and AS-sul1 + PD into BL21(DE3), an expression strain.\n• Made copper-stained mesh and inventoried supplies.",
        link: "/wet-lab/notebook/",
      },
    },
  },
  "week-2026-10-18": {
    overview:
      "Closing weeks: Jamboree prep, poster printing, and post-competition retrospective scheduling.",
    milestones: [
      { date: "2026-10-22", label: "Jamboree presentation dry run", subteamId: "venture" },
    ],
    subteams: {
      wetLab: {
        summary: "Lab wrap-down checklist.",
        detail: "Freezer stocks catalogued; equipment cleaned and signed off.",
      },
      dryLab: {
        summary: "Data archive prepared.",
        detail: "Packaged a PETadex (enzyme database) snapshot and model files for judges.",
      },
      hardware: {
        summary: "Travel crate packed.",
        detail: "Bioreactor secured for shipping; spare sensors labeled.",
      },
      humanPractices: {
        summary: "Reflection interviews scheduled.",
        detail: "Booked team retrospective sessions for November.",
      },
      outreach: {
        summary: "Posters for school partners.",
        detail: "Printed thank-you posters and feedback summary.",
      },
      venture: {
        summary: "Pitch timing rehearsed.",
        detail: "Recorded run-through; trimmed script to 8 minutes.",
      },
      web: {
        summary: "Final site release tagged.",
        detail: "Tagged release on GitLab; monitoring the build pipeline.",
      },
    },
  },
}

/** Weeks with start date before this get quiet placeholders instead of "coming soon". */
const PAST_WEEK_QUIET_BEFORE = "2026-07-31"

/**
 * Real outreach week copy from meeting minutes (Mar–Jul 2026).
 * Applied after base overrides so mock outreach blurbs are replaced.
 */
const OUTREACH_WEEK_PATCHES = {
  "week-2026-03-29": {
    outreach: {
      summary: "Branding and mascot sketches carry over from March kickoff.",
      detail:
        "March sessions set a whimsical hand-drawn look, plastic-enzyme characters, and wiki art inspiration. Character design brief (trainers + PETamon partners) targeted April 5 sketches.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-04-05": {
    milestones: [
      { date: "2026-04-05", label: "Character / mascot sketch deadline", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Character sheets and wiki design workshopping.",
      detail:
        "Sketch deadline for trainers and PETamon partners. Wiki look-and-feel ideas voted in late March; logo competition still open. Members gathering stories for a Project Intro social post.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-04-12": {
    outreach: {
      summary: "Instagram monitoring and subteam story gathering.",
      detail:
        "Members attending wet lab, hardware, dry lab, venture, and web meetings to gather Project Intro content. Logo submissions encouraged.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-04-19": {
    outreach: {
      summary: "Continuing branding and social prep.",
      detail:
        "Quiet documentation week — character and logo work continues, plus planning photo/video coverage for the May 9 team social.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-04-26": {
    outreach: {
      summary: "Pre-May social and conference logistics.",
      detail:
        "Preparing May 9 photo/video coverage and asking the sustainability office about catering for the microplastics conference.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-05-03": {
    milestones: [
      { date: "2026-05-09", label: "Team social + photo/video day", subteamId: "outreach" },
    ],
    outreach: {
      summary: "May 9 social filming and photo capture.",
      detail:
        "Outreach covered the team social for Instagram and the wiki — photos go in the shared Drive folder after the event.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-05-10": {
    milestones: [
      { date: "2026-05-12", label: "PetaScale at Web Summit", subteamId: "outreach" },
      { date: "2026-05-17", label: "Project Intro post + homepage design due", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Summer plan: intro post, weekly reels, newsletter, homepage.",
      detail:
        "Locked owners for the Project Intro Instagram post (due May 17), Road to Jamboree weekly reels, first newsletter (~May 24), homepage art, and a late-May picnic. Logo vote still open.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-05-17": {
    outreach: {
      summary: "Ship Project Intro; start Road to Jamboree reels; finalize logo.",
      detail:
        "Project Intro posts Sunday morning; weekly Road to Jamboree filming/editing begins. Homepage design handed to Abby/Dennis; logo redesign targeted for May 24.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-05-24": {
    milestones: [
      { date: "2026-05-26", label: "First team newsletter sent", subteamId: "outreach" },
      { date: "2026-05-29", label: "Riverdale Park picnic social", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Project Intro live; first newsletter and picnic.",
      detail:
        "Project Intro completed. First newsletter sent via Brevo (~May 26) covering Web Summit, campus events, and the May 9 social. Riverdale Park picnic May 29. Wiki art mockup underway; promo-video research assigned.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-05-31": {
    outreach: {
      summary: "Post-picnic wrap; promo research continues.",
      detail:
        "Picnic social hosted May 29. Team reviewing prior years’ promo videos and refining logo capitalization and animation.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-06-07": {
    milestones: [
      { date: "2026-06-14", label: "Logo redesign target", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Promo crew staffed; conference and logo redesign.",
      detail:
        "Script, animation, editing, and voiceover owners assigned after reviewing prior-year videos. Microplastics conference planning continues; next Road to Jamboree reel focuses on hardware.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-06-14": {
    milestones: [
      { date: "2026-06-21", label: "Newsletter draft (conference teaser)", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Promo storyboard draft; homepage sections; hardware reels.",
      detail:
        "Promo storyboard first draft out for comments. Homepage split into six sketched sections. Hardware Road to Jamboree reel filming mid-week. Newsletter prioritizes the conference announcement; Islands outing Jun 26.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-06-21": {
    milestones: [
      { date: "2026-06-26", label: "Toronto Islands filming / social", subteamId: "outreach" },
      { date: "2026-06-27", label: "Homepage section sketches due", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Promo script polish; July shoot plan; Islands outing.",
      detail:
        "One more session to shorten the promo script and lock location/props; filming starts in July. Hardware reel filmed around the hardware meeting. Homepage section sketches due Jun 27.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-06-28": {
    milestones: [
      { date: "2026-06-28", label: "Homepage art export check-in", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Homepage section exports and bottle lifecycle art.",
      detail:
        "Web design sync: line-art exports for each homepage section, bottle lifecycle art, animated logo, and placeholder motion for water/conditions scenes. Next step is rendering and stitching.",
      link: "/beyond-the-bench/outreach/#design",
    },
  },
  "week-2026-07-05": {
    milestones: [
      { date: "2026-07-05", label: "Newsletter published", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Newsletter out; promo shot list; conference speaker emails.",
      detail:
        "Newsletter live. Promo filming shot list started this week. Conference invites sent to potential speakers; interest and intro social posts scheduled.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-07-12": {
    milestones: [
      { date: "2026-07-12", label: "Miriam Diamond + Karen Wirsig confirmed", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Conference speakers confirmed; promo filming ramps up.",
      detail:
        "Miriam Diamond (seminar) and Karen Wirsig (panel) confirmed for the Sep 19 microplastics conference. Promo shot list updated; animation work started. Road to Jamboree reels on hold until the promo is done.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-07-19": {
    milestones: [
      { date: "2026-07-19", label: "Promo animation planning meeting", subteamId: "outreach" },
      { date: "2026-07-20", label: "Outreach meeting #15", subteamId: "outreach" },
      { date: "2026-07-21", label: "Hardware promo filming window", subteamId: "outreach" },
      { date: "2026-07-22", label: "Promo voiceover due", subteamId: "outreach" },
      { date: "2026-07-22", label: "Anthony VC promo interview", subteamId: "outreach" },
      { date: "2026-07-23", label: "Promo storyboard simplified", subteamId: "outreach" },
      { date: "2026-07-23", label: "Sania VC promo interview", subteamId: "outreach" },
      { date: "2026-07-24", label: "Wet lab promo filming", subteamId: "outreach" },
      { date: "2026-07-25", label: "First live promo filming", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Meet #15 — promo filming ramp + animation plan; Aug 3 animation deadline.",
      detail:
        "Jul 20 Meet #15: ~15 of 35 promo filming shots done (8 more from Islands); CapCut + DaVinci Resolve editing; animation meeting 1 done with style refs. Shoot windows — hardware Tue 5:30–7:30, wet lab Fri, Victoria Park wastewater B-roll, VC interviews (Clara done; Anthony Wed, Sania Thu); animations due Aug 3. Jul 19 animation meeting locked TED-Ed mid-section shots 2.1–2.9 + flowchart 3.12; VO Jul 22; zooplankton cut Jul 23; scene 1 film Jul 25. Presentation video (15 min, Oct) staffed separately; July newsletter draft targeted for Jul 30 / Aug 1; merch (hoodies, tees, quarter-zips, stickers) exploration started; RTJ still on hold.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-07-26": {
    milestones: [
      { date: "2026-07-27", label: "Hand-drawn promo art due", subteamId: "outreach" },
      { date: "2026-07-30", label: "July newsletter target post", subteamId: "outreach" },
      { date: "2026-08-01", label: "July newsletter backup post window", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Hand-drawn promo art sprint; July newsletter draft → Jul 30 / Aug 1.",
      detail:
        "Pipeline: storyboard (done) → hand-drawn assets (due Mon Jul 27) → render and rig in After Effects. Art covers nets, bottles, microplastics, fish, human/eating frames, and lake/table backgrounds, plus a flowchart animation beat. July newsletter draft due this window for a Jul 30 or Aug 1 send (possible Mailchimp switch next month). Merch supplier scouting continues alongside wiki homepage stitch.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-08-02": {
    milestones: [
      { date: "2026-08-03", label: "Promo animation deadline", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Promo animation delivery for the mid-section and flowchart.",
      detail:
        "Internal deadline Aug 3 midnight for the animated promo mid-section (~25–30s educational style) and flowchart beat. Live-action edit continues around the animated middle.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-09-06": {
    outreach: {
      summary: "Conference week approach — speakers, pamphlet, promo.",
      detail:
        "September 19 microplastics conference with confirmed seminar and panel speakers. Final promo and presentation-video work runs in parallel with the wiki soft freeze.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-09-13": {
    milestones: [
      { date: "2026-09-19", label: "Microplastics conference", subteamId: "outreach" },
    ],
    outreach: {
      summary: "Microplastics conference (Sep 19).",
      detail:
        "Run conference programming with Miriam Diamond’s seminar and Karen Wirsig’s panel; capture photos and quotes for the Impact section.",
      link: "/beyond-the-bench/outreach/",
    },
  },
  "week-2026-10-18": {
    outreach: {
      summary: "Jamboree outreach wrap and partner thanks.",
      detail:
        "Presentation dry-run support, partner thank-yous, and archival of social and newsletter assets after the conference.",
      link: "/beyond-the-bench/outreach/",
    },
  },
}

/**
 * Real human-practices week copy from HP meeting slides/notes (Mar–Jul 2026).
 * Applied after base overrides so mock HP blurbs are replaced.
 * Calendar skeleton starts week-2026-03-29 — March kickoff folds into that week.
 */
const HUMAN_PRACTICES_WEEK_PATCHES = {
  "week-2026-03-29": {
    humanPractices: {
      summary: "March kickoff: what human practices is, winner case studies, stakeholder map.",
      detail:
        "Early meetings covered how human practices differs from outreach, award criteria, and assigned readings. Members presented past winning projects and began country stakeholder lists (India, Nigeria, Indonesia, China, Indigenous communities of Canada). Plastic-degrading enzyme (PETase) goals framed for HP — wastewater contacts and government/agency outreach.",
      link: "/human-practices/",
    },
  },
  "week-2026-04-05": {
    humanPractices: {
      summary: "Stakeholder list growing; members sit in on other subteams.",
      detail:
        "Continuing literature review and adding contacts to the stakeholder sheet. Members attending wet lab, dry lab, hardware, and venture meetings so interviews stay grounded in project needs.",
      link: "/human-practices/",
    },
  },
  "week-2026-04-12": {
    humanPractices: {
      summary: "Building the stakeholder contact list.",
      detail:
        "Country-assigned stakeholder research continues; preparing tailored outreach emails ahead of the May interview campaign.",
      link: "/human-practices/",
    },
  },
  "week-2026-04-19": {
    humanPractices: {
      summary: "Stakeholder prep and subteam sync.",
      detail:
        "Quiet documentation week — expanding the contact sheet and liaison notes that feed May email templates and interview guides.",
      link: "/human-practices/",
    },
  },
  "week-2026-04-26": {
    humanPractices: {
      summary: "Pre-May outreach and conference speaker search.",
      detail:
        "Finalizing stakeholder categories and email templates. Microplastics conference planning begins in parallel (venues and seminar/panel speakers).",
      link: "/human-practices/",
    },
  },
  "week-2026-05-03": {
    milestones: [
      { date: "2026-05-09", label: "Team social with Trash Team", subteamId: "humanPractices" },
    ],
    humanPractices: {
      summary: "Accepted to Synbio conference; start stakeholder emails.",
      detail:
        "Accepted for a poster at Synbio (a synthetic biology conference at Waterloo, Jun 15–17). Email templates for stakeholder outreach; about ten tailored emails per member. Opened the search for microplastics-conference keynote and seminar speakers.",
      link: "/human-practices/",
    },
  },
  "week-2026-05-10": {
    humanPractices: {
      summary: "First-wave stakeholder emails and interview scheduling.",
      detail:
        "Members send tailored outreach; formal interviews wait until the interview guide lands next meeting. Synbio registration (Waterloo, Jun 15–17) and conference venue search continue.",
      link: "/human-practices/",
    },
  },
  "week-2026-05-17": {
    milestones: [
      { date: "2026-05-21", label: "Stakeholder interview process locked", subteamId: "humanPractices" },
    ],
    humanPractices: {
      summary: "Interview guide ready; three season reports defined.",
      detail:
        "Interview workflow: background research → tailored questions → follow-up. Season deliverables set — a regulatory framework report, a sustainability report, and a socioeconomic report — toward a global deployment framing. Conference venue search (on- and off-campus). Wet/dry/hardware liaison updates continue.",
      link: "/human-practices/",
    },
  },
  "week-2026-05-24": {
    milestones: [
      { date: "2026-05-28", label: "Stakeholder follow-ups and conference venues", subteamId: "humanPractices" },
    ],
    humanPractices: {
      summary: "Low email response rate; push follow-ups and venues.",
      detail:
        "Hardware and dry-lab liaison briefings. Roughly one in ten outreach emails answered — push tailored questions and share booked interview links with the team. Conference venues added to the shared sheet.",
      link: "/human-practices/",
    },
  },
  "week-2026-05-31": {
    humanPractices: {
      summary: "Ethics framing; stakeholder guide and pitch deck shared.",
      detail:
        "Discussed biosafety, environmental safety, regulation, public perception, and open science for enzyme use in wastewater treatment. Shared a stakeholder guide and short interview pitch deck. Continue emails or prep for booked interviews; ethics contacts added to the sheet.",
      link: "/human-practices/",
    },
  },
  "week-2026-06-07": {
    milestones: [
      {
        date: "2026-06-11",
        label: "Launch three policy and impact reports",
        subteamId: "humanPractices",
      },
    ],
    humanPractices: {
      summary: "Three written reports launched — regulation, society, sustainability.",
      detail:
        "New workstreams: regulatory frameworks, socioeconomic analysis, and sustainability (short report / infographic style). Stakeholder notes cleaned for the shared folder; sheet tracks email, response, and interview status. Policy contacts requested.",
      link: "/human-practices/",
    },
  },
  "week-2026-06-14": {
    milestones: [
      { date: "2026-06-15", label: "Synbio poster presentation (Waterloo)", subteamId: "humanPractices" },
      { date: "2026-06-17", label: "Synbio conference ends", subteamId: "humanPractices" },
    ],
    humanPractices: {
      summary: "Report owners assigned; Synbio poster at Waterloo.",
      detail:
        "Synbio is a synthetic biology conference (Jun 15–17, Waterloo). Report owners assigned for regulatory, socioeconomic, and sustainability drafts. Outlines become 1–2 page drafts that fold in stakeholder feedback.",
      link: "/human-practices/",
    },
  },
  "week-2026-06-21": {
    humanPractices: {
      summary: "Annotated sources for reports; Bioethics Symposium announced.",
      detail:
        "Add 2–3 reference links per outline point. Virtual Bioethics Symposium Jul 12 (2–4pm EST) — a 10–15 minute ethics presentation plus Q&A. Continue stakeholder emails; liaisons list preferred stakeholder types and questions.",
      link: "/human-practices/",
    },
  },
  "week-2026-06-28": {
    milestones: [
      { date: "2026-07-02", label: "Human Practices weekly meeting", subteamId: "humanPractices" },
    ],
    humanPractices: {
      summary: "Symposium prep and report outlines.",
      detail:
        "Weekly meeting Jul 2. Continuing annotated bibliographies, report outlines, and Bioethics Symposium slides ahead of Jul 12.",
      link: "/human-practices/",
    },
  },
  "week-2026-07-05": {
    humanPractices: {
      summary: "Bioethics Symposium prep week.",
      detail:
        "Finalize slides on the four bioethics pillars (beneficence, non-maleficence, justice, autonomy) for enzyme-based wastewater remediation. Report drafts continue in parallel.",
      link: "/human-practices/",
    },
  },
  "week-2026-07-12": {
    milestones: [
      { date: "2026-07-12", label: "Bioethics Symposium (virtual)", subteamId: "humanPractices" },
    ],
    humanPractices: {
      summary: "Bioethics Symposium — present project ethics.",
      detail:
        "Virtual symposium Jul 12: team presents ethical principles behind enzymatic microplastic cleanup and discusses fair access, scale-up, and industry design changes.",
      link: "/human-practices/",
    },
  },
  "week-2026-07-19": {
    milestones: [
      {
        date: "2026-07-23",
        label: "Stakeholder feedback on website and reports",
        subteamId: "humanPractices",
      },
    ],
    humanPractices: {
      summary: "Symposium reflection; feedback on PETadex site and reports.",
      detail:
        "Two kinds of stakeholder meetings going forward: feedback on PETadex (our public enzyme database / website) and feedback on the regulatory, socioeconomic, and sustainability reports. Follow up with PETase scientists met earlier; choose final report formats and start rough drafts.",
      link: "/human-practices/",
    },
  },
  "week-2026-07-26": {
    humanPractices: {
      summary: "Report drafts and PETadex follow-ups.",
      detail:
        "Rough drafts in chosen formats; email prior scientific contacts to meet about the PETadex website. Microplastics conference speaker work continues with outreach.",
      link: "/human-practices/",
    },
  },
  "week-2026-09-06": {
    humanPractices: {
      summary: "Conference approach — narrative and speakers.",
      detail:
        "Finalize how regulatory, socioeconomic, and sustainability findings feed the Sep 19 microplastics conference and the wiki human-practices narrative.",
      link: "/human-practices/",
    },
  },
  "week-2026-09-13": {
    milestones: [
      { date: "2026-09-19", label: "Microplastics conference", subteamId: "humanPractices" },
    ],
    humanPractices: {
      summary: "Microplastics conference (Sep 19).",
      detail:
        "Public conference programming with outreach — capture stakeholder quotes and design-change evidence for Integrated Human Practices.",
      link: "/human-practices/",
    },
  },
  "week-2026-10-18": {
    humanPractices: {
      summary: "Jamboree wrap and reflections.",
      detail:
        "Archive interview notes and report drafts; schedule post-competition reflection interviews for the wiki narrative.",
      link: "/human-practices/",
    },
  },
}

function quietPlaceholderFor(subteamId) {
  const track = SUBTEAM_BY_ID[subteamId]
  const label = track?.label || "team"
  return {
    summary: "Slow week",
    detail: `Quiet week for ${label} — continuing work from previous sessions.`,
    link: track?.href || "/",
  }
}

function applyOutreachWeekPatch(week) {
  const patch = OUTREACH_WEEK_PATCHES[week.id]
  if (!patch) return week

  const milestones = [...(week.milestones || [])]
  for (const milestone of patch.milestones || []) {
    const exists = milestones.some(
      (m) => m.date === milestone.date && m.label === milestone.label && m.subteamId === milestone.subteamId
    )
    if (!exists) milestones.push(milestone)
  }

  return {
    ...week,
    milestones,
    subteams: {
      ...week.subteams,
      outreach: { ...patch.outreach },
    },
  }
}

function applyHumanPracticesWeekPatch(week) {
  const patch = HUMAN_PRACTICES_WEEK_PATCHES[week.id]
  if (!patch) return week

  const milestones = [...(week.milestones || [])]
  for (const milestone of patch.milestones || []) {
    const exists = milestones.some(
      (m) => m.date === milestone.date && m.label === milestone.label && m.subteamId === milestone.subteamId
    )
    if (!exists) milestones.push(milestone)
  }

  return {
    ...week,
    milestones,
    subteams: {
      ...week.subteams,
      humanPractices: { ...patch.humanPractices },
    },
  }
}

/** Replace "Progress update coming soon." on past weeks for every subteam. */
function applyPastWeekQuietPlaceholders(week) {
  if (week.start >= PAST_WEEK_QUIET_BEFORE) return week

  let changed = false
  const subteams = { ...week.subteams }
  for (const id of SUBTEAM_IDS) {
    if (subteams[id]?.summary === "Progress update coming soon.") {
      subteams[id] = quietPlaceholderFor(id)
      changed = true
    }
  }
  return changed ? { ...week, subteams } : week
}

function mergeWeek(skeleton, override = {}) {
  const subteams = { ...defaultSubteams(), ...(override.subteams || {}) }
  return {
    ...skeleton,
    overview:
      override.overview ||
      "Team progress for this week will be updated soon. Use subteam filters below when detailed entries are available.",
    milestones: override.milestones || [],
    subteams,
  }
}

/** @type {ContributionWeek[]} */
export const CONTRIBUTION_WEEKS = buildWeekSkeleton()
  .map((sk) => mergeWeek(sk, WEEK_CONTENT_OVERRIDES[sk.id]))
  .map(applyOutreachWeekPatch)
  .map(applyHumanPracticesWeekPatch)
  .map(applyPastWeekQuietPlaceholders)

/** @type {Record<string, ContributionWeek>} */
export const CONTRIBUTION_WEEK_BY_ID = Object.fromEntries(
  CONTRIBUTION_WEEKS.map((w) => [w.id, w])
)

export function getDefaultWeekId() {
  return CONTRIBUTION_WEEKS[0]?.id ?? null
}

export function parseWeekHash(hash) {
  const raw = (hash || "").replace(/^#/, "")
  if (!raw.startsWith("week-")) return null
  return CONTRIBUTION_WEEK_BY_ID[raw] ? raw : null
}
