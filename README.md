# EC2 Pricing

A static JSON API for AWS EC2 Linux On-Demand instance pricing, updated daily and served via GitHub Pages.

## Live API

### Individual instance pricing

```
https://ec2pricing.com/{region}/{family}/{size}.json
```

**Examples:**

```bash
# Get t3a.medium pricing in us-east-1
curl https://ec2pricing.com/us-east-1/t3a/medium.json

# Get c7g.2xlarge pricing in eu-west-1
curl https://ec2pricing.com/eu-west-1/c7g/2xlarge.json
```

**Response format:**

```json
{
  "instanceType": "t3a.medium",
  "instanceFamily": "General purpose",
  "vCPU": "2",
  "memory": "4 GiB",
  "storage": "EBS only",
  "networkPerformance": "Up to 5 Gigabit",
  "operatingSystem": "Linux",
  "price": 0.0376
}
```

### Family summaries

```
https://ec2pricing.com/{region}/{family}.json
```

Get all instances in a family, sorted by price.

**Examples:**

```bash
# Get all t3a instances in us-east-1
curl https://ec2pricing.com/us-east-1/t3a.json

# Get all m7g instances in eu-west-1
curl https://ec2pricing.com/eu-west-1/m7g.json
```

**Response format:**

```json
{
  "family": "t3a",
  "region": "us-east-1",
  "instances": [
    {
      "instanceType": "t3a.nano",
      "instanceFamily": "General purpose",
      "vCPU": "2",
      "memory": "0.5 GiB",
      "storage": "EBS only",
      "networkPerformance": "Up to 5 Gigabit",
      "operatingSystem": "Linux",
      "price": 0.0047
    },
    {
      "instanceType": "t3a.micro",
      "instanceFamily": "General purpose",
      "vCPU": "2",
      "memory": "1 GiB",
      "storage": "EBS only",
      "networkPerformance": "Up to 5 Gigabit",
      "operatingSystem": "Linux",
      "price": 0.0094
    }
    // ... all instances in family, sorted by price
  ]
}
```

All `price` values are hourly On-Demand rates in USD.

### Master index

```bash
# List all regions and instance types
curl https://ec2pricing.com/index.json
```

Returns a full manifest of every region and instance type:

```json
{
  "updatedAt": "2026-02-17T06:00:00.000Z",
  "regions": {
    "us-east-1": {
      "instanceTypes": ["c5.xlarge", "m5.large", "t3.micro", "..."]
    }
  }
}
```

## Supported regions

| Americas     | Europe       | Asia Pacific   | Middle East & Africa |
| ------------ | ------------ | -------------- | -------------------- |
| us-east-1    | eu-central-1 | ap-east-1      | af-south-1           |
| us-east-2    | eu-central-2 | ap-east-2      | il-central-1         |
| us-west-1    | eu-north-1   | ap-northeast-1 | me-central-1         |
| us-west-2    | eu-south-1   | ap-northeast-2 | me-south-1           |
| ca-central-1 | eu-south-2   | ap-northeast-3 |                      |
| ca-west-1    | eu-west-1    | ap-south-1     |                      |
| mx-central-1 | eu-west-2    | ap-south-2     |                      |
| sa-east-1    | eu-west-3    | ap-southeast-1 |                      |
|              |              | ap-southeast-2 |                      |
|              |              | ap-southeast-3 |                      |
|              |              | ap-southeast-4 |                      |
|              |              | ap-southeast-5 |                      |
|              |              | ap-southeast-6 |                      |
|              |              | ap-southeast-7 |                      |

## How it works

A [GitHub Actions workflow](.github/workflows/update-pricing.yml) runs daily and:

1. Spins up 34 parallel jobs (one per AWS region) via a matrix strategy
2. Each job fetches the raw pricing JSON from the [AWS Bulk Pricing API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-ppslong.html), filters for Linux Compute Instances, and writes one JSON file per instance type
3. Each region is zipped and uploaded as a pipeline artifact
4. A final deploy job downloads all artifacts, generates `index.json`, and publishes to GitHub Pages

## Local development

Requires [Bun](https://bun.sh).

### Process a single region

```bash
bun process-region.js us-east-1
```

Output is written to:

- Individual instances: `instances/{region}/{family}/{size}.json`
- Family summaries: `instances/{region}/{family}.json`

### Generate index

After processing regions, generate the index from a directory of region data:

```bash
bun generate-index.js instances
```

## Project structure

```
.
├── process-region.js        # Process a single region (used by CI)
├── generate-index.js        # Generate index.json from processed data
├── .github/workflows/
│   └── update-pricing.yml   # Daily CI pipeline with matrix strategy
└── instances/               # Generated output (gitignored)
    └── {region}/
        ├── {family}.json         # Family summary (all instances)
        └── {family}/
            └── {size}.json       # Individual instance
```

## Data source

Pricing data is fetched directly from the official [AWS EC2 Pricing API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/index.json).

**Filtering:**

- Only **Linux On-Demand** pricing is included
- Standard `BoxUsage` instances only (no Reserved, Savings Plans, Dedicated, or Spot)
- Base Linux without pre-installed software (SQL, etc.)
- No Windows, RHEL, SUSE, or other operating systems

## License

[MIT](LICENSE)
