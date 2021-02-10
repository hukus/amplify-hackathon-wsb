import App from "./App.svelte";
import Amplify from "@aws-amplify/core";
import aws_exports from "./aws-exports";

// comment this if you need to test aws endpoint from localhost
if (window.location.hostname.includes("localhost")) {
  aws_exports.aws_cloud_logic_custom = aws_exports.aws_cloud_logic_custom.map(
    (config) => {
      if (config.name === "scrapi") {
        config.endpoint = `http://${window.location.hostname}:3000`;
      }
      return config;
    }
  );
}

Amplify.configure(aws_exports);

const app = new App({
  target: document.body,
});

export default app;
