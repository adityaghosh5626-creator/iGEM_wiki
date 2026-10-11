import React, { useCallback, useState } from "react"
import { graphql } from "gatsby"
import styled, { css } from "styled-components"
import WikiLayout from "../../components/layout.js"

/*
 * Members come from src/data/team/team.csv (export it from Google Sheets as
 * CSV). The `team` column groups the cards: sections follow SECTION_ORDER,
 * then any other team names in the order they first appear.
 */

const SECTION_ORDER = [
  "Presidents",
  "Team Leads",
  "Wet Lab",
  "Dry Lab",
  "Hardware",
  "Human Practices",
  "Outreach",
  "Venture",
  "Web",
  "Advisors",
]

/** Card frame colours: leads in pink, everyone else in lavender. */
const LEAD_FRAME = "#f3dde9"
const TEAM_FRAME = "#dde1f8"
const LEAD_SECTIONS = new Set(["Presidents", "Team Leads"])

const HEADING = "#6b7fe6"

const photoSrc = (m) => m.photo || m.imageSrc || ""

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")

function groupByTeam(members) {
  const groups = new Map()
  for (const m of members) {
    const team = (m.team || "Team").trim()
    if (!groups.has(team)) groups.set(team, [])
    groups.get(team).push(m)
  }
  const rank = (t) => {
    const i = SECTION_ORDER.indexOf(t)
    return i === -1 ? SECTION_ORDER.length : i
  }
  return [...groups.entries()].sort((a, b) => rank(a[0]) - rank(b[0]))
}

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.02c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65V21h-4z"
    />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      d="M3.5 6h17v12h-17zM3.5 6.5l8.5 6.5 8.5-6.5"
    />
  </svg>
)

function MemberLinks({ m }) {
  const stop = (e) => e.stopPropagation()
  if (!m.linkedIn && !m.email) return null
  return (
    <Links>
      {m.linkedIn && (
        <IconLink href={m.linkedIn} target="_blank" rel="noopener noreferrer" onClick={stop} aria-label={`${m.Name} on LinkedIn`}>
          <LinkedInIcon />
        </IconLink>
      )}
      {m.email && (
        <IconLink href={`mailto:${m.email}`} onClick={stop} aria-label={`Email ${m.Name}`}>
          <MailIcon />
        </IconLink>
      )}
    </Links>
  )
}

