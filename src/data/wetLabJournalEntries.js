/**
 * Wet Lab notebook entries (same shape as the Hardware journal's: see
 * hardwareJournalEntries.js), newest first. Compiled from the Wet Lab meeting
 * slides, the experiment schedule, the assay design documents and the
 * subteam's Discord channels.
 *
 * @typedef {import('./hardwareJournalEntries.js').HardwareJournalEntry} WetLabJournalEntry
 */

const WL_IMG = (path) => `https://static.igem.wiki/teams/6187/wiki/wetlab/journal/${path}`

/** @type {WetLabJournalEntry[]} */
const WET_LAB_JOURNAL_ENTRIES_RAW = [
  {
    id: "2026-03-19",
    date: "2026-03-19",
    label: "Mar 19",
    goal: "Debrief the first two brainstorming sessions and narrow down assay ideas.",
    workCompleted:
      "Reviewed ideas from brainstorms 1 and 2: flow-cytometry droplets with a dye–quencher PET linker, clip-chemistry and SpyTag binding, fluorescein conjugation, and magnetic sorting. Presented the two front-runners at Meeting #2: surface collection (biotinylated PET bound by streptavidin, released by PETase onto a nickel-resin collection surface via a His tag) and a dropout assay (amino acids melted into PET, released by PETase to rescue auxotrophic cells).",
    result:
      "Surface collection and the dropout assay carried forward as the main concepts, with internal controls planned (catalytically dead, low- and high-activity PETases).",
    nextStep:
      "Research existing assays for overlap, continue safety training, join the team Benchling project, and hold the next brainstorm on March 29.",
  },
  {
    id: "2026-05-07",
    date: "2026-05-07",
    label: "May 7",
    goal: "Restart weekly Wet Lab meetings for the summer and split into assay subgroups.",
    workCompleted:
      "Moved meetings to Thursdays 6–7 PM after exams. Introduced a team task tracker and lead office hours, confirmed access to the BME teaching lab alongside BioZone, and updated the assay ideas.",
    result:
      "Members assigned themselves to three assay subgroups; volunteers picked up the open research questions for the next meeting.",
    nextStep: "Finish assay research and start the safety paperwork needed for the BME lab.",
  },
  {
    id: "2026-05-25",
    date: "2026-05-25",
    label: "May 25",
    goal: "Lock in the organism and get members cleared for the BME teaching lab.",
    workCompleted:
      "Ran the mandatory BME lab tour, made Wet Lab meetings in-person, opened an absence channel, and started the assay design master document (questions on copper-responsive promoters such as copAP and pCusC, and on loading copper into PET).",
    result:
      "Bacteria (E. coli) confirmed as the working organism; assay plans rewritten accordingly. Copper phthalate (rather than copper sulfate) chosen as the way to load copper into PET.",
    nextStep: "Complete EHS courses and the CHE summer training, and send the assay plans for expert review.",
  },
  {
    id: "2026-06-03",
    date: "2026-06-03",
    label: "Jun 3",
    goal: "First days in the lab: set up reagents and basic media.",
    workCompleted:
      "Picked up the first reagent orders, organized and labelled them in the BME lab, and introduced lab-note taking. Prepared LB broth and LB agar, autoclaved at the Donnelly Centre and poured plates. Assay plans went to Jonas for review; RRF templates went out to all members.",
    result:
      "Lab space and media ready. Expert review of the assay plans came back positive, with a suggestion to try copper phthalate melted directly into PET as a substrate variant.",
    nextStep: "Finish RRFs by June 9 and schedule competent-cell prep and transformations.",
  },
  {
    id: "2026-06-11",
    date: "2026-06-11",
    label: "Jun 11",
    goal: "Make competent cells and settle the Selection assay design.",
    workCompleted:
      "Picked up cells from Thomas, grew liquid cultures and prepared Mix&Go and BL21 competent cells (OD600 read in flat 96-well plates). The Selection subgroup met to compare trimethoprim (TMP) vs sulfonamide selection, dfrA1 vs dfrB10 markers, inducer and promoter options, media and controls.",
    result:
      "First batch of competent cells made. Selection design questions laid out, with the biggest open risk identified before cloning.",
    nextStep: "Run the first full week of transformations and minipreps.",
  },
  {
    id: "2026-06-15",
    date: "2026-06-15",
    label: "Jun 15",
    goal: "Run the first full lab week: transformations, minipreps and glycerol stocks.",
    workCompleted:
      "Inoculated SOB with DH5α, made DH5α competent cells, transformed BL21 with pUC19 and DH5α with distribution-kit plasmids, made liquid cultures, minipreps and glycerol stocks, and poured chloramphenicol, kanamycin and ampicillin plates. All members are now BME trained.",
    result:
      "Transformation workflow running Monday to Friday. The first plasmid design was finalized and its insert is ready to order.",
    nextStep: "Check miniprep yields with the NanoDrop and send good samples for sequencing.",
  },
  {
    id: "2026-06-22",
    date: "2026-06-22",
    label: "Jun 22",
    goal: "Troubleshoot BL21 minipreps and transform the new NEB DH5α cells.",
    workCompleted:
      "Restreaked BL21 from glycerol stock, redid BL21 minipreps and NanoDrop readings, transformed NEB DH5α with distribution plasmids and grew 5 mL cultures. Set a rule that nothing stays in the incubators over the weekend after mould appeared on a plate.",
    result:
      "BL21 gave poor miniprep yields; switching to larger cultures or Terrific Broth (TB) and doubling lysis buffers was suggested. Selection-assay plasmids finalized with both sulfonamide and TMP resistance markers.",
    nextStep: "Hold the cloning strategy meeting and place DNA orders.",
  },
  {
    id: "2026-07-03",
    date: "2026-07-03",
    label: "Jul 3",
    goal: "Get distribution-kit plasmids into DH5α and plan cloning.",
    workCompleted:
      "Held the cloning strategy meeting and placed IDT orders. Moved DH5α competent cells to −80 °C, resuspended selected distribution plasmids and transformed DH5α (plates split between two transformations each).",
    result:
      "All transformations worked (some colonies sparse on the EcCo and pTac plates). DH5α transformations are now reliable.",
    nextStep: "Grow cultures, miniprep and sequence the distribution plasmids; write protocols for copper and dye experiments.",
  },
  {
    id: "2026-07-08",
    date: "2026-07-08",
    label: "Jul 8",
    goal: "First assay-specific protocols and the Wet Lab manifesto.",
    workCompleted:
      "Wrote protocols for loading copper into plastic and staining PETG fabric with dyes. Started expressing FAST-PETase in SHuffle T7, made Terrific Broth, and miniprepped the distribution plasmids (pDest, IsPETW, pRBS, EcCoWT, pJump26 and terminators) for sequencing. Completed the Wet Lab manifesto needed for order approvals.",
    result:
      "First round of protocols finished (copper compounds, fabric staining, concentrated PETase extraction) and the next reagent orders placed.",
    nextStep: "Make competent cells with the Zymo protocol and assemble the IDT fragments.",
  },
  {
    id: "2026-07-14",
    date: "2026-07-14",
    label: "Jul 14",
    goal: "Assemble the AS plasmid from IDT fragments.",
    workCompleted:
      "Day 1–2 of the Zymo competent cell protocol. KLD-circularized the linear IDT plasmids, PCR-amplified fragments with primers, ran Golden Gate assembly (GGA) on the PCR products and transformed the KLD and GGA products.",
    result: "KLD transformation produced colonies on the selection plate.",
    nextStep: "Pick colonies for liquid cultures and miniprep the AS plasmid.",
  },
  {
    id: "2026-07-16",
    date: "2026-07-16",
    label: "Jul 16",
    goal: "Meeting #15: review the week and team feedback.",
    workCompleted:
      "Made competent cells, performed KLD on the AS plasmid fragment, PCR'd one of the two PD fragments to add Golden Gate cut sites, transformed the AS plasmid, made its glycerol stock and miniprepped it for sequencing. Collected feedback on documentation, lab-note structure and shift instructions.",
    result:
      "AS plasmid in hand and sent for sequencing. Weekly subgroup-lead meetings started; a 'What we did' section was added to the lab notes.",
    nextStep: "Prepare for the BioZone safety interview with Prof. Lawson (review RRFs).",
  },
  {
    id: "2026-07-20",
    date: "2026-07-20",
    label: "Jul 20",
    goal: "Pass safety interviews and narrow the assay scope.",
    workCompleted:
      "Passed the first round of Lawson safety interviews (all leads and half the team). Made copper phthalate, stained fabric with copper, ran day 1–2 of BL21 competent cells, and transformed pUC19 into our own DH5α competent cells as a positive control. Received the AS plasmid sequencing.",
    result:
      "Scope sharpened to the copper-based Biosensor and Selection assays, with an August 1 checkpoint to show at least one assay is likely to work. Only the 20 mL culture's miniprep gave a full AS plasmid assembly.",
    nextStep: "Purify the AS plasmid and test copper toxicity.",
  },
  {
    id: "2026-07-27",
    date: "2026-07-27",
    label: "Jul 27",
    goal: "Purify the AS plasmid, fix minipreps and start copper tests.",
    workCompleted:
      "Glycerol-stocked and miniprepped the AS plasmid, finished BL21 competent cells, made serial-dilution OD vials for Hardware's OD sensor testing, and began copper toxicity and copper-release-from-fabric tests. Placed Twist and IDT orders. Second Lawson interview held for the rest of the team.",
    result:
      "AS plasmid purified, competent cells made, and the miniprep protocol that had been failing is now solved. Copper phthalate made (blue precipitate; IR confirmation pending).",
    nextStep: "Golden Gate the Selection and Biosensor inserts into the AS plasmid.",
    images: [
      {
        src: WL_IMG("copper-phthalate-jul30.avif"),
        alt: "Copper phthalate in a tube",
        caption: "Copper phthalate made for loading copper into PET (Jul 30).",
      },
      {
        src: WL_IMG("stained-pet-mesh-jul31.avif"),
        alt: "Stained PET mesh held with tweezers",
        caption: "Dye-stained PET mesh for the dye-release tests (Jul 31).",
      },
    ],
  },
  {
    id: "2026-08-04",
    date: "2026-08-04",
    label: "Aug 4",
    goal: "Clone the Selection and Biosensor variants of the AS plasmid.",
    workCompleted:
      "Ran GGA of the post-KLD AS plasmid with the sul1, sul2, dfr and msGFP2 inserts and transformed them into DH5α. Made Mueller Hinton plates across a range of CuSO₄ concentrations, ran copper toxicity spot plates and copper strip tests, and measured crystal violet absorbance at 590 nm after 5–40 min staining.",
    result:
      "Everyone has now passed the Lawson interview, so the whole roster can work at the bench. Undigested plasmids on a gel showed supercoiled/nicked mixtures, so gels now need digestion first.",
    nextStep: "Miniprep and sequence each AS variant; make TMP stock for the dfr plates.",
    images: [
      {
        src: WL_IMG("copper-tox-plates-aug7.avif"),
        alt: "Copper toxicity spot plates",
        caption: "Copper toxicity spot plates at different CuSO₄ concentrations (Aug 7).",
      },
    ],
  },
  {
    id: "2026-08-11",
    date: "2026-08-11",
    label: "Aug 11",
    goal: "Sequence the AS variants and test copper and dye release from PET.",
    workCompleted:
      "Miniprepped sul1, sul2, dfr and msGFP2 (mixing kit columns when one ran out) and sent them for sequencing. Ran the dye-release protocol and 24 h copper strip tests on PET mesh. Explored measuring copper sorption by comparing CuSO₄ concentration before and after adding mesh.",
    result:
      "First sequencing runs had few reads and genomic DNA contamination; sul2 and msGFP2 were usable, sul1 needed a fresh miniprep. The 5-minute stained mesh released noticeably more crystal violet than the longer stains. Copper test strips read falsely when NaOH is present, so neutralization is needed first. Four assays now in development: copper Biosensor, Selection, dye release and an in-house halo assay; a dead PETase arrived as a negative control.",
    nextStep: "Re-sequence the variants and test the Biosensor strain on copper plates.",
    images: [
      {
        src: WL_IMG("miniprep-nanodrop-aug12.avif"),
        alt: "NanoDrop readings for the AS variant minipreps",
        caption: "NanoDrop readings for the sul1, sul2, dfr and msGFP2 minipreps (Aug 12).",
      },
      {
        src: WL_IMG("copper-test-strips-aug12.avif"),
        alt: "Copper test strips",
        caption: "Copper test strips on solution exposed to copper-stained PET mesh (Aug 12).",
      },
    ],
  },
  {
    id: "2026-08-15",
    date: "2026-08-15",
    label: "Aug 15",
    goal: "Confirm the cloned AS variants by sequencing.",
    workCompleted:
      "Reviewed the new sequencing results for each AS variant and planned constant-copper and constant-sulfonamide plate series (sulfonamide 0–250 µg/mL at 4 mM copper; copper series at 32 µg/mL sulfonamide).",
    result:
      "AS-msGFP2 confirmed (a single base-pair mismatch carried over from the backbone) and AS-sul1 confirmed. AS-dfr and AS-sul2 needed to be redone.",
    nextStep: "Transform AS-msGFP2 and AS-sul1 into BL21 and test them on copper plates.",
    images: [
      {
        src: WL_IMG("selection-plates-aug14.avif"),
        alt: "Selection test plate with colonies",
        caption: "Copper + antibiotic test plate from the Selection trials (Aug 14).",
      },
    ],
  },
  {
    id: "2026-08-17",
    date: "2026-08-17",
    label: "Aug 17",
    goal: "Test the copper Biosensor and check copper leaching from PET mesh.",
    workCompleted:
      "Imaged BL21 AS-msGFP2 on kan + CuSO₄ plates under UV and blue light. Grew AS-msGFP2 with copper-stained PET mesh placed on the plates (mesh washed once, twice or three times) to test leaching. Re-sequenced AS-sul2 and AS-dfr, and set up a new GGA of AS + pCusC-RBS + dfrB10.",
    result:
      "AS-msGFP2 responds to copper as designed: the team's first validated experimental result of the summer. Colonies touching washed mesh did not glow, so washed mesh does not leach detectable copper. AS-sul2 confirmed (4 of 5 samples); all AS-dfr samples carried the same mutations and deletions, so dfr was rebuilt.",
    nextStep: "Test AS-sul1 and AS-sul2 across sulfonamide and copper concentrations.",
    images: [
      {
        src: WL_IMG("msgfp-copper-glow-aug17.avif"),
        alt: "UV light on an AS-msGFP2 plate showing a glowing spot",
        caption: "AS-msGFP2 fluorescing on a copper plate under UV light (Aug 17).",
      },
    ],
  },
  {
    id: "2026-08-24",
    date: "2026-08-24",
    label: "Aug 24",
    goal: "Collect Selection data and start the PD (display) plasmid.",
    workCompleted:
      "Photographed copper plates under blue light, tested AS-sul1 on kan + 32 µg/mL sulfonamide with varying copper and AS-sul2 on varying sulfonamide at 4 mM copper (10⁸–10² dilutions, empty AS control), glycerol-stocked and sequenced AS-empty and AS-dfr, and redid the empty PD transformation. Submitted all outstanding safety forms; Prof. Lawson signed the RRFs.",
    result:
      "AS-sul1 grows at higher sulfadiazine concentrations than the negative control: early evidence that the Selection assay works. Copper loads reliably onto the PET test plates. PD fragment 1 PCR gave a clean band.",
    nextStep: "Assemble the PD plasmid from fragments 1 and 2 and move into BioZone.",
    images: [
      {
        src: WL_IMG("msgfp-blue-light-aug24.avif"),
        alt: "Copper plates under blue light",
        caption: "Copper plates under blue light: only the Biosensor colonies glow (Aug 24).",
      },
      {
        src: WL_IMG("selection-series-aug24.avif"),
        alt: "Row of Selection test plates",
        caption: "Sulfonamide and copper plate series for AS-sul1 and AS-sul2 (Aug 24).",
      },
      {
        src: WL_IMG("pd-frag1-gel-aug28.avif"),
        alt: "Gel of PD fragment 1 PCR",
        caption: "PD fragment 1 PCR product on a gel with a 1 kb ladder (Aug 28).",
      },
    ],
  },
  {
    id: "2026-08-31",
    date: "2026-08-31",
    label: "Aug 31",
    goal: "Finish at BME and move into BioZone.",
    workCompleted:
      "PCR-cleaned PD fragment 1, ran GGA of fragments 1 and 2, and transformed the product into DH5α on amp plates. August 31 was the last regular lab day at BME; samples and reagents were logged on an inventory sheet and moved to BioZone (room 403) on dry ice.",
    result:
      "PD fragments 1 and 2 through PCR and assembly; second BioZone lab tour completed.",
    nextStep: "Wait for the BioZone RRFs to be approved before starting lab work there.",
  },
  {
    id: "2026-09-17",
    date: "2026-09-17",
    label: "Sep 17",
    goal: "Prepare for the conference and wiki while RRFs are reviewed.",
    workCompleted:
      "Attended the BioZone orientation, built the Wet Lab poster on our assays for the UofT Microplastics Conference, and drafted the Wet Lab wiki sections (due September 18).",
    result: "Poster presented at the conference on September 19; wiki drafts submitted for review.",
    nextStep: "Resume lab shifts once Environmental Health and Safety approves the RRFs.",
  },
  {
    id: "2026-09-22",
    date: "2026-09-22",
    label: "Sep 22",
    goal: "Restart lab work in BioZone and clone the control PETases.",
    workCompleted:
      "RRFs approved; lab shifts resumed on September 24. Moved samples from the Lash Miller and BME labs into BioZone, took inventory, miniprepped the PD liquid cultures, and resuspended the Twist inserts (IsPETase, FAST-PETase, LCC-PETase, M4-Q PETase and a dead IsPETase).",
    result: "Wet Lab is fully based in BioZone, with control PETase inserts ready for assembly into the PD backbone.",
    nextStep: "Golden Gate each control PETase into the PD plasmid.",
  },
  {
    id: "2026-09-30",
    date: "2026-09-30",
    label: "Sep 30",
    goal: "Assemble the control PD plasmids.",
    workCompleted:
      "Miniprepped and sequenced the PD backbone, PCR'd the PETase controls, ran GGA of the controls into PD, and prepared LB + kan + amp and MHA + kan + amp + IPTG (± sulfonamide) plates. Secured −80 °C freezer space in BioZone.",
    result:
      "The PD miniprep had high concentration and purity, and all control PD plasmids now exist. The first sequence library from Dry Lab was ordered. One KLD'd PD lost half its sequence, so a fresh PD was ordered.",
    nextStep: "Transform the AS and PD plasmids together into BL21(DE3).",
  },
  {
    id: "2026-10-05",
    date: "2026-10-05",
    label: "Oct 5",
    goal: "Combine the assay plasmid with the display plasmid in one strain.",
    workCompleted:
      "Ran GGA of the empty PD with the five control PETases, PCR-checked the products, streaked AS-msGFP and AS-sul1, and co-transformed AS + PD (AS-msGFP + PD and AS-sul1 + PD) into BL21(DE3) on kan + amp plates. Started BL21(DE3) competent cells carrying each AS plasmid for serial transformations, and made more copper-stained mesh.",
    result: "Co-transformations plated; competent cells in progress for the serial-transformation route.",
    nextStep:
      "Test the controls on assay plates, and try a quick check suggested by Thomas: incubate copper PET mesh with FAST-PETase lysate, pour it over a lawn of the GFP strain, and look for fluorescence.",
    images: [
      {
        src: WL_IMG("workflow-oct6.avif"),
        alt: "Handwritten workflow note",
        caption: "The week's workflow: GGA PETases into PD, KLD, then co-transform with AS into BL21 (Oct 6).",
      },
      {
        src: WL_IMG("transformation-plates-oct7.avif"),
        alt: "Transformation plates",
        caption: "Co-transformation plates (Oct 7).",
      },
    ],
  },
]

/** Newest first. */
export const WET_LAB_JOURNAL_ENTRIES = [...WET_LAB_JOURNAL_ENTRIES_RAW].sort((a, b) =>
  b.date.localeCompare(a.date)
)

export { WL_IMG }
