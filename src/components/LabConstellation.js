import React, { useEffect, useRef } from "react"
import styled, { keyframes } from "styled-components"
import { phone as phoneMedia } from "./artScale.js"

/**
 * The lab's Dry Lab story (HomeScrollPrototype's section 4), played through
 * two holds where the lab stops scrolling (`holdRef.current` = { h1, h2 },
 * how far through each the reader is, 0–1).
 *
 * The window is the PETadex as a night sky. Through the first hold each
 * cluster is highlighted in turn while stars are picked off it (WindowSky).
 * Then the big blue cluster's stars come off the window and ride down with
 * the reader (LabConstellation); through the second hold the lines between
 * them are drawn, and they fly together into the enzyme's shape, which takes
 * over from there.
 *
 * Points are plate px on the lab's 1004×4000 plate.
 */

const clamp01 = v => Math.max(0, Math.min(1, v))
const ease = t => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t

/** The window on the lab wall: [x0, y0, x1, y1]. */
export const LAB_WINDOW = [115, 313, 882, 868]

/** A ring of points, each joined to the next (and the last to the first). */
const ring = n => Array.from({ length: n }, (_, i) => [i, (i + 1) % n])

/**
 * The big blue cluster's constellation, the one that comes off the window:
 * twelve stars round its edge and four inside (traced off umap-data), in the
 * same order as the enzyme's (ENZYME_POINTS), so each flies to its own spot.
 */
const BLUE_CENTRE = [558, 698.2]
const BLUE_POINTS = [
  [558, 655.7], [599.4, 626.9], [617.4, 663.8], [597.6, 698], [594, 719.6],
  [598.5, 769.1], [558, 755.6], [534.6, 738.5], [517.5, 721.4], [501.3, 698],
  [494.1, 661.1], [527.4, 644], [532.5, 683.4], [574.6, 669.7], [572.4, 706.8],
  [548.7, 714.3],
]
/** Its lines: round the edge, then across it. */
const BLUE_EDGES = [
  ...ring(12),
  [10, 12], [12, 13], [13, 2], [13, 14], [14, 4], [14, 15], [15, 7], [12, 15],
]

/**
 * The clusters, in the order they're highlighted (the big blue one first):
 * the stars picked off each, and the glow round it, [cx, cy, rx, ry].
 */
const CLUSTERS = [
  { points: BLUE_POINTS, glow: [556, 706, 84, 102], blue: true },
  { points: [[277.5, 693.5], [283.5, 707], [259.5, 701.8]], glow: [280, 700, 50, 38] },
  { points: [[295.7, 549.6], [315.2, 572.1], [295.7, 593.8], [276.9, 581.1], [271.7, 560.8]], glow: [280, 572, 62, 50] },
  { points: [[412.6, 369.1], [436.6, 393.1], [414.8, 420.9], [381.1, 411.9], [380.3, 375.9]], glow: [411, 396, 62, 62] },
  { points: [[524.6, 439.6]], glow: [525, 440, 22, 22] },
  { points: [[625.4, 375.7], [637.4, 408], [613.4, 414.7], [602.1, 397.5]], glow: [613, 397, 48, 50] },
  { points: [[311.4, 798.1], [334.9, 796]], glow: [323, 796, 38, 24] },
  { points: [[656.4, 804.4], [657.1, 826.9], [630.1, 825.4]], glow: [655, 821, 46, 36] },
]

/** The enzyme's painted box (109×125) and the stars' spots round its outline. */
const BOX_W = 109
const BOX_H = 125
const ENZYME_POINTS = [
  [0.495, 0.064], [0.752, 0.064], [0.826, 0.288], [0.982, 0.448],
  [0.881, 0.64], [0.706, 0.768], [0.495, 0.88], [0.257, 0.808],
  [0.11, 0.648], [0.028, 0.448], [0.119, 0.256], [0.266, 0.096],
  [0.3, 0.36], [0.62, 0.3], [0.72, 0.52], [0.5, 0.62],
].map(([u, v]) => [u * BOX_W, v * BOX_H])

/**
 * The first hold (shares of it): the clusters take their turns across
 * SCAN, each highlighted while its stars are picked one after another.
 */
const SCAN = [0.05, 0.88]
/** A highlight's fade in and out, as shares of its cluster's turn. */
const GLOW_EDGE = 0.25
/**
 * The second hold: the lines are drawn (DRAW), then the stars fly into the
 * enzyme's shape one after another (each taking ASSEMBLE_EACH), then fade as
 * the enzyme fades in over them (HomeScrollPrototype's LAB_HANDOFF).
 */
