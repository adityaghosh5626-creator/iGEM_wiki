import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { formatDayShort } from "../../data/contributionCalendar/calendarUtils.js"
import { trackColor, trackTextColor } from "../../data/subteamTracks.js"
import { NEW_TAB } from "../mdx/linkTarget.js"

/*
 * Pieces shared by the iteration ledger (<DryLabIterations />) and the
 * calendar's iteration thread: kind tags, status pills, the five-part story
 * and the dated step timeline. Labels come in as `meta` (dryLabIterations.js)
 * so this file stays free of Dry Lab data.
 */

/** Kind tag: a glyph plus its name, so it never relies on colour alone. */
export function KindTag({ kind, meta }) {
  const k = meta.kinds[kind]
  return (
    <Tag $kind={kind}>
      <span aria-hidden>{k.glyph}</span> {k.label}
    </Tag>
  )
}

export function StatusPill({ status, meta }) {
  return <Pill $status={status}>{meta.statuses[status].label}</Pill>
}

/** Workstream label with its pipeline number, in the workstream's colour. */
export function TrackBadge({ track }) {
  return (
    <TrackChip $color={trackColor(track)} $text={trackTextColor(track)}>
      {track.number ? `${track.number} · ` : ""}
      {track.label}
    </TrackChip>
  )
}

/** Expected / What happened / What we changed: the three a judge reads first. */
export function StoryCore({ it }) {
  return (
    <Core>
      <CoreItem>
        <CoreLabel>Expected</CoreLabel>
        <CoreText>{it.expected}</CoreText>
      </CoreItem>
      <CoreItem>
        <CoreLabel>What happened</CoreLabel>
        <CoreText>{it.happened}</CoreText>
      </CoreItem>
      <CoreItem $accent>
        <CoreLabel>What we changed</CoreLabel>
        <CoreText>{it.changed}</CoreText>
      </CoreItem>
    </Core>
  )
}

/** How we found out / What we learned / Result. */
export function StoryDetail({ it }) {
  return (
    <DetailList>
      <dt>How we found out</dt>
      <dd>{it.foundBy}</dd>
      <dt>What we learned</dt>
      <dd>{it.learned}</dd>
      {it.result ? (
        <>
          <dt>Result</dt>
          <dd>{it.result}</dd>
        </>
      ) : null}
    </DetailList>
  )
}

/**
 * Dated Design / Build / Test / Learn steps. With `onPick`, each date is a
 * button that moves the calendar to that week; `currentWeekOf` marks the
 * steps in the week on show.
 */
export function StepTimeline({ steps, meta, onPick, isCurrent }) {
  return (
    <Steps>
      {steps.map((s, i) => (
        <Step key={`${s.date}-${i}`} $current={isCurrent?.(s.date)}>
          {onPick ? (
            <StepDate as="button" type="button" onClick={() => onPick(s.date)} title="Show this week">
              {formatDayShort(s.date)}
            </StepDate>
          ) : (
            <StepDate>{formatDayShort(s.date)}</StepDate>
          )}
          <StageTag $stage={s.stage}>{meta.stages[s.stage]}</StageTag>
          <StepText>{s.text}</StepText>
        </Step>
      ))}
    </Steps>
  )
}

export function EvidenceLinks({ see, source }) {
  return (
    <Evidence>
      <span>Evidence:</span>
      {see.map(([label, href]) => (
        <EvidenceLink key={href} to={href} {...NEW_TAB}>
          {label} →
        </EvidenceLink>
      ))}
      {source ? <Source>Source: {source}</Source> : null}
    </Evidence>
  )
}

const KIND_COLORS = {
  failure: "#b4492f",
  surprise: "#8a5a9e",
  constraint: "#6a6650",
  feedback: "#2f7a72",
}

const STATUS_COLORS = {
  resolved: ["#e3efdc", "#2d5a1f"],
  "in-progress": ["#f6e8c8", "#6b4a0c"],
  open: ["#f6dcd5", "#7a2a17"],
}

