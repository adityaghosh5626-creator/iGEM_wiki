// Body font (--font-body). Bundled into the build so it's served from the wiki
// itself; weights match the ones used across src/.
import "@fontsource/dm-sans/400.css"
import "@fontsource/dm-sans/500.css"
import "@fontsource/dm-sans/600.css"
import "@fontsource/dm-sans/700.css"
import "@fontsource/dm-sans/800.css"
import { endRouteWait, startRouteWait } from "./src/components/SiteLoader.js"

/*
 * A page that takes over a second to arrive puts the logo loader up (in
 * place of Gatsby's "Preparing requested page" notice, which
 * scripts/run-develop.cjs turns off).
 */
export const onRouteUpdateDelayed = () => startRouteWait()
export const onRouteUpdate = () => endRouteWait()

/*
 * Scroll restoration: back/forward (and reloads) return to where you were
 * on that page. Gatsby remembers each history entry's position; these make
 * the return instant and reliable.
 */

export const shouldUpdateScroll = ({
  routerProps: { location },
  getSavedScrollPosition,
}) => {
  // [x, y], with no y when this visit to the page hasn't been scrolled.
  const [, savedY] = getSavedScrollPosition(location)
  if (savedY != null) {
    restoreScroll(savedY)
    return false
  }
  // A #section link: Gatsby scrolls to it.
  if (location.hash) return true
  // A new page starts at the top, at once (the site's smooth scrolling
  // would otherwise glide up from the last page's position).
  window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  return false
}

/**
 * Puts the page back at `y` straight away (not smooth-scrolled from the top)
 * and holds it there for a moment while the art finishes sizing, which can
 * shift the page; stops as soon as the reader scrolls themselves.
 */
function restoreScroll(y) {
  const until = performance.now() + 1200
  const inputs = ["wheel", "touchstart", "keydown", "pointerdown"]
  let readerScrolled = false
  const stop = () => {
    readerScrolled = true
  }
  inputs.forEach(type =>
    window.addEventListener(type, stop, { passive: true, once: true }),
  )
  const hold = () => {
    if (!readerScrolled && Math.abs(window.scrollY - y) > 1) {
      window.scrollTo({ top: y, left: 0, behavior: "instant" })
    }
    if (!readerScrolled && performance.now() < until) {
      requestAnimationFrame(hold)
    } else {
      inputs.forEach(type => window.removeEventListener(type, stop))
    }
  }
  hold()
}
