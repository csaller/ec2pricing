import { createSignal, For, type JSX } from "solid-js";
import styles from "./Tabs.module.css";

interface Tab {
  id: string;
  label: string;
  content: () => JSX.Element;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs(props: TabsProps) {
  const [active, setActive] = createSignal(props.tabs[0]?.id ?? "");

  return (
    <div>
      <div class={styles.tabs}>
        <For each={props.tabs}>
          {(tab) => (
            <button
              class={`${styles.tab} ${active() === tab.id ? styles.active : ""}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>
      <For each={props.tabs}>
        {(tab) => (
          <div
            class={styles.tabContent}
            style={{ display: active() === tab.id ? "block" : "none" }}
          >
            {tab.content()}
          </div>
        )}
      </For>
    </div>
  );
}