const DRAW = [0.06, 0.3]
const ASSEMBLE_FROM = 0.46
const ASSEMBLE_STAGGER = 0.01
const ASSEMBLE_EACH = 0.28
const CONSTELLATION_OUT = [0.84, 0.92]
/**
 * Phones hold the lab in one place for both holds, so the constellation's
 * ride down from the window to under it runs through this share of the second.
 */
const PHONE_RIDE = [0.02, 0.2]

/** `count` moments spread evenly across [from, to]; the i-th. */
const spread = ([from, to], count, i) =>
  count <= 1 ? from : from + ((to - from) * i) / (count - 1)

/** Star ink: pale in the night sky, navy on the pale wall. */
const SKY_INK = [255, 251, 232]
const WALL_INK = [29, 42, 92]

/** A four-pointed star, about 2 units across, centred on 0,0. */
const STAR_PATH =
  "M0,-1 L0.22,-0.22 L1,0 L0.22,0.22 L0,1 L-0.22,0.22 L-1,0 L-0.22,-0.22Z"

/** Each cluster's turn in the scan, [start, end] of the first hold. */
const TURN = (SCAN[1] - SCAN[0]) / CLUSTERS.length
const TURNS = CLUSTERS.map((_, k) => [SCAN[0] + k * TURN, SCAN[0] + (k + 1) * TURN])
/** Every star picked in the window, and when (picked within its cluster's turn). */
const SKY_STARS = CLUSTERS.flatMap((c, k) =>
  c.points.map((p, i) => ({
    p,
    blue: c.blue,
    at: TURNS[k][0] + TURN * (0.15 + (0.7 * (i + 0.5)) / c.points.length),
  })),
)

const stillPlease = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

/** Runs `update` on every scroll frame while `ref` is near the screen. */
function useScrollFrames(ref, update) {
  const updateRef = useRef(update)
  updateRef.current = update
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let raf = 0
    const run = () => {
      raf = 0
      updateRef.current()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(run)
    }
    let listening = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === listening) return
        listening = entry.isIntersecting
        if (listening) {
          window.addEventListener("scroll", onScroll, { passive: true })
          window.addEventListener("resize", onScroll, { passive: true })
        } else {
          window.removeEventListener("scroll", onScroll)
          window.removeEventListener("resize", onScroll)
        }
        run()
      },
      { rootMargin: "100% 0px" },
    )
    io.observe(el)
    run()
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [ref])
}

/**
 * Over the window: through the first hold each cluster is highlighted in
 * turn (a soft glow and a dashed ring round it) while its stars are picked (a
 * ring closes in on each as it pops). The blue cluster's stars are handed to
 * LabConstellation once the hold's done.
 */
export function WindowSky({ className, style, holdRef }) {
  const rootRef = useRef(null)
  const starRefs = useRef([])
  const glowRefs = useRef([])
  const blueRef = useRef(null)

  useScrollFrames(rootRef, () => {
    const { h1 = 0 } = holdRef?.current || {}
    SKY_STARS.forEach((star, i) => {
      const el = starRefs.current[i]
      if (!el) return
      const on = h1 >= star.at
      if (on !== el.hasAttribute("data-picked")) {
        if (on) el.setAttribute("data-picked", "")
        else el.removeAttribute("data-picked")
      }
    })
    TURNS.forEach(([from, to], k) => {
      const el = glowRefs.current[k]
      if (!el) return
      const edge = TURN * GLOW_EDGE
      const lit = Math.min(clamp01((h1 - from) / edge), clamp01((to - h1) / edge))
      el.style.opacity = String(lit)
    })
    // Off they come (LabConstellation draws them from here on).
    if (blueRef.current) {
      blueRef.current.style.visibility = h1 >= 0.999 ? "hidden" : "visible"
    }
  })

  const [x0, y0, x1, y1] = LAB_WINDOW
  const star = i => (
    <g
      key={i}
      ref={el => {
        starRefs.current[i] = el
      }}
      transform={`translate(${SKY_STARS[i].p[0]} ${SKY_STARS[i].p[1]})`}
    >
      <PickRing r="9" />
      <g transform="scale(4.2)">
        <SkyStar d={STAR_PATH} />
      </g>
    </g>
  )
  const stars = SKY_STARS.map((_, i) => i)
  return (
    <Sky ref={rootRef} className={className} style={style} aria-hidden="true">
      <svg viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} preserveAspectRatio="none">
        <defs>
          <radialGradient id="lab-cluster-glow">
            <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#fff6d8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#fff6d8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {CLUSTERS.map((c, k) => {
          const [cx, cy, rx, ry] = c.glow
          return (
            <g
              key={k}
              ref={el => {
                glowRefs.current[k] = el
              }}
              style={{ opacity: 0 }}
            >
              <ellipse cx={cx} cy={cy} rx={rx * 1.35} ry={ry * 1.35} fill="url(#lab-cluster-glow)" />
              <SelectRing cx={cx} cy={cy} rx={rx} ry={ry} />
            </g>
          )
        })}
        {stars.filter(i => !SKY_STARS[i].blue).map(star)}
        <g ref={blueRef}>{stars.filter(i => SKY_STARS[i].blue).map(star)}</g>
      </svg>
    </Sky>
  )
}

