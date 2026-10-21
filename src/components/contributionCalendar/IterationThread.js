import React from "react"
import styled from "styled-components"
import {
  EvidenceLinks,
  KindTag,
  StatusPill,
  StepTimeline,
  StoryCore,
  StoryDetail,
  TrackBadge,
} from "./iterationParts.js"

/**
 * One iteration, followed through the season, in the calendar's details
 * panel: the story, then dated steps that move the calendar to their week.
 */
export function IterationThread({ it, track, meta, criteria, week, onClose, onPickDate }) {
  const inWeek = (date) => Boolean(week) && date >= week.start && date <= week.end
  return (
    <Root aria-label={`Iteration: ${it.title}`}>
      <Back type="button" onClick={onClose}>
        ← Back to this week
      </Back>
      <Head>
        {track ? <TrackBadge track={track} /> : null}
        <KindTag kind={it.kind} meta={meta} />
        <StatusPill status={it.status} meta={meta} />
      </Head>
      <Title>{it.title}</Title>
      <Lenses>Speaks to: {it.criteria.map((c) => criteria[c]).join(" · ")}</Lenses>
      <StoryCore it={it} />
      <StoryDetail it={it} />
      <Label>Timeline: pick a date to see that week</Label>
      <StepTimeline steps={it.steps} meta={meta} onPick={onPickDate} isCurrent={inWeek} />
      <EvidenceLinks see={it.see} source={it.source} />
    </Root>
  )
}

/** "This week's iterations": one line each, opening the thread. */
export function WeekIterations({ entries, meta, trackById, onOpen }) {
  if (!entries?.length) return null
  return (
    <List>
      <Label as="p">What went wrong, and what we changed</Label>
      {entries.map(({ iteration: it, steps }) => (
        <Row key={it.id}>
          <RowButton type="button" onClick={() => onOpen(it.id)}>
            <RowGlyph $kind={it.kind} aria-hidden>
              {meta.kinds[it.kind].glyph}
            </RowGlyph>
            <span>
              <RowMeta>
                {trackById[it.track]?.label ?? "Whole Dry Lab"} · {meta.kinds[it.kind].label} ·{" "}
                {steps.map((s) => meta.stages[s.stage]).join(", ")} this week
              </RowMeta>
              <RowTitle>{it.title}</RowTitle>
              <RowStep>{steps[steps.length - 1].text}</RowStep>
            </span>
            <RowGo aria-hidden>→</RowGo>
          </RowButton>
        </Row>
      ))}
    </List>
  )
}

const KIND_COLORS = {
  failure: "#b4492f",
  surprise: "#8a5a9e",
  constraint: "#6a6650",
  feedback: "#2f7a72",
}

const Root = styled.section`
  /* Its own container, so the story stacks to the panel's width. */
  container-type: inline-size;
  padding: var(--space-md);
  background: var(--cal-surface, #fff);
`

const Back = styled.button`
  margin-bottom: var(--space-sm);
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--cal-line, var(--color-border));
  border-radius: 5px;
  background: var(--cal-surface, #fff);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--cal-accent, #2d9194);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`

const Head = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.6rem;
`

const Title = styled.p`
  &&& {
    margin: 0.4rem 0 0.15rem;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.35;
    color: var(--cal-ink, var(--color-text));
  }
`

const Lenses = styled.p`
  &&& {
    margin: 0 0 var(--space-sm);
    font-size: 0.74rem;
    color: var(--cal-muted, var(--color-muted));
  }
`

const Label = styled.p`
  &&& {
    margin: var(--space-md) 0 0;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cal-accent, #2d9194);
  }
`

const List = styled.div`
  margin-bottom: var(--space-sm);
  padding: var(--space-sm) var(--space-md) var(--space-md);
  border: 1px solid var(--cal-line, var(--color-border));
  border-radius: 6px;
  background: var(--cal-surface, #fff);

  > p {
    margin-top: 0.35rem !important;
    margin-bottom: 0.35rem !important;
  }
`

const Row = styled.div`
  & + & {
    border-top: 1px solid var(--cal-line, var(--color-border));
  }
`

const RowButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
  color: var(--cal-ink, var(--color-text));
  cursor: pointer;

  &:hover span:nth-child(2) > :nth-child(2) {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`

const RowGlyph = styled.span`
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  margin-top: 0.1rem;
  border-radius: 50%;
  background: ${({ $kind }) => KIND_COLORS[$kind]};
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
`

const RowMeta = styled.span`
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--cal-muted, var(--color-muted));
`

const RowTitle = styled.span`
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.35;
`

const RowStep = styled.span`
  display: block;
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--cal-muted, var(--color-muted));
`

const RowGo = styled.span`
  margin-left: auto;
  color: var(--cal-accent, #2d9194);
  font-weight: 700;
`
