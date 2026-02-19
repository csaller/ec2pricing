import { createSignal, type JSX } from "solid-js";
import styles from "./CodeBlock.module.css";

interface CodeBlockProps {
  children: JSX.Element;
  copyText?: string;
}

export default function CodeBlock(props: CodeBlockProps) {
  const [copied, setCopied] = createSignal(false);

  const copy = async () => {
    const text = props.copyText;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  };

  return (
    <div class={styles.codeSection}>
      {props.copyText && (
        <button
          class={`${styles.copyBtn} ${copied() ? styles.copied : ""}`}
          onClick={copy}
        >
          {copied() ? "Copied!" : "Copy"}
        </button>
      )}
      <pre><code>{props.children}</code></pre>
    </div>
  );
}

interface CmdLineProps {
  command: string;
  text: string;
}

export function CmdLine(props: CmdLineProps) {
  const [copied, setCopied] = createSignal(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  };

  return (
    <span class={styles.cmdLine}>
      <span class={styles.command}>{props.command}</span> {props.text.replace(props.command + " ", "")}
      <button
        class={`${styles.inlineCopyBtn} ${copied() ? styles.copied : ""}`}
        onClick={copy}
      >
        {copied() ? "Copied!" : "Copy"}
      </button>
    </span>
  );
}
