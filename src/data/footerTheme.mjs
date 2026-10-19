const bottomColors = {
  "/human-practices/": "#CDD7B8",
  "/beyond-the-bench/human-practices/": "#CDD7B8",
  "/entrepreneurship/": "#7FE4AA",
  "/beyond-the-bench/entrepreneurship/": "#7FE4AA",
  "/contribution/": "#769B8A",
  "/project/contribution/": "#769B8A",
  "/attributions/": "#EBB9A0",
  "/team/attributions/": "#EBB9A0",
  "/team/": "#94D0D2",
  "/engineering/": "#C9A379",
  "/project/engineering/": "#C9A379",
  "/safety/": "#588C7E",
  "/safety-and-security/": "#588C7E",
  "/finance/": "#FADECD",
  "/description/": "#000000",
  "/project/description/": "#000000",
  "/model/": "#805340",
  "/software/": "#805340",
  "/wiki/": "#FECC65",
  "/beyond-the-bench/outreach/": "#D7AB6F",
  "/": "#296270",
}

export function footerTheme(pagePath = "") {
  const path = pagePath ? `${pagePath.replace(/\/+$/, "")}/` : ""
  const bottom = path.startsWith("/hardware/") ? "#A39DCC"
    : path.startsWith("/dry-lab/") ? "#805340"
    : path.startsWith("/wet-lab/") ? "#98CC80"
    : bottomColors[path]
  const lightText = ["#296270", "#000000", "#805340"].includes(bottom)
  return {
    bottom,
    text: bottom ? (lightText ? "#FFFFFF" : "#06202B") : undefined,
    button: path === "/" ? "#1BB4A8" : undefined,
  }
}
