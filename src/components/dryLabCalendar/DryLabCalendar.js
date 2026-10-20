import React from "react"
import { ContributionTimeline } from "../contributionCalendar/ContributionTimeline.js"
import { DRY_LAB_CALENDAR } from "../../data/dryLabCalendar.js"
import {
  DRY_LAB_ITERATION_BY_ID,
  ITERATION_CRITERIA,
  ITERATION_KINDS,
  ITERATION_STAGES,
  ITERATION_STATUSES,
  ITERATION_TRACK_BY_ID,
  ITERATIONS_BY_WEEK,
  parseIterationHash,
} from "../../data/dryLabIterations.js"

/** The calendar's iteration threads (what went wrong and what we changed). */
const ITERATIONS = {
  byId: DRY_LAB_ITERATION_BY_ID,
  byWeek: ITERATIONS_BY_WEEK,
  parseHash: parseIterationHash,
  meta: { kinds: ITERATION_KINDS, statuses: ITERATION_STATUSES, stages: ITERATION_STAGES },
  criteria: ITERATION_CRITERIA,
  trackById: ITERATION_TRACK_BY_ID,
}

const CALENDAR = { ...DRY_LAB_CALENDAR, iterations: ITERATIONS }

/**
 * Dry Lab's season week by week, one track per workstream, with the
 * iteration threads. The team-wide calendar (/contribution/) with Dry Lab's
 * own weeks, tracks and iterations.
 */
export function DryLabCalendar() {
  return <ContributionTimeline embedded calendar={CALENDAR} />
}

export default DryLabCalendar
