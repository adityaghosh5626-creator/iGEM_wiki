import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styled, { keyframes } from "styled-components"

/** Combined textbox + copy (PETase / MHETase explanation) from team iGEM static assets. */
const MHETASE_TEXTBOX_IMG =
  "https://static.igem.wiki/teams/6187/wiki/homepage-components/mhetase-textbox.avif"

/**
 * Popover width scales with the window (like the art): POPOVER_WIDTH_SHARE of
 * it, between the min and max. POPOVER_WIDTH_PX is the pre-layout fallback.
 */
const POPOVER_WIDTH_SHARE = 0.45
const POPOVER_MAX_WIDTH_PX = 760
export const POPOVER_WIDTH_PX = 560

/** Smallest the popover gets (phones, or squeezed above a term near the top). */
const POPOVER_MIN_WIDTH_PX = 240

/** Below site chrome (`WikiTopBar` / home nav mount at 110); above mockup overlays (≤95). */
export const POPOVER_Z_INDEX = 100

export const POPOVER_GAP_PX = 12

/** Lightning-bolt tip: fraction in from the popover’s left edge (measured: ~0.40 in all three text-box images). */
const BOLT_TIP_X_FRAC = 0.4

/**
 * Popover art layout: a tilted black box, the character poking out above its
 * top-right corner and the bolt tail hanging below. Per image (by file
 * name), as shares of the image height at its left and right edges:
 * `top` / `bottom` are the box's edges (where a drawn pointer meets it) and
 * `clipBottom` the crop that drops the bolt, slanted with the box and just
 * below the last line of text. `character` is the part of the character
 * above the box [x0, y0, x1, y1] (shares of width / height), kept off the
 * term when the popover opens below it. Measured from the images; other images get
 * the straight crop in DEFAULT_BOX.
 */
const BOX_EDGES = {
  "mhetase-textbox.avif": {
    character: [0.78, 0, 0.99, 0.3],
    top: [0.508, 0.245],
    bottom: [0.882, 0.675],
    clipBottom: [0.894, 0.687],
  },
  "rnalab.avif": {
    character: [0.76, 0, 0.98, 0.29],
    top: [0.502, 0.232],
    bottom: [0.883, 0.638],
    clipBottom: [0.886, 0.641],
  },
  "text-box-3-1.avif": {
    character: [0.76, 0, 0.98, 0.29],
    top: [0.496, 0.22],
    bottom: [0.885, 0.633],
    clipBottom: [0.913, 0.661],
  },
}
const DEFAULT_BOX = {
  top: [0.41, 0.41],
  bottom: [0.8, 0.8],
  clipBottom: [0.8, 0.8],
}
const boxEdgesFor = (src) => BOX_EDGES[src.split("/").pop()] || DEFAULT_BOX
/** Height share of a slanted edge [left, right] at `x` (share of the width). */
const edgeAt = ([left, right], x) => left + (right - left) * x
/** Keeps the character's feet off the term when the popover sits below it. */
const BELOW_EXTRA_GAP_PX = 14
/** How far the painted bolt may miss the term (share of width) before a drawn pointer replaces it. */
const BOLT_SLACK_FRAC = 0.06
/** Drawn pointer size (px). */
const POINTER_H_PX = 18

/** Keep the popover inside the viewport with this padding (px). */
const POPOVER_EDGE_PAD_PX = 16

/** Approximate height ÷ width before the popover image loads (updated after onLoad). */
const SHELL_ASPECT = 0.62

const POPOVER_POP_MS = 420

const popoverPopIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.2) rotate(-8deg);
  }
  45% {
    opacity: 1;
    transform: scale(1.14) rotate(4deg);
  }
  70% {
    transform: scale(0.94) rotate(-3deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(-2deg);
  }
`

/** The term's box, plus its first/last line (a wrapped term spans two lines). */
function measureButton(el) {
  const r = el.getBoundingClientRect()
  const lines = el.getClientRects()
  const first = lines[0] || r
  const last = lines[lines.length - 1] || r
  return {
    top: r.top,
    bottom: r.bottom,
    left: r.left,
    right: r.right,
    width: r.width,
    height: r.height,
    firstX: first.left + first.width / 2,
    lastX: last.left + last.width / 2,
  }
}

/** Popover width for the current window: a share of it, clamped, and never wider than fits. */
function computePopoverWidth() {
  if (typeof window === "undefined") return POPOVER_WIDTH_PX
  const available = window.innerWidth - POPOVER_EDGE_PAD_PX * 2
  const scaled = Math.min(
    POPOVER_MAX_WIDTH_PX,
    Math.max(POPOVER_MIN_WIDTH_PX, window.innerWidth * POPOVER_WIDTH_SHARE)
  )
  return Math.min(scaled, available)
}

/** Lowest y the popover may reach up to: below any fixed/sticky top bar. */
function topLimit() {
  if (typeof document === "undefined") return POPOVER_EDGE_PAD_PX
  const bar = document.querySelector("header")
  const barBottom = bar ? bar.getBoundingClientRect().bottom : 0
  return Math.max(POPOVER_EDGE_PAD_PX, barBottom + POPOVER_EDGE_PAD_PX / 2)
}

/**
 * Above the term, pointing down at it; if there isn't room above, shrink the
 * popover (down to POPOVER_MIN_WIDTH_PX) so it still fits above, and only if
 * even that won't fit, put it below. The painted bolt is kept when it lands on
 * the term; otherwise (popover nudged to stay on screen, or placed below) the
 * bolt is cropped off and a drawn pointer on the box aims at the term instead.
 *
 * Below the term, the character on the box's top-right corner is kept off
 * it: the popover slides right until the character clears the term, or, with
 * no room, drops until it does (the pointer then grows to reach the term).
 *
 * Returns { left, top, width, place: "above" | "below", pointer: null |
 * x-share, pointerLen }.
 */
function layoutFromButton(btn, aspect, maxW, box) {
  const gap = POPOVER_GAP_PX
  const roomAbove = btn.top - gap - topLimit()
  let popW = Math.min(maxW, roomAbove / aspect)
  const place = popW >= POPOVER_MIN_WIDTH_PX ? "above" : "below"
  if (place === "below") popW = maxW
  const popH = popW * aspect
  const targetX = place === "above" ? btn.firstX : btn.lastX

  const maxLeft =
    typeof window === "undefined"
      ? Infinity
      : Math.max(POPOVER_EDGE_PAD_PX, window.innerWidth - popW - POPOVER_EDGE_PAD_PX)
  let left = targetX - popW * BOLT_TIP_X_FRAC
  left = Math.min(Math.max(left, POPOVER_EDGE_PAD_PX), maxLeft)
  const tipAt = (l) => (targetX - l) / popW
  const boltLands = Math.abs(tipAt(left) - BOLT_TIP_X_FRAC) <= BOLT_SLACK_FRAC
  const pointerAt = (l) => Math.min(0.94, Math.max(0.06, tipAt(l)))
  let pointer = place === "above" && boltLands ? null : pointerAt(left)

  let top
  let pointerLen = POINTER_H_PX
  if (place === "below") {
    const boxTopAt = (p) => popH * edgeAt(box.top, p)
    top = btn.bottom + POINTER_H_PX + BELOW_EXTRA_GAP_PX - boxTopAt(pointer)
    if (box.character) {
      const [cx0, cy0, cx1, cy1] = box.character
      const covers = (l, t) =>
        l + cx0 * popW < btn.right + gap &&
        l + cx1 * popW > btn.left - gap &&
        t + cy0 * popH < btn.bottom + gap &&
        t + cy1 * popH > btn.top - gap
      if (covers(left, top)) {
        // Slide right until the character is past the term's right end.
        const slid = btn.right + gap - cx0 * popW
        if (slid <= maxLeft && tipAt(slid) >= 0.06) {
          left = slid
          pointer = pointerAt(left)
          top = btn.bottom + POINTER_H_PX + BELOW_EXTRA_GAP_PX - boxTopAt(pointer)
        } else {
          // No room: drop until the character is below the term.
          top = btn.bottom + gap - cy0 * popH
          pointerLen = Math.max(POINTER_H_PX, top + boxTopAt(pointer) - btn.bottom - 4)
        }
      }
    }
  } else if (pointer == null) {
    top = btn.top - gap - popH
  } else {
    top = btn.top - POINTER_H_PX - 4 - popH * edgeAt(box.bottom, pointer)
  }

  return { left, top, width: popW, place, pointer, pointerLen }
}

/**
 * Glossary term + fixed-size popover portaled to document.body so it is never
 * clipped by the mockup overlays. Position tracks the underlined word on scroll.
 */
export function ExplainTerm({
  term,
  explanation,
  imageSrc = MHETASE_TEXTBOX_IMG,
  imageAlt,
  className,
}) {
  const popoverId = useId()
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const popoverRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [pos, setPos] = useState(null)
  const coarsePointerRef = useRef(false)
  const pinnedRef = useRef(false)

  useEffect(() => {
    pinnedRef.current = pinned
  }, [pinned])

  const box = boxEdgesFor(imageSrc)

  const updatePosition = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return
    const m = measureButton(btn)
    if (m.width <= 0 && m.height <= 0) return

    const popEl = popoverRef.current
    const aspect =
      popEl?.offsetHeight > 0 && popEl.offsetWidth > 0
        ? popEl.offsetHeight / popEl.offsetWidth
        : SHELL_ASPECT

    setPos(layoutFromButton(m, aspect, computePopoverWidth(), box))
  }, [box])

  const show = useCallback(() => setOpen(true), [])
  const dismiss = useCallback(() => {
    setOpen(false)
    setPinned(false)
    setPos(null)
  }, [])
  const hideUnlessPinned = useCallback(() => {
    if (pinnedRef.current) return
    setOpen(false)
    setPos(null)
  }, [])

  useLayoutEffect(() => {
    if (!open) return undefined
    updatePosition()
    const raf = requestAnimationFrame(updatePosition)
    window.addEventListener("scroll", updatePosition, { passive: true, capture: true })
    window.addEventListener("resize", updatePosition, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", updatePosition, { capture: true })
      window.removeEventListener("resize", updatePosition)
    }
  }, [open, updatePosition])

  const onKeyDown = useCallback(
    (ev) => {
      if (ev.key === "Escape") {
        ev.preventDefault()
        dismiss()
        buttonRef.current?.blur()
      } else if (
        (ev.key === "Enter" || ev.key === " ") &&
        ev.target === buttonRef.current
      ) {
        // TermButton is a span (see below), so activate it like a button.
        ev.preventDefault()
        buttonRef.current.click()
      }
    },
    [dismiss]
  )

  /** Click pins the popover open; click again (or Escape) dismisses it. */
  const onTermClick = useCallback((ev) => {
    ev.stopPropagation()
    setPinned((wasPinned) => {
      if (wasPinned) {
        setOpen(false)
        setPos(null)
        return false
      }
      setOpen(true)
      return true
    })
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined
    const mq = window.matchMedia("(pointer: coarse)")
    const sync = () => {
      coarsePointerRef.current = mq.matches
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    /* Pinned: click away to close. Touch: same when open (no hover preview). */
    if (!pinned && !coarsePointerRef.current) return undefined

    const onDocPointer = (ev) => {
      if (rootRef.current?.contains(ev.target)) return
      if (buttonRef.current?.contains(ev.target)) return
      dismiss()
    }
    document.addEventListener("pointerdown", onDocPointer)
    return () => document.removeEventListener("pointerdown", onDocPointer)
  }, [open, pinned, dismiss])

  return (
    <>
      <TermRoot
        ref={rootRef}
        className={className}
        onMouseEnter={show}
        onMouseLeave={hideUnlessPinned}
        onFocus={show}
        onBlur={hideUnlessPinned}
        onKeyDown={onKeyDown}
      >
        <TermButton
          ref={buttonRef}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-pressed={pinned}
          aria-describedby={open ? popoverId : undefined}
          onClick={onTermClick}
        >
          {term}
        </TermButton>
      </TermRoot>
      {typeof document !== "undefined" &&
        open &&
        createPortal(
          <PopoverOuter
            ref={popoverRef}
            id={popoverId}
            role="tooltip"
            aria-label={explanation || undefined}
            style={
              pos
                ? {
                    left: pos.left,
                    top: pos.top,
                    width: pos.width,
                    bottom: "auto",
                    right: "auto",
                    visibility: "visible",
                  }
                : {
                    left: -9999,
                    top: -9999,
                    width: POPOVER_WIDTH_PX,
                    bottom: "auto",
                    right: "auto",
                    visibility: "hidden",
                  }
            }
          >
            <PopoverInner
              $below={pos?.place === "below"}
              style={{
                transformOrigin:
                  pos?.pointer == null
                    ? `${BOLT_TIP_X_FRAC * 100}% 100%`
                    : `${pos.pointer * 100}% ${pointerEdge(pos, box) * 100}%`,
              }}
            >
              {pos?.pointer != null && (
                <Pointer
                  aria-hidden="true"
                  $below={pos.place === "below"}
                  style={{
                    left: `${pos.pointer * 100}%`,
                    top: `${pointerEdge(pos, box) * 100}%`,
                    // Below the term it may have to reach further (see layout).
                    ...(pos.place === "below" && { borderBottomWidth: pos.pointerLen }),
                  }}
                />
              )}
              <ShellWrap style={{ clipPath: shellClip(pos, box) }}>
                <ShellImg
                  src={imageSrc}
                  alt={imageAlt || explanation || term}
                  onLoad={updatePosition}
                />
              </ShellWrap>
            </PopoverInner>
          </PopoverOuter>,
          document.body
        )}
    </>
  )
}

const TermRoot = styled.span`
  display: inline;
  vertical-align: baseline;
`

/**
 * A span, not a <button>: buttons lay out as inline-blocks, so a term that
 * wraps turned into one wide box (full-width highlight, trailing punctuation
 * pushed to its own line). An inline span highlights line by line.
 */
const TermButton = styled.span`
  display: inline;
  margin: 0;
  padding: 0 0.12em;
  border: none;
  background: linear-gradient(
    to bottom,
    transparent 58%,
    #e63946 58%,
    #e63946 88%,
    transparent 88%
  );
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
  border-radius: 2px;

  &:focus-visible {
    outline: 2px solid var(--color-accent, #c92f3b);
    outline-offset: 3px;
  }
`

const PopoverOuter = styled.div`
  position: fixed;
  z-index: ${POPOVER_Z_INDEX};
  pointer-events: none;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
`

/** transform-origin is set inline: the popover pops from whatever points at the term. */
const PopoverInner = styled.div`
  position: relative;
  width: 100%;
  animation: ${popoverPopIn} ${POPOVER_POP_MS}ms cubic-bezier(0.34, 1.45, 0.64, 1) forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
    transform: rotate(-2deg);
  }
`

/** Where the drawn pointer meets the box: its top edge below the term, else its bottom. */
const pointerEdge = (pos, box) =>
  edgeAt(pos.place === "below" ? box.top : box.bottom, pos.pointer)

/**
 * With a drawn pointer, the painted bolt would point elsewhere: crop it off
 * along the box's slanted bottom edge (below the last line of text, so no
 * copy is cut). The character stays.
 */
function shellClip(pos, box) {
  if (pos?.pointer == null) return "none"
  const pct = (v) => `${(v * 100).toFixed(2)}%`
  const [botL, botR] = box.clipBottom
  return `polygon(0 0, 100% 0, 100% ${pct(botR)}, 0 ${pct(botL)})`
}

const ShellWrap = styled.div`
  position: relative;
  width: 100%;
`

/** Stands in for the painted bolt; `left` / `top` are set inline to aim at the term. */
const Pointer = styled.span`
  position: absolute;
  z-index: 1;
  width: 0;
  height: 0;
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  ${({ $below }) =>
    $below
      ? `border-bottom: ${POINTER_H_PX}px solid #000; transform: translate(-50%, -100%);`
      : `border-top: ${POINTER_H_PX}px solid #000; transform: translate(-50%, -2px);`}
`

const ShellImg = styled.img`
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  pointer-events: none;
`

export default ExplainTerm
