import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

/**
 * Optional auto-scroll for the homepage: a play button (bottom left; its
 * "Auto-scroll" label slides out on hover) makes the page scroll itself at a reading pace. As each popup
 * reaches the middle of the screen it stops and opens it (the red underlined
 * terms, then each petamon's description at the ending), then carries on.
 * Any scroll, tap or key from the reader hands control back.
 *
 * Self-contained: popups are opened through their own hover behaviour, so
 * nothing else knows this exists. To take it out, delete this file, the two
 * `HomeAutoplay` lines and the `data-autoplay-forest` attribute in
 * HomeScrollPrototype.js.
 */

/** Scroll speed, in screen heights per second. */
const SPEED_VH_PER_S = 0.16
/** How long each term's popup stays open. */
const TERM_HOLD_MS = 4500
/** How long each petamon's description stays open at the ending. */
const PETAMON_HOLD_MS = 2600
/** A popup opens once its middle reaches this far down the screen. */
const STOP_AT_VIEW_Y = 0.55
/** Faster while the forest walk holds the page (it's long to sit through). */
const FOREST_SPEED_X = 2

/** The red underlined terms (ExplainTermPopover): they open on hover. */
const TERM_SELECTOR = 'span[role="button"][aria-expanded]'
/** The petamon names at the ending (EndingPetamonBottle): they open on hover. */
const PETAMON_LABEL_SELECTOR = "[data-label]"

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const maxScroll = () =>
  document.documentElement.scrollHeight - window.innerHeight

function isShown(el) {
  return el.checkVisibility
    ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
    : true
}

/** A mouse moving onto or off a term (React's mouse enter / leave). */
function mouse(el, over) {
  el.dispatchEvent(
    new MouseEvent(over ? "mouseover" : "mouseout", {
      bubbles: true,
      relatedTarget: over ? null : document.body,
    }),
  )
}

/** A pointer moving onto or off a petamon name (pointer enter / leave). */
function hover(el, over) {
  el.dispatchEvent(
    new PointerEvent(over ? "pointerover" : "pointerout", {
      bubbles: true,
      pointerType: "mouse",
      relatedTarget: over ? null : document.body,
    }),
  )
}

export function HomeAutoplay() {
  const [playing, setPlaying] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!playing) return undefined
    const root = buttonRef.current?.parentElement ?? document.body
    let cancelled = false
    let raf = 0
    // Closes whatever popup is open, if the run ends while it's showing.
    let closeOpen = null

    if (window.scrollY >= maxScroll() - 2) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }

    const terms = [...root.querySelectorAll(TERM_SELECTOR)].map(el => ({
      el,
      ready: () => isShown(el),
      play: async () => {
        mouse(el, true)
        closeOpen = () => mouse(el, false)
        await wait(TERM_HOLD_MS)
      },
    }))
    const labels = [...root.querySelectorAll(PETAMON_LABEL_SELECTOR)]
    const petamons = labels.length
      ? [
          {
            el: labels[0].parentElement,
            // Their names fade in once the petamons have burst out.
            ready: () =>
              labels.every(l => parseFloat(getComputedStyle(l).opacity) > 0.9),
            play: async () => {
              for (const label of labels) {
                if (cancelled) return
                hover(label, true)
                closeOpen = () => hover(label, false)
                await wait(PETAMON_HOLD_MS)
                closeOpen()
                closeOpen = null
              }
            },
          },
        ]
      : []
    // Popups already scrolled past when it starts are skipped.
    const stops = [...terms, ...petamons].map(stop => ({
      ...stop,
      done: stop.el.getBoundingClientRect().bottom < 0,
    }))
    const due = stop => {
      const r = stop.el.getBoundingClientRect()
      return (
        r.bottom > 0 &&
        r.top + r.height / 2 <= window.innerHeight * STOP_AT_VIEW_Y &&
        stop.ready()
      )
    }

    let pos = window.scrollY
    let last = performance.now()
    const tick = now => {
      if (cancelled) return
      const stop = stops.find(s => !s.done && due(s))
      if (stop) {
        stop.done = true
        stop.play().then(() => {
          if (cancelled) return
          closeOpen?.()
          closeOpen = null
          pos = window.scrollY
          last = performance.now()
          raf = requestAnimationFrame(tick)
        })
        return
      }
      // The page can move the scroll itself (the forest walk and the ending
      // give back their scroll length once played): carry on from there.
      if (Math.abs(window.scrollY - pos) > 2) pos = window.scrollY
      const dt = Math.min(64, now - last)
      last = now
      // The forest's composition is pinned (fixed) while its walk plays.
      const forest = root.querySelector("[data-autoplay-forest]")
      const speed =
        forest && getComputedStyle(forest).position === "fixed"
          ? SPEED_VH_PER_S * FOREST_SPEED_X
          : SPEED_VH_PER_S
      pos = Math.min(
        maxScroll(),
        pos + (speed * window.innerHeight * dt) / 1000,
      )
      window.scrollTo({ top: pos, left: 0, behavior: "instant" })
      if (pos >= maxScroll() - 1) {
        setPlaying(false)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // The reader taking over (not this button, not the simulated hovers).
    const takeOver = event => {
      if (!event.isTrusted || buttonRef.current?.contains(event.target)) return
      setPlaying(false)
    }
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"]
    inputs.forEach(type =>
      window.addEventListener(type, takeOver, { passive: true }),
    )
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      closeOpen?.()
      inputs.forEach(type => window.removeEventListener(type, takeOver))
    }
  }, [playing])

  return (
    <AutoplayButton
      ref={buttonRef}
      type="button"
      aria-pressed={playing}
      title={
        playing
          ? "Pause (or just scroll)"
          : "Let the page scroll itself; popups open on their own"
      }
      onClick={() => setPlaying(p => !p)}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        {playing ? (
          <path d="M4 3h3v10H4zM9 3h3v10H9z" />
        ) : (
          <path d="M5 2.5v11l9-5.5z" />
        )}
      </svg>
      <Label>{playing ? "Pause" : "Auto-scroll"}</Label>
    </AutoplayButton>
  )
}

export default HomeAutoplay

/**
 * A circle like the back-to-top button (bottom right), on the other side,
 * with just the play / pause icon; hovering or focusing it slides out what
 * it does.
 */
const AutoplayButton = styled.button`
  position: fixed;
  left: max(1rem, env(safe-area-inset-left));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 105;
  display: inline-flex;
  align-items: center;
  height: 3rem;
  min-width: 3rem;
  /* Centres the icon in the circle while the label is tucked away. */
  padding: 0 calc((3rem - 2px - 0.95rem) / 2);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-text);
  box-shadow: 0 4px 14px rgba(6, 32, 43, 0.18);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background-color 0.2s ease;

  svg {
    flex: none;
    width: 0.95rem;
    height: 0.95rem;
    fill: currentColor;
  }

  &:hover {
    background: var(--color-surface);
    transform: translateY(-1px);
  }

  &:hover > span,
  &:focus-visible > span {
    max-width: 8rem;
    margin-left: 0.45rem;
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }
`

/** Still read out by screen readers while tucked away. */
const Label = styled.span`
  max-width: 0;
  margin-left: 0;
  overflow: hidden;
  white-space: nowrap;
  opacity: 0;
  transition:
    max-width 0.25s ease,
    margin-left 0.25s ease,
    opacity 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
