import React, { useId, useState } from "react"
import styled from "styled-components"
import { ENGINEERING_STAGES } from "../../data/engineeringCycles.js"
import { EngineeringArtwork } from "./EngineeringArtwork.js"

function point(radius, degrees) {
  const angle = (degrees - 90) * Math.PI / 180
  return [170 + radius * Math.cos(angle), 170 + radius * Math.sin(angle)]
}

// Geometric fallback for a wheel without custom artwork regions.
function segment(index, artwork = false) {
  const gap = artwork ? 0 : 3
  const radius = artwork ? 170 : 154
  const start = index * 90 + gap
  const end = (index + 1) * 90 - gap
  return `M ${point(radius, start)} A ${radius} ${radius} 0 0 1 ${point(radius, end)} L ${point(77, end)} A 77 77 0 0 0 ${point(77, start)} Z`
}

export function EngineeringCycleWheel({ activeStage, onSelect, panelId, art = {} }) {
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const id = useId().replace(/:/g, "")
  const { cycleImage, centerImage, centerAlt, showCycleLabels } = art
  return (
    <WheelContainer>
    <Wheel viewBox="0 0 340 340" role="group" aria-label="Engineering cycle sections" $artwork={Boolean(cycleImage)}>
      <defs>
        <clipPath id={`${id}-cycle`}><circle cx="170" cy="170" r="170" /></clipPath>
        <clipPath id={`${id}-center`}><circle cx="170" cy="170" r="77" /></clipPath>
      </defs>
      {cycleImage && (art.cycleCrop ? <svg x="0" y="0" width="340" height="340" viewBox="0 0 340 340" aria-hidden="true">
        <EngineeringArtwork src={cycleImage} crop={art.cycleCrop} />
      </svg> : <image href={cycleImage} x="0" y="0" width="340" height="340"
        preserveAspectRatio="xMidYMid meet" clipPath={`url(#${id}-cycle)`} aria-hidden="true" />)}
      {ENGINEERING_STAGES.map((stage, index) => {
        const active = stage.id === activeStage
        const regionPath = cycleImage && art.cycleRegions?.[index]
          ? art.cycleRegions[index]
          : segment(index, Boolean(cycleImage))
        const [x, y] = point(114, index * 90 + 45)
        return (
          <g key={stage.id} role="button" tabIndex={0}
            aria-label={`Go to ${stage.label}`} aria-pressed={active}
            aria-controls={panelId}
            onClick={() => onSelect(stage.id)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect(stage.id)
              }
            }}>
            <path
              className="segment"
              d={regionPath}
              fill={cycleImage ? "transparent" : stage.color}
            />
            <path
              className="veil"
              d={regionPath}
              fill="#fff"
              opacity={active ? 0 : 0.65}
            /> 
            {(!cycleImage || showCycleLabels) && <>
            <text x={x} y={y - 7} textAnchor="middle" className="number">0{index + 1}</text>
            <text x={x} y={y + 17} textAnchor="middle" className="label">{stage.label}</text>
            </>}
          </g>
        )
      })}
      {!centerImage && !cycleImage && <>
      <circle cx="170" cy="170" r="67" fill="#fffaf0" stroke="#d6c5ac" strokeDasharray="3 5" />
      <text x="170" y="164" textAnchor="middle" className="center-label">ENGINEERING</text>
      <text x="170" y="187" textAnchor="middle" className="center-sub">cycle ↻</text>
      </>}
    </Wheel>
    {centerImage && <CenterControl
      onMouseEnter={() => setBubbleOpen(true)} onMouseLeave={() => setBubbleOpen(false)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setBubbleOpen(false) }}
      onKeyDown={event => { if (event.key === "Escape") { setBubbleOpen(false); event.stopPropagation() } }}>
      <CenterButton type="button" aria-label={`${centerAlt}: explore related pages`}
        aria-expanded={bubbleOpen} aria-controls={`${id}-links`}
        onFocus={() => setBubbleOpen(true)} onClick={() => setBubbleOpen(true)}>
        <CenterArt $bounds={art.centerBounds || [111, 107, 119, 119]}>
          {art.centerCrop ? <EngineeringArtwork src={centerImage} crop={art.centerCrop} /> : <img src={centerImage} alt="" />}
        </CenterArt>
      </CenterButton>
      <SpeechBubble id={`${id}-links`} hidden={!bubbleOpen}>
        <BubbleArt><EngineeringArtwork src={art.speechBubbleImage} crop={art.speechBubbleCrop} preserveAspectRatio="none" removeWhite /></BubbleArt>
        <BubbleText>{(art.links || []).map(url => <p key={url}>Visit <a href={url}>{url}</a> for more.</p>)}</BubbleText>
      </SpeechBubble>
    </CenterControl>}
    </WheelContainer>
  )
}

const Wheel = styled.svg`
  display: block;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
  overflow: visible;
  font-family: var(--font-body);
  g { cursor: pointer; outline: none; }
  image { pointer-events: none; }
  ${({ $artwork }) => $artwork && `mix-blend-mode: multiply;`}
  .segment { stroke: transparent; stroke-width: 3; }
  .veil { pointer-events: none; transition: opacity 180ms ease; }
  g:focus-visible .segment { stroke: #594632; }
  ${({ $artwork }) => !$artwork && `g:hover .segment { stroke: #594632; }`}
  text { fill: #382d24; pointer-events: none; }
  .number { font-size: 12px; letter-spacing: 2px; }
  .label { font-size: 18px; font-weight: 700; }
  ${({ $artwork }) => $artwork && `.label, .number { fill: #fff; paint-order: stroke; stroke: #315950; stroke-width: 2px; }`}
  .center-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .center-sub { font-size: 19px; }
  @media (prefers-reduced-motion: reduce) { .veil { transition: none; } }
`

const WheelContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem;
  margin: 0 auto;
`
const CenterControl = styled.div`
  position: absolute;
  width: 35%;
  height: 35%;
  left: 32.5%;
  top: 31.5%;
  z-index: auto;
`
const CenterButton = styled.button`
  width: 100%; height: 100%; padding: 0; border: 0;
  background: transparent; cursor: pointer; border-radius: 50%;
  position: absolute; inset: 0;
  mix-blend-mode: multiply;
  img { width: 100%; height: 100%; object-fit: contain; }
  &:focus-visible { outline: 2px solid #594632; outline-offset: 3px; }
`
const CenterArt = styled.div`
  position: absolute;
  pointer-events: none;
  left: ${({ $bounds }) => (($bounds[0] - 110.5) / 119) * 100}%;
  top: ${({ $bounds }) => (($bounds[1] - 107.1) / 119) * 100}%;
  width: ${({ $bounds }) => ($bounds[2] / 119) * 100}%;
  height: ${({ $bounds }) => ($bounds[3] / 119) * 100}%;
`
const SpeechBubble = styled.div`
  position: absolute; top: 100%; left: -85%; width: 270%;
  padding: 2rem 1rem 0.9rem; z-index: 3;
  isolation: isolate;
  &[hidden] { display: none; }
`
const BubbleArt = styled.div`
  position: absolute; inset: 0; pointer-events: none;
`
const BubbleText = styled.div`
  position: relative; color: #20180f; font-size: 0.75rem; line-height: 1.4;
  p { margin: 0 0 0.5rem; }
  p:last-child { margin-bottom: 0; }
  a { color: inherit; text-decoration: underline; overflow-wrap: anywhere; }
  a:focus-visible { outline: 2px solid #20180f; }
`
