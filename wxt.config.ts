import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    host_permissions: ["https://timeapi.io/*", "https://www.google.com/*"],
  },
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte", "@wxt-dev/unocss"],
  unocss: {
    // Exclude unocss from running for the background
    excludeEntrypoints: ["background"],
    configOrPath: "uno.config.ts",
  },
});
