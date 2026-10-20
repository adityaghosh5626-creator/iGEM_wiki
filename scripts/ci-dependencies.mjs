import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const require = createRequire(path.resolve('package.json'))
const marker = 'node_modules/.igem-dependencies.json'
const signature = {
  lock: createHash('sha256').update(await fs.readFile('package-lock.json')).digest('hex'),
  package: createHash('sha256').update(await fs.readFile('package.json')).digest('hex'),
  node: process.version,
  platform: process.platform,
  arch: process.arch,
}
async function check() {
  const stored = JSON.parse(await fs.readFile(marker, 'utf8'))
  if (JSON.stringify(stored) !== JSON.stringify(signature)) throw new Error('Dependency cache does not match this lockfile or Node platform.')
  await fs.access('node_modules/gatsby/cli.js')
  // Catch incomplete extraction or native modules from an incompatible runner.
  require('sharp')
  require('esbuild').transformSync('const value = 1', { minify: true })
}
const mode = process.argv[2]
if (!['prepare', 'check'].includes(mode)) throw new Error('Use prepare or check.')
try {
  await check()
  console.log('Verified installed dependency cache; no npm install needed.')
} catch (error) {
  if (mode === 'check') {
    throw new Error('Installed dependencies were not restored correctly. Retry prepare_dependencies and check its cache upload before retrying Pages. ' + error.message)
  }
  console.log('Preparing dependencies:', error.message)
  const result = spawnSync('npm', ['ci', '--cache', '.npm', '--no-audit', '--no-fund'], { stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
  // Cache installed packages only, not duplicate downloads or the old libvips archive.
  await fs.rm('.npm', { recursive: true, force: true })
  await fs.writeFile(marker, JSON.stringify(signature))
  await check()
  console.log('Installed dependencies verified and ready for the Pages job.')
}
