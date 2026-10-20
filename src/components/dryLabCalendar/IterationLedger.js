import React, { useMemo, useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import {
  DRY_LAB_ITERATIONS,
  ITERATION_CRITERIA,
  ITERATION_KINDS,
  ITERATION_STAGES,
  ITERATION_STATUSES,
  ITERATION_TRACKS,
  summarizeIterations,
} from "../../data/dryLabIterations.js"
import {
  EvidenceLinks,
  KindTag,
  StatusPill,
  StepTimeline,
  StoryCore,
  StoryDetail,
  TrackBadge,
} from "../contributionCalendar/iterationParts.js"

const META = { kinds: ITERATION_KINDS, statuses: ITERATION_STATUSES, stages: ITERATION_STAGES }

/** Where "See in calendar" goes; the calendar opens the thread from `#iter-<id>`. */
const CALENDAR_PATH = "/dry-lab/overview/"

/**
 * Dry Lab's iterations as a ledger: what we expected, what happened and what
 * we changed, grouped by workstream in pipeline order. Each card opens into
 * how we found out, what we learned, the dated steps and the evidence.
 *
 * `criterion` presets the judging-lens filter (the Engineering page uses
 * "engineering"); `samePage` keeps calendar links as bare hashes when the
 * calendar is on the same page.
 */
export function DryLabIterations({ criterion = "all", samePage = false }) {
  const [track, setTrack] = useState("all")
  const [kind, setKind] = useState("all")
  const [status, setStatus] = useState("all")
  const [lens, setLens] = useState(criterion)

  const scoped = useMemo(
    () => DRY_LAB_ITERATIONS.filter((it) => lens === "all" || it.criteria.includes(lens)),
    [lens]
  )
  const shown = scoped.filter(
    (it) =>
      (track === "all" || it.track === track) &&
      (kind === "all" || it.kind === kind) &&
      (status === "all" || it.status === status)
  )
  const summary = summarizeIterations(scoped)
  const groups = ITERATION_TRACKS.map((t) => ({ track: t, items: shown.filter((it) => it.track === t.id) })).filter(
    (g) => g.items.length
  )

  return (
    <Root>
      <Summary>
        <strong>{summary.total} iterations</strong>
        {Object.entries(ITERATION_STATUSES).map(([id, s]) =>
          summary.status[id] ? (
            <span key={id}>
              {summary.status[id]} {s.label.toLowerCase()}
            </span>
          ) : null
        )}
        {summary.kind.feedback ? <span>{summary.kind.feedback} from outside feedback</span> : null}
      </Summary>

      <Filters role="group" aria-label="Filter iterations">
        <Select label="Workstream" value={track} onChange={setTrack}>
          <option value="all">All</option>
          {ITERATION_TRACKS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.number ? `${t.number}. ` : ""}
              {t.label}
            </option>
          ))}
        </Select>
        <Select label="Kind" value={kind} onChange={setKind}>
          <option value="all">All</option>
          {Object.entries(ITERATION_KINDS).map(([id, k]) => (
            <option key={id} value={id}>
              {k.label}
            </option>
          ))}
        </Select>
        <Select label="Status" value={status} onChange={setStatus}>
          <option value="all">All</option>
          {Object.entries(ITERATION_STATUSES).map(([id, s]) => (
            <option key={id} value={id}>
              {s.label}
            </option>
          ))}
        </Select>
        <Select label="Judging lens" value={lens} onChange={setLens}>
          <option value="all">All</option>
          {Object.entries(ITERATION_CRITERIA).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </Select>
      </Filters>

      {groups.length === 0 && <Empty>No iterations match these filters.</Empty>}

      {groups.map(({ track: t, items }) => (
        <Group key={t.id}>
          <GroupHead>
            <TrackBadge track={t} />
            <span>
              {items.length} iteration{items.length === 1 ? "" : "s"}
            </span>
          </GroupHead>
          {items.map((it) => (
            <Card key={it.id} id={`ledger-${it.id}`} $kind={it.kind}>
              <CardHead>
                <KindTag kind={it.kind} meta={META} />
                <StatusPill status={it.status} meta={META} />
                {it.criteria.map((c) => (
                  <Lens key={c}>{ITERATION_CRITERIA[c]}</Lens>
                ))}
              </CardHead>
              <Title>{it.title}</Title>
              <StoryCore it={it} />
              <More>
                <summary>How we found out, what we learned and the timeline</summary>
                <StoryDetail it={it} />
                <StepTimeline steps={it.steps} meta={META} />
                <EvidenceLinks see={it.see} source={it.source} />
              </More>
              {/* Same page: a bare hash, which the calendar listens for.
                  Elsewhere: a Link, so the iGEM build's path prefix applies. */}
              {samePage ? (
                <CalendarLink href={`#iter-${it.id}`}>Follow it on the calendar →</CalendarLink>
              ) : (
                <CalendarLink as={Link} to={`${CALENDAR_PATH}#iter-${it.id}`}>
                  Follow it on the calendar →
                </CalendarLink>
              )}
            </Card>
          ))}
        </Group>
      ))}
    </Root>
  )
}

