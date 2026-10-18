const React = require("react")

/**
 * The section-4 enzyme (the protein that follows the scroll), hosted on
 * GitLab (which serves uploads as AVIF).
 */
const ICON_BASE = "https://static.igem.wiki/teams/6187/wiki/homepage-components/"

/**
 * PETABITE logo loop frames — the loading screen shows these first (see
 * src/components/logoFrames.js). PlateImg draws each from its cropped copy
 * (see src/data/plateCrops.js), so that's what to preload.
 */
const LOGO_FRAME_URLS = Array.from(
  { length: 13 },
  (_, i) =>
    `https://static.igem.wiki/teams/6187/wiki/homepage-cropped/logo-animation-files-untitled-artwork-${i + 1}.avif`,
)

exports.onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  // Screen readers and CSS hyphenation both need the page language.
  setHtmlAttributes({ lang: "en" })
  setHeadComponents([
    React.createElement("link", {
      key: "favicon",
      rel: "icon",
      href: `${ICON_BASE}favicon-enzyme.avif`,
      type: "image/avif",
      sizes: "128x128",
    }),
    React.createElement("link", {
      key: "apple-touch-icon",
      rel: "apple-touch-icon",
      href: `${ICON_BASE}apple-touch-icon-enzyme.avif`,
    }),
    ...LOGO_FRAME_URLS.map((href, i) =>
      React.createElement("link", {
        key: `logo-frame-${i}`,
        rel: "preload",
        as: "image",
        href,
        fetchpriority: "high",
      }),
    ),
  ])
}