const TeamPage = ({ data }) => {
  const sections = groupByTeam(data.allTeamCsv.nodes)
  const [flipped, setFlipped] = useState(() => new Set())

  const toggle = useCallback((id) => {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const keyToggle = (id) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggle(id)
    }
  }

  return (
    <WikiLayout>
      <Title>Meet the Team</Title>

      {sections.map(([team, members]) => (
        <Section key={team} aria-labelledby={`team-${team}`}>
          <SectionTitle id={`team-${team}`}>{team}</SectionTitle>
          <Cards>
            {members.map((m) => {
              const isFlipped = flipped.has(m.id)
              const frame = LEAD_SECTIONS.has(team) ? LEAD_FRAME : TEAM_FRAME
              return (
                <Card key={m.id} style={{ "--frame": frame }}>
                  <FlipInner $flipped={isFlipped}>
                    <Front
                      role="button"
                      tabIndex={isFlipped ? -1 : 0}
                      aria-hidden={isFlipped}
                      aria-expanded={isFlipped}
                      aria-label={`${m.Name}, ${m.role}. Show bio.`}
                      onClick={() => toggle(m.id)}
                      onKeyDown={keyToggle(m.id)}
                    >
                      <Photo>
                        {photoSrc(m) ? (
                          <img src={photoSrc(m)} alt="" loading="lazy" />
                        ) : (
                          <Initials aria-hidden>{initials(m.Name)}</Initials>
                        )}
                        <Caption>
                          <Name>{m.Name}</Name>
                          <Role>{m.role}</Role>
                        </Caption>
                        <MemberLinks m={m} />
                      </Photo>
                    </Front>

                    <Back
                      role="button"
                      tabIndex={isFlipped ? 0 : -1}
                      aria-hidden={!isFlipped}
                      aria-expanded={isFlipped}
                      aria-label={`${m.Name} bio. Click to flip back.`}
                      onClick={() => toggle(m.id)}
                      onKeyDown={keyToggle(m.id)}
                    >
                      <BackInner>
                        <BackName>{m.Name}</BackName>
                        <BackRole>{m.role}</BackRole>
                        <Bio>{m.description}</Bio>
                        {m.website && (
                          <TextLink href={m.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            Website
                          </TextLink>
                        )}
                      </BackInner>
                    </Back>
                  </FlipInner>
                </Card>
              )
            })}
          </Cards>
        </Section>
      ))}
    </WikiLayout>
  )
}

export const query = graphql`
  query TeamMembers {
    allTeamCsv {
      nodes {
        id
        Name
        role
        team
        description
        imageSrc
        linkedIn
        email
        website
        photo
      }
    }
  }
`

export default TeamPage
export const Head = () => <title>Meet the Team — iGEM Toronto 2026</title>

const Title = styled.h1`
  margin: clamp(2rem, 6vw, 4rem) 0 clamp(2.5rem, 7vw, 5rem);
  text-align: center;
  color: ${HEADING};
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.5rem, 7vw, 4.25rem);
  letter-spacing: -0.01em;
`

const Section = styled.section`
  margin-bottom: clamp(3rem, 7vw, 5rem);
`

const SectionTitle = styled.h2`
  margin: 0 0 clamp(1.5rem, 3vw, 2.25rem);
  color: ${HEADING};
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.75rem, 4.5vw, 2.6rem);
`

/** Rows of up to four, centered (so a short row like the leads sits in the middle). */
const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(1.25rem, 3vw, 2rem) clamp(1rem, 3vw, 1.9rem);
  max-width: calc(4 * 10rem + 3 * 1.9rem);
  margin: 0 auto;
`

const Card = styled.div`
  width: clamp(8.5rem, 40vw, 10rem);
  aspect-ratio: 156 / 218;
  perspective: 1000px;
`

const FlipInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.55s ease;
  transform: rotateY(${({ $flipped }) => ($flipped ? 180 : 0)}deg);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const face = css`
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  padding: 7px;
  border-radius: 8px;
  background: var(--frame);
  cursor: pointer;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  &:focus-visible {
    outline: 2px solid ${HEADING};
    outline-offset: 3px;
  }
`

const Front = styled.div`
  ${face}
`

const Back = styled.div`
  ${face}
  transform: rotateY(180deg);
`

const Photo = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: linear-gradient(160deg, #c9cde6, #8d94b8);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Darkens the top and bottom so the name and icons read on any photo. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      rgba(0, 0, 0, 0.45),
      transparent 32%,
      transparent 78%,
      rgba(0, 0, 0, 0.35)
    );
  }
`

const Initials = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 2.25rem;
`

const Caption = styled.div`
  position: absolute;
  z-index: 1;
  top: 0.45rem;
  left: 0.5rem;
  right: 0.5rem;
  color: #fff;
  line-height: 1.2;
`

const Name = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
`

const Role = styled.div`
  font-size: 0.68rem;
  opacity: 0.9;
`

const Links = styled.div`
  position: absolute;
  z-index: 1;
  right: 0.4rem;
  bottom: 0.4rem;
  display: flex;
  gap: 0.25rem;
`

const IconLink = styled.a`
  display: grid;
  place-items: center;
  width: 1.3rem;
  height: 1.3rem;
  border: 1.5px solid #fff;
  border-radius: 3px;
  color: #fff;

  svg {
    width: 0.8rem;
    height: 0.8rem;
  }

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.25);
  }
`

const BackInner = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding: 0.6rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.7);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const BackName = styled.div`
  font-weight: 700;
  font-size: 0.85rem;
`

const BackRole = styled.div`
  color: var(--color-muted);
  font-size: 0.72rem;
  margin-bottom: 0.4rem;
`

const Bio = styled.p`
  flex: 1;
  margin: 0 0 0.4rem;
  white-space: pre-wrap;
  font-size: 0.72rem;
  line-height: 1.45;
`

const TextLink = styled.a`
  font-size: 0.72rem;
  text-decoration: underline;
  text-underline-offset: 2px;
`