function Select({ label, value, onChange, children }) {
  return (
    <SelectLabel>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </SelectLabel>
  )
}

export default DryLabIterations

const KIND_EDGE = {
  failure: "#b4492f",
  surprise: "#8a5a9e",
  constraint: "#8b8670",
  feedback: "#2f7a72",
}

const Root = styled.div`
  container-type: inline-size;
  width: 100%;
  margin: var(--space-md) 0 var(--space-lg);
  color: var(--cal-ink, var(--color-text));
`

const Summary = styled.p`
  &&& {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.9rem;
    align-items: baseline;
    margin: 0 0 var(--space-sm);
    font-size: 0.95rem;
    color: var(--cal-ink, var(--color-text));
  }

  span {
    color: var(--cal-muted, var(--color-muted));
  }

  span::before {
    content: "·";
    margin-right: 0.9rem;
  }
`

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  border: 1px solid var(--cal-line, var(--color-border));
  border-radius: 8px;
  background: var(--cal-surface, #fff);
`

const SelectLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1 1 9rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cal-muted, var(--color-muted));

  select {
    font: inherit;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    padding: 0.3rem 0.4rem;
    border: 1px solid var(--cal-line, var(--color-border));
    border-radius: 5px;
    background: var(--cal-surface, #fff);
    color: var(--cal-ink, var(--color-text));
  }
`

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
`

const GroupHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  color: var(--cal-muted, var(--color-muted));
`

const Card = styled.article`
  padding: var(--space-md);
  border: 1px solid var(--cal-line, var(--color-border));
  border-left: 5px solid ${({ $kind }) => KIND_EDGE[$kind]};
  border-radius: 6px;
  background: var(--cal-surface, #fff);
  scroll-margin-top: 6rem;

  &:target {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--cal-accent, #2d9194) 45%, transparent);
  }
`

const CardHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.6rem;
  margin-bottom: 0.35rem;
`

const Lens = styled.span`
  font-size: 0.68rem;
  color: var(--cal-muted, var(--color-muted));

  &::before {
    content: "·";
    margin-right: 0.5rem;
  }
`

/* Not a heading: the page's section menu lists every h3. */
const Title = styled.p`
  &&& {
    margin: 0 0 var(--space-sm);
    font-family: var(--font-body);
    font-size: 1.02rem;
    font-weight: 700;
    line-height: 1.35;
    color: var(--cal-ink, var(--color-text));
  }
`

const More = styled.details`
  margin-top: var(--space-sm);

  summary {
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--cal-accent, #2d9194);
  }

  summary:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`

const CalendarLink = styled.a`
  &&& {
    display: inline-block;
    margin-top: var(--space-sm);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--cal-ink, var(--color-text));
    text-decoration: none;
    background: none;
    border-bottom: 1px solid color-mix(in srgb, var(--cal-accent, #2d9194) 45%, transparent);
  }
`

const Empty = styled.p`
  &&& {
    color: var(--cal-muted, var(--color-muted));
  }
`
