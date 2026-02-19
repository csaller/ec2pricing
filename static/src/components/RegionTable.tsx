import { For } from "solid-js";
import styles from "./RegionTable.module.css";

const regionGroups = [
  {
    name: "Americas",
    regions: [
      "us-east-1", "us-east-2", "us-west-1", "us-west-2",
      "ca-central-1", "ca-west-1", "mx-central-1", "sa-east-1",
    ],
  },
  {
    name: "Europe",
    regions: [
      "eu-central-1", "eu-central-2", "eu-north-1", "eu-south-1",
      "eu-south-2", "eu-west-1", "eu-west-2", "eu-west-3",
    ],
  },
  {
    name: "Asia Pacific",
    regions: [
      "ap-east-1", "ap-east-2", "ap-northeast-1", "ap-northeast-2",
      "ap-northeast-3", "ap-south-1", "ap-south-2", "ap-southeast-1",
      "ap-southeast-2", "ap-southeast-3", "ap-southeast-4", "ap-southeast-5",
      "ap-southeast-6", "ap-southeast-7",
    ],
  },
  {
    name: "Middle East & Africa",
    regions: ["af-south-1", "il-central-1", "me-central-1", "me-south-1"],
  },
];

export default function RegionTable() {
  return (
    <div class={styles.grid}>
      <For each={regionGroups}>
        {(group) => (
          <div class={styles.group}>
            <div class={styles.groupTitle}>{group.name}</div>
            <div class={styles.regions}>
              <For each={group.regions}>
                {(r) => <div class={styles.region}>{r}</div>}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
