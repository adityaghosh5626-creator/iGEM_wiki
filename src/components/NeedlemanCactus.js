import React, { useEffect, useMemo, useRef } from "react"
import styled, { keyframes } from "styled-components"

/**
 * Needleman the cactus and his friend Wunsch the tumbleweed, on the Dry Lab
 * skyline. Needleman sways. Hovering either of them (tap on touch) makes both
 * jump in surprise, flips Needleman's arm up and pops his speech bubble; then
 * Wunsch rolls off the right edge, with a few slow hops, and back in from the
 * left to his spot.
 *
 * The art is drawn on its own plate (`cfg.plate`); `cfg.at` and `cfg.scale`
 * place it on the scene's plate.
 */

const JUMP_MS = 520
const ARM_MS = 420
const BUBBLE_MS = 380
/** How long the bubble stays up after the last hover or tap. */
const BUBBLE_HOLD_MS = 4500
/** Wunsch's rolling speed (scene px per second) and his pause off-screen. */
const ROLL_SPEED = 95
const OFFSCREEN_PAUSE_MS = 700
/** The rock-and-settle once he's home. */
const SETTLE_MS = 700
/** Hops on the way back: [where along the leg (0–1), length (scene px), height (share of Wunsch's height)]. */
const HOPS = [
  [0.16, 70, 0.3],
  [0.45, 95, 0.4],
  [0.72, 60, 0.24],
]

const ARM_DOWN = "perspective(600px) rotateX(180deg)"
const ARM_UP = "perspective(600px) rotateX(0deg)"

const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const pct = (n, of) => `${((n / of) * 100).toFixed(4)}%`

/** `box` (scene px) as a % window inside `parent` (scene px). */
function within([x0, y0, x1, y1], [px0, py0, px1, py1]) {
  const w = px1 - px0
  const h = py1 - py0
  return {
    left: pct(x0 - px0, w),
    top: pct(y0 - py0, h),
    width: pct(x1 - x0, w),
    height: pct(y1 - y0, h),
  }
}

/** Full source image offset so `box` of a `[W, H]` plate fills its window. */
function crop([x0, y0, x1, y1], [W, H]) {
  const w = x1 - x0
  const h = y1 - y0
  return {
    width: `${(W / w) * 100}%`,
    height: `${(H / h) * 100}%`,
    left: `${(-x0 / w) * 100}%`,
    top: `${(-y0 / h) * 100}%`,
  }
}

/** Ground height (scene px) under `x`, from `[x, y]` points. */
function floorAt(floor, x) {
  if (x <= floor[0][0]) return floor[0][1]
  for (let i = 1; i < floor.length; i++) {
    const [x1, y1] = floor[i]
    if (x <= x1) {
      const [x0, y0] = floor[i - 1]
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    }
  }
  return floor[floor.length - 1][1]
}

/**
 * Wunsch's trip as two synced animations: `move` (along the ground, with
 * hops) for his window and `spin` (rolling) for the art inside it.
 */
