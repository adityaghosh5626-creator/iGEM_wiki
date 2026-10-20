// GitHub builds the site; GitLab verifies and publishes the same source snapshot.
// Uses only Node built-ins, git and tar, so publishing needs no npm install.
import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const directory = '.igem-pages'
const archive = path.join(directory, 'site.tar.gz')
const manifestFile = path.join(directory, 'manifest.json')
const sha256 = value => createHash('sha256').update(value).digest('hex')
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()
// The GitLab snapshot adds only .igem-pages; all other tracked source must match.
const sourceDigest = () => sha256(git('ls-tree', '-r', '--full-tree', 'HEAD')
  .split('\n').filter(line => !line.split('\t')[1]?.startsWith(`${directory}/`)).join('\n'))

const mode = process.argv[2]
if (mode === 'pack') {
  await fs.access('public/index.html')
  await fs.mkdir(directory, { recursive: true })
  execFileSync('tar', ['-czf', archive, '-C', 'public', '.'], { stdio: 'inherit' })
  const bytes = await fs.readFile(archive)
  if (bytes.length > 4_500_000) throw new Error('Pages bundle exceeds the 4.50 MB safety budget.')
  await fs.writeFile(manifestFile, JSON.stringify({
    version: 1,
    commit: git('rev-parse', 'HEAD'),
    sourceDigest: sourceDigest(),
    archiveSha256: sha256(bytes),
  }, null, 2) + '\n')
  console.log(`Packed Pages bundle: ${(bytes.length / 1_000_000).toFixed(2)} MB`)
} else if (mode === 'unpack') {
  let manifest
  try { manifest = JSON.parse(await fs.readFile(manifestFile, 'utf8')) }
  catch { throw new Error('No valid Pages bundle. Run the GitHub “Sync main to iGEM GitLab” workflow first.') }
  if (manifest.version !== 1 || manifest.sourceDigest !== sourceDigest()) {
    throw new Error('Source changed after this site was built. Rebuild and sync from GitHub before publishing.')
  }
  if (sha256(await fs.readFile(archive)) !== manifest.archiveSha256) {
    throw new Error('Pages archive checksum mismatch; refusing to publish.')
  }
  await fs.rm('public', { recursive: true, force: true })
  await fs.mkdir('public')
  execFileSync('tar', ['-xzf', archive, '-C', 'public'], { stdio: 'inherit' })
  await fs.access('public/index.html')
  console.log(`Verified and unpacked Pages built from GitHub ${manifest.commit}`)
} else {
  throw new Error('Usage: node scripts/igem-pages-bundle.mjs pack|unpack')
}
