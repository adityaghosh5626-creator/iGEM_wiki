/** Scroll citation links locally instead of triggering Gatsby hash navigation. */
export function scrollToReference(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey) return

  const link = event.target.closest?.("a[href]")
  if (!link || !event.currentTarget.contains(link) ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")) return

  const href = link.getAttribute("href")
  if (!/^#(?:bib-|ref-)/.test(href)) return
  let id
  try { id = decodeURIComponent(href.slice(1)) } catch { return }
  const document = link.ownerDocument
  const reference = document.getElementById(id)
  if (!reference) return

  event.preventDefault()
  event.stopPropagation()

  // Move keyboard focus with the reader, without a second automatic scroll.
  if (!reference.hasAttribute("tabindex")) {
    reference.setAttribute("tabindex", "-1")
    reference.addEventListener("blur", () => reference.removeAttribute("tabindex"), { once: true })
  }
  reference.focus({ preventScroll: true })
  const reducedMotion = document.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  reference.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" })
}
