import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const siteDir = Bun.argv[2] || 'site'

// Collect all instance types per region by walking the directory tree
const regions = {}

const regionDirs = await readdir(siteDir, { withFileTypes: true })
for (const entry of regionDirs) {
  if (!entry.isDirectory()) continue

  const regionCode = entry.name
  const instanceTypes = []

  // Walk the region directory to find all .json files
  const familyDirs = await readdir(join(siteDir, regionCode), { withFileTypes: true })
  for (const familyEntry of familyDirs) {
    if (!familyEntry.isDirectory()) continue

    const familyName = familyEntry.name
    const files = await readdir(join(siteDir, regionCode, familyName))
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      const size = file.replace('.json', '')
      instanceTypes.push(`${familyName}.${size}`)
    }
  }

  instanceTypes.sort()
  regions[regionCode] = { instanceTypes }
}

const index = {
  updatedAt: new Date().toISOString(),
  regions
}

await Bun.write(join(siteDir, 'index.json'), JSON.stringify(index, null, 2))
console.log(`Generated index.json with ${Object.keys(regions).length} regions`)
