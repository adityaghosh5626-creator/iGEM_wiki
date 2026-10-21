import React, { useId, useRef, useState } from "react"
import { navigate, withPrefix } from "gatsby"
import styled from "styled-components"
import { HARDWARE_SUBSYSTEMS } from "../../data/hardwareIterations.js"
import { HARDWARE_MAPS, HARDWARE_MAP_COLOURS } from "../../data/hardwareMap.js"

const ITERATIONS_PATH = "/hardware/past-iterations/"

/**
 * The prototype photo with each part outlined in its subsystem's colour and
 * labelled. Hovered (focused), a part tells what it does; clicked, it opens
 * that subsystem under Past Iterations. Pass `version` (`version-1`,
 * `version-2`, or `version-3`) to use that photo. On touch, the first tap
 * shows what it does and the second opens it.
 */
export function HardwareMap({ version = "version-1" }) {
  const map = HARDWARE_MAPS[version] || HARDWARE_MAPS["version-1"]
  const { src, size: [W, H], alt, parts, summaries } = map
  const id = useId()
  // The part shown: its subsystem's parts all light up, its label says more.
  const [active, setActive] = useState(null)
  const touched = useRef(false)
  const labelOf = sub => HARDWARE_SUBSYSTEMS.find(s => s.id === sub)?.label || sub
  const path = sub => `${ITERATIONS_PATH}#${version ? `${version}-` : ""}${sub}`

  const open = (sub, i) => event => {
    // A tap on a part not yet shown: show it first.
    if (touched.current && active?.i !== i) {
      event.preventDefault()
      setActive({ sub, i })
      return
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return
    event.preventDefault()
    const hash = `#${version ? `${version}-` : ""}${sub}`
    const here = window.location.pathname.replace(/\/$/, "")
    const page = withPrefix(ITERATIONS_PATH).replace(/\/$/, "")
    // Already on Past Iterations: set the hash so the timeline hears it.
    // Gatsby's navigate updates the address without a hashchange event.
    if (here === page) {
      if (window.location.hash === hash) {
        document.getElementById("iteration-subsystems")?.scrollIntoView({ block: "start" })
      } else {
        window.location.hash = hash
      }
      return
    }
    navigate(path(sub))
  }
  const handlers = (sub, i) => ({
    href: withPrefix(path(sub)),
    onPointerDown: event => {
      touched.current = event.pointerType !== "mouse"
    },
    onMouseEnter: () => setActive({ sub, i }),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive({ sub, i }),
    onBlur: () => setActive(null),
    onClick: open(sub, i),
  })

  return (
    <Figure>
      <Stage style={{ aspectRatio: `${W} / ${H}` }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        <svg viewBox={`0 0 ${W} ${H}`} aria-label="Bioreactor parts">
          <defs>
            <filter id={`${id}-aura`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          {parts.map((part, i) => {
            const colour = HARDWARE_MAP_COLOURS[part.subsystem]
            const about = summaries[part.subsystem]
            const points = part.points.map(p => p.join(",")).join(" ")
            return (
              <PartLink
                key={i}
                {...handlers(part.subsystem, i)}
                aria-label={`${labelOf(part.subsystem)}: ${about} Opens that subsystem.`}
                $on={active?.sub === part.subsystem}
                style={{ "--part": colour }}
              >
                <polygon className="aura" points={points} filter={`url(#${id}-aura)`} />
                <polygon className="edge" points={points} />
              </PartLink>
            )
          })}
        </svg>
        {parts.map((part, i) => {
          const colour = HARDWARE_MAP_COLOURS[part.subsystem]
          const about = summaries[part.subsystem]
          const [x, y] = part.label
          const right = part.align === "right"
          const on = active?.sub === part.subsystem
          return (
            <Label
              key={i}
              {...handlers(part.subsystem, i)}
              // The outlines are the links read out; these are for pointers.
              tabIndex={-1}
              aria-hidden
              $on={on}
              $right={right}
              style={{
                "--part": colour,
                top: `${((y / H) * 100).toFixed(2)}%`,
                ...(right
                  ? { right: `${(((W - x) / W) * 100).toFixed(2)}%` }
                  : { left: `${((x / W) * 100).toFixed(2)}%` }),
              }}
            >
              <Pill>{labelOf(part.subsystem)}</Pill>
              {active?.i === i && (
                // Away from its part, and kept inside the photo.
                <Tip $up={part.tip === "up" || y > H * 0.6} $right={right || x > W * 0.45}>
                  {about}
                  <More>{touched.current ? "Tap again" : "Click"} to read more</More>
                </Tip>
              )}
            </Label>
          )
        })}
      </Stage>
      <figcaption>
        Hover over (or tap) a part to see what it does, and click it to open
        that subsystem.
      </figcaption>
    </Figure>
  )
}

const Figure = styled.figure`
  width: 100%;
  max-width: 40rem;
  margin: var(--space-lg) auto;

  figcaption {
    margin-top: var(--space-sm);
    color: var(--color-muted);
    font-size: 0.9rem;
    text-align: center;
  }
`

const Stage = styled.div`
  position: relative;
  width: 100%;
  container-type: inline-size;

  img,
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
    object-fit: cover;
    border-radius: 0.6rem;
  }
`

/** A part's outline: a soft aura in its colour, brighter while it's shown. */
const PartLink = styled.a`
  cursor: pointer;
  outline: none;

  polygon {
    fill: var(--part);
    stroke: var(--part);
    stroke-linejoin: round;
    transition: fill-opacity 0.2s ease, stroke-opacity 0.2s ease;
  }

  .aura {
    fill-opacity: 0;
    stroke-width: 10;
    stroke-opacity: ${({ $on }) => ($on ? 0.95 : 0.6)};
  }

  .edge {
    fill-opacity: ${({ $on }) => ($on ? 0.3 : 0.1)};
    stroke-width: ${({ $on }) => ($on ? 3 : 2)};
  }

  &:focus-visible .edge {
    stroke: #fff;
    stroke-dasharray: 6 4;
  }
`

const Label = styled.a`
  position: absolute;
  z-index: ${({ $on }) => ($on ? 2 : 1)};
  display: flex;
  flex-direction: column;
  align-items: ${({ $right }) => ($right ? "flex-end" : "flex-start")};
  text-decoration: none;
  transform: translateY(-50%);

  /* Not the page text's link underline and hover tint. */
  &&& {
    border-bottom: 0;
    background: none;
  }
`

const Pill = styled.span`
  padding: 0.2em 0.6em;
  border: 2px solid var(--part);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #1d2a33;
  font-size: clamp(0.62rem, 2.4cqw, 0.85rem);
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 0 0.6em var(--part);
`

const Tip = styled.span`
  position: absolute;
  ${({ $up }) => ($up ? "bottom: calc(100% + 0.4em);" : "top: calc(100% + 0.4em);")}
  ${({ $right }) => ($right ? "right: 0;" : "left: 0;")}
  width: min(15rem, 55cqw);
  padding: 0.55em 0.7em;
  border-left: 4px solid var(--part);
  border-radius: 0.4rem;
  background: rgba(255, 255, 255, 0.97);
  color: #1d2a33;
  font-size: clamp(0.66rem, 2.3cqw, 0.82rem);
  line-height: 1.4;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
`

const More = styled.span`
  display: block;
  margin-top: 0.35em;
  color: #4d5b66;
  font-weight: 700;
`
