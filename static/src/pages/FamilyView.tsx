import { useParams } from "@solidjs/router";
import { createResource, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import styles from "./FamilyView.module.css";

interface Instance {
  instanceType: string;
  instanceFamily: string;
  vCPU: string;
  memory: string;
  storage: string;
  networkPerformance: string;
  operatingSystem: string;
  price: number;
}

interface FamilyData {
  family: string;
  region: string;
  instances: Instance[];
}

async function fetchFamily(params: { region: string; family: string }): Promise<FamilyData> {
  const res = await fetch(`/${params.region}/${params.family}.json`);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export default function FamilyView() {
  const params = useParams<{ region: string; family: string }>();
  const [data] = createResource(
    () => ({ region: params.region, family: params.family }),
    fetchFamily
  );

  return (
    <div class={styles.container}>
      <nav class={styles.breadcrumb}>
        <A href="/">Home</A>
        <span> / </span>
        <span>{params.region}/{params.family}</span>
      </nav>

      <Show when={data.loading}>
        <p class={styles.loading}>Loading...</p>
      </Show>

      <Show when={data.error}>
        <div class={styles.error}>
          <h2>Not Found</h2>
          <p>Family <code>{params.family}</code> not found in <code>{params.region}</code>.</p>
          <A href="/">Back to docs</A>
        </div>
      </Show>

      <Show when={data()}>
        {(family) => (
          <>
            <h2>{family().family}</h2>
            <p class={styles.subtitle}>
              {family().instances.length} instances in {family().region} &mdash; sorted by price
            </p>

            <table class={styles.table}>
              <thead>
                <tr>
                  <th>Instance Type</th>
                  <th>vCPU</th>
                  <th>Memory</th>
                  <th>Storage</th>
                  <th>Network</th>
                  <th>Price/hr</th>
                </tr>
              </thead>
              <tbody>
                <For each={family().instances}>
                  {(instance) => {
                    const parts = instance.instanceType.split(".");
                    return (
                      <tr>
                        <td>
                          <A href={`/${params.region}/${parts[0]}/${parts[1]}`}>
                            {instance.instanceType}
                          </A>
                        </td>
                        <td>{instance.vCPU}</td>
                        <td>{instance.memory}</td>
                        <td>{instance.storage}</td>
                        <td>{instance.networkPerformance}</td>
                        <td class={styles.price}>${instance.price}</td>
                      </tr>
                    );
                  }}
                </For>
              </tbody>
            </table>

            <div class={styles.apiLink}>
              API: <a href={`/${params.region}/${params.family}.json`}>
                /{params.region}/{params.family}.json
              </a>
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
