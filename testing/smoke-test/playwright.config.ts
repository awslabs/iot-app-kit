import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:5173/';
const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;

export default defineConfig({
  testDir: './tests',
  expect: {
    timeout: 100 * SECOND_IN_MS,
  },
  timeout: 100 * SECOND_IN_MS,
  globalTimeout: 10 * MINUTE_IN_MS,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    viewport: { height: 1500, width: 1028 },
    trace: 'on-first-retry',
    baseURL: BASE_URL,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: !process.env.CI,
    url: BASE_URL,
    timeout: 1 * MINUTE_IN_MS,
  },
});
