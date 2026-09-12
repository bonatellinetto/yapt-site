const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  use: { headless: true },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --port 4329', url: 'http://127.0.0.1:4329', reuseExistingServer: !process.env.CI },
});
