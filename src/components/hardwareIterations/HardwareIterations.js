import React, { useEffect, useState } from "react"
import { HARDWARE_ITERATIONS, HARDWARE_SUBSYSTEMS } from "../../data/hardwareIterations.js"
import { IterationTimeline } from "./IterationTimeline.js"
import { SubsystemTabs } from "./SubsystemTabs.js"
import V1Overview from "../../content/wiki/hardware/past-iterations/version-1/_overview.mdx"
import V2Overview from "../../content/wiki/hardware/past-iterations/version-2/_overview.mdx"

const OVERVIEW_CONTENT = { "version-1": V1Overview, "version-2": V2Overview }

/**
 * A link can open a subsystem: #pumps, or on a version, #version-2-pumps
 * (the Hardware Notebook's photo links here like that).
 */
function fromHash(hash) {
  const [, versionId, subsystem] =
    hash.slice(1).match(/^(?:(version-\d+)-)?([a-z]+)$/) || []
  if (!HARDWARE_SUBSYSTEMS.some(s => s.id === subsystem)) return null
  const version = HARDWARE_ITERATIONS.findIndex(it => it.id === versionId)
  return { subsystem, version: version === -1 ? null : version }
}

export function HardwareIterations() {
  const [version, setVersion] = useState(0)
  const [subsystem, setSubsystem] = useState("cad")
  const iteration = HARDWARE_ITERATIONS[version]
  const Overview = OVERVIEW_CONTENT[iteration.id]

  useEffect(() => {
    const open = () => {
      const target = fromHash(window.location.hash)
      if (!target) return
      setSubsystem(target.subsystem)
      if (target.version !== null) setVersion(target.version)
      requestAnimationFrame(() =>
        document.getElementById("iteration-subsystems")?.scrollIntoView({ block: "start" })
      )
    }
    open()
    window.addEventListener("hashchange", open)
    return () => window.removeEventListener("hashchange", open)
  }, [])

  return (
    <div>
      <IterationTimeline iterations={HARDWARE_ITERATIONS} selectedIndex={version} onChange={setVersion} />
      <p role="status">Viewing {iteration.label}</p>
      <section aria-labelledby="iteration-overview">
        <h2 id="iteration-overview">Overview</h2>
        <h3>{iteration.label}</h3>
        {Overview ? <Overview key={iteration.id} /> : <p>{iteration.overview}</p>}
      </section>
      <h2 id="iteration-subsystems">Subsystems</h2>
      <SubsystemTabs iteration={iteration} selected={subsystem} onSelect={setSubsystem} />
    </div>
  )
}
