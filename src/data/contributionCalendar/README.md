# Contribution calendar data

Week-by-week team progress for `/contribution/` (December 2025 – October 2026).

## Where things go

- **Milestones** are the important dates. They show on the calendar cells (two per day at most) and in the "Milestones this week" card.
- **Week overview + subteam entries** are the sidebar: one or two sentences of headline progress, then a short summary and detail per subteam.
- **The specifics** live in the notebooks. Wet Lab and Hardware entries link to their journal entry with `/wet-lab/notebook/#journal-YYYY-MM-DD` or `/hardware/notebook/#journal-YYYY-MM-DD`.

## Files

- [`weeks.js`](weeks.js) — week skeletons plus content:
  - `WEEK_CONTENT_OVERRIDES`: overview, milestones and Wet Lab / Dry Lab / Hardware / Venture / Web entries, keyed by week id.
  - `OUTREACH_WEEK_PATCHES` and `HUMAN_PRACTICES_WEEK_PATCHES`: the Outreach and Human Practices entries (and their milestones).
  - `SUBTEAM_FIRST_WEEK`: weeks before a subteam started say "Not started yet"; later gaps say "Slow week".
  - `PAST_WEEK_QUIET_BEFORE` and `LATEST_WEEK_ID`: move these forward as new weeks are written up.
- [`calendarUtils.js`](calendarUtils.js) — month list, date range, grid helpers and date formatting.
- [`../subteamTracks.js`](../subteamTracks.js) — subteam colours, labels and default links, plus the `all` (whole team) milestone colour.

Content comes from the leads' weekly updates and announcements on Discord, subteam channels, meeting minutes and slides in the team Drive, and the notebooks.

## Adding a week

Week ids are `week-` + the Sunday that starts the row (`week-2026-10-11`).

```js
"week-2026-10-11": {
  overview: "One or two sentences on the team's headline progress.",
  milestones: [
    { date: "2026-10-14", label: "Short label", subteamId: "wetLab" }, // or "all" for whole-team dates
  ],
  subteams: {
    wetLab: {
      summary: "Short line.",
      detail: "Longer text. Use \n• for bullet lines.",
      link: "/wet-lab/notebook/#journal-2026-10-14",
    },
  },
},
```

A milestone's date must fall inside its week (Sunday to Saturday).

## Future CSV import (recommended columns)

One row per week (Sunday `week_start` to Saturday `week_end`):

| Column | Description |
|--------|-------------|
| `week_start` | `YYYY-MM-DD` (Sunday) |
| `week_end` | `YYYY-MM-DD` (Saturday) |
| `overview` | Broad team summary (always shown) |
| `wetLab_summary` | Short line |
| `wetLab_detail` | Optional longer text |
| `wetLab_link` | Optional override URL |
| `dryLab_summary` | … |
| `dryLab_detail` | … |
| … | Repeat for `hardware`, `humanPractices`, `outreach`, `venture`, `web` |

Optional milestone rows (or extra sheet) with:

| Column | Description |
|--------|-------------|
| `week_start` | Links milestone to week |
| `milestone_date` | `YYYY-MM-DD` |
| `milestone_label` | Short label on calendar cell |
| `milestone_subteam` | One of: `wetLab`, `dryLab`, `hardware`, `humanPractices`, `outreach`, `venture`, `web`, `all` |

A small Node script can read the CSV at build time and emit `weeks.js`, or you can use `gatsby-transformer-csv` plus a GraphQL query in a page query.
