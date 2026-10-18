import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import styled, { css, keyframes } from "styled-components"
import {
  LOGO_BOX,
  LOGO_FRAMES,
  LOGO_FRAME_TIMING,
  LOGO_PLATE,
  LOGO_REST,
  LogoFrame,
} from "./logoFrames.js"

/** Give up waiting on slow images after this long. */
const LOADER_TIMEOUT_MS = 7000
/** Fill (clip) transition; the exit waits for it to reach the top. */
const FILL_MS = 380
const FADE_MS = 480
const BOUNCE_MS = 320
const SPRING_MS = 760
/** Overshoots a little, then settles — the "spring" into the hero slot. */
const SPRING_EASING = "cubic-bezier(0.34, 1.32, 0.52, 1)"

/** Set once any loader has finished: later pages show it only while they load. */
let siteLoadedOnce = false

/**
 * A page change still being fetched after a second (gatsby-browser's
 * onRouteUpdateDelayed; it stands in for Gatsby's own "Preparing requested
 * page" notice). The page being left puts the loader up, and the page
 * arriving keeps it up until its images are in.
 */
let routeWaiting = false
const ROUTE_WAIT_EVENT = "wiki:route-wait"
const ROUTE_DONE_EVENT = "wiki:route-done"

export function startRouteWait() {
  routeWaiting = true
  window.dispatchEvent(new Event(ROUTE_WAIT_EVENT))
}

export function endRouteWait() {
  routeWaiting = false
  window.dispatchEvent(new Event(ROUTE_DONE_EVENT))
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

/** Images the loader waits on: deferred ones may not load until scrolled to. */
const eagerImages = () =>
  [...document.images].filter(img => img.loading !== "lazy")

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

/** Current point in the logo loop (ms), read off the first frame's animation. */
function loopPhase(root) {
  const anim = root?.querySelector("[data-logo-frame]")?.getAnimations?.()[0]
  const t = anim?.currentTime
  return typeof t === "number" ? t % LOGO_FRAME_TIMING.cycleMs : 0
}

function LogoFrames() {
  return (
    <FramesWindow>
      {LOGO_FRAMES.map((src, i) => (
        <LogoFrame key={src} src={src} alt="" $index={i} />
      ))}
    </FramesWindow>
  )
}

/**
 * Full-screen loader: the PETABITE logo loop, filled in from the bottom as the
 * page's images load, then faded out.
 *
 * `handoff` (homepage): a function returning `{ getRect, onLand }` for the
 * hero logo. Instead of fading, the loader logo freezes, bounces, and springs
 * into `getRect()` (the hero's painted logo box, viewport px); `onLand(phaseMs)`
 * then lets the hero take over from the frozen frame.
 * `always`: show even after the first page load (client-side navigation).
 */
export function SiteLoader({ handoff, always = false }) {
  // "check": a page reached from another; the loader only shows (before
  // the first paint) if its images still have to load.
  const [state, setState] = useState(() =>
    always || !siteLoadedOnce || routeWaiting ? "loading" : "check"
  )
  const [progress, setProgress] = useState(0)
  const overlayRef = useRef(null)
  const backdropRef = useRef(null)
  const logoRef = useRef(null)
  const handoffRef = useRef(handoff)
  handoffRef.current = handoff
  const mountedRef = useRef(true)
  useEffect(
    () => () => {
      mountedRef.current = false
    },
    []
  )

  useIsoLayoutEffect(() => {
    if (state !== "check") return
    setState(eagerImages().some(img => !img.complete) ? "loading" : "done")
  }, [state])

  // A slow page change: cover this page until the next one takes over.
  useEffect(() => {
    const wait = () => {
      setProgress(0)
      setState(s => (s === "done" || s === "check" ? "waiting" : s))
    }
    // Still here once it has arrived (the same page): show it's ready.
    const done = () => setState(s => (s === "waiting" ? "loading" : s))
    window.addEventListener(ROUTE_WAIT_EVENT, wait)
    window.addEventListener(ROUTE_DONE_EVENT, done)
    return () => {
      window.removeEventListener(ROUTE_WAIT_EVENT, wait)
      window.removeEventListener(ROUTE_DONE_EVENT, done)
    }
  }, [])

  // One logo loop for every loader (the timeline's), so the leaving page's
  // loader hands over to the arriving page's without the logo jumping.
  const shown = state !== "done" && state !== "check"
  useIsoLayoutEffect(() => {
    if (!shown) return
    logoRef.current?.querySelectorAll("[data-logo-frame]").forEach(el =>
      el.getAnimations?.().forEach(anim => {
        anim.startTime = 0
      })
    )
  }, [shown])

  useEffect(() => {
    if (state !== "loading") return undefined
    const imgs = eagerImages()
    const total = imgs.length
    let loaded = imgs.filter(img => img.complete).length
    setProgress(total === 0 ? 1 : loaded / total)
    const mark = () => {
      loaded += 1
      setProgress(Math.min(1, loaded / total))
    }
    const pending = imgs.filter(img => !img.complete)
    pending.forEach(img => {
      img.addEventListener("load", mark, { once: true })
      img.addEventListener("error", mark, { once: true })
    })
    const timer = window.setTimeout(() => setProgress(1), LOADER_TIMEOUT_MS)
    return () => {
      window.clearTimeout(timer)
      pending.forEach(img => {
        img.removeEventListener("load", mark)
        img.removeEventListener("error", mark)
      })
    }
  }, [state])

  // Once full (and the fill has visibly reached the top), leave.
  useEffect(() => {
    if (state !== "loading" || progress < 1) return undefined
    // Only the pending timer is cancellable; once the exit starts it runs to
    // the end (setting "leaving" below re-runs this effect's cleanup).
    const timer = window.setTimeout(async () => {
      setState("leaving")
      siteLoadedOnce = true
      const overlay = overlayRef.current
      const backdrop = backdropRef.current
      const logo = logoRef.current
      const target = handoffRef.current?.()
      const reduce = prefersReducedMotion()

      const fadeOut = async () => {
        await overlay?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: reduce ? 0 : FADE_MS,
          easing: "ease",
          fill: "forwards",
        }).finished
      }

      if (!target || !logo || !backdrop) {
        await fadeOut()
        target?.onLand(0)
      } else {
        // Freeze on the current frame; the hero picks up from here.
        logo.dataset.frozen = "1"
        const phase = loopPhase(logo)
        const rect = target.getRect()
        const visible = rect && rect.bottom > 0 && rect.top < window.innerHeight
        if (reduce || !visible) {
          await fadeOut()
          target.onLand(phase)
        } else {
          await logo.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(0.9)", offset: 0.45 },
              { transform: "scale(1.04)", offset: 0.8 },
              { transform: "scale(1)" },
            ],
            { duration: BOUNCE_MS, easing: "ease-in-out" }
          ).finished
          const from = logo.getBoundingClientRect()
          const to = target.getRect()
          const k = to.width / Math.max(1, from.width)
          logo.style.transformOrigin = "0 0"
          backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: SPRING_MS * 0.7,
            easing: "ease-out",
            fill: "forwards",
          })
          await logo.animate(
            [
              { transform: "translate(0, 0) scale(1)" },
              {
                transform: `translate(${to.left - from.left}px, ${
                  to.top - from.top
                }px) scale(${k})`,
              },
            ],
            { duration: SPRING_MS, easing: SPRING_EASING, fill: "forwards" }
          ).finished
          target.onLand(phase)
        }
      }
      if (mountedRef.current) setState("done")
    }, FILL_MS)
    return () => window.clearTimeout(timer)
  }, [state, progress])

  if (!shown) return null

  return (
    <Overlay
      ref={overlayRef}
      aria-hidden={state === "leaving"}
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      $leaving={state === "leaving"}
      $fadeIn={state === "waiting"}
    >
      <Backdrop ref={backdropRef} />
      <Centred>
        <Logo ref={logoRef}>
          <Faint>
            <LogoFrames />
          </Faint>
          <Fill style={{ clipPath: `inset(${(1 - progress) * 100}% 0 0 0)` }}>
            <LogoFrames />
          </Fill>
        </Logo>
      </Centred>
    </Overlay>
  )
}

