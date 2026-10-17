import React from "react"
import { ContributionTimeline } from "../contributionCalendar/ContributionTimeline.js"
import { DRY_LAB_CALENDAR } from "../../data/dryLabCalendar.js"

/**
 * Dry Lab's season week by week, one track per workstream. The team-wide
 * calendar (/contribution/) with Dry Lab's own weeks and tracks.
 */
export function DryLabCalendar() {
  return <ContributionTimeline embedded calendar={DRY_LAB_CALENDAR} />
}

export default DryLabCalendar
