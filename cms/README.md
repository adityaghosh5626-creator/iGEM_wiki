# Payload CMS prototype

**Currently disabled.** Edit the local MDX files under `src/content/wiki/`.
The CMS app, database integration, import tools, and saved exports are retained.
Gatsby ignores saved exports, sync/export commands skip CMS requests, and the
Payload demo workflow and CMS Git deployments are disabled by default.

To restore it:

1. Set `USE_PAYLOAD_EXPORTS = true` in `content-source.config.mjs`.
2. Install CMS dependencies with `npm --prefix cms/payload-app ci` and configure
   its environment using the workflow guide below.
3. Set the GitHub repository variable `PAYLOAD_ENABLED` to `true` if using the demo workflow.
4. Set `git.deploymentEnabled` to `true` in `cms/payload-app/vercel.json` if restoring CMS Git deployments.
5. Run `npm run payload:sync`, validate content, and rebuild Gatsby.

These repository settings do not shut down an already hosted CMS or delete its database.


This folder preserves the team's Payload CMS pilot for possible future wiki authoring.

## Hosted demo (Vercel)

See **[docs/vercel-demo-deployment.md](../docs/vercel-demo-deployment.md)** for the full setup guide (two Vercel projects: CMS + wiki).

## Local quick start

See [docs/payload-cms-workflow.md](../docs/payload-cms-workflow.md).

```bash
npm run payload:develop      # http://localhost:3000/admin
npm run payload:import-mdx   # seed Wiki Pages from existing MDX
npm run payload:export       # export published pages to src/content/wiki/_payload-export/
npm run develop              # Gatsby wiki at http://localhost:8000
```

## Layout

- `payload-app/` — Payload + Next.js CMS app
- `../docs/payload-cms-workflow.md` — author guide
- `../scripts/export-payload-content.mjs` — MDX export script
- `../src/content/wiki/_payload-export/` — exported MDX consumed by Gatsby

Local dev uses SQLite. Vercel uses Postgres + Blob storage (configured automatically).
