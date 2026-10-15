# Editing Past Iterations

Each version/subsystem has its own MDX file under:

`src/content/wiki/hardware/past-iterations/`

- `version-1/_cad.mdx`, `version-2/_cad.mdx`, `version-3/_cad.mdx`
- Each version also has `_temperature.mdx`, `_power.mdx`, `_pumps.mdx`,
  `_od.mdx`, `_data.mdx`, and `_stirring.mdx`.

Edit those files directly. Write Markdown tables, paragraphs, and images in
any order, or use the usual wiki MDX components such as `Figure` and `DataTable`.
The leading underscore marks an embedded fragment, not a standalone page;
no page frontmatter is needed. The timeline and tabs select the matching file.

```mdx
#### Design

| Part | Material |
| --- | --- |
| Holder | PLA |

Explain the design here.

<Figure
  src="https://static.igem.wiki/teams/6187/wiki/your-image.avif"
  alt="Describe the design shown"
  caption="Optional caption"
/>

| Test | Result |
| --- | --- |
| Fit | Add your result |

More text here.
```

Replace the example URL with your real upload. Use `Figure` for local images
when you need deployment-prefix handling. Version labels and the overview
above the tabs remain in `src/data/hardwareIterations.js`. Component imports
are wired in `subsystemContent.js`.