export default SiteLoader

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: ${({ $leaving }) => ($leaving ? "none" : "auto")};
  /* Over the page being left, it fades in rather than cutting. */
  ${({ $fadeIn }) =>
    $fadeIn &&
    css`
      animation: ${fadeIn} 0.25s ease both;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/** Same off-white as the navbar; fades separately so the logo can fly out. */
const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: var(--color-bg);
`

/**
 * Moves the logo so the resting logo, not the box round every frame, sits in
 * the middle of the screen. Its own element, so the homepage's bounce and
 * spring (animations on Logo) start from where it's drawn.
 */
const Centred = styled.div`
  position: relative;
  transform: translate(
    ${(((LOGO_BOX.x + LOGO_BOX.w / 2 - (LOGO_REST.x + LOGO_REST.w / 2)) / LOGO_BOX.w) * 100).toFixed(2)}%,
    ${(((LOGO_BOX.y + LOGO_BOX.h / 2 - (LOGO_REST.y + LOGO_REST.h / 2)) / LOGO_BOX.h) * 100).toFixed(2)}%
  );
`

const Logo = styled.div`
  position: relative;
  width: min(72vw, 40rem);
  aspect-ratio: ${LOGO_BOX.w} / ${LOGO_BOX.h};

  &[data-frozen="1"] [data-logo-frame] {
    animation-play-state: paused;
  }
`

const Faint = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.16;
  filter: grayscale(1);
`

const Fill = styled.div`
  position: absolute;
  inset: 0;
  transition: clip-path ${FILL_MS}ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

/** Full frame plates offset so only LOGO_BOX shows. */
const FramesWindow = styled.div`
  position: absolute;
  left: ${(-LOGO_BOX.x / LOGO_BOX.w) * 100}%;
  top: ${(-LOGO_BOX.y / LOGO_BOX.h) * 100}%;
  width: ${(LOGO_PLATE.w / LOGO_BOX.w) * 100}%;
`
