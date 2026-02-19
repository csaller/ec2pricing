import CodeBlock, { CmdLine } from "../components/CodeBlock";
import Tabs from "../components/Tabs";
import RegionTable from "../components/RegionTable";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Live API</h2>
        <p class={styles.sectionSubtitle}>Fetch EC2 pricing data with a simple HTTP request. No authentication required.</p>

        <h3 class={styles.h3}>Individual instance pricing</h3>
        <div class={styles.endpoint}>
          https://www.ec2pricing.com/{"{region}"}/{"{family}"}/{"{size}"}.json
        </div>

        <p class={styles.p}><span class={styles.strong}>Examples</span></p>
        <CodeBlock>
          <span class={styles.comment}># Get t3a.medium pricing in us-east-1</span>{"\n"}
          <CmdLine command="curl" text="curl https://www.ec2pricing.com/us-east-1/t3a/medium.json" />{"\n"}
          {"\n"}
          <span class={styles.comment}># Get c7g.2xlarge pricing in eu-west-1</span>{"\n"}
          <CmdLine command="curl" text="curl https://www.ec2pricing.com/eu-west-1/c7g/2xlarge.json" />
        </CodeBlock>

        <p class={styles.p}><span class={styles.strong}>Response</span></p>
        <CodeBlock copyText={`{
  "instanceType": "t3a.medium",
  "instanceFamily": "General purpose",
  "vCPU": "2",
  "memory": "4 GiB",
  "storage": "EBS only",
  "networkPerformance": "Up to 5 Gigabit",
  "operatingSystem": "Linux",
  "price": 0.0376
}`}>
          {`{`}{"\n"}
          {"  "}<span class={styles.property}>"instanceType"</span>: <span class={styles.string}>"t3a.medium"</span>,{"\n"}
          {"  "}<span class={styles.property}>"instanceFamily"</span>: <span class={styles.string}>"General purpose"</span>,{"\n"}
          {"  "}<span class={styles.property}>"vCPU"</span>: <span class={styles.string}>"2"</span>,{"\n"}
          {"  "}<span class={styles.property}>"memory"</span>: <span class={styles.string}>"4 GiB"</span>,{"\n"}
          {"  "}<span class={styles.property}>"storage"</span>: <span class={styles.string}>"EBS only"</span>,{"\n"}
          {"  "}<span class={styles.property}>"networkPerformance"</span>: <span class={styles.string}>"Up to 5 Gigabit"</span>,{"\n"}
          {"  "}<span class={styles.property}>"operatingSystem"</span>: <span class={styles.string}>"Linux"</span>,{"\n"}
          {"  "}<span class={styles.property}>"price"</span>: <span class={styles.number}>0.0376</span>{"\n"}
          {`}`}
        </CodeBlock>

        <h3 class={styles.h3}>Family summaries</h3>
        <div class={styles.endpoint}>
          https://www.ec2pricing.com/{"{region}"}/{"{family}"}.json
        </div>
        <p class={styles.p}>Get all instances in a family, sorted by price.</p>

        <p class={styles.p}><span class={styles.strong}>Examples</span></p>
        <CodeBlock>
          <span class={styles.comment}># Get all t3a instances in us-east-1</span>{"\n"}
          <CmdLine command="curl" text="curl https://www.ec2pricing.com/us-east-1/t3a.json" />{"\n"}
          {"\n"}
          <span class={styles.comment}># Get all m7g instances in eu-west-1</span>{"\n"}
          <CmdLine command="curl" text="curl https://www.ec2pricing.com/eu-west-1/m7g.json" />
        </CodeBlock>

        <p class={styles.p}><span class={styles.strong}>Response</span></p>
        <CodeBlock copyText={`{
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
    }
  ]
}`}>
          {`{`}{"\n"}
          {"  "}<span class={styles.property}>"family"</span>: <span class={styles.string}>"t3a"</span>,{"\n"}
          {"  "}<span class={styles.property}>"region"</span>: <span class={styles.string}>"us-east-1"</span>,{"\n"}
          {"  "}<span class={styles.property}>"instances"</span>: [{"\n"}
          {"    "}{`{`}{"\n"}
          {"      "}<span class={styles.property}>"instanceType"</span>: <span class={styles.string}>"t3a.nano"</span>,{"\n"}
          {"      "}<span class={styles.property}>"instanceFamily"</span>: <span class={styles.string}>"General purpose"</span>,{"\n"}
          {"      "}<span class={styles.property}>"vCPU"</span>: <span class={styles.string}>"2"</span>,{"\n"}
          {"      "}<span class={styles.property}>"memory"</span>: <span class={styles.string}>"0.5 GiB"</span>,{"\n"}
          {"      "}<span class={styles.property}>"storage"</span>: <span class={styles.string}>"EBS only"</span>,{"\n"}
          {"      "}<span class={styles.property}>"networkPerformance"</span>: <span class={styles.string}>"Up to 5 Gigabit"</span>,{"\n"}
          {"      "}<span class={styles.property}>"operatingSystem"</span>: <span class={styles.string}>"Linux"</span>,{"\n"}
          {"      "}<span class={styles.property}>"price"</span>: <span class={styles.number}>0.0047</span>{"\n"}
          {"    "}{`}`}{"\n"}
          {"    "}<span class={styles.comment}>// ... all instances in family, sorted by price</span>{"\n"}
          {"  "}]{"\n"}
          {`}`}
        </CodeBlock>

        <div class={styles.note}>
          All <code>price</code> values are hourly On-Demand rates in USD.
        </div>

        <h3 class={styles.h3}>Master index</h3>
        <CodeBlock>
          <span class={styles.comment}># List all regions and instance types</span>{"\n"}
          <CmdLine command="curl" text="curl https://www.ec2pricing.com/index.json" />
        </CodeBlock>

        <p class={styles.p}>Returns a full manifest of every region and instance type:</p>
        <CodeBlock copyText={`{
  "updatedAt": "2026-02-17T06:00:00.000Z",
  "regions": {
    "us-east-1": {
      "instanceTypes": ["c5.xlarge", "m5.large", "t3.micro", "..."]
    }
  }
}`}>
          {`{`}{"\n"}
          {"  "}<span class={styles.property}>"updatedAt"</span>: <span class={styles.string}>"2026-02-17T06:00:00.000Z"</span>,{"\n"}
          {"  "}<span class={styles.property}>"regions"</span>: {`{`}{"\n"}
          {"    "}<span class={styles.property}>"us-east-1"</span>: {`{`}{"\n"}
          {"      "}<span class={styles.property}>"instanceTypes"</span>: [<span class={styles.string}>"c5.xlarge"</span>, <span class={styles.string}>"m5.large"</span>, <span class={styles.string}>"t3.micro"</span>, <span class={styles.string}>"..."</span>]{"\n"}
          {"    "}{`}`}{"\n"}
          {"  "}{`}`}{"\n"}
          {`}`}
        </CodeBlock>
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Usage Examples</h2>
        <p class={styles.sectionSubtitle}>Fetch EC2 pricing data in your language of choice.</p>

        <Tabs
          tabs={[
            {
              id: "javascript",
              label: "JavaScript",
              content: () => (
                <>
                  <p class={styles.p}><span class={styles.strong}>Fetch a single instance</span></p>
                  <CodeBlock copyText={`async function getInstanceData(region, family, size) {
  const url = \`https://www.ec2pricing.com/\${region}/\${family}/\${size}.json\`
  const response = await fetch(url)
  const data = await response.json()
  return data
}

const instanceData = await getInstanceData('us-east-1', 't3a', 'medium')
console.log(\`Instance: \${instanceData.instanceType}\`)
console.log(\`Price: $\${instanceData.price}/hour\`)
console.log(\`vCPU: \${instanceData.vCPU}, Memory: \${instanceData.memory}\`)`}>
                    <span class={styles.keyword}>async</span> <span class={styles.keyword}>function</span> <span class={styles.fn}>getInstanceData</span>(region, family, size) {`{`}{"\n"}
                    {"  "}<span class={styles.keyword}>const</span> url = <span class={styles.string}>{"`"}https://www.ec2pricing.com/${"${region}"}/${"${family}"}/${"${size}"}.json{"`"}</span>{"\n"}
                    {"  "}<span class={styles.keyword}>const</span> response = <span class={styles.keyword}>await</span> <span class={styles.fn}>fetch</span>(url){"\n"}
                    {"  "}<span class={styles.keyword}>const</span> data = <span class={styles.keyword}>await</span> response.<span class={styles.fn}>json</span>(){"\n"}
                    {"  "}<span class={styles.keyword}>return</span> data{"\n"}
                    {`}`}{"\n"}
                    {"\n"}
                    <span class={styles.keyword}>const</span> instanceData = <span class={styles.keyword}>await</span> <span class={styles.fn}>getInstanceData</span>(<span class={styles.string}>'us-east-1'</span>, <span class={styles.string}>'t3a'</span>, <span class={styles.string}>'medium'</span>){"\n"}
                    console.<span class={styles.fn}>log</span>(<span class={styles.string}>{"`"}Instance: ${"${instanceData.instanceType}"}{"`"}</span>){"\n"}
                    console.<span class={styles.fn}>log</span>(<span class={styles.string}>{"`"}Price: $${"${instanceData.price}"}/hour{"`"}</span>){"\n"}
                    console.<span class={styles.fn}>log</span>(<span class={styles.string}>{"`"}vCPU: ${"${instanceData.vCPU}"}, Memory: ${"${instanceData.memory}"}{"`"}</span>)
                  </CodeBlock>

                  <p class={styles.p}><span class={styles.strong}>Fetch an entire family</span></p>
                  <CodeBlock copyText={`async function getFamilyData(region, family) {
  const url = \`https://www.ec2pricing.com/\${region}/\${family}.json\`
  const response = await fetch(url)
  const data = await response.json()
  return data
}

const familyData = await getFamilyData('us-east-1', 't3a')
console.log(\`Family: \${familyData.family}\`)
console.log(\`Instance count: \${familyData.instances.length}\`)`}>
                    <span class={styles.keyword}>async</span> <span class={styles.keyword}>function</span> <span class={styles.fn}>getFamilyData</span>(region, family) {`{`}{"\n"}
                    {"  "}<span class={styles.keyword}>const</span> url = <span class={styles.string}>{"`"}https://www.ec2pricing.com/${"${region}"}/${"${family}"}.json{"`"}</span>{"\n"}
                    {"  "}<span class={styles.keyword}>const</span> response = <span class={styles.keyword}>await</span> <span class={styles.fn}>fetch</span>(url){"\n"}
                    {"  "}<span class={styles.keyword}>const</span> data = <span class={styles.keyword}>await</span> response.<span class={styles.fn}>json</span>(){"\n"}
                    {"  "}<span class={styles.keyword}>return</span> data{"\n"}
                    {`}`}{"\n"}
                    {"\n"}
                    <span class={styles.keyword}>const</span> familyData = <span class={styles.keyword}>await</span> <span class={styles.fn}>getFamilyData</span>(<span class={styles.string}>'us-east-1'</span>, <span class={styles.string}>'t3a'</span>){"\n"}
                    console.<span class={styles.fn}>log</span>(<span class={styles.string}>{"`"}Family: ${"${familyData.family}"}{"`"}</span>){"\n"}
                    console.<span class={styles.fn}>log</span>(<span class={styles.string}>{"`"}Instance count: ${"${familyData.instances.length}"}{"`"}</span>)
                  </CodeBlock>
                </>
              ),
            },
            {
              id: "python",
              label: "Python",
              content: () => (
                <>
                  <p class={styles.p}><span class={styles.strong}>Fetch a single instance</span></p>
                  <CodeBlock copyText={"import requests\n\ndef get_instance_data(region, family, size):\n    url = f\"https://www.ec2pricing.com/{region}/{family}/{size}.json\"\n    response = requests.get(url)\n    response.raise_for_status()\n    return response.json()\n\ninstance = get_instance_data('us-east-1', 't3a', 'medium')\nprint(f\"Instance: {instance['instanceType']}\")\nprint(f\"Price: ${instance['price']}/hour\")\nprint(f\"vCPU: {instance['vCPU']}, Memory: {instance['memory']}\")"}>

                    <span class={styles.keyword}>import</span> requests{"\n"}
                    {"\n"}
                    <span class={styles.keyword}>def</span> <span class={styles.fn}>get_instance_data</span>(region, family, size):{"\n"}
                    {"    "}url = <span class={styles.string}>f"https://www.ec2pricing.com/{"{region}"}/{"{family}"}/{"{size}"}.json"</span>{"\n"}
                    {"    "}response = requests.<span class={styles.fn}>get</span>(url){"\n"}
                    {"    "}response.<span class={styles.fn}>raise_for_status</span>(){"\n"}
                    {"    "}<span class={styles.keyword}>return</span> response.<span class={styles.fn}>json</span>(){"\n"}
                    {"\n"}
                    instance = <span class={styles.fn}>get_instance_data</span>(<span class={styles.string}>'us-east-1'</span>, <span class={styles.string}>'t3a'</span>, <span class={styles.string}>'medium'</span>){"\n"}
                    <span class={styles.fn}>print</span>(<span class={styles.string}>f"Instance: {"{instance['instanceType']}"}"</span>){"\n"}
                    <span class={styles.fn}>print</span>(<span class={styles.string}>f"Price: ${"{instance['price']}"}/hour"</span>){"\n"}
                    <span class={styles.fn}>print</span>(<span class={styles.string}>f"vCPU: {"{instance['vCPU']}"}, Memory: {"{instance['memory']}"}"</span>)
                  </CodeBlock>

                  <p class={styles.p}><span class={styles.strong}>Fetch an entire family</span></p>
                  <CodeBlock copyText={"import requests\n\ndef get_family_data(region, family):\n    url = f\"https://www.ec2pricing.com/{region}/{family}.json\"\n    response = requests.get(url)\n    response.raise_for_status()\n    return response.json()\n\nfamily_data = get_family_data('us-east-1', 't3a')\nprint(f\"Family: {family_data['family']}\")\nprint(f\"Instance count: {len(family_data['instances'])}\")"}>

                    <span class={styles.keyword}>import</span> requests{"\n"}
                    {"\n"}
                    <span class={styles.keyword}>def</span> <span class={styles.fn}>get_family_data</span>(region, family):{"\n"}
                    {"    "}url = <span class={styles.string}>f"https://www.ec2pricing.com/{"{region}"}/{"{family}"}.json"</span>{"\n"}
                    {"    "}response = requests.<span class={styles.fn}>get</span>(url){"\n"}
                    {"    "}response.<span class={styles.fn}>raise_for_status</span>(){"\n"}
                    {"    "}<span class={styles.keyword}>return</span> response.<span class={styles.fn}>json</span>(){"\n"}
                    {"\n"}
                    family_data = <span class={styles.fn}>get_family_data</span>(<span class={styles.string}>'us-east-1'</span>, <span class={styles.string}>'t3a'</span>){"\n"}
                    <span class={styles.fn}>print</span>(<span class={styles.string}>f"Family: {"{family_data['family']}"}"</span>){"\n"}
                    <span class={styles.fn}>print</span>(<span class={styles.string}>f"Instance count: {"{len(family_data['instances'])}"}"</span>)
                  </CodeBlock>
                </>
              ),
            },
          ]}
        />
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Supported Regions</h2>
        <p class={styles.sectionSubtitle}>34 AWS regions across 4 continents.</p>
        <RegionTable />
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>Data Source</h2>
        <p class={styles.sectionSubtitle}>Pricing data is fetched directly from the official AWS EC2 Pricing API.</p>

        <p class={styles.p}><span class={styles.strong}>Filtering</span></p>
        <ul>
          <li>Only <strong>Linux On-Demand</strong> pricing is included</li>
          <li>Standard <code>BoxUsage</code> instances only (no Reserved, Savings Plans, Dedicated, or Spot)</li>
          <li>Base Linux without pre-installed software (SQL, etc.)</li>
          <li>No Windows, RHEL, SUSE, or other operating systems</li>
        </ul>
      </section>

      <footer class={styles.footer}>
        <span>MIT License</span>
        <span>Data updated daily from AWS EC2 Pricing API</span>
      </footer>
    </>
  );
}
