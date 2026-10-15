import React, { useId } from "react"
import styled from "styled-components"

export function IterationTimeline({ iterations, selectedIndex, onChange }) {
  const id = useId()
  return (
    <Timeline aria-label="Hardware iteration timeline">
      <label htmlFor={id}>Explore the iterations</label>
      <p>Drag the timeline or choose a version below.</p>
      <input id={id} type="range" min="0" max={iterations.length - 1} step="1"
        value={selectedIndex} aria-valuetext={iterations[selectedIndex].label}
        onChange={event => onChange(Number(event.target.value))} />
      <Stops>
        {iterations.map((iteration, index) => (
          <button key={iteration.id} type="button" aria-pressed={index === selectedIndex}
            onClick={() => onChange(index)}>{iteration.label}</button>
        ))}
      </Stops>
    </Timeline>
  )
}
const Timeline = styled.section`
  padding: clamp(1rem, 3vw, 2rem);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface, #faf6ed);
  label { font-size: 1.35rem; font-weight: 700; }
  p { margin: 0.5rem 0 1rem; }
  input { display: block; width: 100%; min-height: 44px; accent-color: var(--color-accent); cursor: pointer; }
  :focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }
`
const Stops = styled.div`
  display: flex; justify-content: space-between; gap: 0.5rem;
  button { min-height: 44px; padding: 0.5rem 0.8rem; border: 1px solid var(--color-border); border-radius: 2rem; font: inherit; color: inherit; background: transparent; cursor: pointer; }
  button[aria-pressed="true"] { background: var(--color-accent); color: white; border-color: var(--color-accent); }
  button:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 3px; }
`
