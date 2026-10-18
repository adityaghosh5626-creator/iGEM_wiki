import React from "react"
import styled, { keyframes } from "styled-components"
import { PlateImg } from "./PlateImg.js"

/**
 * The lab's Wet Lab shelf and Hardware bench, played through the lab's third
 * and fourth holds (`--lab-hold-3`, `--lab-hold-4` on the lab, 0–1; see
 * HomeScrollPrototype's SECTION4_HOLD_ROWS):
 * 3. The glassware stands on the bench from the start. The axolotl pops up
 *    from behind it as the hold starts; as the results come in (WET_RESULTS:
 *    the beaker glows, colonies grow on the plate) it turns surprised, jumps
 *    and lights up (`data-wet-stage` on the lab, set from wetStage). Then
 *    the blue beaker tips and pours (WET_POUR) down to the bioreactor.
 * 4. The bioreactor lights up (BENCH_ON) and growth curves draw on the
 *    monitor (CURVES).
 * Everything is in the lab plate's px, placed as shares of it.
 */

const PLATE = { w: 1004, h: 4000 }
const ART = "https://static.igem.wiki/teams/6187/wiki/homepage-components/"
/** The shelf before its results and after; both 946-wide, centred on the plate. */
const WET_BEFORE = `${ART}lab-stuff/wetlab.avif`
const WET_AFTER = `${ART}lab-stuff/wl-results.avif`
/** The Hardware bioreactor on its board, on the lower right shelf (946 wide too). */
const BIOREACTOR = `${ART}bioreactor-protoboard.avif`
const CANVAS_W = 946
const CANVAS_X = (PLATE.w - CANVAS_W) / 2

/**
 * The shelf art in pieces: each its box on the canvases [x0, y0, x1, y1] and
 * where it's moved to [dx, dy] (plate px), so the glassware stands on the
 * bench and the axolotl peeks over its back edge.
 */
const AXOLOTL = { box: [100, 1255, 600, 1650], at: [0, 60] }
const BEAKER = { box: [0, 1650, 242, 1889], at: [-8, -40] }
const PETRI = { box: [96, 1889, 330, 2010], at: [40, -97] }
const BLUE = { box: [345, 1800, 540, 2010], at: [0, -95] }
/** The tipped beaker and its stream, cut off at the bioreactor's mouth. */
const POUR = { box: [425, 1850, 645, 2803], at: [0, -95] }
/** Where the stream leaves the tipped beaker (canvas row, before moving). */
const POUR_START_ROW = 2005
/**
 * The bench's back edge (plate row): the axolotl is behind it, all but its
 * paws (and gill tips) over it, in these columns (canvas x) [left, right].
 * A third column is where the right side starts on the edge, slanting in to
 * `right` over PAW_SLANT_ROWS: round the magnifying glass's handle, which
 * comes down over the edge right beside its body.
 */
const BENCH_BACK_ROW = 1640
const AXOLOTL_PAWS = [
  [160, 272, 276],
  [403, 510],
]
const PAW_SLANT_ROWS = 10
/** How far (plate px) the axolotl sinks behind the bench when it's hidden. */
const AXOLOTL_SINK = 260

/** The axolotl's window cut at the bench's back edge, its paws `down` (0–1) below it. */
const axolotlClip = down => {
  const [x0, y0, x1, y1] = AXOLOTL.box
  const pct = (v, from, to) =>
    `${(((v - from) / (to - from)) * 100).toFixed(2)}%`
  const edgeRow = BENCH_BACK_ROW - AXOLOTL.at[1]
  const edge = pct(edgeRow, y0, y1)
  const foot = `calc(${edge} + ${down} * (100% - ${edge}))`
  const slant = `calc(${edge} + ${down} * (${pct(edgeRow + PAW_SLANT_ROWS, y0, y1)} - ${edge}))`
  const paws = AXOLOTL_PAWS.slice()
    .reverse()
    .flatMap(([a, b, top = b]) => [
      `${pct(top, x0, x1)} ${edge}`,
      `${pct(b, x0, x1)} ${slant}`,
      `${pct(b, x0, x1)} ${foot}`,
      `${pct(a, x0, x1)} ${foot}`,
      `${pct(a, x0, x1)} ${edge}`,
    ])
  return `polygon(0 0, 100% 0, 100% ${edge}, ${paws.join(", ")}, 0 ${edge})`
}

