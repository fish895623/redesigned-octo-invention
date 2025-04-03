const { defineConfig } = require("cypress");
const { plugins: vitePlugins } = require("@vitejs/plugin-react");

module.exports = defineConfig({
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalStudio: true,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
