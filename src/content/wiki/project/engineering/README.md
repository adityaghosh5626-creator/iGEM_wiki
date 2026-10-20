# Editing the engineering scroll panel

Each subteam has its own folder, with one `_version-N.mdx` file per version.
For example, edit `hardware/_version-1.mdx` for Hardware Version 1.
The underscore marks these as embedded content, not standalone wiki pages.

Keep the four `EngineeringStage` wrappers in order: `design`, `build`, `test`,
`learn`. Their titles and wheel navigation are generated automatically.
Write Markdown or use the usual wiki components inside each wrapper, leaving
blank lines around Markdown:

```mdx
<EngineeringStage id="design">

We compared two designs.

| Design | Result |
| --- | --- |
| A | Describe the result |

<Figure src="YOUR_IMAGE_URL" alt="Describe the design" />

More text can follow the figure.

</EngineeringStage>
```

To add a version, copy `_template.mdx` into the relevant folder as
`_version-4.mdx` (using the next number), import it and add it to that team's
array in `src/components/engineering/contentRegistry.js`, then update the
team's `versionCount` in `src/data/engineeringCycles.js`. The arrows and gears
follow that count. A version without a registered file displays the template.
