import { A } from "@solidjs/router";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div class={styles.container}>
      <h1 class={styles.code}>404</h1>
      <p>This endpoint doesn't exist.</p>
      <p>
        Try a valid path like <code>{`/{region}/{family}/{size}.json`}</code>
      </p>
      <p>
        <A href="/">View API documentation</A>
      </p>
      <div class={styles.examples}>
        curl https://ec2pricing.com/us-east-1/t3a/medium.json
        <br />
        curl https://ec2pricing.com/eu-west-1/c7g.json
        <br />
        curl https://ec2pricing.com/index.json
      </div>
    </div>
  );
}
