import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

/**
 * The structure viewer from petadex.net, running inside the wiki: Mol*, the
 * engine the RCSB PDB viewer is built on, drawing a real cartoon from Mol*'s
 * own secondary-structure assignment.
 *
 * Ported from petadex.io/frontend/src/components/protein/ProteinViewer.js and
 * its molstarAnnotations.js, with three differences:
 *   - the structure is a static file served by the wiki, not a call to the
 *     petadex.net API, so the demo still makes no call off this site;
 *   - the Mol* UI is off and the record card supplies the controls;
 *   - the catalytic triad is drawn as ball-and-stick, the way that file's
 *     annotation overlay draws a group of residues.
 *
 * Mol* is imported on mount rather than at the top of the module, so its
 * bundle only reaches a reader who opens the structure layer, and so the SSR
 * build never touches it.
 */

/**
 * The catalytic triad, in the magenta petadex.net marks an annotated residue
 * with. It has to stay legible against both colour modes below, and the ink
 * brown it used to be was too close to the chain's N-terminal end.
 */
export const TRIAD_COLOR = 0xd12b7d
const PAPER = 0xf3e9e5

/** A Mol* colour as CSS, so a legend can be drawn from the same numbers. */
export const cssColor = (value) => `#${value.toString(16).padStart(6, "0")}`

/**
 * AlphaFold's confidence bands. The uncertainty theme reads the B-factor
 * column, which is where ColabFold writes pLDDT, and it reverses its scale,
 * so the list runs from the confident end down.
 */
export const PLDDT_COLORS = [0x2f6fba, 0x68b9e8, 0xe6c94a, 0xe08552]

/** The pLDDT range the scale is stretched over. */
export const PLDDT_DOMAIN = [50, 90]

/**
 * N to C terminus in the Dry Lab figure palette, in place of Mol*'s default
 * rainbow, so the key beside the viewer means what it says.
 */
export const CHAIN_COLORS = [0xb6693d, 0xc8a24a, 0x3f7a5a, 0x3f7a8c, 0x4a5f8c]

/** The cartoon with its colouring switched off, as petadex.net draws it. */
export const PLAIN_COLOR = 0xf5f5f5

const THEME = {
  plain: { name: "uniform", params: { value: PLAIN_COLOR } },
  chain: {
    name: "sequence-id",
    params: { list: { kind: "interpolate", colors: CHAIN_COLORS } },
  },
  plddt: {
    name: "uncertainty",
    params: { domain: PLDDT_DOMAIN, list: { kind: "interpolate", colors: PLDDT_COLORS } },
  },
}

/**
 * Resolves once the element has a width and a height. An element that is
 * still being laid out — or one in a panel that has not been sized yet —
 * measures zero, and Mol* cannot start in a box of no size.
 */
const waitForBox = (el, timeoutMs = 8000) =>
  new Promise((resolve, reject) => {
    const measure = () => {
      const box = el.getBoundingClientRect()
      return box.width > 0 && box.height > 0 ? box : null
    }
    const now = measure()
    if (now) return resolve(now)
    if (typeof ResizeObserver !== "function") {
      return reject(new Error("viewer has no room to draw in"))
    }
    const observer = new ResizeObserver(() => {
      const box = measure()
      if (!box) return
      clearTimeout(timer)
      observer.disconnect()
      resolve(box)
    })
    const timer = setTimeout(() => {
      observer.disconnect()
      reject(new Error("viewer has no room to draw in"))
    }, timeoutMs)
    observer.observe(el)
  })

