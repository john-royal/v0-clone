import { api } from "./api";
import { realtime } from "./realtime";
import { secrets } from "./secrets";

export const web = new sst.aws.StaticSite("Web", {
  path: "packages/web",
  build: {
    command: "pnpm run build",
    output: "dist",
  },
  dev: {
    url: "http://localhost:5173",
  },
  environment: {
    VITE_CLERK_PUBLISHABLE_KEY: secrets.ClerkPublishableKey.value,
    VITE_API_URL: api.url,
    VITE_REALTIME_ENDPOINT: realtime.endpoint,
    VITE_REALTIME_AUTHORIZER: realtime.authorizer,
    VITE_REALTIME_NAMESPACE: `${$app.name}/${$app.stage}`,
  },
});
