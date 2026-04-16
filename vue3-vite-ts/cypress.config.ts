import { defineConfig } from "cypress";

export default defineConfig({
  reporter: "buildkite-test-collector/cypress/reporter",
  reporterOptions: {
    token_name: "BUILDKITE_ANALYTICS_TOKEN",
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
