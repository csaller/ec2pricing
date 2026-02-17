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
let count = 0

for (const key of Object.keys(products)) {
  const product = products[key]
  const attrs = product.attributes || {}

  const productFamily = attrs.productFamily || product.productFamily || null
  if (productFamily !== 'Compute Instance') continue

  // Only include Linux instances
  const os = attrs.operatingSystem || attrs['Operating System'] || ''
  if (os !== 'Linux') continue

  const sku = product.sku || attrs.instancesku || attrs.instanceSku || attrs.sku
  const price = getPriceForSku(sku)
  const instanceType = attrs.instanceType || attrs['Instance Type'] || null

  if (!instanceType) continue

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
}

console.log(`Done: wrote ${count} instance files for ${regionCode}`)
