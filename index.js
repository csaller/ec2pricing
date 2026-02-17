import { mkdir } from 'node:fs/promises'

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'af-south-1',
  'ap-east-1',
  'ap-south-2',
  'ap-southeast-3',
  'ap-southeast-5',
  'ap-southeast-4',
  'ap-south-1',
  'ap-southeast-6',
  'ap-northeast-3',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-east-2',
  'ap-southeast-7',
  'ap-northeast-1',
  'ca-central-1',
  'ca-west-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-south-1',
  'eu-west-3',
  'eu-south-2',
  'eu-north-1',
  'eu-central-2',
  'il-central-1',
  'mx-central-1',
  'me-south-1',
  'me-central-1',
  'sa-east-1'
]

for (const regionCode of regions) {
  const url = new URL(
    `https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20260216204215/${regionCode}/index.json`
  )
  const response = await fetch(url.href)
  const awsData = await response.json()
  // const awsData = JSON.parse(await Bun.file(`raw/${regionCode}.json`).text())
  const products = awsData.products || {}
  const terms = awsData.terms || {}

  const regionDir = `instances/${regionCode}`
  await mkdir(regionDir, { recursive: true })

  // Build a helper to find the USD price for a given SKU in the OnDemand terms
  const getPriceForSku = sku => {
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

  // Track directories we've already created to avoid redundant mkdir calls
  const createdDirs = new Set()

  // Track instances by family for summary files
  const familyInstances = {}

  for (const key of Object.keys(products)) {
    const product = products[key]
    const attrs = product.attributes || {}

    // Only create JSON files for specific instances, not instance families
    const productFamily = attrs.productFamily || product.productFamily || null
    if (productFamily !== 'Compute Instance') continue

    // Only include Linux instances
    const os = attrs.operatingSystem || attrs['Operating System'] || ''
    if (os !== 'Linux') continue

    // Skip if no valid instance type
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

    const sku =
      product.sku || attrs.instancesku || attrs.instanceSku || attrs.sku
    const price = getPriceForSku(sku)

    const instancePath = String(instanceType).replace(/[^a-zA-Z0-9]/g, '/')
    const fullPath = `${regionDir}/${instancePath}.json`

    // Ensure parent directories exist for nested instance paths (e.g. m5/xlarge)
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
      networkPerformance:
        attrs.networkPerformance || attrs['Network Performance'] || null,
      operatingSystem:
        attrs.operatingSystem || attrs['Operating System'] || null,
      price: price
    }

    await Bun.write(fullPath, JSON.stringify(instanceJson))

    // Track this instance for the family summary
    const familyName = instanceType.split('.')[0] // e.g., "t3a" from "t3a.medium"
    if (!familyInstances[familyName]) {
      familyInstances[familyName] = []
    }
    familyInstances[familyName].push(instanceJson)
  }

  // Write family summary files
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
  }
}