/** The glowing results: the beaker and the plate [cx, cy, rx, ry]. */
const BEAKER_GLOW = [157, 1772, 140, 125]
const PLATE_GLOW = [281, 1850, 115, 48]
/** The bioreactor vessel's mouth, where its light comes out. */
const VESSEL = [641, 2706]
/** The monitor's screen, and the chart drawn on its lower part [x0, y0, x1, y1]. */
const CHART = [902, 2722, 996, 2866]

/** Shares of hold 3 and 4 over which each part plays. */
const WET_RESULTS = [0.6, 0.7]
const WET_GLOW = [0.66, 0.74]
export const WET_TIP = [0.86, 0.9]
const WET_POUR = [0.9, 1]
const BENCH_ON = [0.08, 0.2]
const CURVES = [0.3, 0.72]

/** The axolotl's stage through hold 3: hidden, out (popped up) or surprised. */
export const wetStage = h3 =>
  h3 <= 0.005 ? "hidden" : h3 < WET_RESULTS[0] ? "out" : "surprised"

/** How far hold `h` is through [from, to], 0–1, as CSS. */
const through = (h, [from, to]) =>
  `clamp(0, calc((var(--lab-hold-${h}, 0) - ${from}) / ${to - from}), 1)`

const xPct = x => `${(x / PLATE.w) * 100}%`
const yPct = y => `${(y / PLATE.h) * 100}%`

/** Logistic growth curves on the chart, 0–1 each way: [rate, midpoint, top]. */
const GROWTH = [
  [11, 0.42, 0.86, "#7cf29a"],
  [9, 0.55, 0.66, "#6fd6ff"],
  [8, 0.68, 0.44, "#f59bd8"],
]
const curvePath = ([rate, mid, top]) =>
  Array.from({ length: 25 }, (_, i) => {
    const t = i / 24
    const y = top / (1 + Math.exp(-rate * (t - mid)))
    return `${i ? "L" : "M"}${(t * 100).toFixed(1)},${(100 - y * 100).toFixed(1)}`
  }).join(" ")

/** A piece's window on the plate: its box, moved. */
const pieceStyle = ({ box: [x0, y0, x1, y1], at: [dx, dy] }) => ({
  left: xPct(x0 + CANVAS_X + dx),
  top: yPct(y0 + dy),
  width: xPct(x1 - x0),
  height: yPct(y1 - y0),
})

/** The whole canvas inside a piece's window, so the piece's box fills it. */
const canvasStyle = ({ box: [x0, y0, x1, y1] }) => ({
  left: `${(-x0 / (x1 - x0)) * 100}%`,
  top: `${(-y0 / (y1 - y0)) * 100}%`,
  width: `${(CANVAS_W / (x1 - x0)) * 100}%`,
})

/** One piece of `src`, moved into place; `$show` styles its window. */
function Piece({ piece, src, ...rest }) {
  return (
    <PieceWindow style={pieceStyle(piece)} {...rest}>
      <PieceImg src={src} alt="" style={canvasStyle(piece)} />
    </PieceWindow>
  )
}

