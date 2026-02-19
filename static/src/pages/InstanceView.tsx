import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import { A } from "@solidjs/router";
import styles from "./InstanceView.module.css";

interface InstanceData {
  instanceType: string;
  instanceFamily: string;
  vCPU: string;
  memory: string;
  storage: string;
  networkPerformance: string;
  operatingSystem: string;
  price: number;
}

async function fetchInstance(params: { region: string; family: string; size: string }): Promise<InstanceData> {
  const res = await fetch(`/${params.region}/${params.family}/${params.size}.json`);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export default function InstanceView() {
  const params = useParams<{ region: string; family: string; size: string }>();
  const [data] = createResource(
    () => ({ region: params.region, family: params.family, size: params.size }),
    fetchInstance
  );

  return (
    <div class={styles.container}>
      <nav class={styles.breadcrumb}>
        <A href="/">Home</A>
        <span> / </span>
        <A href={`/${params.region}/${params.family}`}>{params.region}/{params.family}</A>
        <span> / </span>
        <span>{params.size}</span>
      </nav>

      <Show when={data.loading}>
        <p class={styles.loading}>Loading...</p>
      </Show>

      <Show when={data.error}>
        <div class={styles.error}>
          <h2>Not Found</h2>
          <p>Instance <code>{params.family}.{params.size}</code> not found in <code>{params.region}</code>.</p>
          <A href="/">Back to docs</A>
        </div>
      </Show>

      <Show when={data()}>
        {(instance) => (
          <>
            <h2>{instance().instanceType}</h2>
            <p class={styles.subtitle}>{instance().instanceFamily} &mdash; {params.region}</p>

            <table class={styles.table}>
              <tbody>
                <tr><td>Instance Type</td><td>{instance().instanceType}</td></tr>
                <tr><td>Instance Family</td><td>{instance().instanceFamily}</td></tr>
                <tr><td>vCPU</td><td>{instance().vCPU}</td></tr>
                <tr><td>Memory</td><td>{instance().memory}</td></tr>
                <tr><td>Storage</td><td>{instance().storage}</td></tr>
                <tr><td>Network Performance</td><td>{instance().networkPerformance}</td></tr>
                <tr><td>Operating System</td><td>{instance().operatingSystem}</td></tr>
                <tr><td>Price (hourly)</td><td class={styles.price}>${instance().price}/hr</td></tr>
              </tbody>
            </table>

            <div class={styles.apiLink}>
              API: <a href={`/${params.region}/${params.family}/${params.size}.json`}>
                /{params.region}/{params.family}/{params.size}.json
              </a>
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
