import React, { useCallback, useEffect, useRef, useState } from "react"
import { withPrefix } from "gatsby"
import styled from "styled-components"

/*
 * The PETadex game: browser, battle, coverage board and tutorial, all in one
 * self-contained page at static/figures/petadex-game/petadex-game.html.
 * It started as ~/Documents/projects/petamon-game/petadex-game-demo.html,
 * adapted here to be always dark, drop the demo title and dev notes, and lay
 * itself out to fill the frame. Carry later changes to the demo over by hand.
 *
 * The frame is sized to fit the window under the site header, and the game
 * fits inside it: the coverage board takes what is left and scrolls on its
 * own. The battle dialog and tutorial bar are fixed to the game's viewport,
 * so they always land inside the frame.
 */
const SRC = "/figures/petadex-game/petadex-game.html"

const PetadexGame = () => {
  const href = withPrefix(SRC)
  const boxRef = useRef(null)
  const [full, setFull] = useState(false)

  useEffect(() => {
    const sync = () => setFull(document.fullscreenElement === boxRef.current)
    document.addEventListener("fullscreenchange", sync)
    return () => document.removeEventListener("fullscreenchange", sync)
  }, [])

  const toggleFull = useCallback(() => {
    const box = boxRef.current
    if (!box) return
    if (document.fullscreenElement === box) {
      document.exitFullscreen?.()
      return
    }
    const request = box.requestFullscreen || box.webkitRequestFullscreen
    // Where full screen is refused, the game still has its own page.
    if (!request) {
      window.open(href, "_blank", "noopener")
      return
    }
    Promise.resolve(request.call(box)).catch(() => {
      window.open(href, "_blank", "noopener")
    })
  }, [href])

  return (
    <Figure>
      <Head>
        <FrameButton type="button" onClick={toggleFull} aria-pressed={full}>
          {full ? "Exit full screen" : "Full screen ⤢"}
        </FrameButton>
      </Head>
      <Box ref={boxRef}>
        <Frame src={href} title="PETadex game" loading="lazy" />
      </Box>
    </Figure>
  )
}

export default PetadexGame

const Figure = styled.figure`
  margin: var(--space-lg, 1.5rem) 0;
`

const Head = styled.div`
  display: flex;
  margin-bottom: var(--space-xs, 0.4rem);
`

const FrameButton = styled.button`
  margin-left: auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-link, inherit);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
`

const Box = styled.div`
  width: 100%;
  height: min(46rem, calc(100vh - 7rem));
  min-height: 26rem;
  overflow: hidden;
  border: 1px solid #16181a;
  border-radius: 8px;
  background: #16181a;

  &:fullscreen {
    height: 100%;
    border: 0;
    border-radius: 0;
  }
`

const Frame = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
`