export const StructureViewer = ({ src, triad, mode = "chain", spin = false, label, onState }) => {
  const hostRef = useRef(null)
  const pluginRef = useRef(null)
  const polymerRef = useRef(null)
  const [state, setState] = useState("loading")
  // Kept so a failure says what went wrong on the page itself, not only in
  // the console.
  const [failure, setFailure] = useState(null)

  // One effect builds the viewer and loads the structure. The colour mode and
  // the spin are pushed into the running plugin by the two effects below, so
  // changing either reloads nothing.
  useEffect(() => {
    if (typeof window === "undefined") return undefined
    let live = true

    const start = async () => {
      try {
        setState("loading")
        const [{ createPluginUI }, { renderReact18 }, { DefaultPluginUISpec }] = await Promise.all([
          import("molstar/lib/mol-plugin-ui"),
          import("molstar/lib/mol-plugin-ui/react18"),
          import("molstar/lib/mol-plugin-ui/spec"),
          // The viewport's own stylesheet, loaded with it rather than with
          // the page, since every other page has no use for it.
          import("molstar/build/viewer/molstar.css"),
        ])
        if (!live || !hostRef.current) return

        // Mol* measures its target on creation and will not start inside a
        // box of no size. The panel around it can still be settling when this
        // runs, so wait for a box rather than giving up on the first measure.
        await waitForBox(hostRef.current)
        if (!live) return

        const spec = DefaultPluginUISpec()
        spec.layout = {
          initial: { isExpanded: false, showControls: false, controlsDisplay: "none" },
        }
        spec.components = {
          ...spec.components,
          controls: { left: "none", right: "none", top: "none", bottom: "none" },
        }
        spec.canvas3d = {
          renderer: { backgroundColor: PAPER },
          camera: { helper: { axes: { name: "off", params: {} } } },
        }

        const plugin = await createPluginUI({
          target: hostRef.current,
          spec,
          render: renderReact18,
        })
        if (!live) {
          plugin.dispose()
          return
        }
        pluginRef.current = plugin

        const text = await fetch(src).then((res) => {
          if (!res.ok) throw new Error(`structure file: HTTP ${res.status}`)
          return res.text()
        })
        if (!live) return

        const data = await plugin.builders.data.rawData({ data: text, label })
        const trajectory = await plugin.builders.structure.parseTrajectory(data, "pdb")
        const model = await plugin.builders.structure.createModel(trajectory)
        const structure = await plugin.builders.structure.createStructure(model)

        const polymer = await plugin.builders.structure.tryCreateComponentStatic(
          structure,
          "polymer"
        )
        if (polymer) {
          polymerRef.current = await plugin.builders.structure.representation.addRepresentation(
            polymer,
            {
              type: "cartoon",
              typeParams: {},
              color: (THEME[mode] ?? THEME.chain).name,
              colorParams: (THEME[mode] ?? THEME.chain).params,
            }
          )
        }

        await addTriad(plugin, structure, triad)

        const { Structure } = await import("molstar/lib/mol-model/structure")
        await plugin.managers.camera.focusLoci(
          Structure.toStructureElementLoci(structure.cell.obj.data)
        )

        if (!live) return
        setState("ready")
      } catch (err) {
        console.error("Mol* structure viewer:", err)
        if (live) setFailure(err?.message || String(err))
        if (live) setState("error")
      }
    }

    start()
    return () => {
      live = false
      polymerRef.current = null
      if (pluginRef.current) {
        pluginRef.current.dispose()
        pluginRef.current = null
      }
    }
    // The structure is rebuilt only when the record changes; mode and spin
    // are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, triad, label])

  useEffect(() => {
    onState?.(state)
  }, [state, onState])

  // Recolour the cartoon in place. The triad keeps its own colour, because
  // only the polymer's representation is updated.
  useEffect(() => {
    const plugin = pluginRef.current
    const polymer = polymerRef.current
    if (!plugin || !polymer || state !== "ready") return
    let cancelled = false
    const recolour = async () => {
      const { StateTransforms } = await import("molstar/lib/mol-plugin-state/transforms")
      if (cancelled || !pluginRef.current) return
      await plugin
        .build()
        .to(polymer)
        .update(StateTransforms.Representation.StructureRepresentation3D, (old) => ({
          ...old,
          colorTheme: THEME[mode] ?? THEME.chain,
        }))
        .commit()
    }
    recolour()
    return () => {
      cancelled = true
    }
  }, [mode, state])

  useEffect(() => {
    const plugin = pluginRef.current
    if (!plugin?.canvas3d || state !== "ready") return
    plugin.canvas3d.setProps({
      trackball: { animate: spin ? { name: "spin", params: { speed: 0.12 } } : { name: "off", params: {} } },
    })
  }, [spin, state])

  return (
    <Host>
      <Target ref={hostRef} />
      {state !== "ready" && (
        <Notice role="status">
          {state === "loading" ? (
            "Loading the structure…"
          ) : (
            <>
              The structure viewer did not load.
              {failure && <Reason>{failure}</Reason>}
            </>
          )}
        </Notice>
      )}
    </Host>
  )
}

/**
 * The catalytic triad, as its own component drawn in ball-and-stick over the
 * cartoon. Mol*'s addRepresentation ignores a loci, so the residues become a
 * sub-component first, the way the petadex annotation overlay does it.
 */
const addTriad = async (plugin, structure, triad) => {
  if (!triad?.length) return
  const { Schema } = await import("molstar/lib/mol-model/structure/structure/element/schema")
  const { Color } = await import("molstar/lib/mol-util/color")
  const expression = Schema.toExpression({
    items: triad.map(([pos]) => ({ label_seq_id: pos })),
  })
  const component = await plugin.builders.structure.tryCreateComponentFromExpression(
    structure,
    expression,
    "catalytic-triad",
    { label: "Catalytic triad" }
  )
  if (!component) return
  await plugin.builders.structure.representation.addRepresentation(component, {
    type: "ball-and-stick",
    typeParams: { sizeFactor: 0.3 },
    color: "uniform",
    colorParams: { value: Color(TRIAD_COLOR) },
  })
}

const Host = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  /* A floor, so the viewer still has somewhere to draw if the box above it
     ever fails to give this one a width. */
  min-height: 18rem;
  max-height: 26rem;
  overflow: hidden;
  border-radius: 10px;
  background: #f3e9e5;

  /* The plugin paints into a canvas that fills the box; its own chrome is
     switched off in the spec above, and this covers anything it still lays
     over the viewport. */
  .msp-layout-expanded,
  .msp-layout-standard {
    position: absolute;
    inset: 0;
  }

  .msp-layout-top,
  .msp-layout-bottom,
  .msp-layout-left,
  .msp-layout-right,
  .msp-layout-controls,
  .msp-viewport-controls,
  .msp-highlight-toast-wrapper {
    display: none !important;
  }
`

const Target = styled.div`
  position: absolute;
  inset: 0;
`

const Notice = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: #f3e9e5;
  color: #805340;
  font-size: 0.82rem;
  text-align: center;
`

const Reason = styled.span`
  display: block;
  margin-top: 0.4rem;
  color: #8a7266;
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  overflow-wrap: anywhere;
`
