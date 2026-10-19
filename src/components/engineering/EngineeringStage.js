import React, { useId } from "react"
import styled from "styled-components"
import { ENGINEERING_STAGES } from "../../data/engineeringCycles.js"

/** Keep these wrappers in MDX so the wheel can find each scroll destination. */
export function EngineeringStage({ id, children }) {
  const titleId = useId()
  const index = ENGINEERING_STAGES.findIndex(stage => stage.id === id)
  const stage = ENGINEERING_STAGES[index]
  if (!stage) throw new Error(`Unknown engineering stage: ${id}`)
  return (
    <StageSection data-engineering-stage={id} aria-labelledby={titleId}>
      <StageTitle id={titleId} $color={stage.color}>
        <span>0{index + 1}</span> {stage.label}
      </StageTitle>
      {children}
    </StageSection>
  )
}

const StageSection = styled.section`
  padding-bottom: 1rem;
  overflow-wrap: anywhere;
  &:last-child { min-height: 100%; }
  & + & { padding-top: 1rem; border-top: 1px dashed #d6c5ac; }
  img { max-width: 100%; height: auto; }
`
const StageTitle = styled.h3`
  && { margin: 0 0 1rem; border: 0; padding: 0.5rem 0.7rem; background: ${({ $color }) => $color}; color: #382d24; font-size: 1.25rem; }
  span { font-size: 0.8rem; margin-right: 0.35rem; }
`
