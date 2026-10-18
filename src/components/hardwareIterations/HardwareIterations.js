import React, { useState } from "react"
import { HARDWARE_ITERATIONS } from "../../data/hardwareIterations.js"
import { IterationTimeline } from "./IterationTimeline.js"
import { SubsystemTabs } from "./SubsystemTabs.js"

export function HardwareIterations() {
  const [version, setVersion] = useState(0)
  const [subsystem, setSubsystem] = useState("cad")
  const iteration = HARDWARE_ITERATIONS[version]
  return (
    <div>
      <IterationTimeline iterations={HARDWARE_ITERATIONS} selectedIndex={version} onChange={setVersion} />
      <p role="status">Viewing {iteration.label}</p>
      <section aria-labelledby="iteration-overview">
        <h2 id="iteration-overview">Overview</h2>
        <h3>{iteration.label}</h3>
        <p>{iteration.overview}</p>
      </section>
      <h2 id="iteration-subsystems">Subsystems</h2>
      <SubsystemTabs iteration={iteration} selected={subsystem} onSelect={setSubsystem} />
    </div>
  )
}
