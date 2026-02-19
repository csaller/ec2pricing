import type { ParentProps } from "solid-js";
import Header from "./components/Header";

export default function Layout(props: ParentProps) {
  return (
    <div class="container">
      <Header />
      <main>{props.children}</main>
    </div>
  );
}
