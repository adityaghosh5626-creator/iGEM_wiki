/**
 * The bioreactor prototype photo in the Hardware Notebook. Each part is
 * outlined in the photo's own px (546 × 550) and belongs to a subsystem (ids
 * from HARDWARE_SUBSYSTEMS); its label sits at `label`, its left edge there,
 * or its right edge with `align: "right"`. What it does opens under the
 * label, or over it with `tip: "up"` (low on the photo, it always does).
 */
export const HARDWARE_MAP = {
  src: "https://static.igem.wiki/teams/6187/wiki/hardware-notebook/screenshot-2026-10-19-at-8-56-26-am.avif",
  size: [546, 550],
  alt: "The bioreactor prototype on a desk: a tablet, the blue vessel holder over a breadboard, a power module, the stirring fan box with a heater plate on top, and a pump, all wired together.",
  parts: [
    {
      subsystem: "data",
      // Round the vessel in front of it, clear of its glow.
      points: [[102, 0], [327, 0], [327, 141], [321, 147], [300, 147], [300, 138], [293, 128], [276, 124], [250, 124], [231, 128], [222, 138], [222, 147], [108, 147], [102, 141]],
      label: [112, 14],
    },
    {
      subsystem: "cad",
      points: [[227, 145], [234, 137], [250, 132], [275, 132], [290, 137], [295, 146], [295, 195], [227, 195]],
      label: [221, 160],
      align: "right",
    },
    {
      subsystem: "power",
      points: [[231, 195], [312, 195], [312, 301], [231, 301]],
      label: [318, 266],
    },
    {
      subsystem: "power",
      points: [[0, 270], [33, 272], [38, 279], [44, 280], [57, 276], [70, 274], [84, 290], [70, 319], [42, 317], [42, 300], [34, 298], [0, 297]],
      label: [4, 248],
      tip: "up",
    },
    {
      subsystem: "stirring",
      points: [[97, 395], [112, 397], [158, 415], [165, 440], [166, 470], [150, 500], [123, 520], [105, 516], [70, 495], [48, 460], [50, 447], [60, 440], [88, 410]],
      label: [174, 476],
    },
    // The heater plate on the stirring box: after it, so it's on top.
    {
      subsystem: "temperature",
      points: [[89, 412], [136, 430], [115, 461], [65, 444]],
      label: [28, 372],
    },
    {
      subsystem: "pumps",
      points: [[428, 397], [446, 388], [450, 376], [503, 368], [506, 343], [520, 345], [546, 357], [546, 436], [535, 438], [528, 424], [470, 428], [452, 423], [447, 412], [428, 407]],
      label: [540, 318],
      align: "right",
      tip: "up",
    },
  ],
}

/** Each subsystem's colour on the photo and what it does, for its tooltip. */
export const HARDWARE_MAP_SUBSYSTEMS = {
  data: {
    colour: "#3d9df2",
    about: "Sends data from the bioreactor to our software, and controls from the software back, through an easy-to-use interface.",
  },
  cad: {
    colour: "#9b6bff",
    about: "The 3D-printed holder for the culture vial, with ports in its lid for tubing and sensors.",
  },
  power: {
    colour: "#f5a300",
    about: "Powers every component, including the 5 W heater and the 2.5 W pumps, from a power module shared with the Arduino.",
  },
  temperature: {
    colour: "#f2552c",
    about: "Heats the culture above room temperature and holds it there, so microorganisms that need the warmth can thrive.",
  },
  stirring: {
    colour: "#e8509b",
    about: "A low-cost brushless fan with magnets on its hub spins a magnetic stir bar inside the vial.",
  },
  pumps: {
    colour: "#1bb39a",
    about: "Peristaltic pumps that dose liquid into and out of the bioreactor, at different speeds for different volumes.",
  },
}
