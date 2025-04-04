const { defineConfig } = require('cypress');
const { plugins: vitePlugins } = require('@vitejs/plugin-react');
const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter');

module.exports = defineConfig({
  e2e: {
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalStudio: true,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      installLogsPrinter(on, {
        printLogsToConsole: 'always', // Ensures logs are printed to the console
        printLogsToFile: 'always', // Saves logs to a file
        outputRoot: 'cypress/logs', // Directory for log files
        outputTarget: {
          'cypress-log.txt': 'txt', // Log file name and format
        },
      });
      return config;
    },
  },
});
