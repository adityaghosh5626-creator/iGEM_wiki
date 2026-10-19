import React, { useCallback, useEffect, useRef, useState } from "react"
import { graphql } from "gatsby"
import styled, { css } from "styled-components"
import WikiLayout from "../../components/layout.js"

/*
 * Members come from src/data/team/team.csv (from the team roster). The
 * `level` column groups the cards, in the order of LEVELS; within a level
 * they keep the roster's order. `subteams` lists a member's subteams ("Wet
 * Lab; Outreach"), each shown as its symbol on the card.
 */

const LEVELS = [
  ["President", "Presidents"],
  ["Lead", "Leads"],
  ["Member", "Members"],
  ["Advisor", "Advisors"],
]

/**
 * Colours from the waterfall behind the page: card frames in its sand (leads)
 * and spray (everyone else), headings in the deep teal of its pool.
 */
const LEAD_FRAME = "#eadfc8"
const TEAM_FRAME = "#cdeae8"
const LEAD_LEVELS = new Set(["President", "Lead"])

const HEADING = "#1f6e69"
const MUTED = "#4d6d69"

/**
 * Subteam "types", shown like a Pokémon card's type symbols down each card's
 * corner, one for each of a member's subteams. `slug` names the icon
 * uploaded to team/icons/ on iGEM's servers.
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

const subteamsOf = (m) =>
  (m.subteams || "").split(";").map(subteamIn).filter(Boolean)

/**
 * The line under a name. Subteams already have icons, so this is only a
 * title: President, Advisor, or the team someone leads. Anthony is both
 * president and Entrepreneurship lead, so those join with a comma.
 */
const cardLabel = (m) => {
  const parts = []
  if (m.level === "President") parts.push("President")
  if (m.level === "Advisor") parts.push("Advisor")
  if (m.level === "President" || m.level === "Lead") {
    for (const type of subteamsOf(m)) parts.push(type.label)
  }
  return parts.join(", ")
}

/**
 * Waterfall painting (1110×4000) behind the page. It fills the window width
 * and pans from the sky to the pool over the page's scroll, so the whole
 * painting goes by however long the page is.
 */
const BG_SRC = "https://static.igem.wiki/teams/6187/wiki/team/bg.avif"

const photoSrc = (m) => m.photo || ""

/** First and last name's, past a nickname in brackets ("Adrija (Hiya) Paul"). */
const initials = (name = "") => {
  const words = name.split(/\s+/).filter((w) => w && !w.startsWith("("))
  return [words[0], words.length > 1 && words[words.length - 1]]
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join("")
}

const groupByLevel = (members) =>
  LEVELS.map(([level, title]) => [
    level,
    title,
    members.filter((m) => m.level === level),
  ]).filter(([, , group]) => group.length)

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
        <IconLink href={`mailto:${m.email}`} target="_blank" rel="noopener noreferrer" onClick={stop} aria-label={`Email ${m.Name}`}>
          <MailIcon />
        </IconLink>
      )}
    </Links>
  )
}

