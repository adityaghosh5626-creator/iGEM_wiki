import React from "react"
import styled from "styled-components"

export const Layout = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
`

/**
 * The plain pages' contents list, down the left. Wide windows have room for
 * it in the margin (it takes the margin's width, up to 14rem); narrower
 * ones give it a column (WikiLayout's `withToc`). Phones leave it off.
 */
export const TOCWrapper = styled.div`
  position: fixed;
  top: 14rem;
  left: 1.5rem;
  width: min(14rem, calc((100vw - var(--max-width)) / 2 + 1rem));

  @media (max-width: 1423px) {
    width: 11rem;
  }

  @media (max-width: 859px) {
    display: none;
  }
`

export const Content = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  min-width: 0;

  @media (max-width: 1200px) {
    padding: 0 24px;
  }
`

export const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 32px;
  font-size: 3rem;
`

export const Subheading = styled.h2`
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 2rem;
`
