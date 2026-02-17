import { mkdir } from 'node:fs/promises'

const regionCode = Bun.argv[2]
if (!regionCode) {
  console.error('Usage: bun process-region.js <region-code>')
  process.exit(1)
}

console.log(`Processing region: ${regionCode}`)

const url = `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/${regionCode}/index.json`
const response = await fetch(url)
if (!response.ok) {
  console.error(`Failed to fetch pricing data for ${regionCode}: ${response.status} ${response.statusText}`)
  process.exit(1)
}

const awsData = await response.json()
const products = awsData.products || {}
const terms = awsData.terms || {}

const regionDir = `instances/${regionCode}`
await mkdir(regionDir, { recursive: true })

const getPriceForSku = (sku) => {
  if (!sku || !terms.OnDemand) return null
  const skuEntry = terms.OnDemand[sku]
  if (!skuEntry) return null
  for (const termKey of Object.keys(skuEntry)) {
    const term = skuEntry[termKey]
    const priceDimensions = term.priceDimensions || {}
    for (const pdKey of Object.keys(priceDimensions)) {
      const pd = priceDimensions[pdKey]
      const usd = pd && pd.pricePerUnit && pd.pricePerUnit.USD
      if (usd !== undefined) {
        const parsed = parseFloat(String(usd))
        if (!Number.isNaN(parsed)) return parsed
      }
    }
  }
  return null
}

const createdDirs = new Set()
const familyInstances = {}
let count = 0

for (const key of Object.keys(products)) {
  const product = products[key]
  const attrs = product.attributes || {}

  const productFamily = attrs.productFamily || product.productFamily || null
  if (productFamily !== 'Compute Instance') continue

  // Only include Linux instances
  const os = attrs.operatingSystem || attrs['Operating System'] || ''
  if (os !== 'Linux') continue

  const instanceType = attrs.instanceType || attrs['Instance Type'] || null
  if (!instanceType) continue

  // Only include standard On-Demand pricing (no Savings Plans, Reserved, Dedicated, etc.)
  // Usage types can be "BoxUsage:instance" or "REGION-BoxUsage:instance" (e.g., "SAE1-BoxUsage:t3.micro")
  const usageType = attrs.usagetype || attrs.usageType || ''
  if (!usageType.endsWith(`BoxUsage:${instanceType}`)) continue

  // Only include base Linux without pre-installed software (SQL, etc.)
  const preInstalledSw = attrs.preInstalledSw || attrs['Pre Installed S/W'] || ''
  if (preInstalledSw !== 'NA') continue

  // Only include base operation (not SQL or other add-ons)
  const operation = attrs.operation || ''
  if (operation !== 'RunInstances') continue

  const sku = product.sku || attrs.instancesku || attrs.instanceSku || attrs.sku
  const price = getPriceForSku(sku)

  const instancePath = String(instanceType).replace(/[^a-zA-Z0-9]/g, '/')
  const fullPath = `${regionDir}/${instancePath}.json`

  const parentDir = fullPath.substring(0, fullPath.lastIndexOf('/'))
  if (!createdDirs.has(parentDir)) {
    await mkdir(parentDir, { recursive: true })
    createdDirs.add(parentDir)
  }

  const instanceJson = {
    instanceType: attrs.instanceType || attrs['Instance Type'] || null,
    instanceFamily: attrs.instanceFamily || attrs['Instance Family'] || null,
    vCPU: attrs.vcpu || attrs.vCPU || null,
    memory: attrs.memory || attrs.Memory || null,
    storage: attrs.storage || attrs.Storage || null,
    networkPerformance: attrs.networkPerformance || attrs['Network Performance'] || null,
    operatingSystem: attrs.operatingSystem || attrs['Operating System'] || null,
    price: price
  }

  await Bun.write(fullPath, JSON.stringify(instanceJson))
  count++

  // Track this instance for the family summary
  const familyName = instanceType.split('.')[0]
  if (!familyInstances[familyName]) {
    familyInstances[familyName] = []
  }
  familyInstances[familyName].push(instanceJson)
}

// Write family summary files
let familyCount = 0
for (const [familyName, instances] of Object.entries(familyInstances)) {
  const familyJson = {
    family: familyName,
    region: regionCode,
    instances: instances.sort((a, b) => {
      // Sort by price ascending
      const priceA = a.price || 0
      const priceB = b.price || 0
      return priceA - priceB
    })
  }

  const familyPath = `${regionDir}/${familyName}.json`
  await Bun.write(familyPath, JSON.stringify(familyJson, null, 2))
  familyCount++
}

console.log(`Done: wrote ${count} instance files and ${familyCount} family files for ${regionCode}`)
