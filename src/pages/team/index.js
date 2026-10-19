import React, { useCallback, useEffect, useRef, useState } from "react"
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

/**
 * Colours from the waterfall behind the page: card frames in its sand (leads)
 * and spray (everyone else), headings in the deep teal of its pool.
 */
const LEAD_FRAME = "#eadfc8"
const TEAM_FRAME = "#cdeae8"
const LEAD_SECTIONS = new Set(["Presidents", "Team Leads"])

const HEADING = "#1f6e69"
const MUTED = "#4d6d69"

/**
 * Subteam "types", shown like a Pokémon card's type symbol in each card's
 * corner. A member's type comes from their team, else from their role (so a
 * "Human Practices Lead" in Team Leads is Human Practices). `slug` names the
 * icon uploaded to team/icons/ on iGEM's servers.
 */
const SUBTEAM_ICON_BASE =
  "https://static.igem.wiki/teams/6187/wiki/team/icons/"
const SUBTEAMS = [
  { slug: "hardware", label: "Hardware", match: ["hardware"] },
  { slug: "wet-lab", label: "Wet Lab", match: ["wet lab", "wetlab"] },
  { slug: "dry-lab", label: "Dry Lab", match: ["dry lab", "drylab"] },
  { slug: "web", label: "Web", match: ["web", "wiki"] },
  { slug: "outreach", label: "Outreach", match: ["outreach"] },
  {
    slug: "entrepreneurship",
    label: "Entrepreneurship",
    match: ["entrepreneurship", "venture"],
  },
  {
    slug: "human-practices",
    label: "Human Practices",
    match: ["human practices"],
  },
]

const subteamIn = (text = "") => {
  const t = text.toLowerCase()
  return SUBTEAMS.find((st) => st.match.some((k) => t.includes(k)))
}

const subteamOf = (m) => subteamIn(m.team) || subteamIn(m.role)

/**
 * Waterfall painting (1110×4000) behind the page. It fills the window width
 * and pans from the sky to the pool over the page's scroll, so the whole
 * painting goes by however long the page is.
 */
const BG_SRC = "https://static.igem.wiki/teams/6187/wiki/team/bg.avif"

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
  const backdropRef = useRef(null)

  useEffect(() => {
    const box = backdropRef.current
    const img = box?.firstElementChild
    if (!img) return undefined
    let frame = 0
    const pan = () => {
      frame = 0
      const range = document.documentElement.scrollHeight - window.innerHeight
      const p = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0
      const y = p * Math.min(0, box.clientHeight - img.offsetHeight)
      img.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(pan)
    }
    pan()
    img.addEventListener("load", queue)
    window.addEventListener("scroll", queue, { passive: true })
    window.addEventListener("resize", queue)
    return () => {
      cancelAnimationFrame(frame)
      img.removeEventListener("load", queue)
      window.removeEventListener("scroll", queue)
      window.removeEventListener("resize", queue)
    }
  }, [])

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
    <WikiLayout pagePath="/team/">
      <Backdrop ref={backdropRef} aria-hidden>
        <img src={BG_SRC} alt="" />
      </Backdrop>

      <Content>
        <Title>Meet the Team</Title>

        {sections.map(([team, members]) => (
          <Section key={team} aria-labelledby={`team-${team}`}>
            <SectionTitle id={`team-${team}`}>{team}</SectionTitle>
            <Cards>
              {members.map((m) => {
                const isFlipped = flipped.has(m.id)
                const frame = LEAD_SECTIONS.has(team) ? LEAD_FRAME : TEAM_FRAME
                const type = subteamOf(m)
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
                          <Caption $badge={Boolean(type)}>
                            <Name>{m.Name}</Name>
                            <Role>{m.role}</Role>
                          </Caption>
                          {type && (
                            <TypeBadge
                              src={`${SUBTEAM_ICON_BASE}${type.slug}.avif`}
                              alt={`${type.label} subteam`}
                              title={type.label}
                              loading="lazy"
                              decoding="async"
                            />
                          )}
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
      </Content>
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
export const Head = () => <title>Meet the Team | iGEM Toronto 2026</title>

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #cfe6e4;

  img {
    display: block;
    width: 100%;
    height: auto;
    min-height: 100%;
    object-fit: cover;
    will-change: transform;
  }
`

const Content = styled.div`
  position: relative;
  z-index: 1;
`

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
/**
 * Cards are big on small windows (40vw) and keep growing on big ones (12.5vw
 * past 10rem), so they never look tiny. Everything on a card is sized in em
 * off the card's width, so the text and buttons grow with it.
 */
const Cards = styled.div`
  --card-w: clamp(8.5rem, 40vw, max(10rem, 12.5vw));
  --card-gap: clamp(1rem, 3vw, max(1.9rem, 2.4vw));
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(1.25rem, 3vw, max(2rem, 2.6vw)) var(--card-gap);
  max-width: calc(4 * var(--card-w) + 3 * var(--card-gap));
  margin: 0 auto;
`

const Card = styled.div`
  width: var(--card-w);
  aspect-ratio: 156 / 218;
  perspective: 1000px;
  /* 1em is 16px on a 10rem card. */
  font-size: max(0.85rem, calc(var(--card-w) / 10));
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
  padding: 0.44em;
  border-radius: 0.5em;
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
  background: linear-gradient(160deg, #a7dedf, #4f9f99);

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
  font-size: 2.25em;
`

const Caption = styled.div`
  position: absolute;
  z-index: 1;
  top: 0.45em;
  left: 0.5em;
  /* Clear of the type badge in the corner. */
  right: ${({ $badge }) => ($badge ? "calc(24% + 0.6em)" : "0.5em")};
  color: #fff;
  line-height: 1.2;
`

/** The subteam's icon, top right like a Pokémon card's type symbol. */
const TypeBadge = styled.img`
  position: absolute;
  z-index: 1;
  top: 0.35em;
  right: 0.35em;
  /* Over the photo's own img rule (fill the card). */
  && {
    width: 24%;
    height: auto;
  }
  aspect-ratio: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
  transition: transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);

  @media (hover: hover) {
    ${Card}:hover & {
      transform: scale(1.12) rotate(-8deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Name = styled.div`
  font-size: 0.72em;
  font-weight: 600;
`

const Role = styled.div`
  font-size: 0.68em;
  opacity: 0.9;
`

const Links = styled.div`
  position: absolute;
  z-index: 1;
  right: 0.4em;
  bottom: 0.4em;
  display: flex;
  gap: 0.25em;
`

const IconLink = styled.a`
  display: grid;
  place-items: center;
  width: 1.3em;
  height: 1.3em;
  border: 1.5px solid #fff;
  border-radius: 3px;
  color: #fff;

  svg {
    width: 0.8em;
    height: 0.8em;
  }

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.25);
  }
`

const BackInner = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding: 0.6em;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.7);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const BackName = styled.div`
  font-weight: 700;
  font-size: 0.85em;
`

const BackRole = styled.div`
  color: ${MUTED};
  font-size: 0.72em;
  margin-bottom: 0.4em;
`

const Bio = styled.p`
  flex: 1;
  margin: 0 0 0.4em;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 0.72em;
  line-height: 1.45;
`

const TextLink = styled.a`
  color: ${HEADING};
  font-size: 0.72em;
  text-decoration: underline;
  text-underline-offset: 2px;
`
