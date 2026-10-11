import React from "react"
import { NotebookJournal } from "../hardwareJournal/HardwareJournal.js"
import { WET_LAB_JOURNAL_ENTRIES } from "../../data/wetLabJournalEntries.js"

/** The Wet Lab notebook's dated entries, in the same layout as Hardware's. */
export function WetLabJournal() {
  return (
    <NotebookJournal
      entries={WET_LAB_JOURNAL_ENTRIES}
      intro="Chronological wet lab notes from meetings, lab shifts and the team's lab notes, newest first. Scroll through each entry below, or use the date list to jump to a day."
    />
  )
}

export default WetLabJournal
