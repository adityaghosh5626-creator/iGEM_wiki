import React, { createContext, useContext } from "react"

/**
 * Whether links in the current page open in a new tab. The MDX template turns
 * this on for the Dry Lab pages, so a reader following a link never loses
 * their place. Same-page anchors (#...) still scroll in place.
 */
const NewTabContext = createContext(false)

export const NewTabLinks = ({ enabled, children }) => (
  <NewTabContext.Provider value={Boolean(enabled)}>{children}</NewTabContext.Provider>
)

export const useNewTabLinks = () => useContext(NewTabContext)

/** A link that always opens in a new tab (the calendar's, whatever page it is on). */
export const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" }

/** The target/rel props a link to `href` should carry on this page. */
export const useLinkTarget = (href = "") => {
  const newTab = useNewTabLinks()
  return newTab && !href.startsWith("#") ? NEW_TAB : {}
}