export function LabBench() {
  return (
    <Bench aria-hidden="true">
      <CanvasLayer src={BIOREACTOR} alt="" />
      <AxolotlGlow style={pieceStyle(AXOLOTL)}>
        <AxolotlWindow>
          <AxolotlRise>
            <AxolotlJump>
              <AxolotlCrop>
                <PieceImg
                  className="plain"
                  src={WET_BEFORE}
                  alt=""
                  style={canvasStyle(AXOLOTL)}
                />
                <PieceImg
                  className="surprised"
                  src={WET_AFTER}
                  alt=""
                  style={canvasStyle(AXOLOTL)}
                />
              </AxolotlCrop>
            </AxolotlJump>
          </AxolotlRise>
        </AxolotlWindow>
      </AxolotlGlow>
      <Piece
        piece={BEAKER}
        src={WET_BEFORE}
        $show={`opacity: calc(1 - ${through(3, WET_RESULTS)});`}
      />
      <Piece
        piece={PETRI}
        src={WET_BEFORE}
        $show={`opacity: calc(1 - ${through(3, WET_RESULTS)});`}
      />
      <Piece
        piece={BLUE}
        src={WET_BEFORE}
        $show={`opacity: calc(1 - ${through(3, WET_TIP)});`}
      />
      <Glow $at={BEAKER_GLOW} />
      <Glow $at={PLATE_GLOW} $small />
      <Piece
        piece={BEAKER}
        src={WET_AFTER}
        $show={`opacity: ${through(3, WET_RESULTS)};`}
      />
      <Piece
        piece={PETRI}
        src={WET_AFTER}
        $show={`opacity: ${through(3, WET_RESULTS)};`}
      />
      <Piece
        piece={POUR}
        src={WET_AFTER}
        $show={`
          opacity: ${through(3, WET_TIP)};
          clip-path: inset(
            0 0
              calc((1 - ${through(3, WET_POUR)}) * ${((POUR.box[3] - POUR_START_ROW) / (POUR.box[3] - POUR.box[1])) * 100}%)
              0
          );
        `}
      />
      <VesselLight />
      <Chart viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M2,2 V98 H98" className="axes" />
        {GROWTH.map((g, i) => (
          <path
            key={i}
            d={curvePath(g)}
            pathLength="1"
            stroke={g[3]}
            style={{ "--i": i }}
          />
        ))}
      </Chart>
    </Bench>
  )
}

export default LabBench

const Bench = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
`

/** The 946-wide bioreactor canvas over the plate. */
const CanvasLayer = styled(PlateImg)`
  position: absolute;
  top: 0;
  left: ${xPct(CANVAS_X)};
  display: block;
  width: ${xPct(CANVAS_W)};
  height: auto;
  max-width: none;
  user-select: none;
`

const PieceWindow = styled.div`
  position: absolute;
  overflow: hidden;
  ${({ $show }) => $show}
`

const PieceImg = styled(PlateImg)`
  position: absolute;
  display: block;
  height: auto;
  max-width: none;
  user-select: none;
`

/**
 * Surprised, it lights up like the Wet Lab pages' axolotls: a glow round
 * what shows of it over the bench (so outside the window's cut).
 */
const AxolotlGlow = styled.div`
  position: absolute;
  filter: brightness(1) saturate(1) drop-shadow(0 0 0 rgba(255, 244, 140, 0))
    drop-shadow(0 0 0 rgba(255, 232, 100, 0));
  transition: filter 300ms ease-out;

  [data-wet-stage="surprised"] & {
    filter: brightness(1.12) saturate(1.2)
      drop-shadow(0 0 6px rgba(255, 244, 140, 0.95))
      drop-shadow(0 0 18px rgba(255, 232, 100, 0.75));
    transition: filter 500ms ease-out 150ms;
  }
`

/**
 * The axolotl's window: everything below the bench's back edge is cut off,
 * so it rises from behind the bench; once up, its paws come over the edge.
 */
const AxolotlWindow = styled.div`
  position: absolute;
  inset: 0;
  clip-path: ${axolotlClip(0)};
  transition: clip-path 0s;

  [data-wet-stage="out"] &,
  [data-wet-stage="surprised"] & {
    clip-path: ${axolotlClip(1)};
    transition: clip-path 160ms ease-out 300ms;
  }
`

/** Just its own piece of the art, wherever the pop and the jump take it. */
const AxolotlCrop = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`

/** Popping up from behind the bench, with a little overshoot. */
const AxolotlRise = styled.div`
  position: absolute;
  inset: 0;
  transform: translate3d(
    0,
    ${(AXOLOTL_SINK / (AXOLOTL.box[3] - AXOLOTL.box[1])) * 100}%,
    0
  );
  transition: transform 280ms ease-in;

  [data-wet-stage="out"] &,
  [data-wet-stage="surprised"] & {
    transform: translate3d(0, 0, 0);
    transition: transform 520ms cubic-bezier(0.3, 1.5, 0.5, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }
`

/**
 * A hop that keeps its chin behind the bench: squashed, then stretched up
 * from the bench's edge (and lifted no more than its chin is hidden).
 */
const jump = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1, 1); }
  18% { transform: translate3d(0, 0, 0) scale(1.07, 0.9); }
  42% { transform: translate3d(0, -3%, 0) scale(0.94, 1.16); }
  66% { transform: translate3d(0, 0, 0) scale(1.04, 0.95); }
  84% { transform: translate3d(0, -1%, 0) scale(0.99, 1.03); }
  100% { transform: translate3d(0, 0, 0) scale(1, 1); }
