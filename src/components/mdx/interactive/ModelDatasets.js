import React, { useState } from "react"
import { withPrefix } from "gatsby"
import styled from "styled-components"
import { useLinkTarget } from "../linkTarget.js"

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
const MUTED = "#6f6761"

const HF = "https://huggingface.co/datasets/petadex/"

export const MODEL_DATASETS_METHODS_PATH = "/dry-lab/model/datasets/"

const DATASETS = [
  {
    name: "PETadex corpus",
    section: "the-petadex-corpus",
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
      {
        label: "Centroids (start here)",
        repo: "petadex-corpus-centroids90",
        primary: true,
        desc: "One row per 90% identity cluster: the centroid's own annotations, plus what its members look like. Where most uses should start.",
      },
      {
        label: "Full corpus",
        repo: "petadex-corpus-full",
        desc: "Every one of the 307M ORFs with every annotation layer keyed to it, as Parquet. Large, and best queried directly.",
      },
      {
        label: "Pretraining set",
        repo: "catalytic-orfs-90pid",
        desc: "The 18.2M centroid sequences alone, split for training. This is exactly what PlasticESM was trained on.",
      },
    ],
  },
  {
    name: "PETai activity labels",
    section: "the-petai-activity-labels",
    role: "Targets",
    value: "12,888",
    unit: "activity labels",
    detail: "1,219 sequences from 649 papers",
    feeds: "PETai activity classifier",
    mix: [
      { label: "Human-scraped", n: 6655, color: "#5f8a5a" },
      { label: "LLM-scraped", n: 4694, color: "#4f5aa0" },
      { label: "Kinetics", n: 1342, color: "#b6693d" },
      { label: "Halo screen", n: 197, color: "#a8436b" },
    ],
    links: [
      {
        label: "Unified set (start here)",
        repo: "petai-activity-labels",
        primary: true,
        desc: "All four sources merged on sequence, with clustering and the homology-aware split. What a model actually trains on.",
      },
      {
        label: "Human-scraped",
        repo: "petai-labels-human",
        desc: "6,655 labels read from 59 papers by 19 curators, with the assay conditions and experiment tree only a person records.",
      },
      {
        label: "LLM-scraped",
        repo: "petai-labels-llm",
        desc: "4,694 labels across 572 papers, each carrying the sentence it was taken from. Broad, but with no conditions and no negatives.",
      },
      {
        label: "Kinetics",
        repo: "petai-labels-kinetics",
        desc: "1,342 kinetic constants from 464 published rows. Every row carries its own sequence, so nothing is lost in joining.",
      },
      {
        label: "Halo screen",
        repo: "petai-halo-screen",
        desc: "Our supervising lab's BHET plate screen at every condition, with raw colony data. The only real source of negatives.",
      },
    ],
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

/** One dataset's card. `active` is the link whose description the preview shows. */
const DatasetCard = ({ d, nameTarget }) => {
  const [active, setActive] = useState(null)
  const shown = active === null ? null : d.links[active]
  return (
    <Card>
      <Kicker>{d.role}</Kicker>
      <Name href={withPrefix(`${MODEL_DATASETS_METHODS_PATH}#${d.section}`)} {...nameTarget}>
        {d.name} <span aria-hidden="true">→</span>
      </Name>
      <Value>
        {d.value} <small>{d.unit}</small>
      </Value>
      <Detail>{d.detail}</Detail>
      <Mix mix={d.mix} />
      <Feeds>
        <span aria-hidden="true">↓</span> {d.feeds}
      </Feeds>
      <Links>
        {d.links.map(({ label, repo, desc, primary }, i) => (
          <HfLink
            key={repo}
            href={HF + repo}
            target="_blank"
            rel="noopener noreferrer"
            title={desc}
            $primary={primary}
            data-active={active === i || undefined}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            🤗 {label}
          </HfLink>
        ))}
      </Links>
      <Preview aria-live="polite" $shown={Boolean(shown)}>
        <PreviewIcon aria-hidden="true">i</PreviewIcon>
        <span>{shown ? shown.desc : "Hover a dataset to see what it holds"}</span>
      </Preview>
    </Card>
  )
}

export const ModelDatasets = () => {
  // Each title opens its section of the Methods page.
  const nameTarget = useLinkTarget(MODEL_DATASETS_METHODS_PATH)
  return (
    <Wrap>
      <Cards>
        {DATASETS.map((d) => (
          <DatasetCard key={d.name} d={d} nameTarget={nameTarget} />
        ))}
      </Cards>
      <Join>Published separately, joined on sequence MD5</Join>
    </Wrap>
  )
}

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

/* &&& outranks the page template's link colour, as on HfLink below. */
const Name = styled.a`
  &&& {
    justify-self: start;
    color: ${INK};
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: underline;
    text-decoration-color: ${FRAME};
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }

  &&&:hover {
    text-decoration-color: ${INK};
  }

  span {
    display: inline-block;
    transition: transform 0.2s ease;
  }

  &&&:hover span {
    transform: translateX(3px);
  }
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
    border: 1.5px solid ${({ $primary }) => ($primary ? BUTTON : "#b5a89c")};
    border-radius: 999px;
    color: ${({ $primary }) => ($primary ? BUTTON : MUTED)};
    font-size: 0.78rem;
    font-weight: ${({ $primary }) => ($primary ? 700 : 600)};
    text-decoration: none;
    cursor: help;
  }

  &&&:hover,
  &&&[data-active] {
    border-color: ${({ $primary }) => ($primary ? BUTTON : MUTED)};
    background: ${({ $primary }) => ($primary ? BUTTON : MUTED)};
    color: #fff;
  }
`

/* The preview line doubles as the hover affordance: it always shows the hint,
   and swaps to a description while a link is hovered or focused. Its height is
   reserved so nothing below it moves. */
const Preview = styled.p`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.45rem;
  align-items: start;
  /* Three lines at this element's own line-height, so the hint and the
     longest description occupy the same box and nothing below shifts. */
  min-height: calc(3 * 1.35em);
  margin: 0.15rem 0 0;
  color: ${({ $shown }) => ($shown ? INK : MUTED)};
  font-size: 0.8rem;
  font-style: ${({ $shown }) => ($shown ? "normal" : "italic")};
  line-height: 1.35;
`

const PreviewIcon = styled.span`
  display: grid;
  place-items: center;
  width: 1.05rem;
  height: 1.05rem;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
`

const Join = styled.figcaption`
  margin-top: var(--space-sm);
  color: ${INK_SOFT};
  font-size: 0.85rem;
  text-align: center;
`

/* ---------- The labelling loop: how the two datasets work together ---------- */

const TEAL = "#0d7f8c"

const LOOP = [
  { who: "Labels", what: "train the activity model, PETai" },
  { who: "PETai", what: "scores the candidates and says how sure it is" },
  { who: "Metadata", what: "flags clusters from promising environments" },
  { who: "Wet lab", what: "tests the clusters the model is least sure of but the metadata favours" },
]

export const DatasetLoop = () => (
  <LoopWrap>
    <Steps>
      {LOOP.map(({ who, what }, i) => (
        <Step key={who}>
          <StepNum aria-hidden="true">{i + 1}</StepNum>
          <StepWho>{who}</StepWho>
          <StepWhat>{what}</StepWhat>
        </Step>
      ))}
    </Steps>
    <Return>
      <span aria-hidden="true">↺</span> Each result becomes a new label, so the next round of the model explores the candidates better
    </Return>
  </LoopWrap>
)

const LoopWrap = styled.figure`
  margin: var(--space-lg) 0;
  color: ${INK};
`

const Steps = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.4rem;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
`

const Step = styled.li`
  position: relative;
  display: grid;
  align-content: start;
  gap: 0.3rem;
  padding: 0.8rem 0.9rem;
  border: 2px solid ${FRAME};
  border-radius: 12px;
  background: ${PAPER};

  /* && outranks the article's li + li spacing, which pushed steps 2 to 4 down. */
  && {
    margin: 0;
  }

  /* Arrow to the next step: right on wide screens, down when stacked. */
  &:not(:last-child)::after {
    content: "→";
    position: absolute;
    top: 50%;
    right: -1.15rem;
    transform: translateY(-50%);
    color: ${INK_SOFT};
    font-weight: 700;
  }

  @media (max-width: 640px) {
    &:not(:last-child)::after {
      content: "↓";
      top: auto;
      right: auto;
      bottom: -1.2rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

const StepNum = styled.span`
  justify-self: start;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${INK};
  color: ${PAPER};
  font-size: 0.75rem;
  font-weight: 700;
`

const StepWho = styled.span`
  font-size: 1rem;
  font-weight: 700;
`

const StepWhat = styled.span`
  color: ${INK_SOFT};
  font-size: 0.85rem;
  line-height: 1.35;
`

const Return = styled.figcaption`
  margin-top: var(--space-md);
  padding: 0.6rem 0.9rem;
  border: 2px dashed ${TEAL};
  border-radius: 12px;
  color: ${TEAL};
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
`