const TeamPage = ({ data }) => {
  const sections = groupByLevel(data.allTeamCsv.nodes)
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
        <Legend aria-label="Subteam icons">
          {SUBTEAMS.map((type) => (
            <LegendItem key={type.slug}>
              <img
                src={`${SUBTEAM_ICON_BASE}${type.slug}.avif`}
                alt=""
              />
              <span>{type.label}</span>
            </LegendItem>
          ))}
        </Legend>

        <Roster>
        {sections.map(([level, title, members]) => (
          <Section key={level} aria-labelledby={`team-${level}`}>
            <SectionTitle id={`team-${level}`}>{title}</SectionTitle>
            <Cards>
              {members.map((m) => {
                const isFlipped = flipped.has(m.id)
                const frame = LEAD_LEVELS.has(level) ? LEAD_FRAME : TEAM_FRAME
                const types = subteamsOf(m)
                const label = cardLabel(m)
                const about = [m.major, m.year, m.school].filter(Boolean)
                return (
                  <Card key={m.id} style={{ "--frame": frame }}>
                    <FlipInner $flipped={isFlipped}>
                      <Front
                        role="button"
                        tabIndex={isFlipped ? -1 : 0}
                        aria-hidden={isFlipped}
                        aria-expanded={isFlipped}
                        aria-label={`${m.Name}${label ? `, ${label}` : ""}. Show more.`}
                        onClick={() => toggle(m.id)}
                        onKeyDown={keyToggle(m.id)}
                      >
                        <Photo>
                          {photoSrc(m) ? (
                            <img src={photoSrc(m)} alt="" loading="lazy" />
                          ) : (
                            <Initials aria-hidden>{initials(m.Name)}</Initials>
                          )}
                          <Top>
                            <Caption>
                              <Name>{m.Name}</Name>
                              {label && <Role>{label}</Role>}
                            </Caption>
                            {types.length > 0 && (
                              <TypeBadges>
                                {types.map((type) => (
                                  <TypeBadge
                                    key={type.slug}
                                    src={`${SUBTEAM_ICON_BASE}${type.slug}.avif`}
                                    alt={`${type.label} subteam`}
                                    title={type.label}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ))}
                              </TypeBadges>
                            )}
                          </Top>
                          <MemberLinks m={m} />
                        </Photo>
                      </Front>

                      <Back
                        role="button"
                        tabIndex={isFlipped ? 0 : -1}
                        aria-hidden={!isFlipped}
                        aria-expanded={isFlipped}
                        aria-label={`More about ${m.Name}. Click to flip back.`}
                        onClick={() => toggle(m.id)}
                        onKeyDown={keyToggle(m.id)}
                      >
                        <BackInner>
                          <BackName>{m.Name}</BackName>
                          {label && <BackRole>{label}</BackRole>}
                          {about.length > 0 && (
                            <About>
                              {about.map((line) => (
                                <li key={line}>{line}</li>
                              ))}
                            </About>
                          )}
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
        </Roster>
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
        level
        role
        subteams
        major
        year
        school
        description
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
  margin: clamp(2rem, 6vw, 4rem) 0 clamp(1.5rem, 4vw, 2.5rem);
  text-align: center;
  color: ${HEADING};
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.5rem, 7vw, 4.25rem);
  letter-spacing: -0.01em;
`

/** Clears a legend fixed to the left of the viewport, and only when it would cover the cards. */
const Roster = styled.div`
  --legend-reach: 13.25rem;
  padding-left: max(
    0px,
    calc(
      var(--legend-reach) - max(0px, (100vw - var(--max-width)) / 2) -
        var(--page-padding)
    )
  );

  @media (max-width: 700px) {
    --legend-reach: 3.6rem;
  }
`

const Legend = styled.ul`
  position: fixed;
  z-index: 20;
  top: 5.25rem;
  left: max(0.75rem, env(safe-area-inset-left));
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-height: calc(100vh - 6.5rem);
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
`

const LegendItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: max-content;
  padding: 0.3rem 0.7rem 0.3rem 0.35rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: ${HEADING};
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;

  img {
    width: 1.7rem;
    height: 1.7rem;
  }

  /* A phone has no room for every name at once. The icons stay; the name shows on tap. */
  @media (max-width: 700px) {
    padding-right: 0.35rem;

    span {
      position: absolute;
      left: calc(100% + 0.35rem);
      padding: 0.25rem 0.55rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.95);
      opacity: 0;
      pointer-events: none;
    }

    &:hover span,
    &:focus-within span {
      opacity: 1;
    }
  }
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
  /* Sit below a long name instead of through the middle of it. */
  padding-top: 2.4em;
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 2.25em;
`

/** Name on the left, subteam icons in their own column on the right. */
const Top = styled.div`
  position: absolute;
  z-index: 1;
  top: 0.4em;
  left: 0.45em;
  right: 0.35em;
  display: flex;
  align-items: flex-start;
  gap: 0.4em;
`

const Caption = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  color: #fff;
  line-height: 1.2;
`

/** The subteams' icons, down the top right like a Pokémon card's type symbol. */
const TypeBadges = styled.div`
  flex: 0 0 2.15em;
  display: flex;
  flex-direction: column;
  gap: 0.15em;
`

const TypeBadge = styled.img`
  /* Over the photo's own img rule (fill the card). */
  && {
    width: 100%;
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
  font-size: 0.95em;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
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
  font-size: 1.05em;
`

const BackRole = styled.div`
  color: ${MUTED};
  font-size: 0.72em;
  margin-bottom: 0.4em;
`

/** Major, year and school, one to a line. */
const About = styled.ul`
  margin: 0 0 0.5em;
  padding: 0;
  list-style: none;
  font-size: 0.68em;
  line-height: 1.4;

  li + li {
    margin-top: 0.2em;
  }
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