`

/** Surprised: a jump, and its face swapped for the surprised one. */
const AxolotlJump = styled.div`
  position: absolute;
  inset: 0;
  transform-origin: 50%
    ${(((BENCH_BACK_ROW - AXOLOTL.at[1] - AXOLOTL.box[1]) / (AXOLOTL.box[3] - AXOLOTL.box[1])) * 100).toFixed(2)}%;

  .surprised {
    opacity: 0;
    transition: opacity 120ms ease-out;
  }

  [data-wet-stage="surprised"] & {
    animation: ${jump} 700ms ease-out;

    .surprised {
      opacity: 1;
      transition: opacity 80ms ease-out 100ms;
    }

    .plain {
      opacity: 0;
      transition: opacity 80ms ease-out 100ms;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`

const pulse = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(0.92); }
  50% { transform: translate(-50%, -50%) scale(1.08); }
`

/** A soft green glow over a result (the biosensor's cells lighting up). */
const Glow = styled.div`
  position: absolute;
  left: ${({ $at }) => xPct($at[0])};
  top: ${({ $at }) => yPct($at[1])};
  width: ${({ $at }) => xPct($at[2] * 2)};
  aspect-ratio: ${({ $at }) => `${$at[2]} / ${$at[3]}`};
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    rgba(150, 255, 140, ${({ $small }) => ($small ? 0.45 : 0.55)}),
    rgba(150, 255, 140, 0.18) 60%,
    rgba(150, 255, 140, 0)
  );
  mix-blend-mode: screen;
  opacity: ${through(3, WET_GLOW)};
  transform: translate(-50%, -50%);
  animation: ${pulse} 2.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const rise = keyframes`
  0% { transform: translate(-50%, 0) scale(0.6); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(-50%, -260%) scale(1); opacity: 0; }
`

const shimmer = keyframes`
  0%, 100% { opacity: 0.75; transform: translate(-50%, -50%) scale(0.95); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
`

/** The bioreactor running: light pouring up out of its vessel, with motes rising. */
const VesselLight = styled.div`
  position: absolute;
  left: ${xPct(VESSEL[0])};
  top: ${yPct(VESSEL[1])};
  width: ${xPct(150)};
  aspect-ratio: 1;
  opacity: ${through(4, BENCH_ON)};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(
      closest-side,
      rgba(190, 170, 255, 0.85),
      rgba(120, 200, 255, 0.35) 55%,
      rgba(120, 200, 255, 0)
    );
    mix-blend-mode: screen;
    animation: ${shimmer} 1.8s ease-in-out infinite;
  }

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 30%;
    width: 8%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #e9e4ff;
    box-shadow:
      -18px 6px 0 -1px rgba(200, 230, 255, 0.9),
      16px 12px 0 -2px rgba(230, 210, 255, 0.9),
      -6px 22px 0 -2px rgba(200, 255, 240, 0.8);
    animation: ${rise} 2.4s ease-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after {
      animation: none;
    }
  }
`

/** Growth curves drawing across the monitor's screen, one after another. */
const Chart = styled.svg`
  position: absolute;
  left: ${xPct(CHART[0])};
  top: ${yPct(CHART[1])};
  width: ${xPct(CHART[2] - CHART[0])};
  aspect-ratio: ${CHART[2] - CHART[0]} / ${CHART[3] - CHART[1]};
  padding: 0.4%;
  box-sizing: border-box;
  background: rgba(16, 12, 26, 0.92);
  border-radius: 3px;
  opacity: ${through(4, [CURVES[0] - 0.06, CURVES[0]])};
  overflow: visible;

  path {
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .axes {
    stroke: rgba(220, 220, 255, 0.45);
    stroke-width: 1;
  }

  path[pathLength] {
    stroke-dasharray: 1;
    stroke-dashoffset: calc(
      1 - clamp(
          0,
          calc(
            (var(--lab-hold-4, 0) - ${CURVES[0]} - var(--i) * 0.08) /
              ${CURVES[1] - CURVES[0] - 0.16}
          ),
          1
        )
    );
  }
`
