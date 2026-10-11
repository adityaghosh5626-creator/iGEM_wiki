import styled, { css, keyframes } from "styled-components"
import { PlateImg } from "./PlateImg.js"

/**
 * Thirteen-frame PETABITE logo loop (same slot + idle float as the old static
 * logo), timed like the animated logo GIF: 330ms a frame, except the cut
 * (the "i" swinging into the bond until the pieces fly off) runs faster.
 */
const LOGO_FRAME_COUNT = 13
const LOGO_FRAME_MS = 330
/** First and last frame (1-based) of the cut, and its hold per frame. */
const LOGO_CUT_FRAMES = [2, 9]
const LOGO_CUT_FRAME_MS = 165
export const LOGO_FRAMES = Array.from(
  { length: LOGO_FRAME_COUNT },
  (_, i) =>
    `https://static.igem.wiki/teams/6187/wiki/homepage-components/logo-animation-files/untitled-artwork-${i + 1}.avif`,
)

/** Each frame's visibility window, as a share of the loop. */
export const LOGO_FRAME_TIMING = (() => {
  const [cutFrom, cutTo] = LOGO_CUT_FRAMES
  const durations = LOGO_FRAMES.map((_, i) =>
    i + 1 >= cutFrom && i + 1 <= cutTo ? LOGO_CUT_FRAME_MS : LOGO_FRAME_MS,
  )
  const cycleMs = durations.reduce((sum, ms) => sum + ms, 0)
  let acc = 0
  const windows = durations.map(ms => {
    const start = acc / cycleMs
    acc += ms
    return { start, end: acc / cycleMs }
  })
  return { cycleMs, windows }
})()

export const LOGO_FRAME_KEYFRAMES = LOGO_FRAME_TIMING.windows.map(({ start, end }) => {
  const s = start * 100
  const e = end * 100
  if (start <= 0) {
    return keyframes`
      0%,
      ${e}% {
        opacity: 1;
      }
      ${e + 0.001}%,
      100% {
        opacity: 0;
      }
    `
  }
  return keyframes`
    0%,
    ${Math.max(0, s - 0.001)}% {
      opacity: 0;
    }
    ${s}%,
    ${e}% {
      opacity: 1;
    }
    ${e + 0.001}%,
    100% {
      opacity: 0;
    }
  `
})

/** Pixel size of each frame plate. */
export const LOGO_PLATE = { w: 2360, h: 1640 }
/** Painted area across all frames (plate px), padded. */
export const LOGO_BOX = { x: 180, y: 420, w: 2180, h: 848 }

/**
 * One frame of the loop; frame 0 sizes the stack, the rest sit on top. Find
 * frames by [data-logo-frame] (each is a PlateImg, not necessarily an <img>).
 */
export const LogoFrame = styled(PlateImg).attrs({ "data-logo-frame": "" })`
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
  user-select: none;
  pointer-events: none;
  opacity: 0;
  animation-name: ${({ $index }) =>
    LOGO_FRAME_KEYFRAMES[$index] || LOGO_FRAME_KEYFRAMES[0]};
  animation-duration: ${LOGO_FRAME_TIMING.cycleMs}ms;
  animation-timing-function: steps(1, end);
  animation-iteration-count: infinite;

  ${({ $index }) =>
    $index > 0 &&
    css`
      position: absolute;
      left: 0;
      top: 0;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: ${({ $index }) => ($index === 0 ? 1 : 0)};
  }
`