const STAGE_COLORS = {
  design: "#8fb0cc",
  build: "#d39a5c",
  test: "#dda6a0",
  learn: "#9db58a",
}

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $kind }) => KIND_COLORS[$kind]};

  span {
    display: inline-grid;
    place-items: center;
    width: 1.25em;
    height: 1.25em;
    border-radius: 50%;
    background: ${({ $kind }) => KIND_COLORS[$kind]};
    color: #fff;
    font-size: 0.85em;
  }
`

const Pill = styled.span`
  display: inline-block;
  padding: 0.12rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $status }) => STATUS_COLORS[$status][0]};
  color: ${({ $status }) => STATUS_COLORS[$status][1]};
`

const TrackChip = styled.span`
  display: inline-block;
  padding: 0.12rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $color }) => $color};
  color: ${({ $text }) => $text};
`

const Core = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-sm);

  @container (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const CoreItem = styled.div`
  padding: 0.55rem 0.7rem;
  border-radius: 6px;
  background: ${({ $accent }) =>
    $accent
      ? "color-mix(in srgb, var(--cal-accent, #2d9194) 12%, var(--cal-surface, #fff))"
      : "color-mix(in srgb, var(--cal-ink, #06202b) 4%, var(--cal-surface, #fff))"};
`

const CoreLabel = styled.p`
  &&& {
    margin: 0 0 0.2rem;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--cal-accent, #2d9194);
  }
`

const CoreText = styled.p`
  &&& {
    margin: 0;
    font-size: 0.84rem;
    line-height: 1.5;
    color: var(--cal-ink, var(--color-text));
  }
`

const DetailList = styled.dl`
  &&& {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.35rem 0.8rem;
    margin: var(--space-sm) 0 0;
    font-size: 0.84rem;
    line-height: 1.5;
    color: var(--cal-ink, var(--color-text));
  }

  dt {
    font-weight: 700;
    color: var(--cal-muted, var(--color-muted));
  }

  dd {
    margin: 0;
  }

  @container (max-width: 560px) {
    &&& {
      grid-template-columns: 1fr;
    }

    dd {
      margin-bottom: 0.3rem;
    }
  }
`

const Steps = styled.ol`
  &&& {
    list-style: none;
    margin: var(--space-sm) 0 0;
    padding: 0 0 0 0.9rem;
    border-left: 2px solid var(--cal-line, var(--color-border));
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
`

const Step = styled.li`
  &&& {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.15rem 0.5rem;
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.45;
    color: var(--cal-ink, var(--color-text));
    ${({ $current }) => $current && "font-weight: 600;"}
  }

  &::before {
    content: "";
    position: absolute;
    left: calc(-0.9rem - 6px);
    top: 0.4em;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $current }) => ($current ? "var(--cal-accent, #2d9194)" : "var(--cal-surface, #fff)")};
    border: 2px solid var(--cal-accent, #2d9194);
  }
`

const StepDate = styled.span`
  &&& {
    flex: none;
    min-width: 3.4rem;
    padding: 0;
    text-align: left;
    border: none;
    background: none;
    font: inherit;
    font-weight: 700;
    color: var(--cal-accent, #2d9194);
  }

  &&&[type="button"] {
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--cal-accent, #2d9194) 40%, transparent);
    text-underline-offset: 2px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`

const StageTag = styled.span`
  flex: none;
  padding: 0 0.4rem;
  border-radius: 3px;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ $stage }) => STAGE_COLORS[$stage]};
  color: #1d1a16;
`

const StepText = styled.span`
  flex: 1 1 12rem;
`

const Evidence = styled.p`
  &&& {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.2rem 0.75rem;
    margin: var(--space-sm) 0 0;
    font-size: 0.8rem;
    line-height: 1.4;
  }

  > span:first-child {
    font-weight: 700;
    color: var(--cal-muted, var(--color-muted));
  }
`

const EvidenceLink = styled(Link)`
  &&& {
    font-weight: 600;
    color: var(--cal-accent, #2d9194);
    text-decoration: none;
    background: none;
    border-bottom: 1px solid transparent;
  }

  &&&:hover {
    border-bottom-color: var(--cal-accent, #2d9194);
  }
`

const Source = styled.span`
  flex-basis: 100%;
  font-size: 0.74rem;
  color: var(--cal-muted, var(--color-muted));
`