function rollKeyframes(cfg, sceneW) {
  const { scale } = cfg
  const X = x => cfg.at[0] + x * scale
  const [bx0, by0, bx1, by1] = cfg.friend.box
  const w = (bx1 - bx0) * scale
  const h = (by1 - by0) * scale
  const hub = X(cfg.friend.hub[0])
  const left = hub - X(bx0)
  const right = X(bx1) - hub
  const radius = cfg.friend.radius * scale
  const home = floorAt(cfg.floor, hub)
  const exit = sceneW + left + 2
  const enter = -right - 2

  // Walk each leg a pixel at a time, building up time from the speed there.
  const samples = []
  let t = 0
  let rolled = 0
  const leg = (from, to, speedAt, hops) => {
    const L = Math.abs(to - from)
    // Whole pixels, then exactly `to`, so he lands right on his spot.
    const steps = [...Array(Math.floor(L) + 1).keys()]
    if (steps[steps.length - 1] < L) steps.push(L)
    for (const s of steps) {
      const hop = hops.find(([at, len]) => s >= at * L && s <= at * L + len)
      const lift = hop
        ? Math.sin((Math.PI * (s - hop[0] * L)) / hop[1]) * hop[2] * h
        : 0
      samples.push({ t, x: from + Math.sign(to - from) * s, lift, rolled })
      // Slow hops: a bit slower through the air.
      const ds = Math.min(1, L - s)
      t += ds / (speedAt(s, L) * (hop ? 0.8 : 1))
      rolled += ds
    }
  }
  // Out: speeds up over the first 40 px, then off the right edge.
  leg(hub, exit, s => ROLL_SPEED * Math.min(1, (s + 8) / 40), [])
  const outEnd = samples.length - 1
  t += OFFSCREEN_PAUSE_MS / 1000
  // Back: in from the left, slowing over the last 70 px to his spot.
  leg(enter, hub, (s, L) => ROLL_SPEED * Math.min(1, (L - s + 6) / 70), HOPS)
  // Then he rocks forward a touch and settles back.
  const total = t + SETTLE_MS / 1000
  // Whole turns, so he stops with his hat upright, as he started (no snap
  // when the animation ends).
  const raw = (rolled / radius) * (180 / Math.PI)
  const turnScale = (Math.max(1, Math.round(raw / 360)) * 360) / raw

  const move = []
  const spin = []
  const step = Math.max(1, Math.round(samples.length / 160))
  samples.forEach((p, i) => {
    const keep = i % step === 0 || i === outEnd || i === outEnd + 1 || i === samples.length - 1
    if (!keep) return
    const offset = p.t / total
    const dy = floorAt(cfg.floor, p.x) - home - p.lift
    move.push({
      offset,
      transform: `translate(${(((p.x - hub) / w) * 100).toFixed(2)}%, ${((dy / h) * 100).toFixed(2)}%)`,
    })
    const angle = (p.rolled / radius) * (180 / Math.PI) * turnScale
    spin.push({ offset, transform: `rotate(${angle.toFixed(1)}deg)` })
    // Off-screen pause: hold at the exit until the jump to the left side.
    if (i === outEnd) {
      const hold = (samples[outEnd + 1].t - 0) / total
      move.push({ ...move[move.length - 1], offset: hold })
      spin.push({ ...spin[spin.length - 1], offset: hold })
    }
  })
  const last = samples[samples.length - 1]
  const rest = (last.rolled / radius) * (180 / Math.PI) * turnScale
  move.push({ ...move[move.length - 1], offset: 1 })
  spin.push(
    { offset: (t + SETTLE_MS * 0.0004) / total, transform: `rotate(${(rest + 7).toFixed(1)}deg)` },
    { offset: 1, transform: `rotate(${rest.toFixed(1)}deg)` },
  )
  return { move, spin, durationMs: total * 1000 }
}

/** Surprised hop, squashing on take-off and landing. */
const JUMP = lift => [
  { transform: "translateY(0) scaleY(1)" },
  { transform: "translateY(0) scaleY(0.94)", offset: 0.15 },
  { transform: `translateY(-${lift}%) scaleY(1.04)`, offset: 0.45 },
  { transform: "translateY(0) scaleY(0.96)", offset: 0.8 },
  { transform: "translateY(0) scaleY(1)" },
]

const BUBBLE_IN = [
  { transform: "scale(0.2)", opacity: 0 },
  { transform: "scale(1.08)", opacity: 1, offset: 0.7 },
  { transform: "scale(1)", opacity: 1 },
]

