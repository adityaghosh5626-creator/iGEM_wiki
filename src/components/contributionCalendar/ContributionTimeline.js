import React, { useCallback, useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import {
  CONTRIBUTION_WEEK_BY_ID,
  CONTRIBUTION_WEEKS,
  getDefaultWeekId,
  parseWeekHash,
} from "../../data/contributionCalendar/weeks.js"
import { CONTRIBUTION_MONTHS } from "../../data/contributionCalendar/calendarUtils.js"
import {
  MILESTONE_TRACK_BY_ID,
  SUBTEAM_TRACKS,
} from "../../data/subteamTracks.js"
import { MonthNav } from "./MonthNav.js"
import { WeekNav } from "./WeekNav.js"
import { PanelChrome, RestorePanelBar } from "./PanelChrome.js"
import { SubteamFilterBar } from "./SubteamFilterBar.js"
import { useSplitPane } from "./useSplitPane.js"
import { VintageMonthGrid } from "./VintageMonthGrid.js"
import { WeekDetailPanel } from "./WeekDetailPanel.js"

/** @typedef {null | 'detail' | 'calendar'} HiddenPanel */

/**
 * Everything the calendar shows, so another page can bring its own weeks and
 * tracks (the Dry Lab overview's workstreams) while /contribution/ keeps the
 * whole team's.
 */
export const TEAM_CALENDAR = {
  weeks: CONTRIBUTION_WEEKS,
  weekById: CONTRIBUTION_WEEK_BY_ID,
  months: CONTRIBUTION_MONTHS,
  tracks: SUBTEAM_TRACKS,
  /** Every track a milestone can belong to, including "all". */
  trackById: MILESTONE_TRACK_BY_ID,
  defaultWeekId: getDefaultWeekId(),
  parseHash: parseWeekHash,
  /** Track filters on at first; none, so turning one on shows its progress. */
  initialActiveIds: [],
  /** True: the whole calendar fits in one screen under the site header. */
  fit: false,
  labels: {
    tracks: "Subteams",
    overview: "Team overview",
    hint: "Turn on a subteam above to see its progress this week.",
  },
}

function buildMilestonesByDate(weeks) {
  /** @type {Record<string, import('../../data/contributionCalendar/weeks.js').WeekMilestone[]>} */
  const map = {}
  for (const week of weeks) {
    for (const ms of week.milestones) {
      if (!map[ms.date]) map[ms.date] = []
      map[ms.date].push(ms)
    }
  }
  return map
}

function firstWeekIdForMonth(weeks, monthKey, fallbackId) {
  // Prefer a week whose primary month is the target (avoids cross-month weeks
  // whose monthKeys[0] is the previous month).
  const preferred = weeks.find((wk) => wk.monthKeys[0] === monthKey)
  if (preferred) return preferred.id
  const w = weeks.find((wk) => wk.monthKeys.includes(monthKey))
  return w?.id ?? fallbackId
}

export function ContributionTimeline({ embedded = false, calendar = TEAM_CALENDAR }) {
  const { weeks, weekById, months, tracks, trackById, parseHash, labels } = calendar
  const fit = Boolean(calendar.fit)
  const initialWeekId = calendar.defaultWeekId
  const initialMonth =
    weekById[initialWeekId]?.monthKeys[0] ?? months[0]?.key

  const [monthKey, setMonthKey] = useState(initialMonth)
  const [selectedWeekId, setSelectedWeekId] = useState(initialWeekId)
  const [activeSubteams, setActiveSubteams] = useState(
    () => new Set(calendar.initialActiveIds)
  )
  /** @type {[HiddenPanel, function]} */
  const [hiddenPanel, setHiddenPanel] = useState(null)

  const { splitPct, nudgeSplit, containerRef, onDividerPointerDown } = useSplitPane()

  const milestonesByDate = useMemo(
    () => buildMilestonesByDate(weeks),
    [weeks]
  )

  const selectedWeek = weekById[selectedWeekId] ?? null
  const showDetail = hiddenPanel !== "detail"
  const showCalendar = hiddenPanel !== "calendar"
  const showDivider = showDetail && showCalendar

  const syncHash = useCallback((weekId) => {
    if (typeof window === "undefined" || !weekId) return
    const next = `#${weekId}`
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next)
    }
  }, [])

  const selectWeek = useCallback(
    (weekId) => {
      if (!weekById[weekId]) return
      const week = weekById[weekId]
      setSelectedWeekId(weekId)
      syncHash(weekId)
      // Keep the visible month if this week still belongs to it; otherwise follow the week.
      setMonthKey((prev) =>
        week.monthKeys.includes(prev) ? prev : week.monthKeys[0] ?? prev
      )
    },
    [syncHash, weekById]
  )

  const selectMonth = useCallback(
    (key) => {
      const nextId = firstWeekIdForMonth(weeks, key, initialWeekId)
      setMonthKey(key)
      if (nextId) {
        setSelectedWeekId(nextId)
        syncHash(nextId)
      }
    },
    [syncHash, weeks, initialWeekId]
  )

  const toggleSubteam = useCallback((id) => {
    setActiveSubteams((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const hidePanel = useCallback((panel) => {
    setHiddenPanel(panel)
  }, [])

  const restorePanels = useCallback(() => {
    setHiddenPanel(null)
  }, [])

  // Apply URL hash once on mount — do NOT re-run when selectWeek identity changes,
  // or month navigation gets snapped back to the hash week's monthKeys[0].
  useEffect(() => {
    if (typeof window === "undefined") return undefined
    const initialHashId = parseHash(window.location.hash)
    if (initialHashId) {
      const initialHashWeek = weekById[initialHashId]
      setSelectedWeekId(initialHashId)
      if (initialHashWeek?.monthKeys[0]) {
        setMonthKey(initialHashWeek.monthKeys[0])
      }
    }
    return undefined
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return undefined
    const onHash = () => {
      const id = parseHash(window.location.hash)
      if (id) selectWeek(id)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [parseHash, selectWeek])

  return (
    <TimelineRoot $embedded={embedded} $fit={fit}>
      <SubteamNavRow>
        <SubteamFilterBar
          layout="navbar"
          compact={fit}
          tracks={tracks}
          label={labels.tracks}
          activeIds={activeSubteams}
          onToggle={toggleSubteam}
        />
      </SubteamNavRow>

      <SplitContainer
        ref={containerRef}
        $fit={fit}
        style={{ "--detail-split": `${splitPct}%` }}
      >
        {showDetail && (
          <DetailHalf $full={hiddenPanel === "calendar"} $split={showDivider} $fit={fit}>
            {!showCalendar && (
              <RestorePanelBar
                label="Show calendar →"
                onRestore={() => setHiddenPanel(null)}
              />
            )}
            <ChromeSlot $fit={fit}>
              <PanelChrome
                title="Week details"
                hideLabel="Hide details"
                onHide={() => hidePanel("detail")}
                isHidden={false}
              />
            </ChromeSlot>
            <WeekNavBar>
              <WeekNav weeks={weeks} selectedWeekId={selectedWeekId} onSelect={selectWeek} />
            </WeekNavBar>
            <DetailScroll $fit={fit}>
              <WeekDetailPanel
                week={selectedWeek}
                activeIds={activeSubteams}
                tracks={tracks}
                trackById={trackById}
                overviewLabel={labels.overview}
                hint={labels.hint}
              />
            </DetailScroll>
          </DetailHalf>
        )}

        {showDivider && (
          <ResizeDivider
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
            tabIndex={0}
            onPointerDown={onDividerPointerDown}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") nudgeSplit(-3)
              if (e.key === "ArrowRight") nudgeSplit(3)
            }}
          />
        )}

        {showCalendar && (
          <CalendarHalf $full={hiddenPanel === "detail"} $fit={fit}>
            {!showDetail && (
              <RestorePanelBar
                label="← Show week details"
                onRestore={restorePanels}
              />
            )}
            <ChromeSlot $fit={fit}>
              <PanelChrome
                title="Calendar"
                hideLabel="Hide calendar"
                onHide={() => hidePanel("calendar")}
                isHidden={false}
              />
            </ChromeSlot>
            <CalendarPanel $fit={fit}>
              <MonthNav months={months} selectedKey={monthKey} onSelect={selectMonth} />
              <VintageMonthGrid
                monthKey={monthKey}
                selectedWeekId={selectedWeekId}
                onSelectWeek={selectWeek}
                milestonesByDate={milestonesByDate}
                months={months}
                trackById={trackById}
                fit={fit}
              />
            </CalendarPanel>
          </CalendarHalf>
        )}
      </SplitContainer>
    </TimelineRoot>
  )
}

const TimelineRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 75vh;
  width: ${({ $embedded }) => ($embedded ? "100%" : "min(96rem, calc(100vw - 1.5rem))")};
  max-width: ${({ $embedded }) => ($embedded ? "100%" : "96rem")};
  min-width: 0;
  margin-inline: auto;
  /* Stacks by its own width, so it also fits a narrow text box. */
  container-type: inline-size;
  padding-inline: ${({ $embedded }) => ($embedded ? "0" : "clamp(0.75rem, 2vw, 1.5rem)")};
  box-sizing: border-box;
  position: relative;
  left: ${({ $embedded }) => ($embedded ? "auto" : "50%")};
  transform: ${({ $embedded }) => ($embedded ? "none" : "translateX(-50%)")};

  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }

  /* Fit: one screen tall under the site header (75px), so its top and bottom
     are in view together. The month grid and the week details share what's
     left; the details scroll. */
  ${({ $fit }) =>
    $fit &&
    `
    min-height: 0;
    height: clamp(24rem, calc(100svh - var(--dl-header, 4.75rem) - 2.25rem), 52rem);

    /* Narrow pages pin the section strip under the header too. */
    @media (max-width: 860px) {
      height: clamp(24rem, calc(100svh - var(--dl-header, 4.75rem) - 5rem), 52rem);
    }
  `}
`

/** Panel title bars; short screens drop them in fit mode to give the month room. */
const ChromeSlot = styled.div`
  flex: none;

  ${({ $fit }) =>
    $fit &&
    `
    @media (max-height: 820px) {
      display: none;
    }
  `}
`

const SubteamNavRow = styled.div`
  width: 100%;
  margin-bottom: 0;
  border: 1px solid var(--cal-line, var(--color-border));
  border-radius: 8px 8px 0 0;
  border-bottom: none;
  background: var(--cal-surface, #fff);
  box-sizing: border-box;
`

const SplitContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 72vh;
  border: 1px solid var(--cal-line, var(--color-border));
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  width: 100%;

  @container (max-width: 720px) {
    flex-direction: column;
    min-height: auto;
  }

  ${({ $fit }) =>
    $fit &&
    `
    flex: 1 1 auto;
    min-height: 0;
  `}
`

const DetailHalf = styled.div`
  min-width: min(14rem, 100%);
  display: flex;
  flex-direction: column;
  flex: ${({ $full, $split }) =>
    $full ? "1 1 100%" : $split ? "0 0 var(--detail-split)" : "0 0 auto"};
  max-width: ${({ $full, $split }) =>
    $full ? "100%" : $split ? "var(--detail-split)" : "none"};

  @container (max-width: 720px) {
    flex: 1 1 auto;
    max-width: 100%;
  }

  ${({ $fit }) =>
    $fit &&
    `
    min-height: 0;

    @container (max-width: 720px) {
      flex: 1 1 0;
      min-width: 0;
    }
  `}
`

const WeekNavBar = styled.div`
  flex-shrink: 0;
  padding: var(--space-sm) var(--space-md) var(--space-md);
  background: var(--cal-surface, #fff);
`

const DetailScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* Its content doesn't size the panels: beside the calendar it takes the
     calendar's height and scrolls, so picking a week or a subteam never
     changes the page's length. */
  contain: size;

  /* Stacked over the calendar: a fixed height of its own. */
  @container (max-width: 720px) {
    flex: none;
    height: min(24rem, 55vh);
  }

  /* Fit: whatever height is left over. */
  ${({ $fit }) =>
    $fit &&
    `
    @container (max-width: 720px) {
      flex: 1 1 0;
      height: auto;
    }
  `}
`

const ResizeDivider = styled.div`
  flex: 0 0 8px;
  width: 8px;
  cursor: col-resize;
  background: var(--cal-line, var(--color-border));
  position: relative;
  touch-action: none;
  user-select: none;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 2.5rem;
    border-radius: 2px;
    background: var(--cal-accent, #2d9194);
    opacity: 0.5;
  }

  &:hover,
  &:focus-visible {
    background: var(--cal-accent, #2d9194);

    &::after {
      opacity: 1;
      background: #fff;
    }
  }

  @container (max-width: 720px) {
    display: none;
  }
`

const CalendarHalf = styled.div`
  min-width: min(28rem, 100%);
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  border-left: ${({ $full }) => ($full ? "none" : "1px solid var(--cal-line, var(--color-border))")};

  @container (max-width: 720px) {
    border-left: none;
    border-top: 1px solid var(--cal-line, var(--color-border));
  }

  /* Fit, stacked: the month takes a bit over half the height. */
  ${({ $fit, $full }) =>
    $fit &&
    `
    min-height: 0;

    @container (max-width: 720px) {
      flex: ${$full ? "1 1 0" : "0 0 56%"};
      min-width: 0;

      @media (max-height: 820px) {
        flex-basis: ${$full ? "0" : "62%"};
      }
    }
  `}
`

const CalendarPanel = styled.div`
  background: var(--cal-surface, #fff);
  padding: var(--space-md) clamp(1.25rem, 3.5vw, 2.75rem) var(--space-lg);
  min-height: 68vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  ${({ $fit }) =>
    $fit &&
    `
    min-height: 0;
    padding: var(--space-sm) clamp(0.5rem, 2vw, 1.5rem);

    /* The month nav: less room under it. */
    > :first-child {
      margin-bottom: var(--space-xs);
    }
  `}
`


export default ContributionTimeline
