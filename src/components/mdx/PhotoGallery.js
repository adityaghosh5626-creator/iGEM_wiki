import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

/**
 * Team-social and reel photos. One photo is just the image. Several loop:
 * the current photo is large, and the previous and next peek in smaller and
 * faded. Drag, horizontal scroll, the buttons, the side previews, and arrow
 * keys move it. Photos are not links.
 */
export const PhotoGallery = ({ slides = [] }) => {
  const [index, setIndex] = useState(0)
  const stageRef = useRef(null)
  const drag = useRef(null)
  const suppressClick = useRef(false)
  const count = slides.length

  const mod = i => ((i % count) + count) % count
  const step = delta => {
    if (count < 2) return
    setIndex(i => mod(i + delta))
  }

  useEffect(() => {
    const el = stageRef.current
    if (!el || count < 2) return
    let acc = 0
    let locked = false
    const onWheel = event => {
      if (Math.abs(event.deltaX) < 8 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      if (locked) return
      acc += event.deltaX
      if (Math.abs(acc) < 28) return
      const dir = acc > 0 ? 1 : -1
      acc = 0
      locked = true
      setIndex(i => (i + dir + count) % count)
      window.setTimeout(() => {
        locked = false
      }, 320)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [count])

  if (count === 0) return null

  const current = mod(index)
  const label = slides[current].alt || "Photos"

  if (count === 1) {
    return (
      <Solo>
        <Photo src={slides[0].src} alt={slides[0].alt || "Photo"} decoding="async" />
      </Solo>
    )
  }

  const onKeyDown = event => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      step(-1)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      step(1)
    }
  }

  const onPointerDown = event => {
    if (event.button !== 0) return
    drag.current = { x: event.clientX }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerUp = event => {
    if (!drag.current) return
    const dx = event.clientX - drag.current.x
    drag.current = null
    if (dx <= -48) {
      suppressClick.current = true
      step(1)
    } else if (dx >= 48) {
      suppressClick.current = true
      step(-1)
    }
  }

  const onSlideClick = delta => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    if (delta !== 0) step(delta)
  }

  const prev = slides[mod(current - 1)]
  const next = slides[mod(current + 1)]

  return (
    <Gallery tabIndex={0} aria-label={label} onKeyDown={onKeyDown}>
      <Stage
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null
        }}
      >
        <Peek
          type="button"
          $side="left"
          aria-label="Previous photo"
          tabIndex={-1}
          onClick={() => onSlideClick(-1)}
        >
          <PeekImg src={prev.src} alt="" draggable={false} />
        </Peek>
        <Peek
          type="button"
          $side="right"
          aria-label="Next photo"
          tabIndex={-1}
          onClick={() => onSlideClick(1)}
        >
          <PeekImg src={next.src} alt="" draggable={false} />
        </Peek>
        <Center>
          <Photo
            src={slides[current].src}
            alt={`${label}, photo ${current + 1} of ${count}`}
            draggable={false}
            decoding="async"
          />
        </Center>
      </Stage>
      <Controls>
        <NavButton type="button" onClick={() => step(-1)}>
          Previous
        </NavButton>
        <Caption>
          {label}
          <Count aria-live="polite">
            {current + 1} of {count}
          </Count>
        </Caption>
        <NavButton type="button" onClick={() => step(1)}>
          Next
        </NavButton>
      </Controls>
    </Gallery>
  )
}

const photoFit = `
  && {
    display: block;
    width: 100%;
    height: auto;
    max-height: 70vh;
    object-fit: contain;
  }
`

const Solo = styled.figure`
  margin: var(--space-sm) 0 0;
  max-width: 100%;
  min-width: 0;
`

const Photo = styled.img`
  ${photoFit}
`

const Gallery = styled.figure`
  margin: var(--space-sm) 0 0;
  max-width: 100%;
  min-width: 0;
  outline: none;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
  }
`

const Stage = styled.div`
  position: relative;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;

  &:active {
    cursor: grabbing;
  }
`

const Center = styled.div`
  position: relative;
  z-index: 2;
  width: 74%;
  margin: 0 auto;
  pointer-events: none;
`

const Peek = styled.button`
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 42%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  opacity: 0.45;

  ${({ $side }) =>
    $side === "left"
      ? "left: 0; transform: translateY(-50%); transform-origin: left center;"
      : "right: 0; transform: translateY(-50%); transform-origin: right center;"}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const PeekImg = styled.img`
  && {
    display: block;
    width: 100%;
    height: auto;
    max-height: 46vh;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
  }
`

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm) var(--space-md);
  min-width: 0;
  margin-top: var(--space-sm);
`

const NavButton = styled.button`
  flex: none;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;

  &:hover {
    background: color-mix(in srgb, var(--color-border) 22%, var(--color-surface));
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`

const Caption = styled.p`
  min-width: 0;
  margin: 0;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
`

const Count = styled.span`
  display: block;
  margin-top: 0.15rem;
  color: var(--color-muted);
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`