/** Each blue star's start, in the riding box's units (1 = 1 plate px), its middle on the cluster's. */
const RIDE_START = BLUE_POINTS.map(([x, y]) => [
  x - BLUE_CENTRE[0] + BOX_W / 2,
  y - BLUE_CENTRE[1] + BOX_H / 2,
])

/**
 * The blue cluster's constellation off the window. Its lane (`className`
 * places it: the enzyme's left and width, from the cluster's middle to where
 * the lab holds the second time) is ridden at the window's middle, like the
 * enzyme: same size, so the enzyme takes over in place. It starts `dx` plate
 * px across from its lane (where the cluster is; `phoneDx` on phones) and
 * slides over as it rides, growing to `big` times the enzyme's size (`phoneBig`
 * on phones) so it reads beside the story's lines; through the second hold
 * its lines are drawn and its stars fly into the enzyme's shape (the enzyme
 * takes over at that size and shrinks back once the reader scrolls on).
 * On phones its lane is just its spot under the window, `phoneDy` plate px
 * below the cluster, and it rides there through PHONE_RIDE of the second hold.
 */
export function LabConstellation({
  className,
  holdRef,
  dx = 0,
  phoneDx = 0,
  phoneDy = 0,
  big = 1,
  phoneBig = 1,
}) {
  const laneRef = useRef(null)
  const stickRef = useRef(null)
  const bodyRef = useRef(null)
  const starRefs = useRef([])
  const lineRefs = useRef([])

  useScrollFrames(laneRef, () => {
    const lane = laneRef.current
    const stick = stickRef.current
    const body = bodyRef.current
    if (!lane || !stick || !body) return
    const { h1 = 0, h2 = 0 } = holdRef?.current || {}
    const vh = window.innerHeight
    const r = lane.getBoundingClientRect()
    const k = r.width / BOX_W
    const onPhone = window.matchMedia?.(phoneMedia.replace("@media ", ""))?.matches
    // How far it's ridden, from the cluster to the second hold.
    const run = Math.max(1, r.height - stick.offsetHeight)
    const t = onPhone
      ? ease(clamp01((h2 - PHONE_RIDE[0]) / (PHONE_RIDE[1] - PHONE_RIDE[0])))
      : ease(clamp01((vh * 0.5 - r.top) / run))
    const across = (onPhone ? phoneDx : dx) * (1 - t)
    const down = onPhone ? -phoneDy * (1 - t) : 0
    const grown = 1 + ((onPhone ? phoneBig : big) - 1) * t
    // Stars grow less than the shape, so they stay small beside its lines.
    const starK = 1 / Math.sqrt(grown)
    const out = clamp01(
      (h2 - CONSTELLATION_OUT[0]) / (CONSTELLATION_OUT[1] - CONSTELLATION_OUT[0]),
    )
    body.style.visibility = h1 >= 0.999 && out < 1 ? "visible" : "hidden"
    body.style.opacity = String(1 - out)
    body.style.transform = `translate(${((across / BOX_W) * 100).toFixed(2)}%, ${((down / BOX_H) * 100).toFixed(2)}%) scale(${grown.toFixed(4)})`

    // Pale while it's still over the night sky, navy once it's on the wall.
    const b = body.getBoundingClientRect()
    const laneRow = BLUE_CENTRE[1] + (onPhone ? phoneDy : 0)
    const windowBottom = r.top + (LAB_WINDOW[3] - laneRow) * k
    const sky = clamp01((windowBottom - (b.top + b.height / 2)) / (60 * k) + 0.5)
    const ink = SKY_INK.map((c, i) => Math.round(lerp(WALL_INK[i], c, sky)))
    body.style.setProperty("--ink", `rgb(${ink.join(", ")})`)
    body.style.setProperty(
      "--halo",
      sky > 0.5 ? "rgba(255, 244, 190, 0.9)" : "rgba(255, 255, 255, 0.95)",
    )

    const at = RIDE_START.map(([x, y], i) => {
      const m = ease(
        clamp01((h2 - ASSEMBLE_FROM - i * ASSEMBLE_STAGGER) / ASSEMBLE_EACH),
      )
      return [lerp(x, ENZYME_POINTS[i][0], m), lerp(y, ENZYME_POINTS[i][1], m)]
    })
    at.forEach(([x, y], i) => {
      starRefs.current[i]?.setAttribute(
        "transform",
        `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${starK.toFixed(3)})`,
      )
    })
    const still = stillPlease()
    BLUE_EDGES.forEach(([a, b], i) => {
      const el = lineRefs.current[i]
      if (!el) return
      // One after another, round the edge then across, through DRAW.
      const span = (DRAW[1] - DRAW[0]) / BLUE_EDGES.length
      const drawn = still
        ? Number(h2 >= DRAW[0])
        : clamp01((h2 - DRAW[0] - i * span) / span)
      el.style.strokeDashoffset = String(1 - drawn)
      el.setAttribute("x1", at[a][0].toFixed(2))
      el.setAttribute("y1", at[a][1].toFixed(2))
      el.setAttribute("x2", at[b][0].toFixed(2))
      el.setAttribute("y2", at[b][1].toFixed(2))
    })
  })

  return (
    <Lane ref={laneRef} className={className} aria-hidden="true">
      <Stick ref={stickRef}>
        <Body ref={bodyRef}>
          <svg viewBox={`0 0 ${BOX_W} ${BOX_H}`} overflow="visible">
            {BLUE_EDGES.map((_, i) => (
              <RideLine
                key={i}
                ref={el => {
                  lineRefs.current[i] = el
                }}
                pathLength="1"
              />
            ))}
            {BLUE_POINTS.map((_, i) => (
              <g
                key={i}
                ref={el => {
                  starRefs.current[i] = el
                }}
              >
                <g transform="scale(4.2)">
                  <RideStar d={STAR_PATH} />
                </g>
              </g>
            ))}
          </svg>
        </Body>
      </Stick>
    </Lane>
  )
}