export function NeedlemanCactus({ plate, cfg }) {
  const src = name => `${cfg.assetBase}${name}.avif`
  const scene = [0, 0, plate.W, plate.H]
  const toScene = ([x0, y0, x1, y1]) => [
    cfg.at[0] + x0 * cfg.scale,
    cfg.at[1] + y0 * cfg.scale,
    cfg.at[0] + x1 * cfg.scale,
    cfg.at[1] + y1 * cfg.scale,
  ]
  const { body, arm, bubble, friend, prop } = cfg
  // Needleman's group: the bubble, his body and arm, swaying from his base.
  const group = [bubble.box[0], bubble.box[1], arm.box[2], body.box[3]]
  const [gx0, gy0, gx1, gy1] = group
  const swayOrigin = `${pct(cfg.base[0] - gx0, gx1 - gx0)} 100%`
  const [fx0, fy0, fx1, fy1] = friend.box

  const jumpRef = useRef(null)
  const armRef = useRef(null)
  const bubbleRef = useRef(null)
  const friendMoveRef = useRef(null)
  const friendJumpRef = useRef(null)
  const friendSpinRef = useRef(null)
  const state = useRef({ up: false, home: true, hide: 0, roll: 0 })

  const roll = useMemo(() => rollKeyframes(cfg, plate.W), [cfg, plate.W])

  useEffect(
    () => () => {
      clearTimeout(state.current.hide)
      clearTimeout(state.current.roll)
    },
    [],
  )

  const lower = () => {
    const s = state.current
    s.up = false
    const quick = reducedMotion()
    armRef.current?.animate([{ transform: ARM_UP }, { transform: ARM_DOWN }], {
      duration: quick ? 0 : ARM_MS,
      easing: "ease-in-out",
      fill: "forwards",
    })
    bubbleRef.current?.animate([...BUBBLE_IN].reverse(), {
      duration: quick ? 0 : BUBBLE_MS * 0.7,
      easing: "ease-in",
      fill: "forwards",
    })
  }

  const surprise = () => {
    const s = state.current
    const quick = reducedMotion()
    if (!quick) {
      jumpRef.current?.animate(JUMP(6), { duration: JUMP_MS, easing: "ease-out" })
    }
    if (!s.up) {
      s.up = true
      armRef.current?.animate([{ transform: ARM_DOWN }, { transform: ARM_UP }], {
        duration: quick ? 0 : ARM_MS,
        delay: quick ? 0 : 120,
        easing: "cubic-bezier(0.3, 1.45, 0.5, 1)",
        fill: "forwards",
      })
      bubbleRef.current?.animate(BUBBLE_IN, {
        duration: quick ? 0 : BUBBLE_MS,
        delay: quick ? 0 : 220,
        easing: "ease-out",
        fill: "forwards",
      })
    }
    clearTimeout(s.hide)
    s.hide = setTimeout(lower, BUBBLE_HOLD_MS)

    // Wunsch jumps too, then rolls away (unless he's already out rolling).
    if (!s.home || quick) return
    s.home = false
    friendJumpRef.current?.animate(JUMP(16), { duration: JUMP_MS, delay: 60, easing: "ease-out" })
    s.roll = setTimeout(() => {
      const opts = { duration: roll.durationMs, easing: "linear" }
      const move = friendMoveRef.current?.animate(roll.move, opts)
      friendSpinRef.current?.animate(roll.spin, opts)
      if (move) move.onfinish = () => (s.home = true)
      else s.home = true
    }, JUMP_MS + 120)
  }

  const hoverProps = {
    onMouseEnter: surprise,
    // Touch has no hover: a tap does it instead.
    onPointerDown: event => {
      if (event.pointerType !== "mouse") surprise()
    },
  }

  return (
    <>
      <Sway style={{ ...within(toScene(group), scene), transformOrigin: swayOrigin }}>
        <Jumper ref={jumpRef} style={{ transformOrigin: swayOrigin }}>
          <Piece
            ref={bubbleRef}
            style={{
              ...within(bubble.box, group),
              transformOrigin: `${pct(bubble.tail[0] - bubble.box[0], bubble.box[2] - bubble.box[0])} ${pct(bubble.tail[1] - bubble.box[1], bubble.box[3] - bubble.box[1])}`,
              transform: "scale(0)",
              opacity: 0,
            }}
          >
            <Img src={src(bubble.name)} alt="" draggable={false} style={crop(bubble.box, cfg.plate)} />
          </Piece>
          <Piece $hit style={within(body.box, group)} {...hoverProps}>
            <Img src={src(body.name)} alt="" draggable={false} style={crop(body.box, cfg.plate)} />
          </Piece>
          <Piece
            ref={armRef}
            $hit
            style={{
              ...within(arm.box, group),
              transformOrigin: `50% ${pct(arm.shoulderY - arm.box[1], arm.box[3] - arm.box[1])}`,
              transform: ARM_DOWN,
            }}
            {...hoverProps}
          >
            <Img src={src(arm.name)} alt="" draggable={false} style={crop(arm.box, cfg.plate)} />
          </Piece>
        </Jumper>
      </Sway>

      {/* The scroll stays planted while Wunsch is away. */}
      <Piece style={{ ...within(toScene(prop.box), scene), clipPath: prop.clip }}>
        <Img src={src(prop.name)} alt="" draggable={false} style={crop(prop.box, cfg.plate)} />
      </Piece>

      <Free ref={friendMoveRef} style={within(toScene(friend.box), scene)}>
        <Free
          ref={friendJumpRef}
          style={{ inset: 0, transformOrigin: "50% 100%" }}
        >
          <Piece
            ref={friendSpinRef}
            $hit
            style={{
              inset: 0,
              clipPath: friend.clip,
              transformOrigin: `${pct(friend.hub[0] - fx0, fx1 - fx0)} ${pct(friend.hub[1] - fy0, fy1 - fy0)}`,
            }}
            {...hoverProps}
          >
            <Img src={src(friend.name)} alt="" draggable={false} style={crop(friend.box, cfg.plate)} />
          </Piece>
        </Free>
      </Free>
    </>
  )
}

const sway = keyframes`
  from { transform: rotate(-2deg); }
  to { transform: rotate(2deg); }
`

const Sway = styled.div`
  position: absolute;
  pointer-events: none;
  animation: ${sway} 3.6s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Jumper = styled.div`
  position: absolute;
  inset: 0;
`

const Free = styled.div`
  position: absolute;
  pointer-events: none;
`

const Piece = styled.div`
  position: absolute;
  overflow: hidden;
  pointer-events: ${({ $hit }) => ($hit ? "auto" : "none")};
`

const Img = styled.img`
  position: absolute;
  display: block;
  max-width: none;
  user-select: none;
`
