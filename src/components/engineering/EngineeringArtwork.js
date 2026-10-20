import React, { useId } from "react"

/** Crop a shared CDN canvas in the browser, preserving the original artwork. */
export function EngineeringArtwork({ src, crop, className, preserveAspectRatio = "xMidYMid meet", removeWhite = false }) {
  const clipId = `art-${useId().replace(/:/g, "")}`
  return (
    <svg className={className} viewBox={crop.join(" ")} aria-hidden="true"
      focusable="false" preserveAspectRatio={preserveAspectRatio} style={{ display: "block", width: "100%", height: "100%", overflow: "hidden", mixBlendMode: removeWhite ? "normal" : "multiply" }}>
      <defs><clipPath id={clipId}><rect x={crop[0]} y={crop[1]} width={crop[2]} height={crop[3]} /></clipPath>
        {removeWhite && <filter id={`${clipId}-white`} x={crop[0]} y={crop[1]} width={crop[2]} height={crop[3]} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          {/* White becomes transparent; the brown paint remains opaque. */}
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 3" />
        </filter>}
      </defs>
      <image href={src} x="0" y="0" width="1110" height="4000" clipPath={`url(#${clipId})`} filter={removeWhite ? `url(#${clipId}-white)` : undefined} />
    </svg>
  )
}