export default LabConstellation

const pickPop = keyframes`
  0% { transform: scale(0); }
  60% { transform: scale(1.5); }
  100% { transform: scale(1); }
`

const pickRing = keyframes`
  0% { opacity: 0; transform: scale(2.2); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: scale(0.6); }
`

const Sky = styled.div`
  position: absolute;
  pointer-events: none;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
`

/** The dashed ring round the cluster being highlighted. */
const SelectRing = styled.ellipse`
  fill: none;
  stroke: rgba(255, 246, 216, 0.85);
  stroke-width: 1;
  stroke-dasharray: 5 4;
  vector-effect: non-scaling-stroke;
`

/** Closes in on a star as it's picked. */
const PickRing = styled.circle`
  fill: none;
  stroke: rgba(255, 246, 200, 0.95);
  stroke-width: 1.2;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;

  [data-picked] > & {
    animation: ${pickRing} 0.7s ease-out both;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-picked] > & {
      animation: none;
    }
  }
`

/** Hidden until picked, then pops. */
const SkyStar = styled.path`
  fill: #fffbe8;
  filter: drop-shadow(0 0 1.5px rgba(255, 244, 190, 0.95));
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0);

  [data-picked] > g > & {
    transform: scale(1);
    animation: ${pickPop} 0.45s ease-out both;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-picked] > g > & {
      animation: none;
    }
  }
`

const Lane = styled.div`
  position: absolute;
  pointer-events: none;
`

/**
 * The enzyme's size and place in its lane (Section4EnzymeFollow), so they
 * line up. Phones: at the lane's top, where the lab holds still.
 */
const Stick = styled.div`
  position: sticky;
  top: 50vh;
  aspect-ratio: ${BOX_W} / ${BOX_H};
  transform: translate3d(0, -50%, 0);

  ${phoneMedia} {
    position: relative;
    top: 0;
  }
`

const Body = styled.div`
  position: absolute;
  inset: 0;
  visibility: hidden;
  will-change: transform, opacity;

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
`

const RideLine = styled.line`
  stroke: var(--ink, #fffbe8);
  stroke-opacity: 0.6;
  stroke-width: 0.8;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
`

const RideStar = styled.path`
  fill: var(--ink, #fffbe8);
  filter: drop-shadow(0 0 1.5px var(--halo, rgba(255, 244, 190, 0.9)));
`
