import React from "react"
import styled from "styled-components"

/**
 * Overview figure for the Model page's Datasets subsection: the two datasets
 * the model learns from, what each is made of, what it feeds, and where to
 * download it. Colours follow the Dry Lab figure style guide, as in
 * DiamondSearch.js. Numbers come from the Hugging Face dataset cards; their
 * sources are listed in the writer notes of /dry-lab/model/datasets/.
 */

const INK = "#5f3928"
const INK_SOFT = "#805340"
const PAPER = "#f3e9e5"
const FRAME = "#c8b388"
const BUTTON = "#4f5aa0"

const HF = "https://huggingface.co/datasets/petadex/"

export const MODEL_DATASETS_METHODS_PATH = "/dry-lab/model/datasets/"

const DATASETS = [
  {
    name: "PETadex corpus",
    role: "Candidates",
    value: "307M",
    unit: "catalytic ORFs",
    detail: "18.2M clusters at 90% identity",
    feeds: "PlasticESM pretraining, then scoring",
    mix: [
      { label: "Logan", n: 302432407, color: "#b6693d" },
      { label: "NCBI nr", n: 4723128, color: "#4f5aa0" },
      { label: "PAZy", n: 211, color: "#5f8a5a" },
    ],
    links: [
      { label: "Centroids (start here)", repo: "petadex-corpus-centroids90" },
      { label: "Full corpus", repo: "petadex-corpus-full" },
      { label: "Pretraining set", repo: "catalytic-orfs-90pid" },
    ],
  },
  {
    name: "PETai activity labels",
    role: "Targets",
    value: "13,092",
    unit: "activity labels",
    detail: "1,219 sequences from 696 papers",
    feeds: "PETai activity classifier",
    mix: [
      { label: "Hand-curated", n: 6655, color: "#5f8a5a" },
      { label: "LLM-extracted", n: 4898, color: "#4f5aa0" },
      { label: "Kinetics", n: 1342, color: "#b6693d" },
      { label: "Our halo screen", n: 197, color: "#a8436b" },
    ],
    links: [{ label: "Labels", repo: "petai-activity-labels" }],
  },
]

const fmt = (n) => n.toLocaleString("en-US")

const Mix = ({ mix }) => {
  const total = mix.reduce((sum, { n }) => sum + n, 0)
  return (
    <>
      <Bar role="img" aria-label={mix.map((m) => `${m.label} ${fmt(m.n)}`).join(", ")}>
        {mix.map(({ label, n, color }) => (
          <Segment key={label} title={`${label}: ${fmt(n)}`} style={{ flexGrow: n / total, background: color }} />
        ))}
      </Bar>
      <Legend>
        {mix.map(({ label, n, color }) => (
          <li key={label}>
            <Swatch style={{ background: color }} />
            {label} <span>{fmt(n)}</span>
          </li>
        ))}
      </Legend>
    </>
  )
}

export const ModelDatasets = () => (
  <Wrap>
    <Cards>
      {DATASETS.map((d) => (
        <Card key={d.name}>
          <Kicker>{d.role}</Kicker>
          <Name>{d.name}</Name>
          <Value>
            {d.value} <small>{d.unit}</small>
          </Value>
          <Detail>{d.detail}</Detail>
          <Mix mix={d.mix} />
          <Feeds>
            <span aria-hidden="true">↓</span> {d.feeds}
          </Feeds>
          <Links>
            {d.links.map(({ label, repo }) => (
              <HfLink key={repo} href={HF + repo} target="_blank" rel="noopener noreferrer">
                🤗 {label}
              </HfLink>
            ))}
          </Links>
        </Card>
      ))}
    </Cards>
    <Join>Published separately, joined on sequence MD5</Join>
  </Wrap>
)

const Wrap = styled.figure`
  margin: var(--space-lg) 0;
`

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  display: grid;
  align-content: start;
  gap: 0.45rem;
  padding: 1rem 1.1rem;
  border: 2px solid ${FRAME};
  border-radius: 12px;
  background: ${PAPER};
  color: ${INK};
`

const Kicker = styled.span`
  justify-self: start;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  background: ${INK};
  color: ${PAPER};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

const Name = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
`

const Value = styled.span`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;

  small {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${INK_SOFT};
  }
`

const Detail = styled.span`
  color: ${INK_SOFT};
  font-size: 0.85rem;
`

const Bar = styled.div`
  display: flex;
  height: 0.7rem;
  margin-top: 0.3rem;
  overflow: hidden;
  border-radius: 999px;
  background: ${FRAME};
`

const Segment = styled.span`
  flex-basis: 0;
  min-width: 3px;
`

const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.8rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.75rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin: 0;
  }

  li span {
    color: ${INK_SOFT};
    font-variant-numeric: tabular-nums;
  }
`

const Swatch = styled.span`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 2px;
`

const Feeds = styled.span`
  margin-top: 0.3rem;
  padding-top: 0.5rem;
  border-top: 1.5px dashed ${FRAME};
  font-size: 0.9rem;
  font-weight: 700;
`

/* &&& outranks the page template's a:not(.heading-anchor) colour and
   underline, as in DiamondSearch.js. */
const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`

const HfLink = styled.a`
  &&& {
    padding: 0.3rem 0.65rem;
    border: 1.5px solid ${BUTTON};
    border-radius: 999px;
    color: ${BUTTON};
    font-size: 0.78rem;
    font-weight: 700;
    text-decoration: none;
  }

  &&&:hover {
    background: ${BUTTON};
    color: #fff;
  }
`

const Join = styled.figcaption`
  margin-top: var(--space-sm);
  color: ${INK_SOFT};
  font-size: 0.85rem;
  text-align: center;
`
