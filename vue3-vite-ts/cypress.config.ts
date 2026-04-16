import { defineConfig } from "cypress";

export default defineConfig({
  reporter: "buildkite-test-collector/cypress/reporter",
  reporterOptions: {
    token_name: "AZVrY5x32xy3UWu2N9V6QuRd",
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
