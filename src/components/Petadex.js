import React, { useState } from "react"
import styled from "styled-components"

const ENTRIES = [
  {
    id: "001",
    name: "Petase 1",
    properties: ["Antibacterial"],
    image: "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petase-1.avif",
  },
  {
    id: "002",
    name: "Petase 2",
    properties: ["Decomposes H₂O"],
    image: "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petase-2.avif",
  },
  {
    id: "003",
    name: "Petase 3",
    properties: ["Digestive enzyme"],
    image: "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petase-3.avif",
  },
]

const IMG = {
  background:        "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petadex-background.avif",
  screen:            "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petadex-screen.avif",
  petaseBg:          "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petadex-petase-bg.avif",
  propertiesBg:      "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petadex-properties-bg.avif",
  underPropertiesBg: "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petadex-under-properties-bg.avif",
  prev:              "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petadex-prev-petase-button.avif",
  next:              "https://static.igem.wiki/teams/6187/wiki/drylab-page/game/petadex-next-petase-button.avif",
}

const Shell = styled.div`
  position: relative;
  width: 900px;
  max-width: 100%;
  height: 560px;
  margin: 1.5rem auto 4.5rem;
  border-radius: 24px;
  box-sizing: border-box;
  overflow: hidden;
`

const BgImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 24px;
  z-index: 0;
  pointer-events: none;
`

const ScreenFrame = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  bottom: 120px;
  z-index: 1;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  box-sizing: border-box;
`

const ScreenOverlay = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 0;
  pointer-events: none;
`

const TopRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0;
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 240px;
`

const PetaseWindow = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  box-sizing: border-box;
`

const PetaseBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 0;
`

const EnzymeImage = styled.img`
  position: relative;
  z-index: 1;
  width: 160px;
  height: 160px;
  object-fit: contain;
  display: block;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 0;
`

const Name = styled.h3`
  margin: 0 0 6px 4px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
`

const PropertiesBox = styled.div`
  position: relative;
  flex: 1;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

const PropertiesBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 0;
`

const PropList = styled.ul`
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0 0 0 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
`

const Prop = styled.li`
  font-size: 1.1rem;
  color: #222;
  line-height: 1.4;
`

const MiddleBottom = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
`

const UnderPropertiesBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 0;
`

const NavGroup = styled.div`
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 20px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
`

const NavBtn = styled.button`
  background-image: url(${p => p.$img});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  width: 80px;
  height: 80px;
  cursor: pointer;
  opacity: ${p => p.disabled ? 0.35 : 1};
  pointer-events: ${p => p.disabled ? "none" : "auto"};
  transition: transform 0.1s, opacity 0.2s;
  flex-shrink: 0;
  &:active { transform: translateY(3px); }
  &:hover { filter: brightness(1.1); }
`

const Petadex = ({ entries = ENTRIES }) => {
  const [idx, setIdx] = useState(0)
  const entry = entries[idx]

  return (
    <Shell>
      <BgImage src={IMG.background} alt="" />

      <ScreenFrame>
        <ScreenOverlay src={IMG.screen} alt="" />

        <TopRow>
          <LeftColumn>
            <PetaseWindow>
              <PetaseBg src={IMG.petaseBg} alt="" />
              <EnzymeImage key={entry.id} src={entry.image} alt={entry.name} />
            </PetaseWindow>
          </LeftColumn>

          <RightColumn>
            <Name>{entry.name}</Name>
            <PropertiesBox>
              <PropertiesBg src={IMG.propertiesBg} alt="" />
              <PropList>
                {entry.properties.map((p, i) => <Prop key={i}>{p}</Prop>)}
              </PropList>
            </PropertiesBox>
          </RightColumn>
        </TopRow>

        <MiddleBottom>
          <UnderPropertiesBg src={IMG.underPropertiesBg} alt="" />
        </MiddleBottom>
      </ScreenFrame>

      <NavGroup>
        <NavBtn
          $img={IMG.prev}
          onClick={() => setIdx(i => i - 1)}
          disabled={idx === 0}
          aria-label="Previous"
        />
        <NavBtn
          $img={IMG.next}
          onClick={() => setIdx(i => i + 1)}
          disabled={idx === entries.length - 1}
          aria-label="Next"
        />
      </NavGroup>
    </Shell>
  )
}

export default Petadex
